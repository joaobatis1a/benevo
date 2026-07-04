// IMPORTANTE: Adicione esta linha no topo do arquivo
import { apiListarPendentes, apiAprovarBeneficiario } from '../services/api.js';

/**
 * Aguarda o carregamento completo do DOM antes de executar as funções principais.
 */
document.addEventListener("DOMContentLoaded", function () {
    console.log("Script admin-aprovacoes.js carregado e pronto."); // DEBUG

    carregarPendentes(); // Chama a função principal ao abrir a página

    const tabela = document.getElementById("tabela-aprovacoes");

    // Evento de clique para o botão "Aprovar"
    if (tabela) {
        tabela.addEventListener("click", async (event) => {
            if (event.target.classList.contains("btn-aprovar")) {
                const id = event.target.dataset.id;
                console.log("Aprovando beneficiário ID:", id); // DEBUG

                try {
                    await apiAprovarBeneficiario(id);
                    alert("Beneficiário aprovado com sucesso!");
                    carregarPendentes(); // Atualiza a tabela após aprovação
                } catch (error) {
                    console.error("Erro ao aprovar beneficiário:", error);
                    alert("Erro ao aprovar beneficiário.");
                }
            }
        });
    } else {
        console.error("ERRO: Tabela #tabela-aprovacoes não encontrada no DOM.");
    }
});

/**
 * Função principal: carrega todos os beneficiários pendentes.
 */
async function carregarPendentes() {
    console.log("Carregando lista de beneficiários pendentes..."); // DEBUG

    try {
        const pendentes = await apiListarPendentes(); // Chama a função do Dhefferson
        console.log("Pendentes recebidos:", pendentes); // DEBUG
        renderizarTabela(pendentes);
    } catch (error) {
        console.error("Erro ao carregar pendentes:", error);
        alert("Erro ao buscar beneficiários pendentes.");
    }
}

/**
 * Renderiza a tabela de beneficiários pendentes no HTML.
 * @param {Array} beneficiarios - Lista de beneficiários pendentes.
 */
function renderizarTabela(beneficiarios) {
    const corpoTabela = document.getElementById("corpo-tabela-aprovacoes");

    if (!corpoTabela) {
        console.error("ERRO: corpo da tabela (#corpo-tabela-aprovacoes) não encontrado.");
        return;
    }

    // Limpa o conteúdo atual da tabela
    corpoTabela.innerHTML = "";

    // Caso não existam pendentes
    if (!beneficiarios || beneficiarios.length === 0) {
        corpoTabela.innerHTML = '<tr><td colspan="3">Nenhum beneficiário pendente encontrado.</td></tr>';
        return;
    }

    // Cria uma linha (<tr>) para cada beneficiário
    beneficiarios.forEach((benef) => {
        const tr = document.createElement("tr");

        const tdNome = document.createElement("td");
        tdNome.textContent = benef.nome || "Sem nome";
        tr.appendChild(tdNome);

        const tdEmail = document.createElement("td");
        tdEmail.textContent = benef.email || "Sem e-mail";
        tr.appendChild(tdEmail);

        const tdAcoes = document.createElement("td");
        const btnAprovar = document.createElement("button");
        btnAprovar.textContent = "Aprovar";
        btnAprovar.className = "btn-aprovar";
        btnAprovar.dataset.id = benef.id; // importante para capturar o ID no evento
        tdAcoes.appendChild(btnAprovar);

        tr.appendChild(tdAcoes);
        corpoTabela.appendChild(tr);
    });
}
