import sqlite3

conn = sqlite3.connect('database.db')
c = conn.cursor()

# Recria a tabela de jogadas
c.execute('DROP TABLE IF EXISTS jogadas')
c.execute('''
    CREATE TABLE jogadas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario TEXT,
        numero_jogador INTEGER,
        linha INTEGER,
        coluna INTEGER,
        tipo TEXT,  -- 'navio' ou 'ataque'
        timestamp TEXT
    )
''')

# Criação da tabela de histórico de partidas (não apaga se já existir)
c.execute('''
    CREATE TABLE IF NOT EXISTS historico_partidas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        jogador1 TEXT,
        jogador2 TEXT,
        vencedor TEXT,  -- 'jogador1', 'jogador2' ou 'empate'
        data TEXT DEFAULT (datetime('now'))
    )
''')

# Criação da tabela para controle de reinício de partida
c.execute('''
    CREATE TABLE IF NOT EXISTS reinicio_partida (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_partida INTEGER,
        jogador INTEGER, -- 1 ou 2
        confirmou BOOLEAN DEFAULT 0,
        timestamp TEXT DEFAULT (datetime('now'))
    )
''')

conn.commit()
conn.close()
print("Banco de dados recriado com sucesso.")
