package com.benevo.dto;

// dto = data transfer object (objeto de transferencia de dados)
// isso vai ficar tipo um molde do que dheff vai te enviar. pro login so precisa ter 2 campos.
// (geralmente nao se usa a classe "Usuario" inteira para isso pra segurança)

public class LoginRequestDTO {

    private String login;
    private String senha;

    // criar os getters e setters pra o spring ler os dados do JSON que dheff vai enviar
    public String getLogin() { // get login = pegar login, retorna com o email por enquanto
        return login;
    }
    public void setLogin(String login) { // set login = definir login, armazena o login
        this.login = login;
    }
    public String getSenha() { //get senha, mesma logica
        return senha;
    }
    public void setSenha(String senha) { // set senha, mesma logica
        this.senha = senha;
    }
}
