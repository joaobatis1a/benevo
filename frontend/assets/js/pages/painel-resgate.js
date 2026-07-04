import { apiBuscarItens, apiReservarItem } from '../services/api.js';

document.addEventListener("DOMContentLoaded", () => {
    verificarLogin();
    carregarItens();
    configurarFiltros();
    configurarLogout();
});

// --- VARIÁVEIS GLOBAIS DO MÓDULO ---
let itemSelecionadoId = null; // Guarda o ID do item aberto no modal

// --- 1. VERIFICAÇÃO DE SEGURANÇA (desativada nesta demo — sem backend real) ---
function verificarLogin() {
    // Checagem de login desativada para permitir visualização livre na demo.
}

function configurarLogout() {
    document.getElementById("btn-logout").onclick = () => {
        localStorage.clear();
        window.location.href = "login-admin.html";
    };
}

// --- 2. BUSCA E RENDERIZAÇÃO ---
async function carregarItens() {
    const grid = document.getElementById("grid-itens");
    const termo = document.getElementById("campo-busca").value;
    
    // Filtros simples (podem ser expandidos)
    const sortBy = document.getElementById("mais-recente").checked ? "dataEntrada" : "condicao";
    const sortDir = document.getElementById("mais-recente").checked ? "DESC" : "DESC";

    try {
        // Chama a API real
        const itens = await apiBuscarItens({ termo, sortBy, sortDir });
        
        // Filtra no front apenas os DISPONÍVEIS (Backend retorna todos na busca genérica)
        const disponiveis = itens.filter(i => i.status === "Disponível");

        renderizarGrid(disponiveis);
    } catch (error) {
        console.error("Erro ao carregar itens:", error);
        grid.innerHTML = "<p>Erro ao carregar itens. Tente recarregar a página.</p>";
    }
}

function renderizarGrid(itens) {
    const grid = document.getElementById("grid-itens");
    grid.innerHTML = ""; // Limpa loading ou itens anteriores

    if (itens.length === 0) {
        grid.innerHTML = "<p>Nenhum item disponível no momento.</p>";
        return;
    }

    itens.forEach(item => {
        const card = document.createElement("div");
        card.className = "item-card";
        
        // Formata a data
        const dataFormatada = new Date(item.dataEntrada).toLocaleDateString('pt-BR');

        card.innerHTML = `
            <div class="item-info">
                <p><strong>${item.nome}</strong></p>
                <p>Categoria: ${item.categoria}</p>
                <p>Tamanho: ${item.tamanho}</p>
                <p>Condição: ${item.condicao}/5</p>
                <p style="font-size:0.8rem; color:#888;">Chegou em: ${dataFormatada}</p>
            </div>
            <div class="item-actions">
                <button class="btn-resgatar" data-id="${item.id}">Quero este!</button>
            </div>
        `;

        // Adiciona evento de clique no botão
        const btn = card.querySelector(".btn-resgatar");
        btn.onclick = () => abrirModalDetalhes(item);

        grid.appendChild(card);
    });
}

// --- 3. LÓGICA DE MODAIS E RESGATE ---

function abrirModalDetalhes(item) {
    itemSelecionadoId = item.id;
    const modal = document.getElementById("modal-editar");

    // Preenche os dados do modal com o item clicado
    document.getElementById("modal-nome").value = item.nome;
    document.getElementById("modal-tamanho").value = item.tamanho;
    document.getElementById("modal-categoria").value = item.categoria;
    document.getElementById("modal-condicao").value = item.condicao + "/5";
    document.getElementById("modal-descricao").value = item.descricao || "Sem descrição.";

    modal.classList.add("visivel");
}

// Configura os botões do Modal de Detalhes
document.getElementById("btn-fechar-modal").onclick = fecharModalDetalhes;
document.getElementById("btnCancelarModal").onclick = fecharModalDetalhes;

document.getElementById("btnConfirmarResgate").onclick = async () => {
    const beneficiarioId = localStorage.getItem("user_id"); // ID Mongo do usuário logado
    
    if (!beneficiarioId || !itemSelecionadoId) {
        alert("Erro de sessão. Faça login novamente.");
        return;
    }

    // UX: Desabilita botão para evitar duplo clique
    const btn = document.getElementById("btnConfirmarResgate");
    btn.innerText = "Processando...";
    btn.disabled = true;

    try {
        // CHAMA A API REAL PARA RESGATAR
        await apiReservarItem(itemSelecionadoId, beneficiarioId);
        
        fecharModalDetalhes();
        abrirModalSucesso(); // Abre o sucesso e prepara o logout
    } catch (error) {
        console.error(error);
        alert("Erro ao resgatar: " + error.message);
        btn.innerText = "Confirmar Resgate";
        btn.disabled = false;
    }
};

function fecharModalDetalhes() {
    document.getElementById("modal-editar").classList.remove("visivel");
    // Reseta estado do botão se foi usado
    const btn = document.getElementById("btnConfirmarResgate");
    btn.innerText = "Confirmar Resgate";
    btn.disabled = false;
}

// --- 4. SUCESSO E LOGOUT AUTOMÁTICO ---

function abrirModalSucesso() {
    const modalSucesso = document.getElementById("modal-sucesso");
    const texto = document.getElementById("mensagemSucessoTexto");
    const nomeItem = document.getElementById("modal-nome").value;

    texto.innerHTML = `O item <b>${nomeItem}</b> foi reservado para você!<br>Dirija-se ao balcão com seu ID para retirada.`;
    modalSucesso.classList.add("visivel");
}

// Ao clicar em "Entendido" no sucesso, faz o logout e redireciona
document.getElementById("btn-entendido").onclick = () => {
    localStorage.clear();
    window.location.replace("login-beneficiario.html"); // Replace para não voltar com botão "voltar"
};

// --- 5. CONFIGURAÇÃO DE FILTROS ---
function configurarFiltros() {
    // Busca ao digitar (com debounce simples ou enter)
    document.getElementById("campo-busca").addEventListener("keyup", (e) => {
        if (e.key === "Enter") carregarItens();
    });

    // Busca ao clicar nos checkboxes
    document.getElementById("mais-recente").addEventListener("change", (e) => {
        if(e.target.checked) document.getElementById("melhor-estado").checked = false;
        carregarItens();
    });
    
    document.getElementById("melhor-estado").addEventListener("change", (e) => {
        if(e.target.checked) document.getElementById("mais-recente").checked = false;
        carregarItens();
    });
}