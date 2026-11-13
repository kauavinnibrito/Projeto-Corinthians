class Posicao:
    def __init__(self, id_posicao=None, nome_posicao=""):
        self.id_posicao = id_posicao
        self.nome_posicao = nome_posicao

    def to_dict(self):
        return {
            "id_posicao": self.id_posicao,
            "nome_posicao": self.nome_posicao,
        }
