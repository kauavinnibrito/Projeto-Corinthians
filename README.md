# Corinthians FC — Cadastro de Jogadores

Projeto integrado de DWS, POO e Banco de Dados. É um sistema para gerenciar o elenco do Sport Club Corinthians Paulista: dá para cadastrar, listar, consultar, editar e excluir jogadores, e eles aparecem organizados por posição.

## O que o sistema faz

- Cadastra jogador com nome, número da camisa e posição
- Lista os jogadores agrupados por posição (Goleiro, Zagueiro, Lateral, Meio-campista e Atacante)
- Filtra a lista por posição
- Edita e exclui jogadores
- Não deixa dois jogadores usarem o mesmo número de camisa (e só aceita de 1 a 99)

## Tecnologias

- Python 3 com Flask (back-end e rotas)
- POO (classes `Jogador` e `Posicao`) e DAO
- MySQL com `mysql-connector-python`
- HTML, CSS e JavaScript em arquivos separados
- Fetch API para o JavaScript conversar com o Flask

## Organização das pastas

```
Projeto-Corinthians/
├── app/
│   ├── models/          classes Jogador e Posicao
│   ├── dao/             consultas ao banco (JogadorDAO e PosicaoDAO)
│   ├── static/css/      style.css (usado pelo Flask e pela versão do GitHub Pages)
│   ├── static/js/       script.js (Fetch, versão com Flask)
│   │                    pages.js (localStorage, versão do GitHub Pages)
│   ├── templates/       index.html (página servida pelo Flask)
│   ├── database.py      conexão com o MySQL
│   ├── routes.py        rotas da API
│   └── __init__.py      cria o app Flask
├── banco/
│   └── corinthians_db.sql
├── documentacao/
│   ├── diagramas/       UML, conceitual, lógico e físico (PNG e SVG)
│   ├── relatorio_testes.md
│   ├── guia_github.md
│   └── roteiro_apresentacao.md
├── testes/
│   └── testar_api.py
├── index.html           versão estática para o GitHub Pages (precisa ficar na raiz)
├── requirements.txt
├── run.py
└── .gitignore
```

## Como criar o banco

1. Abra o XAMPP e inicie o **MySQL**.
2. Abra o phpMyAdmin (http://localhost/phpmyadmin).
3. Clique na aba **SQL**, cole o conteúdo de `banco/corinthians_db.sql` e clique em **Executar**
   (ou use **Importar** e escolha o arquivo).

Isso cria o banco `corinthians_db`, as tabelas `posicoes` e `jogadores` e as 5 posições iniciais. Pode executar mais de uma vez sem problema.

## Como instalar e executar

Na pasta do projeto, no terminal:

```bash
pip install -r requirements.txt
python run.py
```

Depois abra no navegador: **http://127.0.0.1:5000**

O MySQL precisa ficar ligado enquanto você usa o site. A conexão usa por padrão `localhost`, usuário `root`, sem senha e o banco `corinthians_db` (XAMPP). Se o seu MySQL for diferente, mude em `app/database.py` ou use as variáveis `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` e `DB_NAME`.

## Rotas da API

| Método | Rota | O que faz |
|---|---|---|
| GET | `/api/jogadores/` | lista os jogadores |
| GET | `/api/jogadores/<id>` | busca um jogador |
| POST | `/api/jogadores/` | cadastra |
| PUT | `/api/jogadores/<id>` | atualiza |
| DELETE | `/api/jogadores/<id>` | exclui |
| GET | `/api/posicoes/` | lista as posições |

## Banco de dados

Uma posição pode ter vários jogadores e cada jogador tem uma única posição (relação 1:N).

- `posicoes` (**id_posicao**, nome_posicao)
- `jogadores` (**id_jogador**, nome, numero_camisa, *id_posicao* → posicoes)

Os diagramas estão em `documentacao/diagramas/`.

## Testes

Com o MySQL ligado, rode:

```bash
python testes/testar_api.py
```

O teste cria um banco separado (`corinthians_teste`), roda todas as rotas e apaga o banco no final. O resultado dos testes que já foram feitos está em `documentacao/relatorio_testes.md`.

## Publicação no GitHub Pages

O arquivo `index.html` na raiz é a versão estática para o GitHub Pages. Ela permite demonstrar a interface e testar cadastro, edição, exclusão e filtros. Nesta versão de demonstração, os dados são armazenados no `localStorage` do navegador.

**Limitação importante:** GitHub Pages hospeda apenas arquivos estáticos e não executa Flask/Python nem MySQL. O sistema integrado com banco de dados deve ser executado localmente (ou hospedado em um serviço próprio para back-end). O código completo do back-end permanece na pasta `app/`.

Depois de enviar o projeto para a branch `main`, o workflow `.github/workflows/pages.yml` publica automaticamente o site. No GitHub, confira em **Settings → Pages** se a fonte está configurada como **GitHub Actions**.

O endereço normalmente fica no formato `https://SEU_USUARIO.github.io/NOME_DO_REPOSITORIO/`.
