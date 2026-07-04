package com.benevo.dto;

import com.benevo.model.Item;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class ItemResponseDTO {

    private String id;
    private String nome;
    private String categoria;
    private String condicao;
    private String tamanho;
    private String descricao;
    private String status;
    private LocalDateTime dataEntrada;
    private String doadorId;
    private String doadorNome;

    public ItemResponseDTO(Item item) {
        this.id = item.getId();
        this.nome = item.getNome();
        this.categoria = item.getCategoria();
        this.condicao = item.getCondicao();
        this.tamanho = item.getTamanho();
        this.descricao = item.getDescricao();
        this.status = item.getStatus();
        this.dataEntrada = item.getDataEntrada();
        this.doadorId = item.getDoadorId();
    }
}