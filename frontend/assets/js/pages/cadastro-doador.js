import { apiRegistrarDoador } from '../services/api.js';

document.addEventListener("DOMContentLoaded", () => {
    
    // --- LÓGICA DE MOSTRAR SENHA ---
    function setupTogglePassword(inputId, iconId) {
        const input = document.getElementById(inputId);
        const icon = document.getElementById(iconId);
        
        icon.addEventListener('click', () => {
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }

    setupTogglePassword('senha', 'toggleSenha');
    setupTogglePassword('confirmaSenha', 'toggleConfirmaSenha');

    // --- VALIDAÇÃO EM TEMPO REAL ---
    const senhaInput = document.getElementById('senha');
    const confirmaInput = document.getElementById('confirmaSenha');
    const ruleLength = document.getElementById('rule-length');
    const ruleMatch = document.getElementById('rule-match');

    function validarSenhas() {
        const s1 = senhaInput.value;
        const s2 = confirmaInput.value;

        if (s1.length >= 6) ruleLength.className = 'valid';
        else ruleLength.className = '';

        if (s1 && s1 === s2) ruleMatch.className = 'valid';
        else ruleMatch.className = '';
    }

    senhaInput.addEventListener('input', validarSenhas);
    confirmaInput.addEventListener('input', validarSenhas);

    // --- MODAL DE SUCESSO ---
    const modal = document.createElement("div");
    modal.id = "modal-sucesso";
    modal.style.display = "none";
    modal.className = "modal-sucesso";

    modal.innerHTML = `
        <div class="modal-sucesso-conteudo">
            <h2>Cadastro concluído!</h2>
            <p>Obrigado por se juntar à Benevo! Agora você pode acessar sua conta e fazer doações.</p>
            <button id="btn-ir-login" class="btn-modal">Ir para Login</button>
        </div>
    `;
    document.body.appendChild(modal);

    function abrirModalSucesso() {
        modal.style.display = "flex";
    }

    document.addEventListener("click", (e) => {
        if (e.target.id === "btn-ir-login") {
            window.location.href = "login-doador.html";
        }
    });

    // --- SUBMIT ---
    const form = document.getElementById("form-cad-doador");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const s1 = senhaInput.value;
        const s2 = confirmaInput.value;

        if (s1.length < 6) {
            alert("A senha deve ter no mínimo 6 caracteres.");
            return;
        }
        if (s1 !== s2) {
            alert("As senhas não coincidem.");
            return;
        }

        const doadorData = {
            nome: document.getElementById("nome").value,
            email: document.getElementById("email").value,
            senha: document.getElementById("senha").value,
            cpfCnpj: document.getElementById("cpf").value,
            telefone: document.getElementById("telefone").value
        };

        try {
            const novoDoador = await apiRegistrarDoador(doadorData);
            
            // SUCESSO: Define sessão temporária
            sessionStorage.setItem('temp_doador_id', novoDoador.id);
            sessionStorage.setItem('temp_doador_nome', novoDoador.nome);

            alert("Cadastro realizado! Redirecionando para registrar o item...");
            window.location.href = "cadastro-item.html";
            
        } catch (error) {
            alert("Erro: " + error.message);
        }
    });
});