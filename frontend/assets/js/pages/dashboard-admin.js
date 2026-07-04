/* ==========================================================================
   BENEVO - dashboard-admin.js
   --------------------------------------------------------------------------
   Responsável por:
   1. Buscar e renderizar os itens do banco de dados (Sprint 2 - Read)
   2. Controlar os filtros de busca, data e condição (Sprint 2 - Read)
   3. Controlar os botões de Edição (Sprint 2 - Update)
   4. Controlar os botões de Deleção (Sprint 2 - Delete)
   ========================================================================== */

// --- IMPORTAÇÕES ---
// (Note que importamos 'getItemsComFiltros' e não 'apiBuscarItens')
import {
  apiBuscarItens,
  apiEditarItem,
  apiDeletarItem,
} from "../services/api.js";

// --- ELEMENTOS DO HTML (DOM) ---
// (IDs e Classes baseados no dashboard-admin.html)

// Grid
const itemGrid = document.querySelector(".item-grid");

// Filtros
const inputBusca = document.querySelector(".search-input-gestao-final");
const checkMaisRecente = document.getElementById("mais-recente");
const checkMaisAntigo = document.getElementById("mais-antigo");
const checkMelhorEstado = document.getElementById("melhor-estado");
const checkPiorEstado = document.getElementById("pior-estado");

// Modal
const modal = document.getElementById("modal-editar");
const modalTitle = document.getElementById("modalTitle");
const btnFecharModal = document.querySelector(".close-button");
const btnSalvarModal = document.getElementById("btnSalvar");
const formEditar = document.getElementById("itemForm");

// --- 1. FUNÇÃO PRINCIPAL: CARREGAR OS ITENS ---
/**
 * Busca os itens na API usando os filtros e chama a função para renderizar.
 * @param {Object} filtros - Objeto contendo {termo, condicao, sortData}
 */
async function carregarItens(filtros = {}) {
  if (!itemGrid) return; // Se não achar a grid, não faz nada

  console.log("Carregando itens com filtros:", filtros);
  try {
    // Chama a função CORRETA do api.js
    const itens = await apiBuscarItens(filtros);

    // Limpa a grid antes de adicionar novos itens
    itemGrid.innerHTML = "";

    // Verifica se retornou itens
    if (!itens || itens.length === 0) {
      itemGrid.innerHTML = "<p>Nenhum item encontrado no banco de dados.</p>";
      return;
    }

    // Chama a função para "desenhar" cada item
    itens.forEach(renderizarItemCard);
  } catch (error) {
    console.error("Erro ao carregar itens:", error);
    itemGrid.innerHTML = "<p>Erro ao carregar itens. Tente novamente.</p>";
  }
}

// --- 2. FUNÇÃO DE RENDERIZAÇÃO: "DESENHAR" O CARD ---
/**
 * Cria o HTML de um card de item e o anexa na grid.
 * @param {Object} item - O objeto de item vindo do banco (com id, nome, etc.)
 */
function renderizarItemCard(item) {
  const card = document.createElement("div");
  card.className = "item-card";
  card.dataset.itemId = item.id; // Salva o ID do item no card

  // Mapeia a condição (ex: "5") para o texto (ex: "5/5")
  const estadoTexto = `${item.condicao || "N/A"}/5`;

  card.innerHTML = ` 
    <div class="item-info">
        <p><strong>Nome:</strong> ${item.nome}</p>
        <p><strong>Tamanho:</strong> ${item.tamanho || "N/A"}</p>
        <p><strong>Categoria:</strong> ${item.categoria}</p>
        <p><strong>Doador:</strong> ${item.doadorNome || "(Não informado)"}</p> 
        <p><strong>Estado:</strong> ${estadoTexto}</p>
        <p><strong>Data:</strong> ${new Date(item.dataEntrada).toLocaleDateString("pt-BR")}</p>
    </div>
    <div class="item-actions">
        <button class="btn-ver-mais">Ver Mais</button>
        <div class="btn-icon-group"> 
            <button class="btn-icon btn-edit"><i class="fas fa-pencil-alt"></i></button>
            <button class="btn-icon btn-delete"><i class="fas fa-trash-alt"></i></button>
        </div>
    </div>
    `;

  // --- Adiciona os eventos nos botões do card ---

  // Botão Editar
  card.querySelector(".btn-edit").addEventListener("click", () => {
    abrirModal("edit", item);
  });

  // Botão Deletar
  card.querySelector(".btn-delete").addEventListener("click", () => {
    handleDeletarItem(item.id, item.nome);
  });

  // Botão Ver Mais (atualmente faz o mesmo que editar, mas em modo 'view')
  card.querySelector(".btn-ver-mais").addEventListener("click", () => {
    abrirModal("view", item);
  });

  // Adiciona o card pronto na grid
  itemGrid.appendChild(card);
}

// --- 3. LÓGICA DO MODAL (EDITAR / VER MAIS) ---
/**
 * Abre o modal e o preenche com os dados do item.
 * @param {String} mode - "edit" (para editar) ou "view" (para visualizar)
 * @param {Object} item - O objeto do item a ser exibido/editado
 */
function abrirModal(mode, item) {
  // Preenche os campos do formulário
  formEditar.querySelector("#nome").value = item.nome;
  formEditar.querySelector("#tamanho").value = item.tamanho;
  formEditar.querySelector("#categoria").value = item.categoria;
  formEditar.querySelector("#doador").value = item.doadorNome || "(Não informado)";
  formEditar.querySelector("#estado").value = item.condicao;
  formEditar.querySelector("#data").value = new Date(item.dataEntrada).toLocaleDateString("pt-BR");
  formEditar.querySelector("#descricao").value = item.descricao;

  // Guarda o ID do item no próprio formulário para salvar
  formEditar.dataset.itemId = item.id;

  if (mode === "edit") {
    modalTitle.textContent = "Editar Item " + item.id;
    btnSalvarModal.style.display = "inline-block";
    formEditar.querySelectorAll("input, textarea").forEach((el) => {
      // Deixa todos os campos editáveis, exceto o doador e data
      if (el.id !== "doador" && el.id !== "data") {
        el.disabled = false;
      }
    });
  } else {
    // Modo "view"
    modalTitle.textContent = "Detalhes do Item " + item.id;
    btnSalvarModal.style.display = "none";
    formEditar.querySelectorAll("input, textarea").forEach((el) => {
      el.disabled = true; // Trava todos os campos
    });
  }

  // Mostra o modal
  modal.classList.add("visivel");
}

/**
 * Fecha o modal.
 */
function fecharModal() {
  modal.classList.remove("visivel");
}

/**
 * Evento de Salvar (Submit) do Modal de Edição.
 */
async function handleSalvarEdicao(event) {
  event.preventDefault(); // Impede o recarregamento da página

  const id = formEditar.dataset.itemId;
  if (!id) {
    alert("Erro: ID do item não encontrado.");
    return;
  }

  // Monta o objeto DTO com os dados do formulário
  const itemData = {
    nome: formEditar.querySelector("#nome").value,
    tamanho: formEditar.querySelector("#tamanho").value,
    categoria: formEditar.querySelector("#categoria").value,
    condicao: formEditar.querySelector("#estado").value,
    descricao: formEditar.querySelector("#descricao").value,
  };

  try {
    console.log("Enviando atualização para API:", id, itemData);
    await apiEditarItem(id, itemData); // Chama a API
    alert("Item atualizado com sucesso!");
    fecharModal();
    dispararBuscaComFiltros(); // Recarrega os itens na grid
  } catch (error) {
    console.error("Erro ao salvar edição:", error);
    alert("Erro ao salvar. Tente novamente.");
  }
}

// --- 4. LÓGICA DE DELEÇÃO ---
/**
 * Pede confirmação e chama a API para deletar um item.
 * @param {String} id - ID do item
 * @param {String} nome - Nome do item (para o alerta)
 */
async function handleDeletarItem(id, nome) {
  if (confirm(`Tem certeza que deseja excluir o item "${nome}"?`)) {
    try {
      await apiDeletarItem(id);
      alert("Item excluído com sucesso!");
      dispararBuscaComFiltros(); // Recarrega os itens na grid
    } catch (error) {
      console.error("Erro ao deletar:", error);
      alert("Erro ao deletar item. (Pode estar reservado - RN002)");
    }
  }
}

// --- 5. LÓGICA DOS FILTROS ---
/**
 * Função central que LÊ OS FILTROS da tela e chama o carregarItens.
 */
function dispararBuscaComFiltros() {
    const filtros = {};

    // 1. Pega o termo da barra de pesquisa (Isso está correto)
    const termo = inputBusca.value.trim();
    if (termo) {
        filtros.termo = termo;
    }

    // --- LÓGICA DE ORDENAÇÃO ATUALIZADA ---
    let sortBy = "dataEntrada"; // Padrão
    let sortDir = "DESC"; // Padrão

    if (checkMaisAntigo.checked) {
        sortBy = "dataEntrada";
        sortDir = "ASC";
    } else if (checkMaisRecente.checked) {
        sortBy = "dataEntrada";
        sortDir = "DESC";
    } else if (checkPiorEstado.checked) {
        sortBy = "condicao"; // NOVO: Ordena pelo campo "condicao"
        sortDir = "ASC";      // (Assumindo que 1 é pior)
    } else if (checkMelhorEstado.checked) {
        sortBy = "condicao"; // NOVO: Ordena pelo campo "condicao"
        sortDir = "DESC";     // (Assumindo que 5 é melhor)
    }

    filtros.sortBy = sortBy;
    filtros.sortDir = sortDir;
    
    // NÃO vamos mais filtrar por condição, apenas ordenar
    // REMOVA as linhas que diziam: filtros.condicao = "5"

    console.log("Disparando busca com filtros:", filtros);
    carregarItens(filtros);
}

// --- 6. INICIALIZAÇÃO E OUVINTES DE EVENTOS (EVENT LISTENERS) ---
document.addEventListener("DOMContentLoaded", () => {
  // Checagem de token desativada para permitir visualização livre na demo.
  const token = localStorage.getItem("token_benevo");
  if (
    !itemGrid ||
    !inputBusca ||
    !checkMaisRecente ||
    !checkMaisAntigo ||
    !modal
  ) {
    console.error(
      "Falha ao inicializar o dashboard: Elementos essenciais do DOM não foram encontrados."
    );
    return;
  }

  // --- Ouvintes dos Filtros ---
  inputBusca.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      dispararBuscaComFiltros();
    }
  });

  // Ouvintes para os checkboxes (para filtros OR)
  checkMaisRecente.addEventListener("change", () => {
    if (checkMaisRecente.checked) checkMaisAntigo.checked = false;
    dispararBuscaComFiltros();
  });
  checkMaisAntigo.addEventListener("change", () => {
    if (checkMaisAntigo.checked) checkMaisRecente.checked = false;
    dispararBuscaComFiltros();
  });
  checkMelhorEstado.addEventListener("change", () => {
    if (checkMelhorEstado.checked) checkPiorEstado.checked = false;
    dispararBuscaComFiltros();
  });
  checkPiorEstado.addEventListener("change", () => {
    if (checkPiorEstado.checked) checkMelhorEstado.checked = false;
    dispararBuscaComFiltros();
  });

  // --- Ouvintes do Modal ---
  btnFecharModal.addEventListener("click", fecharModal);
  formEditar.addEventListener("submit", handleSalvarEdicao);

  // Fecha o modal se clicar fora dele
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      fecharModal();
    }
  });

  // --- Carga Inicial ---
  // Carrega os itens (com os filtros padrão) assim que a página abre
  dispararBuscaComFiltros();
});