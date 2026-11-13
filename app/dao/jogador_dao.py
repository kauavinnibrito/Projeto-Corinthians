from app.database import conectar
from app.models.jogador import Jogador

SELECT_JOGADOR = """
    SELECT j.id_jogador, j.nome, j.numero_camisa, j.id_posicao, p.nome_posicao
    FROM jogadores j
    INNER JOIN posicoes p ON p.id_posicao = j.id_posicao
"""


class JogadorDAO:
    def listar(self):
        conexao = conectar()
        try:
            cursor = conexao.cursor(dictionary=True)
            cursor.execute(SELECT_JOGADOR + " ORDER BY p.id_posicao, j.numero_camisa")
            return [Jogador(**linha) for linha in cursor.fetchall()]
        finally:
            conexao.close()

    def buscar_por_id(self, id_jogador):
        conexao = conectar()
        try:
            cursor = conexao.cursor(dictionary=True)
            cursor.execute(SELECT_JOGADOR + " WHERE j.id_jogador = %s", (id_jogador,))
            linha = cursor.fetchone()
            return Jogador(**linha) if linha else None
        finally:
            conexao.close()

    def cadastrar(self, jogador):
        conexao = conectar()
        try:
            cursor = conexao.cursor()
            cursor.execute(
                "INSERT INTO jogadores (nome, numero_camisa, id_posicao) VALUES (%s, %s, %s)",
                (jogador.nome, jogador.numero_camisa, jogador.id_posicao),
            )
            conexao.commit()
            return cursor.lastrowid
        finally:
            conexao.close()

    def atualizar(self, id_jogador, jogador):
        conexao = conectar()
        try:
            cursor = conexao.cursor()
            cursor.execute(
                "UPDATE jogadores SET nome = %s, numero_camisa = %s, id_posicao = %s "
                "WHERE id_jogador = %s",
                (jogador.nome, jogador.numero_camisa, jogador.id_posicao, id_jogador),
            )
            conexao.commit()
        finally:
            conexao.close()

    def excluir(self, id_jogador):
        conexao = conectar()
        try:
            cursor = conexao.cursor()
            cursor.execute("DELETE FROM jogadores WHERE id_jogador = %s", (id_jogador,))
            conexao.commit()
            return cursor.rowcount > 0
        finally:
            conexao.close()
