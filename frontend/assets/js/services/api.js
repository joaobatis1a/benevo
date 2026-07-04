// benevo-project/frontend/assets/js/services/api.js

// URL base da API      
export const API_BASE_URL = "http://localhost:8080";

// ============================================
// FUNÇÕES DE AUTENTICAÇÃO (token e headers)
// ============================================

function getAuthToken() {
  return localStorage.getItem("token_benevo");
}

function getAuthHeaders() {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token
  };
}

// =====================================
// LOGIN GERAL (ADMIN)
// =====================================
export async function fazerLogin(login, senha) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, senha }),
    });

    if (!response.ok) {
      throw new Error("Erro ao fazer login");
    }

    const data = await response.json();
    // Nota: O controller retorna { id, token, tipo, nome }
    return data;
  } catch (error) {
    console.error("Erro no login:", error);
    throw error;
  }
}

// =====================================
// CADASTRAR ITEM (DOADOR)
// =====================================
export async function cadastrarItem(itemData) {
  try {
    const response = await fetch(`${API_BASE_URL}/item/cadastrar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(itemData),
    });

    if (!response.ok) {
      const erro = await response.text(); 
      throw new Error(erro);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao cadastrar item:", error);
    throw error;
  }
}

// ================================
// BUSCAR ITENS (GET)
// ================================
export async function apiBuscarItens(filtros) {
    const params = new URLSearchParams();
    
    if (filtros.termo) params.append('termo', filtros.termo);
    if (filtros.condicao) params.append('condicao', filtros.condicao);
    if (filtros.sortBy) params.append('sortBy', filtros.sortBy);
    if (filtros.sortDir) params.append('sortDir', filtros.sortDir);

    // Nota: Busca geralmente é pública, mas se precisar de auth, descomente o header
    const response = await fetch(`${API_BASE_URL}/item/buscar?${params.toString()}`, {
        method: "GET",
        // headers: getAuthHeaders() 
    });

    if (!response.ok) throw new Error("Erro ao buscar itens");
    return response.json();
}

// ================================
// GESTÃO DE ITENS (ADMIN/DOADOR)
// ================================

export async function apiDeletarItem(id) {
  const response = await fetch(`${API_BASE_URL}/item/deletar/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw new Error("Erro ao deletar item");
}

export async function apiEditarItem(id, itemData) {
  const response = await fetch(`${API_BASE_URL}/item/atualizar/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(itemData),
  });

  if (!response.ok) throw new Error("Erro ao editar item");
  return await response.json();
}

// ================================
//  RESGATAR ITEM (BENEFICIÁRIO)
// ================================
// Esta é a versão correta que recebe DOIS parâmetros
export async function apiReservarItem(itemId, beneficiarioId) {
  const response = await fetch(`${API_BASE_URL}/item/resgatar/${itemId}?beneficiarioId=${beneficiarioId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
      const erro = await response.text();
      throw new Error(erro || "Erro ao resgatar item");
  }
  return await response.json();
}

// ================================
// BENEFICIÁRIO (CADASTRO E LOGIN)
// ================================

export async function apiRegistrarBeneficiario(benefData) {
  // Cadastro é público, sem Auth header
  const response = await fetch(`${API_BASE_URL}/beneficiarios/registrar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(benefData),
  });

  if (!response.ok) {
     const erro = await response.text();
     throw new Error(erro || "Erro ao registrar beneficiário");
  }
  return await response.json();
}

export async function apiRecuperarId(dados) {
  const response = await fetch(`${API_BASE_URL}/beneficiarios/recuperar-id`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }, // Recuperação pública
    body: JSON.stringify(dados),
  });

  if (!response.ok) throw new Error("Erro ao recuperar ID");
  return await response.json();
}

export async function apiAjudarLogin(termoBusca) {
  const response = await fetch(`${API_BASE_URL}/beneficiarios/ajuda-login?busca=${termoBusca}`, {
      method: "GET",
      // Ajuda login é pública
  });
  if (!response.ok) throw new Error("Erro ao buscar ajuda de login");
  return await response.json();
}

export async function apiListarPendentes() {
  const response = await fetch(`${API_BASE_URL}/beneficiarios/pendentes`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Erro ao listar pendentes");
  return await response.json();
}

export async function apiAprovarBeneficiario(id) {
  const response = await fetch(`${API_BASE_URL}/beneficiarios/aprovar/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
    }
  );
  if (!response.ok) throw new Error("Erro ao aprovar beneficiário");
  return await response.json();
}

// ================================
// DOADOR (CADASTRO E LOGIN)
// ================================

export async function apiRegistrarDoador(doadorData) {
  const response = await fetch(`${API_BASE_URL}/doadores/registrar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(doadorData),
  });
  if (!response.ok) throw new Error("Erro ao registrar doador");
  return await response.json();
}

export async function apiLoginDoador(email, senha) {
  const response = await fetch(`${API_BASE_URL}/doadores/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  if (!response.ok) throw new Error("Erro no login do doador");
  return await response.json();
}