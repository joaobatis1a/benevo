import { apiLoginDoador } from '../services/api.js';

document.addEventListener("DOMContentLoaded", function () {
    const formLogin = document.getElementById('form-login-doador');

    // Botão Voltar do navegador deve voltar pro Menu Doador, não Index
    // (Pode adicionar um botão voltar no HTML também se quiser)

    if (formLogin) {
        formLogin.addEventListener('submit', function (event) {
            event.preventDefault();

            const email = document.getElementById('login-doador').value;
            const senha = document.getElementById('senha-doador').value;

            if (!email || !senha) return alert('Preencha tudo.');

            apiLoginDoador(email, senha)
                .then(data => {
                    // MUDANÇA CRUCIAL:
                    // Não tocamos no token_benevo (Admin).
                    // Salvamos o doador temporariamente na sessão.
                    sessionStorage.setItem('temp_doador_id', data.id);
                    sessionStorage.setItem('temp_doador_nome', data.nome);

                    // Redireciona para o fluxo de doação
                    window.location.href = 'cadastro-item.html'; 
                })
                .catch(error => {
                    console.error(error);
                    alert('Doador não encontrado ou senha incorreta.');
                });
        });
    }
});