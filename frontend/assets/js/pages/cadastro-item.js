import { cadastrarItem } from '../services/api.js';

document.addEventListener("DOMContentLoaded", function () {
    
    // 1. CHECAGEM DUPLA (desativada nesta demo — sem backend real):
    // A) Admin está logado?
    const adminToken = localStorage.getItem("token_benevo");
    // Checagem de token desativada para permitir visualização livre na demo.

    // B) Temos um doador identificado para esta sessão?
    const doadorId = sessionStorage.getItem("temp_doador_id") || "demo";
    const doadorNome = sessionStorage.getItem("temp_doador_nome") || "Doador Demo";
    // Checagem de doador desativada para permitir visualização livre na demo.

    // Feedback visual de quem é o doador (opcional, mas bom pra UX)
    // Se tiver um lugar no HTML, exibe: document.getElementById('nome-doador-display').innerText = doadorNome;

    // --- LÓGICA DE SAÍDA DO FLUXO ---
    function sairDoFluxo() {
        // Limpa a sessão temporária do doador
        sessionStorage.removeItem("temp_doador_id");
        sessionStorage.removeItem("temp_doador_nome");
        // Volta para o menu do Admin
        window.location.href = "menu-doador.html";
    }

    const btnLogout = document.getElementById("btn-logout");
    if (btnLogout) {
        btnLogout.innerText = "Cancelar Fluxo"; // Texto mais apropriado
        btnLogout.onclick = (e) => {
            e.preventDefault();
            if(confirm("Cancelar doação e voltar ao menu?")) sairDoFluxo();
        };
    }

    // --- ENVIO DO FORMULÁRIO ---
    const formDoacao = document.getElementById('form-doacao');
    if (formDoacao) {
        formDoacao.addEventListener('submit', function (event) {
            event.preventDefault(); 
            
            const itemData = {
                nome: document.getElementById('nome').value,
                categoria: document.getElementById('categoria').value,
                descricao: document.getElementById('descricao').value,
                condicao: document.getElementById('condicao').value,
                tamanho: document.getElementById('tamanho').value,
                doadorId: doadorId // Usa o ID da sessão temporária
            };

            // Usa o token do ADMIN para autorizar a requisição
            cadastrarItem(itemData, adminToken)
                .then(data => {
                    exibirModalAgradecimento(data.nome, doadorNome, sairDoFluxo);
                    formDoacao.reset(); 
                })
                .catch(error => {
                    console.error(error);
                    alert('Erro ao salvar: ' + error.message);
                });
        });
    }
});

function exibirModalAgradecimento(itemNome, doadorNome, callbackSair) {
    const modal = document.createElement("div");
    modal.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; z-index:9999;";

    modal.innerHTML = `
        <div style="background: white; padding: 30px; width: 90%; max-width: 400px; border-radius: 15px; text-align: center; font-family: Poppins, sans-serif;">
            <i class="fas fa-check-circle" style="font-size: 3rem; color: #28a745; margin-bottom: 15px;"></i>
            <h2 style="color: #1f365c; margin-bottom: 10px;">Item Registrado!</h2>
            <p style="color: #555; margin-bottom: 20px;">
                Doador: <strong>${doadorNome}</strong><br>
                Item: <strong>${itemNome}</strong>
            </p>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button id="btn-novo" style="background: #1f365c; color: white; padding: 10px 20px; border:none; border-radius:8px; cursor:pointer;">Novo Item (Mesmo Doador)</button>
                <button id="btn-sair" style="background: #dc3545; color: white; padding: 10px 20px; border:none; border-radius:8px; cursor:pointer;">Finalizar</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Novo Item: Apenas fecha o modal, mantém a sessão do doador
    document.getElementById("btn-novo").onclick = () => modal.remove();
    
    // Finalizar: Chama a função de limpeza e sai
    document.getElementById("btn-sair").onclick = () => callbackSair();
}