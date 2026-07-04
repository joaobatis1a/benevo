package com.benevo.dto;

public class LoginResponseDTO {
    
    private String id;      // ID do Banco (Técnico)
    private String token;
    private String tipo;
    private String nome;
    private String idBenevo; // NOVO: ID Amigável (Ex: ANA-123)

    public LoginResponseDTO(String id, String token, String tipo, String nome, String idBenevo) {
        this.id = id;
        this.token = token;
        this.tipo = tipo;
        this.nome = nome;
        this.idBenevo = idBenevo;
    }

    public String getId() { return id; }
    public String getToken() { return token; }
    public String getTipo() { return tipo; }
    public String getNome() { return nome; }
    public String getIdBenevo() { return idBenevo; }
}