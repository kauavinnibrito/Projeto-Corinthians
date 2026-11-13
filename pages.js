// Versão estática para GitHub Pages.
// O Pages hospeda arquivos estáticos; por isso esta demonstração usa localStorage.
// O sistema completo com Flask/MySQL continua em app/ e é executado localmente.
const POSICOES = [
  {id_posicao:1,nome_posicao:"Goleiro"},
  {id_posicao:2,nome_posicao:"Zagueiro"},
  {id_posicao:3,nome_posicao:"Lateral"},
  {id_posicao:4,nome_posicao:"Meio-campista"},
  {id_posicao:5,nome_posicao:"Atacante"}
];
const CHAVE = "corinthians_fc_jogadores_v1";
const form = document.querySelector("#form-jogador");
const campoId = document.querySelector("#id-jogador");
const campoNome = document.querySelector("#nome");
const campoNumero = document.querySelector("#numero");
const campoPosicao = document.querySelector("#posicao");
const lista = document.querySelector("#lista-jogadores");
const filtros = document.querySelector("#filtros");
const mensagem = document.querySelector("#mensagem");
const totalJogadores = document.querySelector("#total-jogadores");
const tituloForm = document.querySelector("#titulo-form");
const botaoSalvar = document.querySelector("#btn-salvar");
const botaoCancelar = document.querySelector("#btn-cancelar");
let jogadores = lerDados();
let filtroAtual = "todas";
let temporizador;

function lerDados() {
  try {
    const dados = JSON.parse(localStorage.getItem(CHAVE) || "[]");
    return Array.isArray(dados) ? dados : [];
  } catch {
    return [];
  }
}
function salvarDados() { localStorage.setItem(CHAVE, JSON.stringify(jogadores)); }
function mostrarMensagem(texto, erro=false) {
  clearTimeout(temporizador);
  mensagem.textContent = texto;
  mensagem.classList.toggle("erro", erro);
  if (!erro) temporizador = setTimeout(() => { mensagem.textContent = ""; }, 4000);
}
function iniciar() {
  campoPosicao.innerHTML = '<option value="">Selecione</option>';
  POSICOES.forEach(p => {
    const op = document.createElement("option");
    op.value = p.id_posicao; op.textContent = p.nome_posicao;
    campoPosicao.appendChild(op);
  });
  desenharFiltros(); desenharLista();
}
function desenharFiltros() {
  filtros.innerHTML = "";
  [{id:"todas",nome:"Todas"}, ...POSICOES.map(p=>({id:String(p.id_posicao),nome:p.nome_posicao}))].forEach(o=>{
    const b=document.createElement("button"); b.type="button";
    b.className="filtro"+(o.id===filtroAtual?" ativo":""); b.textContent=o.nome;
    b.addEventListener("click",()=>{filtroAtual=o.id;desenharFiltros();desenharLista();});
    filtros.appendChild(b);
  });
}
function criarCartao(j) {
  const card=document.createElement("article"); card.className="cartao";
  const num=document.createElement("div"); num.className="numero-camisa"; num.textContent=j.numero_camisa;
  const info=document.createElement("div"); info.className="info-jogador";
  const nome=document.createElement("strong"); nome.textContent=j.nome;
  const pos=document.createElement("span"); pos.textContent=POSICOES.find(p=>p.id_posicao===j.id_posicao)?.nome_posicao || "Posição";
  info.append(nome,pos);
  const acoes=document.createElement("div"); acoes.className="acoes-cartao";
  const editar=document.createElement("button"); editar.type="button"; editar.className="mini"; editar.textContent="Editar";
  editar.addEventListener("click",()=>editarJogador(j.id_jogador));
  const excluir=document.createElement("button"); excluir.type="button"; excluir.className="mini excluir"; excluir.textContent="Excluir";
  excluir.addEventListener("click",()=>excluirJogador(j.id_jogador));
  acoes.append(editar,excluir); card.append(num,info,acoes); return card;
}
function desenharLista() {
  lista.innerHTML=""; let exibidos=0;
  POSICOES.filter(p=>filtroAtual==="todas"||String(p.id_posicao)===filtroAtual).forEach(p=>{
    const grupo=jogadores.filter(j=>j.id_posicao===p.id_posicao).sort((a,b)=>a.numero_camisa-b.numero_camisa);
    if(!grupo.length)return; exibidos+=grupo.length;
    const sec=document.createElement("section"); sec.className="grupo";
    const topo=document.createElement("div"); topo.className="grupo-titulo";
    const h=document.createElement("h3"); h.textContent=p.nome_posicao;
    const qtd=document.createElement("span"); qtd.className="quantidade"; qtd.textContent=grupo.length;
    topo.append(h,qtd); const grade=document.createElement("div"); grade.className="grade";
    grupo.forEach(j=>grade.appendChild(criarCartao(j))); sec.append(topo,grade); lista.appendChild(sec);
  });
  if(!exibidos){const p=document.createElement("p");p.className="vazio";p.textContent=jogadores.length?"Nenhum jogador nessa posição.":"Nenhum jogador cadastrado ainda.";lista.appendChild(p);}
  totalJogadores.textContent=jogadores.length;
}
function limparFormulario(){
  form.reset(); campoId.value=""; tituloForm.textContent="Adicionar jogador";
  botaoSalvar.textContent="Cadastrar jogador";botaoCancelar.classList.add("escondido");
  [campoNome,campoNumero,campoPosicao].forEach(c=>c.classList.remove("invalido"));
}
function editarJogador(id){
  const j=jogadores.find(x=>x.id_jogador===id);if(!j)return;
  campoId.value=j.id_jogador;campoNome.value=j.nome;campoNumero.value=j.numero_camisa;
  campoPosicao.value=j.id_posicao;tituloForm.textContent="Editar jogador";
  botaoSalvar.textContent="Salvar alterações";botaoCancelar.classList.remove("escondido");
  document.querySelector("#painel-form").scrollIntoView({behavior:"smooth"});campoNome.focus();
}
function excluirJogador(id){
  const j=jogadores.find(x=>x.id_jogador===id);if(!j)return;
  if(!confirm(`Excluir ${j.nome} do elenco?`))return;
  jogadores=jogadores.filter(x=>x.id_jogador!==id);salvarDados();
  if(campoId.value===String(id))limparFormulario();
  desenharLista();mostrarMensagem("Jogador excluído com sucesso!");
}
function validar(){
  const nome=campoNome.value.trim(),numero=Number(campoNumero.value),pos=Number(campoPosicao.value);
  const okNome=nome.length>=2,okNum=campoNumero.value!==""&&Number.isInteger(numero)&&numero>=1&&numero<=99;
  const okPos=POSICOES.some(p=>p.id_posicao===pos);
  campoNome.classList.toggle("invalido",!okNome);campoNumero.classList.toggle("invalido",!okNum);campoPosicao.classList.toggle("invalido",!okPos);
  if(!okNome)return "Informe o nome do jogador.";
  if(!okNum)return "O número da camisa deve estar entre 1 e 99.";
  if(!okPos)return "Selecione uma posição.";
  const duplicado=jogadores.some(j=>j.numero_camisa===numero&&j.id_jogador!==Number(campoId.value));
  if(duplicado)return "Esse número de camisa já está sendo usado.";
  return null;
}
form.addEventListener("submit",evento=>{
  evento.preventDefault();const problema=validar();if(problema){mostrarMensagem(problema,true);return;}
  const id=Number(campoId.value);
  const dados={id_jogador:id||Date.now(),nome:campoNome.value.trim(),numero_camisa:Number(campoNumero.value),id_posicao:Number(campoPosicao.value)};
  if(id){jogadores=jogadores.map(j=>j.id_jogador===id?dados:j);mostrarMensagem("Jogador atualizado com sucesso!");}
  else{jogadores.push(dados);mostrarMensagem("Jogador cadastrado com sucesso!");}
  salvarDados();limparFormulario();desenharLista();
});
botaoCancelar.addEventListener("click",limparFormulario);
iniciar();
