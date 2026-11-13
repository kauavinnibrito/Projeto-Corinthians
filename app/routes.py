from flask import Blueprint, jsonify, render_template, request
from mysql.connector import Error, IntegrityError
from app.dao.jogador_dao import JogadorDAO
from app.dao.posicao_dao import PosicaoDAO
from app.models.jogador import Jogador

paginas_bp = Blueprint("paginas", __name__)
jogadores_bp = Blueprint("jogadores", __name__)
posicoes_bp = Blueprint("posicoes", __name__)

ERRO_BANCO = "Erro ao acessar o banco de dados. Verifique se o MySQL está ligado."


def erro(mensagem, codigo):
    return jsonify({"erro": mensagem}), codigo


def ler_jogador():
    dados = request.get_json(silent=True)
    if not isinstance(dados, dict):
        return None, "Envie os dados do jogador em formato JSON."

    nome = str(dados.get("nome") or "").strip()
    numero = dados.get("numero_camisa")
    posicao = dados.get("id_posicao")

    if len(nome) < 2:
        return None, "Informe o nome do jogador."
    if len(nome) > 100:
        return None, "O nome pode ter no máximo 100 caracteres."
    if type(numero) is not int or type(posicao) is not int:
        return None, "Informe o número da camisa e a posição."
    if numero < 1 or numero > 99:
        return None, "O número da camisa deve estar entre 1 e 99."

    return Jogador(nome=nome, numero_camisa=numero, id_posicao=posicao), None


def erro_de_integridade(e):
    if e.errno == 1062:
        return erro("Esse número de camisa já está sendo usado por outro jogador.", 409)
    if e.errno == 1452:
        return erro("A posição informada não existe.", 400)
    return erro("Os dados informados não são válidos.", 400)


@paginas_bp.get("/")
def inicio():
    return render_template("index.html")


@jogadores_bp.get("/")
def listar_jogadores():
    try:
        jogadores = JogadorDAO().listar()
        return jsonify([j.to_dict() for j in jogadores])
    except Error:
        return erro(ERRO_BANCO, 500)


@jogadores_bp.get("/<int:id_jogador>")
def buscar_jogador(id_jogador):
    try:
        jogador = JogadorDAO().buscar_por_id(id_jogador)
    except Error:
        return erro(ERRO_BANCO, 500)
    if jogador is None:
        return erro("Jogador não encontrado.", 404)
    return jsonify(jogador.to_dict())


@jogadores_bp.post("/")
def cadastrar_jogador():
    jogador, mensagem = ler_jogador()
    if mensagem:
        return erro(mensagem, 400)
    try:
        novo_id = JogadorDAO().cadastrar(jogador)
    except IntegrityError as e:
        return erro_de_integridade(e)
    except Error:
        return erro(ERRO_BANCO, 500)
    return jsonify({"mensagem": "Jogador cadastrado com sucesso!", "id_jogador": novo_id}), 201


@jogadores_bp.put("/<int:id_jogador>")
def atualizar_jogador(id_jogador):
    jogador, mensagem = ler_jogador()
    if mensagem:
        return erro(mensagem, 400)
    try:
        dao = JogadorDAO()
        if dao.buscar_por_id(id_jogador) is None:
            return erro("Jogador não encontrado.", 404)
        dao.atualizar(id_jogador, jogador)
    except IntegrityError as e:
        return erro_de_integridade(e)
    except Error:
        return erro(ERRO_BANCO, 500)
    return jsonify({"mensagem": "Jogador atualizado com sucesso!"})


@jogadores_bp.delete("/<int:id_jogador>")
def excluir_jogador(id_jogador):
    try:
        if not JogadorDAO().excluir(id_jogador):
            return erro("Jogador não encontrado.", 404)
    except Error:
        return erro(ERRO_BANCO, 500)
    return jsonify({"mensagem": "Jogador excluído com sucesso!"})


@posicoes_bp.get("/")
def listar_posicoes():
    try:
        posicoes = PosicaoDAO().listar()
    except Error:
        return erro(ERRO_BANCO, 500)
    return jsonify([p.to_dict() for p in posicoes])
