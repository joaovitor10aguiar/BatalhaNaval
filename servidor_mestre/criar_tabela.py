import sqlite3

conn = sqlite3.connect('database.db')
c = conn.cursor()

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

conn.commit()
conn.close()
print("Banco de dados recriado com sucesso.")
