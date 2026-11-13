# Roteiro para apresentar

1. **Ideia:** sistema para organizar o elenco do Corinthians por posição.
2. **Banco:** duas tabelas, `posicoes` e `jogadores`. `jogadores.id_posicao` é chave estrangeira para `posicoes.id_posicao`. O número da camisa é único e vai de 1 a 99.
3. **POO e DAO:** `Jogador` e `Posicao` guardam os dados. `JogadorDAO` e `PosicaoDAO` fazem os comandos SQL.
4. **Flask:** as rotas em `routes.py` recebem o pedido, validam, chamam o DAO e respondem em JSON.
5. **Front-end:** `index.html` (estrutura), `style.css` (visual) e `script.js` (Fetch, sem recarregar a página).
6. **Demonstração:** cadastrar, ver o jogador no grupo da posição, editar, filtrar e excluir.

## Perguntas que podem fazer

- **Por que duas tabelas?** Para não repetir o nome da posição em cada jogador.
- **O que é chave estrangeira?** Campo que liga uma tabela a outra (`jogadores.id_posicao`).
- **O que é DAO?** Classe responsável por conversar com o banco.
- **Para que serve o Fetch?** Para o JavaScript chamar as rotas do Flask sem recarregar a página.
- **O que é CRUD?** Criar, ler, atualizar e excluir.
- **O que acontece se eu cadastrar camisa repetida?** O banco rejeita (UNIQUE) e a API devolve erro 409 com mensagem.
