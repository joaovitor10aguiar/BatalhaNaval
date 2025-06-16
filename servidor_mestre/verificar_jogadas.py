import sqlite3

conn = sqlite3.connect('database.db')
c = conn.cursor()

c.execute("SELECT * FROM jogadas")
linhas = c.fetchall()

for linha in linhas:
    print(linha)

conn.close()
