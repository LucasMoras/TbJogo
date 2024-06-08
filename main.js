
document.addEventListener('DOMContentLoaded', function() {
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

    let nomeUsuario = '';
    let numeroAleatorio = 0;
    let tentativas = 0;

    formBoasVindas.addEventListener('submit', function(event) {
        event.preventDefault();
        nomeUsuario = document.getElementById('nomeUsuario').value.trim();

        if (nomeUsuario) {
            iniciarJogo();
        } else {
            alert('Por favor, insira seu nome');
        }
    });

    formAdivinhacao.addEventListener('submit', function(event) {
        event.preventDefault();
        const adivinhar = parseInt(document.getElementById('adivinhar').value, 10);

        if (isNaN(adivinhar) || adivinhar < 1 || adivinhar > 100) {
            mensagemFeedback.textContent = 'Por favor, insira um número válido entre 1 e 100';
        } else {
            tentativas++;
            verificarPalpite(adivinhar);
        }
    });

    botaoJogarNovamente.addEventListener('click', function() {
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

    function verificarPalpite(adivinhar) {
        if (adivinhar === numeroAleatorio) {
            finalizarJogo();
        } else if (adivinhar < numeroAleatorio) {
            mensagemFeedback.textContent = 'O número correto é maior';
        } else {
            mensagemFeedback.textContent = 'O número correto é menor';
        }
    }

    function finalizarJogo() {
        nomeFinalUsuario.textContent = nomeUsuario;
        numeroCorreto.textContent = numeroAleatorio;
        pontuacaoFinal.textContent = tentativas;

        telaJogo.style.display = 'none';
        telaResultado.style.display = 'block';
    }

    function resetarJogo() {
        formBoasVindas.reset();
        formAdivinhacao.reset();

        telaBoasVindas.style.display = 'block';
        telaJogo.style.display = 'none';
        telaResultado.style.display = 'none';
    }
});

