# Relatório de testes

Testes feitos em 09/11/2026. Ambiente: Linux, Python 3.12, Flask 3.1, mysql-connector-python e **MariaDB 10.11** (é o servidor que o XAMPP usa no lugar do MySQL, com o mesmo protocolo e os mesmos comandos SQL usados aqui).

## O que foi testado e passou

| Teste | Como foi feito | Resultado |
|---|---|---|
| Sintaxe Python | `python -m py_compile` em todos os .py | OK |
| Sintaxe JavaScript | `node --check app/static/js/script.js` | OK |
| Criação do banco | executei `banco/corinthians_db.sql` do zero e uma segunda vez em cima | OK, sem erros |
| Tabelas e posições iniciais | consultei `SHOW TABLES` e a tabela posicoes | OK (2 tabelas, 5 posições) |
| Chave estrangeira | consultei o `information_schema` | OK (jogadores.id_posicao → posicoes.id_posicao) |
| Restrições | tentei inserir posição inexistente e camisa 100 direto no banco | banco recusou os dois |
| Conexão MySQL | rotas leram e gravaram no banco de verdade | OK |
| Rotas e CRUD | `testes/testar_api.py` (resultado abaixo) | 32 de 32 |
| Interface | navegador Chromium automatizado (Playwright) contra o servidor Flask rodando | OK |

### Resultado do `testes/testar_api.py`

```
[OK]   tabelas posicoes e jogadores existem
[OK]   posições iniciais inseridas
[OK]   FK jogadores.id_posicao -> posicoes.id_posicao
[OK]   banco rejeita posição inexistente
[OK]   banco rejeita camisa fora de 1-99 (CHECK)
[OK]   GET / abre a página
[OK]   CSS carrega
[OK]   JS carrega
[OK]   GET /api/posicoes/ lista 5 posições
[OK]   GET /api/jogadores/ lista vazia
[OK]   POST cadastra jogador (201)
[OK]   GET por id retorna o jogador com a posição
[OK]   GET id inexistente retorna 404
[OK]   POST número de camisa repetido retorna 409
[OK]   POST posição inexistente retorna 400
[OK]   POST nome vazio retorna 400
[OK]   POST camisa 150 retorna 400
[OK]   POST camisa como texto retorna 400
[OK]   POST sem JSON retorna 400
[OK]   POST segundo jogador (201)
[OK]   GET lista 2 jogadores ordenados por posição e camisa
[OK]   PUT atualiza jogador (200)
[OK]   dados atualizados foram gravados
[OK]   PUT com dados iguais continua 200
[OK]   PUT com camisa de outro jogador retorna 409
[OK]   PUT id inexistente retorna 404
[OK]   DELETE exclui jogador (200)
[OK]   jogador excluído não existe mais (404)
[OK]   DELETE repetido retorna 404
[OK]   DELETE segundo jogador (200)
[OK]   lista volta a ficar vazia
[OK]   banco indisponível retorna 500 com mensagem

32 de 32 testes passaram.
```

### Teste da interface (navegador)

Com o servidor rodando e o banco real, o navegador automatizado conferiu: carregamento das posições via Fetch, mensagem de validação com formulário vazio, cadastro de 4 jogadores, agrupamento por posição, erro de camisa repetida mostrado na tela, filtro por posição, edição (formulário preenchido e jogador movido de grupo), exclusão e lista vazia no final. Também conferi que não há rolagem horizontal em tela de celular (390 px). O único "erro" no console do navegador foi o 409 de propósito do teste de camisa repetida.

## O que NÃO foi testado

- **XAMPP / MySQL Server de verdade:** usei MariaDB. Não há nada específico de MariaDB no código, mas o teste final no seu computador com o XAMPP ainda precisa ser feito por você.
- **phpMyAdmin:** não foi usado; o SQL foi executado pela linha de comando.
- **Navegadores além do Chromium** (Firefox, Safari) e aparelhos celulares reais.
- **Envio ao GitHub:** nada foi enviado. Veja `guia_github.md`.
- **Arquivo nativo do brModelo (.brM):** não foi gerado. Os diagramas são PNG e SVG.
