# Envio do projeto ao GitHub e publicação

## 1. Criar o repositório
No GitHub, crie um repositório chamado `Corinthians_FC`. Se possível, deixe-o vazio (não marque para criar README, licença ou .gitignore), pois os arquivos deste projeto já incluem esses documentos.

## 2. Enviar pelo terminal do VS Code
Abra a pasta `Corinthians_FC` no VS Code e execute:

```bash
git init
git branch -M main
git add .
git commit -m "Projeto integrado: estrutura inicial e banco de dados"
git remote add origin https://github.com/SEU_USUARIO/Corinthians_FC.git
git push -u origin main
```

Troque `SEU_USUARIO` pelo seu usuário do GitHub. Se o repositório já tiver arquivos/commits, não force o envio: primeiro compare o conteúdo para evitar apagar trabalho existente.

## 3. Publicar pelo GitHub Pages
O projeto inclui `.github/workflows/pages.yml`. Depois do primeiro `push`:
1. Abra o repositório no GitHub.
2. Entre em **Settings → Pages**.
3. Em **Build and deployment → Source**, selecione **GitHub Actions**.
4. Abra a aba **Actions** e aguarde o workflow “Publicar site no GitHub Pages” terminar com sucesso.
5. O endereço será `https://SEU_USUARIO.github.io/Corinthians_FC/`.

A página inicial usa `index.html` na raiz. O cadastro demonstrativo do Pages guarda dados no navegador (`localStorage`); para usar o banco MySQL real, execute o Flask localmente conforme o README.

## 4. Adicionar o professor como colaborador (obrigatório)
1. Abra **Settings → Collaborators**.
2. Clique em **Add people**.
3. Informe `leonardo.stephan@eaportal.org`.
4. Selecione a conta correspondente e confirme o convite.

## 5. Histórico de commits
Faça commits reais conforme avançar, sem alterar datas para simular etapas. Sugestões de mensagens:
- `Etapa 1: modelagem UML e criação do banco`
- `Etapa 2: implementação das classes, DAOs e rotas Flask`
- `Entrega final: interface e integração Fetch`
- `Correções e documentação final`

O histórico deve refletir o desenvolvimento efetivamente realizado.
