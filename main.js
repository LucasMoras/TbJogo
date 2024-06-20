// Adiciona um listener para garantir que o script seja executado após o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function () {
    // Referencia os elementos das diferentes telas
    const telaBoasVindas = document.getElementById('telaBoasVindas');
    const telaJogo = document.getElementById('telaJogo');
    const telaResultado = document.getElementById('telaResultado');

    // Referencia os formulários e botões
    const formBoasVindas = document.getElementById('formBoasVindas');
    const formAdivinhacao = document.getElementById('formAdivinhacao');
    const botaoJogarNovamente = document.getElementById('botaoJogarNovamente');

    // Referencia os elementos de mensagem e resultado
    const mensagemBoasVindas = document.getElementById('mensagemBoasVindas');
    const mensagemFeedback = document.getElementById('mensagemFeedback');
    const nomeFinalUsuario = document.getElementById('nomeFinalUsuario');
    const numeroCorreto = document.getElementById('numeroCorreto');
    const pontuacaoFinal = document.getElementById('pontuacaoFinal');
    const classificacaoJogadores = document.getElementById('classificacaoJogadores');

    // Declaração de variáveis globais
    let nomeUsuario = '';
    let numeroAleatorio = 0;
    let tentativas = 0;

    // Referencia e adiciona evento ao botão de resetar a tabela de classificação
    const botaoResetarTabela = document.getElementById('botaoResetarTabela');
    botaoResetarTabela.addEventListener('click', function () {
        localStorage.removeItem('jogadores'); // Remove jogadores do localStorage
        mostrarClassificacao(); // Atualiza a classificação exibida
    });

    // Define o foco automático no input de nome
    document.getElementById('nomeUsuario').focus();

    // Envia as informações ao pressionar Enter no campo nomeUsuario
    document.getElementById('nomeUsuario').addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Previne comportamento padrão de envio
            formBoasVindas.dispatchEvent(new Event('submit')); // Dispara evento de submissão
        }
    });

    // Envia as informações ao pressionar Enter no campo emailUsuario
    document.getElementById('emailUsuario').addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Previne comportamento padrão de envio
            formBoasVindas.dispatchEvent(new Event('submit')); // Dispara evento de submissão
        }
    });

    // Envia as informações do formulário de boas-vindas
    formBoasVindas.addEventListener('submit', function (event) {
        event.preventDefault(); // Previne comportamento padrão de envio

        // Obtém os valores dos campos de nome e email
        nomeUsuario = document.getElementById('nomeUsuario').value.trim();
        const emailUsuario = document.getElementById('emailUsuario').value.trim();

        if (nomeUsuario && emailUsuario) { // Verifica se ambos os campos estão preenchidos
            const formData = new FormData(formBoasVindas); // Cria objeto FormData com os dados do formulário
            formData.append('nomeUsuario', nomeUsuario); // Adiciona nomeUsuario ao FormData
            formData.append('emailUsuario', emailUsuario); // Adiciona emailUsuario ao FormData

            // Envia os dados para o servidor
            fetch(formBoasVindas.action, {
                method: 'POST', // Define o método HTTP como POST
                body: formData // Define o corpo da requisição como FormData
            })
                .then(response => {
                    if (!response.ok) { // Verifica se a resposta não é ok
                        throw new Error('Erro ao enviar dados'); // Lança um erro
                    }
                    iniciarJogo(); // Inicia o jogo
                })
                .catch(error => {
                    console.error('Erro:', error); // Loga o erro no console
                    alert('Erro ao enviar dados. Por favor, tente novamente.'); // Alerta o usuário sobre o erro
                });
        } else {
            alert('Por favor, preencha seu nome e email.'); // Alerta o usuário para preencher os campos
        }
    });

    // Processa a tentativa de adivinhar o número
    formAdivinhacao.addEventListener('submit', function (event) {
        event.preventDefault(); // Previne comportamento padrão de envio

        // Obtém o valor do input e converte para inteiro
        const adivinhar = parseInt(document.getElementById('adivinhar').value, 10);

        // Verifica se o valor é válido
        if (isNaN(adivinhar) || adivinhar < 1 || adivinhar > 100) {
            mensagemFeedback.textContent = 'Por favor, insira um número válido entre 1 e 100'; // Feedback de erro
        } else {
            tentativas++; // Incrementa o número de tentativas
            verificarPalpite(adivinhar); // Verifica o palpite do usuário
            document.getElementById('adivinhar').value = ''; // Limpa o input após a tentativa
        }
    });

    // Reinicia o jogo ao clicar no botão "Jogar Novamente"
    botaoJogarNovamente.addEventListener('click', function () {
        resetarJogo(); // Chama função para resetar o jogo
    });

    // Função para iniciar o jogo
    function iniciarJogo() {
        numeroAleatorio = Math.floor(Math.random() * 100) + 1; // Gera um número aleatório entre 1 e 100
        tentativas = 0; // Reseta o contador de tentativas
        mensagemBoasVindas.textContent = `Olá ${nomeUsuario}, Tente adivinhar o número entre 1 e 100`; // Atualiza a mensagem de boas-vindas
        mensagemFeedback.textContent = ''; // Limpa a mensagem de feedback
        telaBoasVindas.style.display = 'none'; // Esconde a tela de boas-vindas
        telaJogo.style.display = 'block'; // Mostra a tela de jogo
        telaResultado.style.display = 'none'; // Esconde a tela de resultado
    }

    // Função para verificar o palpite do usuário
    function verificarPalpite(adivinhar) {
        const diferenca = Math.abs(adivinhar - numeroAleatorio); // Calcula a diferença entre o palpite e o número correto

        if (adivinhar === numeroAleatorio) { // Verifica se o palpite está correto
            registrarPontuacao(); // Registra a pontuação do usuário
            finalizarJogo(); // Finaliza o jogo
        } else {
            mensagemFeedback.textContent = adivinhar < numeroAleatorio ? 'O número correto é maior' : 'O número correto é menor'; // Fornece feedback ao usuário
            mensagemFeedback.style.color = diferenca <= 10 ? 'red' : 'blue'; // Altera a cor do feedback baseado na proximidade do palpite
        }
    }

    // Função para registrar a pontuação do usuário
    function registrarPontuacao() {
        const jogadores = JSON.parse(localStorage.getItem('jogadores')) || []; // Obtém jogadores do localStorage ou inicializa um array vazio
        jogadores.push({ nome: nomeUsuario, tentativas }); // Adiciona o novo jogador ao array
        jogadores.sort((a, b) => a.tentativas - b.tentativas); // Ordena os jogadores pelo número de tentativas
        localStorage.setItem('jogadores', JSON.stringify(jogadores)); // Salva a lista de jogadores no localStorage
    }

    // Função para mostrar a classificação dos jogadores
    function mostrarClassificacao() {
        const jogadores = JSON.parse(localStorage.getItem('jogadores')) || []; // Obtém jogadores do localStorage ou inicializa um array vazio
        const topJogadores = jogadores.slice(0, 3); // Seleciona os top 3 jogadores
        classificacaoJogadores.innerHTML = topJogadores.map(jogador => `
            <p>${jogador.nome}: ${jogador.tentativas} tentativas</p>
        `).join(''); // Gera o HTML para exibir a classificação
    }

    // Função para finalizar o jogo
    function finalizarJogo() {
        nomeFinalUsuario.textContent = nomeUsuario; // Exibe o nome do usuário
        numeroCorreto.textContent = numeroAleatorio; // Exibe o número correto
        pontuacaoFinal.textContent = tentativas; // Exibe o número de tentativas

        mostrarClassificacao(); // Mostra a classificação dos jogadores
        telaJogo.style.display = 'none'; // Esconde a tela de jogo
        telaResultado.style.display = 'block'; // Mostra a tela de resultado
    }

    // Função para resetar o jogo
    function resetarJogo() {
        formBoasVindas.reset(); // Reseta o formulário de boas-vindas
        formAdivinhacao.reset(); // Reseta o formulário de adivinhação
        document.getElementById('nomeUsuario').focus(); // Define o foco no input de nome
        telaBoasVindas.style.display = 'block'; // Mostra a tela de boas-vindas
        telaJogo.style.display = 'none'; // Esconde a tela de jogo
        telaResultado.style.display = 'none'; // Esconde a tela de resultado
    }
});