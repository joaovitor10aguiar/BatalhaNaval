import sqlite3

conn = sqlite3.connect('database.db')
c = conn.cursor()

c.execute('''
CREATE TABLE IF NOT EXISTS jogadas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario TEXT,
    numero_jogador INTEGER,
    linha INTEGER,
    coluna INTEGER,
    timestamp DATETIME
)
''')

conn.commit()
conn.close()
print("Tabela 'jogadas' criada com sucesso.")
