package com.benevo.service;

import com.benevo.dto.ItemResponseDTO;
import com.benevo.dto.ItemCadastroDTO;
import com.benevo.model.Item;
import com.benevo.repository.DoadorRepository;
import com.benevo.repository.ItemRepository;
import com.benevo.model.Doador;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private DoadorRepository doadorRepository;

    // REGISTRAR ITEM
    public Item registrarItem(Item item) {
        validarItem(item);
        item.setStatus("Disponível");
        item.setDataEntrada(LocalDateTime.now());
        return itemRepository.save(item);
    }

    // LISTAR TODOS OS ITENS (Com Filtros Dinâmicos e Ordenação)
    public List<ItemResponseDTO> listarItensComFiltros(String termoBusca, String condicao, String sortBy, String sortDir) {

        final Query query = new Query();
        final List<Criteria> criterios = new ArrayList<>();

        // 1. Filtro por Termo (Nome ou Categoria)
        if (termoBusca != null && !termoBusca.trim().isEmpty()) {
            criterios.add(new Criteria().orOperator(
                    Criteria.where("nome").regex(termoBusca, "i"),
                    Criteria.where("categoria").regex(termoBusca, "i")
            ));
        }

        // 2. Filtro por Condição (Ex: "Novo", "Usado")
        if (condicao != null && !condicao.trim().isEmpty()) {
            criterios.add(Criteria.where("condicao").is(condicao));
        }

        criterios.add(Criteria.where("status").is("Disponível"));

        // Adiciona critérios à query se existirem
        if (!criterios.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criterios.toArray(new Criteria[0])));
        }

        // 3. Ordenação Robusta
        // Default: Data de Entrada (Mais recentes primeiro)
        String campoSort = "dataEntrada";
        Sort.Direction direcao = Sort.Direction.DESC;

        if (sortBy != null && !sortBy.trim().isEmpty()) {
            if ("condicao".equalsIgnoreCase(sortBy)) {
                campoSort = "condicao";
            } else if ("nome".equalsIgnoreCase(sortBy)) {
                campoSort = "nome";
            }
            // Se não for condicao nem nome, mantém dataEntrada
        }

        if (sortDir != null && !sortDir.trim().isEmpty()) {
            direcao = "ASC".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        }

        query.with(Sort.by(direcao, campoSort));

        // 4. Execução
        List<Item> itensDoBanco = mongoTemplate.find(query, Item.class);

        // 5. Enriquecimento (DTO)
        List<ItemResponseDTO> listaDeResposta = new ArrayList<>();

        for (Item item : itensDoBanco) {
            ItemResponseDTO dto = new ItemResponseDTO(item);

            if (item.getDoadorId() != null && !item.getDoadorId().isEmpty()) {
                Optional<Doador> doadorOpt = doadorRepository.findById(item.getDoadorId());
                if (doadorOpt.isPresent()) {
                    dto.setDoadorNome(doadorOpt.get().getNome());
                } else {
                    dto.setDoadorNome("Doador não encontrado");
                }
            } else {
                dto.setDoadorNome("Doação Anônima");
            }
            listaDeResposta.add(dto);
        }

        return listaDeResposta;
    }

    // BUSCAR POR ID
    public Optional<Item> buscarPorId(String id) {
        return itemRepository.findById(id);
    }

    // ATUALIZAR ITEM
    public Item atualizarItem(String id, ItemCadastroDTO dto) {
        Optional<Item> itemOpt = itemRepository.findById(id);

        if (itemOpt.isEmpty()) {
            throw new RuntimeException("Item com ID " + id + " não encontrado.");
        }

        Item item = itemOpt.get();

        item.setNome(dto.getNome());
        item.setCategoria(dto.getCategoria());
        item.setCondicao(dto.getCondicao());
        item.setTamanho(dto.getTamanho());
        item.setDescricao(dto.getDescricao());

        validarItem(item);

        return itemRepository.save(item);
    }

    // DELETAR ITEM (RN002)
    public boolean deletarItem(String id) {
        Optional<Item> itemOpt = itemRepository.findById(id);

        if (itemOpt.isEmpty()) {
            return false;
        }

        Item item = itemOpt.get();

        if ("Reservado".equalsIgnoreCase(item.getStatus())) {
            throw new RuntimeException("Não é possível excluir um item com status 'Reservado'. (RN002)");
        }

        itemRepository.deleteById(id);
        return true;
    }

    // RESERVAR ITEM (Fluxo 3)
    public Item reservarItem(String id) {
        Optional<Item> itemOpt = itemRepository.findById(id);

        if (itemOpt.isEmpty()) {
            throw new RuntimeException("Item com ID " + id + " não encontrado.");
        }

        Item item = itemOpt.get();

        if (!"Disponível".equalsIgnoreCase(item.getStatus())) {
            throw new RuntimeException("Somente itens com status 'Disponível' podem ser reservados. (RN003)");
        }

        item.setStatus("Reservado");
        return itemRepository.save(item);
    }

    // RESGATAR ITEM (Fluxo 4)
    public Item resgatarItem(String itemId, String beneficiarioId) {
        Optional<Item> itemOpt = itemRepository.findById(itemId);

        if (itemOpt.isEmpty()) {
            throw new RuntimeException("Item com ID " + itemId + " não encontrado.");
        }

        Item item = itemOpt.get();

        if (!"Disponível".equalsIgnoreCase(item.getStatus())) {
            throw new RuntimeException("Item indisponível. Status atual: " + item.getStatus());
        }

        item.setStatus("Doado"); // Status final imediato
    
        item.setBeneficiarioResgateId(beneficiarioId);

        return itemRepository.save(item);
    }

    private void validarItem(Item item) {
        if (isNullOrEmpty(item.getNome())) throw new IllegalArgumentException("O nome do item é obrigatório.");
        if (isNullOrEmpty(item.getCategoria())) throw new IllegalArgumentException("A categoria é obrigatória.");
        if (isNullOrEmpty(item.getCondicao())) throw new IllegalArgumentException("A condição é obrigatória.");
        if (isNullOrEmpty(item.getTamanho())) throw new IllegalArgumentException("O tamanho é obrigatório.");
        if (isNullOrEmpty(item.getDescricao())) throw new IllegalArgumentException("A descrição é obrigatória.");
    }

    private boolean isNullOrEmpty(String valor) {
        return valor == null || valor.trim().isEmpty();
    }
}