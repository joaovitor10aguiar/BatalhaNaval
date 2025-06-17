from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

jogadores = {}  # socket_id: {nome, usuario, numero, pronto}
sockets_por_numero = {}  # numero_jogador: socket_id
vez_atual = 1  # Começa com o jogador 1

# Banco de dados para registrar navios
def registrar_navios(usuario, numero, navios):
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    for pos in navios:
        c.execute('''
            INSERT INTO jogadas (usuario, numero_jogador, linha, coluna, tipo, timestamp)
            VALUES (?, ?, ?, ?, 'navio', datetime("now"))
        ''', (usuario, numero, pos['linha'], pos['coluna']))
    conn.commit()
    conn.close()

@socketio.on('connect')
def on_connect():
    print(f"Novo jogador conectado: {request.sid}")

@socketio.on('pronto')
def jogador_pronto(data):
    numero = data.get('numero_jogador')
    usuario = data.get('usuario')
    if not numero or not usuario:
        return

    sockets_por_numero[int(numero)] = request.sid
    jogador = jogadores.get(request.sid, {})
    jogador['numero'] = numero
    jogador['usuario'] = usuario
    jogador['pronto'] = True
    jogadores[request.sid] = jogador

    if len(sockets_por_numero) == 2:
        sids = list(sockets_por_numero.values())
        todos_prontos = all(jogadores.get(sid, {}).get('pronto') for sid in sids)
        if todos_prontos:
            print('Ambos jogadores prontos! Iniciando partida.')
            for sid in sids:
                if jogadores[sid]['numero'] == vez_atual:
                    socketio.emit('sua_vez', {}, to=sid)
                else:
                    socketio.emit('aguarde', {}, to=sid)

@socketio.on('jogada')
def processar_jogada(data):
    global vez_atual
    numero = int(data['numero_jogador'])
    linha = data['linha']
    coluna = data['coluna']
    usuario = data['usuario']

    if numero != vez_atual:
        emit('erro', {'mensagem': 'Não é sua vez!'}, to=request.sid)
        return

    adversario = 2 if numero == 1 else 1

    conn = sqlite3.connect('database.db')
    c = conn.cursor()

    c.execute('''
        INSERT INTO jogadas (usuario, numero_jogador, linha, coluna, tipo, timestamp)
        VALUES (?, ?, ?, ?, 'ataque', datetime("now"))
    ''', (usuario, numero, linha, coluna))

    c.execute('''
        SELECT 1 FROM jogadas
        WHERE numero_jogador = ? AND linha = ? AND coluna = ? AND tipo = 'navio'
    ''', (adversario, linha, coluna))
    acerto = c.fetchone() is not None

    c.execute('''
        SELECT linha, coluna FROM jogadas
        WHERE numero_jogador = ? AND tipo = 'navio'
    ''', (adversario,))
    navios_adversario = set(c.fetchall())

    c.execute('''
        SELECT linha, coluna FROM jogadas
        WHERE numero_jogador = ? AND tipo = 'ataque'
    ''', (numero,))
    meus_ataques = set(c.fetchall())

    acertos_feitos = meus_ataques.intersection(navios_adversario)
    venceu = len(acertos_feitos) == len(navios_adversario) and len(navios_adversario) > 0

    conn.commit()
    conn.close()

    for sid in jogadores:
        socketio.emit('resultado_jogada', {
            'linha': linha,
            'coluna': coluna,
            'acerto': acerto,
            'jogador': numero
        }, to=sid)

    if venceu:
        print(f">> Jogador {numero} venceu a partida!")
        for sid in jogadores:
            socketio.emit('fim_de_jogo', {'vencedor': numero}, to=sid)
        return

    vez_atual = adversario
    for sid, info in jogadores.items():
        if info.get('numero') == vez_atual:
            socketio.emit('sua_vez', {}, to=sid)
        else:
            socketio.emit('aguarde', {}, to=sid)

@app.route('/registrar', methods=['POST'])
def registrar():
    data = request.json or {}
    nome = data.get('nome')
    usuario = data.get('usuario')

    if not nome or not usuario:
        return jsonify({"status": "erro", "mensagem": "Nome e usuário são obrigatórios."}), 400

    numeros_existentes = {info['numero'] for info in jogadores.values()}
    if 1 not in numeros_existentes:
        numero = 1
    elif 2 not in numeros_existentes:
        numero = 2
    else:
        return jsonify({"status": "erro", "mensagem": "Jogo já está cheio"}), 400

    jogadores[request.remote_addr] = {
        'nome': nome,
        'usuario': usuario,
        'numero': numero,
        'pronto': False
    }

    print(f"Jogador {numero} registrado: {usuario}")
    return jsonify({"status": "ok", "numero_jogador": numero, "usuario": usuario})

@app.route('/posicionar', methods=['POST'])
def posicionar():
    data = request.json
    usuario = data['usuario']
    numero = int(data['numero_jogador'])
    navios = data['navios']

    registrar_navios(usuario, numero, navios)

    for sid, info in jogadores.items():
        if info.get('numero') == numero:
            info['pronto'] = True
            jogadores[sid] = info

    return jsonify({"status": "ok"})

@app.route('/estado/<int:numero_jogador>', methods=['GET'])
def estado_partida(numero_jogador):
    conn = sqlite3.connect('database.db')
    c = conn.cursor()

    c.execute('''
        SELECT linha, coluna FROM jogadas
        WHERE numero_jogador = ? AND tipo = 'ataque'
    ''', (numero_jogador,))
    ataques_feitos = c.fetchall()

    adversario = 2 if numero_jogador == 1 else 1
    c.execute('''
        SELECT linha, coluna FROM jogadas
        WHERE numero_jogador = ? AND tipo = 'ataque'
    ''', (adversario,))
    ataques_recebidos = c.fetchall()

    c.execute('''
        SELECT linha, coluna FROM jogadas
        WHERE numero_jogador = ? AND tipo = 'navio'
    ''', (numero_jogador,))
    navios = c.fetchall()

    conn.close()

    return jsonify({
        'ataques_feitos': ataques_feitos,
        'ataques_recebidos': ataques_recebidos,
        'navios': navios
    })

# -----------------------------
# NOVA LÓGICA DE REINÍCIO DE PARTIDA
# -----------------------------

@app.route('/solicitar_reinicio', methods=['POST'])
def solicitar_reinicio():
    data = request.json
    numero = data.get('numero_jogador')

    conn = sqlite3.connect('database.db')
    c = conn.cursor()

    c.execute('DELETE FROM reinicio_partida')  # Reinicia solicitações anteriores
    c.execute('INSERT INTO reinicio_partida (id_partida, jogador, confirmou) VALUES (1, ?, 1)', (numero,))
    conn.commit()

    adversario = 2 if numero == 1 else 1
    sid_adversario = sockets_por_numero.get(adversario)
    if sid_adversario:
        socketio.emit('solicitacao_reinicio', {'de': numero}, to=sid_adversario)

    return jsonify({"status": "aguardando_confirmacao"})

@socketio.on('confirmar_reinicio')
def confirmar_reinicio(data):
    numero = data.get('numero_jogador')

    conn = sqlite3.connect('database.db')
    c = conn.cursor()

    c.execute('INSERT INTO reinicio_partida (id_partida, jogador, confirmou) VALUES (1, ?, 1)', (numero,))
    conn.commit()

    c.execute('SELECT COUNT(*) FROM reinicio_partida WHERE confirmou = 1')
    total = c.fetchone()[0]
    conn.close()

    if total >= 2:
        print("Reiniciando partida para ambos os jogadores.")
        conn = sqlite3.connect('database.db')
        c = conn.cursor()
        c.execute('DELETE FROM jogadas')  # Limpa jogadas mas preserva histórico
        c.execute('DELETE FROM reinicio_partida')  # Limpa confirmações
        conn.commit()
        conn.close()

        # Reiniciar estado
        global vez_atual
        vez_atual = 1
        for sid in jogadores:
            jogadores[sid]['pronto'] = False
            socketio.emit('reiniciar_posicionamento', {}, to=sid)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
