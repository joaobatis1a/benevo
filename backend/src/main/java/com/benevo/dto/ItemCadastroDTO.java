package com.benevo.dto;

/**
 * DTO usado para receber os dados do item vindos do frontend
 * durante o processo de cadastro.
 */
public class ItemCadastroDTO {

    private String nome;
    private String tamanho;
    private String categoria;
    private String condicao;
    private String descricao;
    private String doadorId;

    public ItemCadastroDTO() {}

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getTamanho() { return tamanho; }
    public void setTamanho(String tamanho) { this.tamanho = tamanho; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getCondicao() { return condicao; }
    public void setCondicao(String condicao) { this.condicao = condicao; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getDoadorId() { return doadorId; }
    public void setDoadorId(String doadorId) { this.doadorId = doadorId; }
}