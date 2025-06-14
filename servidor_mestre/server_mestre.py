from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

jogadores = {}  # socket_id: {nome, usuario, numero, pronto, navios}
sockets_por_numero = {}  # numero_jogador: socket_id
partidas = {}  # id_partida: {jogador1_sid, jogador2_sid, turno}

def registrar_navios(usuario, numero, navios):
    conn = sqlite3.connect('servidor_mestre/database.db')
    c = conn.cursor()
    for pos in navios:
        c.execute('INSERT INTO jogadas (usuario, numero_jogador, linha, coluna, timestamp) VALUES (?, ?, ?, ?, datetime("now"))',
                  (usuario, numero, pos['linha'], pos['coluna']))
    conn.commit()
    conn.close()

@socketio.on('connect')
def on_connect():
    print(f"Novo jogador conectado: {request.sid}")

@app.route('/registrar', methods=['POST'])
def registrar():
    data = request.json
    nome = data.get('nome')
    usuario = data.get('usuario')

    numero_jogador = 1 if 1 not in sockets_por_numero else 2
    sockets_por_numero[numero_jogador] = request.remote_addr  # não confiável para múltiplos jogadores, ideal seria o socketio.sid
    jogadores[request.remote_addr] = {
        'nome': nome,
        'usuario': usuario,
        'numero': numero_jogador,
        'pronto': False,
        'navios': []
    }

    return jsonify({"status": "ok", "numero_jogador": numero_jogador})

@app.route('/posicionar', methods=['POST'])
def posicionar():
    data = request.json
    usuario = data['usuario']
    numero = int(data['numero_jogador'])
    navios = data['navios']

    registrar_navios(usuario, numero, navios)

    for sid, info in jogadores.items():
        if info['numero'] == numero:
            info['pronto'] = True
            info['navios'] = navios
            jogadores[sid] = info

    if len(sockets_por_numero) == 2:
        sids = list(sockets_por_numero.values())
        if all(jogadores.get(sid, {}).get('pronto') for sid in sids):
            partidas[1] = {
                'jogador1_sid': sids[0],
                'jogador2_sid': sids[1],
                'turno': 1
            }
            print("Partida iniciada entre os dois jogadores!")
            socketio.emit("iniciar_partida", {"vez": 1}, to=sids[0])
            socketio.emit("iniciar_partida", {"vez": 2}, to=sids[1])

    return jsonify({"status": "ok"})

@socketio.on("jogada")
def processar_jogada(data):
    numero = int(data['numero_jogador'])
    linha = data['linha']
    coluna = data['coluna']
    partida = partidas.get(1)

    if not partida:
        return

    if partida['turno'] != numero:
        emit("erro", {"mensagem": "Não é seu turno!"}, to=request.sid)
        return

    adversario_sid = partida['jogador2_sid'] if numero == 1 else partida['jogador1_sid']

    emit("receber_jogada", {"linha": linha, "coluna": coluna}, to=adversario_sid)

    partida['turno'] = 2 if numero == 1 else 1

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
