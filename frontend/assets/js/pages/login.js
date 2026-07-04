// IMPORTANTE: Adicione esta linha no topo do arquivo.
import { fazerLogin } from '../services/api.js';

document.addEventListener("DOMContentLoaded", function () {
    
    const formLogin = document.getElementById('form-login');

    if (formLogin) {
        formLogin.addEventListener('submit', function (event) {
            event.preventDefault();

            const login = document.getElementById('login').value;
            const senha = document.getElementById('senha').value;

            if (!login || !senha) {
                alert('Login e senha são obrigatórios.');
                return;
            }

            fazerLogin(login, senha)
                .then(data => {
                    // 'data' AGORA É O NOSSO LoginResponseDTO:
                    // { token: "...", tipo: "ADMIN", nome: "admin" }
                    
                    alert('Login bem-sucedido! Bem-vindo, ' + data.nome);
                    console.log('Resposta do login:', data);

                    // SALVA TUDO NO LOCAL STORAGE
                    localStorage.setItem('token_benevo', data.token);
                    localStorage.setItem('user_tipo', data.tipo); // ESSENCIAL
                    localStorage.setItem('user_nome', data.nome);   // BÔNUS
                    localStorage.setItem('user_id', data.id);

                    // Redireciona com base no TIPO
                    if (data.tipo === 'ADMIN') {
                        window.location.href = 'central.html';
                    } else if (data.tipo === 'DOADOR') {
                        // Se um doador logar por aqui (talvez não deva)
                        window.location.href = 'cadastro-item.html'; 
                    } else {
                        // Outros tipos, se houver
                        window.location.href = 'login-admin.html';
                    }
                })
                .catch(error => {
                    console.error('Erro no login:', error);
                    alert('Login ou senha inválidos.');
                });
        });
    }
});
