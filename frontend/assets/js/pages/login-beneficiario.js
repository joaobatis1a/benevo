import { API_BASE_URL } from '../services/api.js';

document.addEventListener("DOMContentLoaded", () => {
    
    const form = document.getElementById("form-login-benef");
    const modal = document.getElementById("modal-desafio");
    const btnCancelar = document.getElementById("btn-cancelar-desafio");

    // Garante que o modal começa fechado via JS também
    if(modal) modal.classList.remove("visivel");

    // Botão cancelar do modal
    if(btnCancelar) {
        btnCancelar.onclick = () => {
            modal.classList.remove("visivel");
            document.getElementById("form-login-benef").reset(); // Limpa para tentar de novo
        };
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const idBenevo = document.getElementById("idBenevo").value;
        const info = document.getElementById("infoSecundaria").value;

        console.log("Tentando login inicial...", { idBenevo, info });

        try {
            // Passo 1: Validar Credenciais Iniciais
            const response = await fetch(`${API_BASE_URL}/beneficiarios/validar-acesso`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idBenevo, info })
            });

            if (response.status === 200) {
                // SUCESSO DIRETO (Bairro ou Nome Exato)
                console.log("Login direto autorizado!");
                const data = await response.json();
                realizarLogin(data); // <--- CHAMA O REDIRECIONAMENTO
            
            } else if (response.status === 202) {
                // DESAFIO NECESSÁRIO (Nome Parcial)
                console.log("Desafio de segurança necessário.");
                const data = await response.json();
                abrirModalDesafio(idBenevo, data);
            
            } else {
                // ERRO
                const msg = await response.text();
                alert(msg || "Dados não conferem. Verifique o ID e a informação.");
            }
        } catch (err) {
            console.error("Erro na requisição:", err);
            alert("Erro de conexão com o servidor.");
        }
    });
});

function abrirModalDesafio(idBenevo, data) {
    const modal = document.getElementById("modal-desafio");
    
    // Preenche os textos do modal
    document.getElementById("nome-confirmacao").innerText = data.nomeCompleto;
    document.getElementById("pergunta-texto").innerText = data.perguntaSeguranca;
    
    // Limpa input anterior
    document.getElementById("resposta-desafio").value = "";
    
    // Mostra o modal
    modal.classList.add("visivel");

    // Define ação do botão confirmar dentro do modal
    const btnConfirmar = document.getElementById("btn-responder-desafio");
    
    // Remove event listeners antigos para não acumular cliques (importante!)
    const novoBtn = btnConfirmar.cloneNode(true);
    btnConfirmar.parentNode.replaceChild(novoBtn, btnConfirmar);

    novoBtn.onclick = async () => {
        const resposta = document.getElementById("resposta-desafio").value;
        
        console.log("Enviando resposta do desafio...");

        try {
            const resp = await fetch(`${API_BASE_URL}/beneficiarios/responder-desafio`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idBenevo, resposta })
            });

            if (resp.ok) {
                console.log("Desafio vencido! Logando...");
                const loginData = await resp.json();
                realizarLogin(loginData); // <--- CHAMA O REDIRECIONAMENTO
            } else {
                alert("Resposta incorreta! Tente novamente.");
            }
        } catch (err) {
            console.error(err);
            alert("Erro ao validar resposta.");
        }
    };
}

function realizarLogin(data) {
    console.log("Salvando sessão e redirecionando...", data);
    
    // Salva dados
    localStorage.setItem("token_benevo", data.token);
    localStorage.setItem("user_id", data.id);
    localStorage.setItem("user_nome", data.nome);
    localStorage.setItem("user_tipo", "BENEFICIARIO");
    
    // Feedback rápido
    alert(`Bem-vindo(a), ${data.nome}!`);
    
    // REDIRECIONAMENTO
    // Garante que estamos indo para o arquivo correto na mesma pasta
    window.location.href = "painel-resgate-beneficiario.html";
}