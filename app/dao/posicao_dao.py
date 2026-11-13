from app.database import conectar
from app.models.posicao import Posicao


class PosicaoDAO:
    def listar(self):
        conexao = conectar()
        try:
            cursor = conexao.cursor(dictionary=True)
            cursor.execute("SELECT id_posicao, nome_posicao FROM posicoes ORDER BY id_posicao")
            return [Posicao(**linha) for linha in cursor.fetchall()]
        finally:
            conexao.close()
