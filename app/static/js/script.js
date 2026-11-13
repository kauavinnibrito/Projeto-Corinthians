const form = document.querySelector("#form-jogador");
const campoId = document.querySelector("#id-jogador");
const campoNome = document.querySelector("#nome");
const campoNumero = document.querySelector("#numero");
const campoPosicao = document.querySelector("#posicao");
const lista = document.querySelector("#lista-jogadores");
const filtros = document.querySelector("#filtros");
const mensagem = document.querySelector("#mensagem");
const totalJogadores = document.querySelector("#total-jogadores");
const totalPosicoes = document.querySelector("#total-posicoes");
const tituloForm = document.querySelector("#titulo-form");
const botaoSalvar = document.querySelector("#btn-salvar");
const botaoCancelar = document.querySelector("#btn-cancelar");

let posicoes = [];
let jogadores = [];
let filtroAtual = "todas";
let temporizador;

function mostrarMensagem(texto, ehErro = false) {
    clearTimeout(temporizador);
    mensagem.textContent = texto;
    mensagem.classList.toggle("erro", ehErro);
    if (!ehErro) {
        temporizador = setTimeout(() => { mensagem.textContent = ""; }, 4000);
    }
}

async function requisitar(url, opcoes) {
    let resposta;
    try {
        resposta = await fetch(url, opcoes);
    } catch (e) {
        throw new Error("Não foi possível conectar ao servidor.");
    }
    let dados = null;
    try {
        dados = await resposta.json();
    } catch (e) {
        dados = null;
    }
    if (!resposta.ok) {
        throw new Error((dados && dados.erro) || "Erro inesperado no servidor.");
    }
    return dados;
}

async function carregarPosicoes() {
    try {
        posicoes = await requisitar("/api/posicoes/");
        campoPosicao.innerHTML = '<option value="">Selecione</option>';
        posicoes.forEach(p => {
            const opcao = document.createElement("option");
            opcao.value = p.id_posicao;
            opcao.textContent = p.nome_posicao;
            campoPosicao.appendChild(opcao);
        });
        totalPosicoes.textContent = posicoes.length;
        desenharFiltros();
    } catch (erro) {
        campoPosicao.innerHTML = '<option value="">Indisponível</option>';
        mostrarMensagem(erro.message, true);
    }
}

async function carregarJogadores() {
    try {
        jogadores = await requisitar("/api/jogadores/");
        totalJogadores.textContent = jogadores.length;
        desenharLista();
    } catch (erro) {
        lista.innerHTML = '<p class="vazio">Não foi possível carregar os jogadores.</p>';
        mostrarMensagem(erro.message, true);
    }
}

function desenharFiltros() {
    filtros.innerHTML = "";
    const opcoes = [{ id: "todas", nome: "Todas" }].concat(
        posicoes.map(p => ({ id: String(p.id_posicao), nome: p.nome_posicao }))
    );
    opcoes.forEach(o => {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "filtro" + (o.id === filtroAtual ? " ativo" : "");
        botao.textContent = o.nome;
        botao.addEventListener("click", () => {
            filtroAtual = o.id;
            desenharFiltros();
            desenharLista();
        });
        filtros.appendChild(botao);
    });
}

function criarCartao(jogador) {
    const cartao = document.createElement("article");
    cartao.className = "cartao";

    const numero = document.createElement("div");
    numero.className = "numero-camisa";
    numero.textContent = jogador.numero_camisa;

    const info = document.createElement("div");
    info.className = "info-jogador";
    const nome = document.createElement("strong");
    nome.textContent = jogador.nome;
    const posicao = document.createElement("span");
    posicao.textContent = jogador.nome_posicao;
    info.append(nome, posicao);

    const acoes = document.createElement("div");
    acoes.className = "acoes-cartao";
    const editar = document.createElement("button");
    editar.type = "button";
    editar.className = "mini";
    editar.textContent = "Editar";
    editar.addEventListener("click", () => editarJogador(jogador.id_jogador));
    const excluir = document.createElement("button");
    excluir.type = "button";
    excluir.className = "mini excluir";
    excluir.textContent = "Excluir";
    excluir.addEventListener("click", () => excluirJogador(jogador));
    acoes.append(editar, excluir);

    cartao.append(numero, info, acoes);
    return cartao;
}

function desenharLista() {
    lista.innerHTML = "";
    const grupos = posicoes.filter(p => filtroAtual === "todas" || String(p.id_posicao) === filtroAtual);
    let exibidos = 0;

    grupos.forEach(posicao => {
        const doGrupo = jogadores.filter(j => j.id_posicao === posicao.id_posicao);
        if (doGrupo.length === 0) return;
        exibidos += doGrupo.length;

        const secao = document.createElement("section");
        secao.className = "grupo";
        const titulo = document.createElement("div");
        titulo.className = "grupo-titulo";
        const h3 = document.createElement("h3");
        h3.textContent = posicao.nome_posicao;
        const quantidade = document.createElement("span");
        quantidade.className = "quantidade";
        quantidade.textContent = doGrupo.length;
        titulo.append(h3, quantidade);

        const grade = document.createElement("div");
        grade.className = "grade";
        doGrupo.forEach(j => grade.appendChild(criarCartao(j)));

        secao.append(titulo, grade);
        lista.appendChild(secao);
    });

    if (exibidos === 0) {
        const aviso = document.createElement("p");
        aviso.className = "vazio";
        aviso.textContent = jogadores.length === 0
            ? "Nenhum jogador cadastrado ainda."
            : "Nenhum jogador nessa posição.";
        lista.appendChild(aviso);
    }
}

function limparFormulario() {
    form.reset();
    campoId.value = "";
    tituloForm.textContent = "Adicionar jogador";
    botaoSalvar.textContent = "Cadastrar jogador";
    botaoCancelar.classList.add("escondido");
    [campoNome, campoNumero, campoPosicao].forEach(c => c.classList.remove("invalido"));
}

async function editarJogador(id) {
    try {
        const jogador = await requisitar(`/api/jogadores/${id}`);
        campoId.value = jogador.id_jogador;
        campoNome.value = jogador.nome;
        campoNumero.value = jogador.numero_camisa;
        campoPosicao.value = jogador.id_posicao;
        tituloForm.textContent = "Editar jogador";
        botaoSalvar.textContent = "Salvar alterações";
        botaoCancelar.classList.remove("escondido");
        document.querySelector("#painel-form").scrollIntoView({ behavior: "smooth" });
        campoNome.focus();
    } catch (erro) {
        mostrarMensagem(erro.message, true);
    }
}

function validarFormulario() {
    const nomeOk = campoNome.value.trim().length >= 2;
    const numero = Number(campoNumero.value);
    const numeroOk = campoNumero.value !== "" && Number.isInteger(numero) && numero >= 1 && numero <= 99;
    const posicaoOk = campoPosicao.value !== "";
    campoNome.classList.toggle("invalido", !nomeOk);
    campoNumero.classList.toggle("invalido", !numeroOk);
    campoPosicao.classList.toggle("invalido", !posicaoOk);
    if (!nomeOk) return "Informe o nome do jogador.";
    if (!numeroOk) return "O número da camisa deve estar entre 1 e 99.";
    if (!posicaoOk) return "Selecione a posição.";
    return null;
}

form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const problema = validarFormulario();
    if (problema) {
        mostrarMensagem(problema, true);
        return;
    }

    const id = campoId.value;
    const dados = {
        nome: campoNome.value.trim(),
        numero_camisa: Number(campoNumero.value),
        id_posicao: Number(campoPosicao.value)
    };

    botaoSalvar.disabled = true;
    try {
        const resultado = await requisitar(id ? `/api/jogadores/${id}` : "/api/jogadores/", {
            method: id ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });
        limparFormulario();
        mostrarMensagem(resultado.mensagem);
        await carregarJogadores();
    } catch (erro) {
        mostrarMensagem(erro.message, true);
    } finally {
        botaoSalvar.disabled = false;
    }
});

async function excluirJogador(jogador) {
    if (!confirm(`Excluir ${jogador.nome} do elenco?`)) return;
    try {
        const resultado = await requisitar(`/api/jogadores/${jogador.id_jogador}`, { method: "DELETE" });
        if (campoId.value === String(jogador.id_jogador)) limparFormulario();
        mostrarMensagem(resultado.mensagem);
        await carregarJogadores();
    } catch (erro) {
        mostrarMensagem(erro.message, true);
    }
}

botaoCancelar.addEventListener("click", limparFormulario);

async function iniciar() {
    await carregarPosicoes();
    await carregarJogadores();
}

iniciar();
