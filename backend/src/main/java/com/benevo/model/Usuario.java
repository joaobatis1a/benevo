package com.benevo.model;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

@Document(collection = "usuario")
public class Usuario {

    @Id
    private String id;
    private String login;
    private String senha;
    private String role;

    public Usuario() {
    }

    public Usuario(String id, String login, String senha, String role){
        this.id = id;
        this.login = login;
        this.senha = senha;
        this.role = role;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }

}
