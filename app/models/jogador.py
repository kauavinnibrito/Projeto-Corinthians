class Jogador:
    def __init__(self, id_jogador=None, nome="", numero_camisa=0, id_posicao=None, nome_posicao=None):
        self.id_jogador = id_jogador
        self.nome = nome
        self.numero_camisa = numero_camisa
        self.id_posicao = id_posicao
        self.nome_posicao = nome_posicao

    def to_dict(self):
        return {
            "id_jogador": self.id_jogador,
            "nome": self.nome,
            "numero_camisa": self.numero_camisa,
            "id_posicao": self.id_posicao,
            "nome_posicao": self.nome_posicao,
        }
