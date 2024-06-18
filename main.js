document.addEventListener('DOMContentLoaded', function () {
const telaBoasVindas = document.getElementById('telaBoasVindas');
const telaJogo = document.getElementById('telaJogo');
const telaResultado = document.getElementById('telaResultado');

const formBoasVindas = document.getElementById('formBoasVindas');
const formAdivinhacao = document.getElementById('formAdivinhacao');
const botaoJogarNovamente = document.getElementById('botaoJogarNovamente');

const mensagemBoasVindas = document.getElementById('mensagemBoasVindas');
const mensagemFeedback = document.getElementById('mensagemFeedback');
const nomeFinalUsuario = document.getElementById('nomeFinalUsuario');
const numeroCorreto = document.getElementById('numeroCorreto');
const pontuacaoFinal = document.getElementById('pontuacaoFinal');
const classificacaoJogadores = document.getElementById('classificacaoJogadores');

let nomeUsuario = '';
let numeroAleatorio = 0;
let tentativas = 0;

const botaoResetarTabela = document.getElementById('botaoResetarTabela');
botaoResetarTabela.addEventListener('click', function () {
localStorage.removeItem('jogadores');
mostrarClassificacao();
});

// Envia as informaçoes para o email
formBoasVindas.addEventListener('submit', function (event) {
event.preventDefault();
nomeUsuario = document.getElementById('nomeUsuario').value.trim();
const emailUsuario = document.getElementById('emailUsuario').value.trim();

if (nomeUsuario && emailUsuario) {
const formData = new FormData(formBoasVindas);
formData.append('nomeUsuario', nomeUsuario);
formData.append('emailUsuario', emailUsuario);
fetch(formBoasVindas.action, {
method: 'POST',
body: formData
})
.then(response => {
if (!response.ok) {
 throw new Error('Erro ao enviar dados');
}
iniciarJogo();
})
.catch(error => {
console.error('Erro:', error);
alert('Erro ao enviar dados. Por favor, tente novamente.');
});
} else {
alert('Por favor, preencha seu nome e email.');
}
});

//
formAdivinhacao.addEventListener('submit', function (event) {
event.preventDefault();
const adivinhar = parseInt(document.getElementById('adivinhar').value, 10);

if (isNaN(adivinhar) || adivinhar < 1 || adivinhar > 100) {
mensagemFeedback.textContent = 'Por favor, insira um número válido entre 1 e 100';
} else {
tentativas++;
verificarPalpite(adivinhar);
}
});

botaoJogarNovamente.addEventListener('click', function () {
resetarJogo();
});

function iniciarJogo() {
numeroAleatorio = Math.floor(Math.random() * 100) + 1;
tentativas = 0;
mensagemBoasVindas.textContent = `Olá ${nomeUsuario}, Tente adivinhar o número entre 1 e 100`;
mensagemFeedback.textContent = '';
telaBoasVindas.style.display = 'none';
telaJogo.style.display = 'block';
telaResultado.style.display = 'none';
}
//verifica o numero 
function verificarPalpite(adivinhar) {
if (adivinhar === numeroAleatorio) {
registrarPontuacao();
finalizarJogo();
} else if (adivinhar < numeroAleatorio) {
mensagemFeedback.textContent = 'O número correto é maior';
} else {
mensagemFeedback.textContent = 'O número correto é menor';
}
}

function registrarPontuacao() {
const jogadores = JSON.parse(localStorage.getItem('jogadores')) || [];
jogadores.push({ nome: nomeUsuario, tentativas });
jogadores.sort((a, b) => a.tentativas - b.tentativas);
localStorage.setItem('jogadores', JSON.stringify(jogadores));
}

// função para tela de classificação
function mostrarClassificacao() {
const jogadores = JSON.parse(localStorage.getItem('jogadores')) || [];
const topJogadores = jogadores.slice(0, 3);
classificacaoJogadores.innerHTML = topJogadores.map(jogador => `
<p>${jogador.nome}: ${jogador.tentativas} tentativas</p>
`).join('');
}

// finalizar o jogo
function finalizarJogo() {
 nomeFinalUsuario.textContent = nomeUsuario;
numeroCorreto.textContent = numeroAleatorio;
pontuacaoFinal.textContent = tentativas;

mostrarClassificacao();
telaJogo.style.display = 'none';
telaResultado.style.display = 'block';
}

// resetar jogo
function resetarJogo() {
formBoasVindas.reset();
formAdivinhacao.reset();
telaBoasVindas.style.display = 'block';
telaJogo.style.display = 'none';
telaResultado.style.display = 'none';
}
});