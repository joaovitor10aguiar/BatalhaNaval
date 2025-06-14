import sqlite3

conn = sqlite3.connect('database.db')  # ajuste o caminho se necessário
c = conn.cursor()

# Limpa os dados da tabela
c.execute("DELETE FROM jogadas")

# Reseta o autoincremento do ID
c.execute("DELETE FROM sqlite_sequence WHERE name='jogadas'")

conn.commit()
conn.close()

print("Tabela 'jogadas' limpa e ID resetado com sucesso.")
