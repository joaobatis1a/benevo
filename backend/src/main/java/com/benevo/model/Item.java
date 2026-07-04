package com.benevo.model;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
import java.time.LocalDateTime;

@Document(collection = "itens")
public class Item {

    @Id
    private String id;
    private String nome;
    private String categoria;
    private String condicao;
    private String tamanho;
    private String descricao;
    private String status;
    private LocalDateTime dataEntrada;
    private String doadorId;

    // Novo campo para saber quem resgatou o item
    private String beneficiarioResgateId;

    public Item() {
    }

    public Item(String id, String nome, String categoria, String condicao, String tamanho, String descricao) {
        this.id = id;
        this.nome = nome;
        this.categoria = categoria;
        this.condicao = condicao;
        this.tamanho = tamanho;
        this.descricao = descricao;
    }

    // Getters e Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getCondicao() { return condicao; }
    public void setCondicao(String condicao) { this.condicao = condicao; }

    public String getTamanho() { return tamanho; }
    public void setTamanho(String tamanho) { this.tamanho = tamanho; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getDataEntrada() { return dataEntrada; }
    public void setDataEntrada(LocalDateTime dataEntrada) { this.dataEntrada = dataEntrada; }

    public String getDoadorId() { return doadorId; }
    public void setDoadorId(String doadorId) { this.doadorId = doadorId; }

    public String getBeneficiarioResgateId() { return beneficiarioResgateId; }
    public void setBeneficiarioResgateId(String beneficiarioResgateId) { this.beneficiarioResgateId = beneficiarioResgateId; }

    @Override
    public String toString() {
        return "Item{" +
                "id='" + id + '\'' +
                ", nome='" + nome + '\'' +
                ", categoria='" + categoria + '\'' +
                ", condicao='" + condicao + '\'' +
                ", tamanho='" + tamanho + '\'' +
                ", descricao='" + descricao + '\'' +
                ", status='" + status + '\'' +
                ", dataEntrada=" + dataEntrada +
                ", doadorId='" + doadorId + '\'' +
                ", beneficiarioResgateId='" + beneficiarioResgateId + '\'' +
                '}';
    }
}