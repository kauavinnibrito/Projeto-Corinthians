import os
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ))

os.environ["DB_NAME"] = "corinthians_teste"

import mysql.connector
from app import create_app

resultados = []


def registrar(nome, ok, detalhe=""):
    resultados.append(ok)
    print(("[OK]   " if ok else "[FALHA] ") + nome + (f" -> {detalhe}" if detalhe and not ok else ""))


def criar_banco_de_teste():
    sql = (RAIZ / "banco" / "corinthians_db.sql").read_text(encoding="utf-8")
    sql = sql.replace("corinthians_db", "corinthians_teste")
    conexao = mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", ""),
    )
    cursor = conexao.cursor()
    cursor.execute("DROP DATABASE IF EXISTS corinthians_teste")
    for comando in sql.split(";"):
        if comando.strip():
            cursor.execute(comando)
    conexao.commit()
    return conexao, cursor


def testar_banco(cursor):
    cursor.execute("USE corinthians_teste")
    cursor.execute("SHOW TABLES")
    tabelas = {linha[0] for linha in cursor.fetchall()}
    registrar("tabelas posicoes e jogadores existem", tabelas == {"posicoes", "jogadores"}, str(tabelas))

    cursor.execute("SELECT COUNT(*) FROM posicoes")
    registrar("posições iniciais inseridas", cursor.fetchone()[0] == 5)

    cursor.execute(
        "SELECT REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME FROM information_schema.KEY_COLUMN_USAGE "
        "WHERE TABLE_SCHEMA='corinthians_teste' AND TABLE_NAME='jogadores' AND COLUMN_NAME='id_posicao' "
        "AND REFERENCED_TABLE_NAME IS NOT NULL"
    )
    registrar("FK jogadores.id_posicao -> posicoes.id_posicao", cursor.fetchone() == ("posicoes", "id_posicao"))

    try:
        cursor.execute("INSERT INTO jogadores (nome, numero_camisa, id_posicao) VALUES ('X', 1, 999)")
        registrar("banco rejeita posição inexistente", False)
    except mysql.connector.Error:
        registrar("banco rejeita posição inexistente", True)

    try:
        cursor.execute("INSERT INTO jogadores (nome, numero_camisa, id_posicao) VALUES ('X', 100, 1)")
        registrar("banco rejeita camisa fora de 1-99 (CHECK)", False)
    except mysql.connector.Error:
        registrar("banco rejeita camisa fora de 1-99 (CHECK)", True)


def testar_rotas():
    cliente = create_app().test_client()

    r = cliente.get("/")
    registrar("GET / abre a página", r.status_code == 200 and b"Corinthians" in r.data)

    r = cliente.get("/static/css/style.css")
    registrar("CSS carrega", r.status_code == 200)
    r = cliente.get("/static/js/script.js")
    registrar("JS carrega", r.status_code == 200)

    r = cliente.get("/api/posicoes/")
    registrar("GET /api/posicoes/ lista 5 posições", r.status_code == 200 and len(r.get_json()) == 5)
    id_goleiro = r.get_json()[0]["id_posicao"]
    id_atacante = r.get_json()[4]["id_posicao"]

    r = cliente.get("/api/jogadores/")
    registrar("GET /api/jogadores/ lista vazia", r.status_code == 200 and r.get_json() == [])

    r = cliente.post("/api/jogadores/", json={"nome": "Jogador Teste", "numero_camisa": 10, "id_posicao": id_atacante})
    registrar("POST cadastra jogador (201)", r.status_code == 201, r.get_data(as_text=True))
    novo_id = r.get_json().get("id_jogador")

    r = cliente.get(f"/api/jogadores/{novo_id}")
    dados = r.get_json()
    registrar("GET por id retorna o jogador com a posição",
              r.status_code == 200 and dados["nome"] == "Jogador Teste" and dados["nome_posicao"] == "Atacante")

    r = cliente.get("/api/jogadores/9999")
    registrar("GET id inexistente retorna 404", r.status_code == 404)

    r = cliente.post("/api/jogadores/", json={"nome": "Outro", "numero_camisa": 10, "id_posicao": id_goleiro})
    registrar("POST número de camisa repetido retorna 409", r.status_code == 409)

    r = cliente.post("/api/jogadores/", json={"nome": "Outro", "numero_camisa": 5, "id_posicao": 999})
    registrar("POST posição inexistente retorna 400", r.status_code == 400)

    r = cliente.post("/api/jogadores/", json={"nome": "", "numero_camisa": 5, "id_posicao": id_goleiro})
    registrar("POST nome vazio retorna 400", r.status_code == 400)

    r = cliente.post("/api/jogadores/", json={"nome": "Fulano", "numero_camisa": 150, "id_posicao": id_goleiro})
    registrar("POST camisa 150 retorna 400", r.status_code == 400)

    r = cliente.post("/api/jogadores/", json={"nome": "Fulano", "numero_camisa": "7", "id_posicao": id_goleiro})
    registrar("POST camisa como texto retorna 400", r.status_code == 400)

    r = cliente.post("/api/jogadores/", data="não é json", content_type="text/plain")
    registrar("POST sem JSON retorna 400", r.status_code == 400)

    r = cliente.post("/api/jogadores/", json={"nome": "Goleiro Teste", "numero_camisa": 1, "id_posicao": id_goleiro})
    registrar("POST segundo jogador (201)", r.status_code == 201)
    id_goleiro_jogador = r.get_json()["id_jogador"]

    r = cliente.get("/api/jogadores/")
    lista = r.get_json()
    registrar("GET lista 2 jogadores ordenados por posição e camisa",
              len(lista) == 2 and lista[0]["nome_posicao"] == "Goleiro" and lista[1]["nome_posicao"] == "Atacante")

    r = cliente.put(f"/api/jogadores/{novo_id}", json={"nome": "Jogador Editado", "numero_camisa": 11, "id_posicao": id_goleiro})
    registrar("PUT atualiza jogador (200)", r.status_code == 200, r.get_data(as_text=True))
    r = cliente.get(f"/api/jogadores/{novo_id}")
    dados = r.get_json()
    registrar("dados atualizados foram gravados",
              dados["nome"] == "Jogador Editado" and dados["numero_camisa"] == 11 and dados["nome_posicao"] == "Goleiro")

    r = cliente.put(f"/api/jogadores/{novo_id}", json={"nome": "Jogador Editado", "numero_camisa": 11, "id_posicao": id_goleiro})
    registrar("PUT com dados iguais continua 200", r.status_code == 200)

    r = cliente.put(f"/api/jogadores/{novo_id}", json={"nome": "Jogador Editado", "numero_camisa": 1, "id_posicao": id_goleiro})
    registrar("PUT com camisa de outro jogador retorna 409", r.status_code == 409)

    r = cliente.put("/api/jogadores/9999", json={"nome": "Ninguém", "numero_camisa": 50, "id_posicao": id_goleiro})
    registrar("PUT id inexistente retorna 404", r.status_code == 404)

    r = cliente.delete(f"/api/jogadores/{novo_id}")
    registrar("DELETE exclui jogador (200)", r.status_code == 200)
    r = cliente.get(f"/api/jogadores/{novo_id}")
    registrar("jogador excluído não existe mais (404)", r.status_code == 404)
    r = cliente.delete(f"/api/jogadores/{novo_id}")
    registrar("DELETE repetido retorna 404", r.status_code == 404)

    r = cliente.delete(f"/api/jogadores/{id_goleiro_jogador}")
    registrar("DELETE segundo jogador (200)", r.status_code == 200)
    r = cliente.get("/api/jogadores/")
    registrar("lista volta a ficar vazia", r.get_json() == [])


def testar_banco_desligado():
    os.environ["DB_PORT"] = "3999"
    cliente = create_app().test_client()
    r = cliente.get("/api/jogadores/")
    registrar("banco indisponível retorna 500 com mensagem", r.status_code == 500 and "erro" in r.get_json())
    os.environ["DB_PORT"] = "3306"


if __name__ == "__main__":
    conexao, cursor = criar_banco_de_teste()
    try:
        testar_banco(cursor)
        testar_rotas()
        testar_banco_desligado()
    finally:
        cursor.execute("DROP DATABASE IF EXISTS corinthians_teste")
        conexao.close()
    print(f"\n{sum(resultados)} de {len(resultados)} testes passaram.")
    sys.exit(0 if all(resultados) else 1)
