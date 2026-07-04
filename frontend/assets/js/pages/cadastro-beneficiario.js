import { apiRegistrarBeneficiario } from '../services/api.js';

// 1. Obtenção dos elementos do Modal (CORRIGIDO PARA BATER COM O HTML)
const modalSucesso = document.getElementById('modal-sucesso-cadastro');
const beneficiaryIdDisplay = document.getElementById('id-gerado'); // Era 'beneficiaryIdDisplay'
const btnEntendido = document.getElementById('btn-fechar-modal'); // Era 'btn-entendido-cadastro'

function mostrarModalSucesso(id) {
    beneficiaryIdDisplay.textContent = id;
    modalSucesso.classList.add('visivel');
}

function fecharModalSucesso() {
    modalSucesso.classList.remove('visivel');
    // Redireciona para o login para que ele possa usar o novo ID
    window.location.href = 'login-beneficiario.html'; 
}

// Agora 'btnEntendido' não é mais null, então o addEventListener vai funcionar
if (btnEntendido) {
    btnEntendido.addEventListener('click', fecharModalSucesso);
}

document.getElementById("form-cad-beneficiario").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const btnCadastrar = document.querySelector('.btn-cadastrar');
    btnCadastrar.disabled = true;
    btnCadastrar.textContent = 'Aguarde...';

    const local = document.getElementById("local").value;
    
    if (local.length < 3) {
        alert("Por favor, digite um local válido (pelo menos 3 letras).");
        btnCadastrar.disabled = false;
        btnCadastrar.textContent = 'Solicitar Cadastro';
        return;
    }
    
    const data = {
        nome: document.getElementById("nome").value,
        bairroCidade: local,
        email: document.getElementById("email").value || null,
        telefone: document.getElementById("telefone").value || null,
        perguntaSeguranca: document.getElementById("pergunta").value,
        respostaSeguranca: document.getElementById("resposta").value,
    };

    try {
        const resultado = await apiRegistrarBeneficiario(data); 

        // IMPORTANTE: Exibe o ID amigável (ex: JOA936) e não o ID do banco
        mostrarModalSucesso(resultado.idBenevo); 

    } catch (error) {
        alert("Erro no cadastro: " + (error.message || "Tente novamente mais tarde."));
        console.error("Detalhes do erro:", error);
        // Reativa o botão em caso de erro
        btnCadastrar.disabled = false;
        btnCadastrar.textContent = 'Solicitar Cadastro';
    }
    // Nota: O 'finally' foi removido porque queremos manter o botão desabilitado
    // se der sucesso, para evitar múltiplos envios enquanto o modal está aberto.
});