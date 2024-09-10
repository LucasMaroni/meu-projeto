let atendimentos = [];
let intervalos = {};
let atendimentoAtivo = null; // Variável para acompanhar o atendimento ativo

// Atualiza as opções de marca com base no tipo de veículo selecionado
function updateMarcaOptions() {
    const tipoVeiculo = document.getElementById('tipoVeiculo').value;
    const marcaSelect = document.getElementById('marca');
    marcaSelect.innerHTML = ''; // Limpa opções anteriores

    if (tipoVeiculo === 'CAVALO') {
        const opcoes = ['SCANIA', 'MERCEDES BENZ', 'VOLKSWAGEN', 'IVECO', 'DAF', 'VOLVO'];
        opcoes.forEach(marca => {
            const option = document.createElement('option');
            option.value = marca;
            option.textContent = marca;
            marcaSelect.appendChild(option);
        });
    } else if (tipoVeiculo === 'CARRETA') {
        const opcoes = ['FACCHINI', 'RANDON', 'IBIPORAN'];
        opcoes.forEach(marca => {
            const option = document.createElement('option');
            option.value = marca;
            option.textContent = marca;
            marcaSelect.appendChild(option);
        });
    }
}

// Formata o campo de placa
function formatarPlaca(input) {
    input.value = input.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase(); // Remove caracteres inválidos e converte para maiúscula
    if (input.value.length > 3 && !input.value.includes('-')) {
        input.value = input.value.slice(0, 3) + '-' + input.value.slice(3);
    }
}

// Formata o campo de tempo de risco
function formatarTempoRisco(input) {
    input.value = input.value.replace(/[^0-9]/g, ''); // Apenas números
    if (input.value.length === 2) {
        input.value = input.value + ':';
    }
}

// Inicia um atendimento e adiciona à lista de status
function iniciarAtendimento() {
    const placa = document.getElementById('placa').value;
    const operacao = document.getElementById('operacao').value;
    const localizacaoAtual = document.getElementById('localizacaoAtual').value;

    // Certifique-se de que o formulário foi preenchido corretamente
    if (!placa || !operacao || !localizacaoAtual) {
        alert('Por favor, preencha todos os campos antes de iniciar um atendimento.');
        return;
    }

    const atendimentoId = new Date().getTime(); // ID único baseado no timestamp
    atendimentoAtivo = atendimentoId; // Define que há um atendimento ativo
    const atendimentoDiv = document.createElement('div');

    atendimentoDiv.className = 'atendimento-item';
    atendimentoDiv.setAttribute('data-id', atendimentoId); // Adiciona um atributo para identificar o atendimento
    atendimentoDiv.innerHTML = `
        <p><span>Placa:</span> ${placa} - <span>Operação:</span> ${operacao} - <span>Localização Atual:</span> ${localizacaoAtual}</p>
        <button class="finalizar-btn" onclick="confirmarFinalizacao(${atendimentoId})">Finalizar</button>
        <p id="cronometro-${atendimentoId}">00:00:00</p>
    `;

    document.getElementById('atendimentoStatus').appendChild(atendimentoDiv);

    // Inicia o cronômetro para o atendimento específico
    const startTime = Date.now();
    intervalos[atendimentoId] = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const seconds = Math.floor((elapsedTime / 1000) % 60);
        const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
        const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);

        document.getElementById(`cronometro-${atendimentoId}`).textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);

    // Limpa o formulário
    document.getElementById('atendimentoForm').reset();
}

// Confirma a finalização do atendimento e exibe o modal de confirmação
function confirmarFinalizacao(atendimentoId) {
    // Exibe a caixa de confirmação
    const confirmacaoModal = document.getElementById('confirmacaoModal');
    confirmacaoModal.style.display = 'flex';

    document.getElementById('confirmarFinalizar').onclick = function() {
        finalizarAtendimento(atendimentoId);
        confirmacaoModal.style.display = 'none'; // Fecha o modal após a confirmação
    };

    document.getElementById('cancelarFinalizar').onclick = function() {
        confirmacaoModal.style.display = 'none'; // Fecha o modal se o usuário cancelar
    };
}

// Finaliza um atendimento e remove da lista de status
function finalizarAtendimento(atendimentoId) {
    clearInterval(intervalos[atendimentoId]); // Para o cronômetro
    delete intervalos[atendimentoId]; // Remove o intervalo

    const atendimentoDiv = document.querySelector(`.atendimento-item[data-id='${atendimentoId}']`);
    if (atendimentoDiv) {
        const botao = atendimentoDiv.querySelector('button');
        botao.innerText = 'Finalizado';
        botao.className = 'finalizado-btn'; // Atualiza a classe do botão
        botao.disabled = true; // Desativa o botão para não poder ser clicado novamente
    }

    const placa = atendimentoDiv.querySelector('p').textContent.match(/Placa:\s(\S+)/)[1];
    const operacao = atendimentoDiv.querySelector('p').textContent.match(/Operação:\s(\S+)/)[1];
    const localizacao = atendimentoDiv.querySelector('p').textContent.match(/Localização Atual:\s(\S+)/)[1];
    const status = 'Finalizado'; // Status do atendimento
    const tempo = document.getElementById(`cronometro-${atendimentoId}`).textContent;

    enviarDadosParaServidor(atendimentoId, placa, operacao, localizacao, status, tempo);
}

// Função para enviar dados para o servidor
function enviarDadosParaServidor(id, placa, operacao, localizacao, status, tempo) {
    fetch('http://localhost:3000/finalizar-atendimento', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, placa, operacao, localizacao, status, tempo }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Dados enviados com sucesso:', data);
    })
    .catch(error => {
        console.error('Erro ao enviar dados:', error);
    });
}

let Atendimentos = [
    { id: 1, placa: 'ABC123', status: 'Em atendimento' },
    // outros atendimentos
  ];
  
  localStorage.setItem('Atendimentos', JSON.stringify(Atendimentos));
