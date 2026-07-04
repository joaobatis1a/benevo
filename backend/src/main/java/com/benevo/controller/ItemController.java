package com.benevo.controller;

import com.benevo.dto.ItemResponseDTO;
import com.benevo.dto.ItemCadastroDTO;
import com.benevo.model.Item;
import com.benevo.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/item")
@CrossOrigin("*")
public class ItemController {

    @Autowired
    private ItemService itemService;

    // CADASTRAR ITEM
    @PostMapping("/cadastrar")
    public ResponseEntity<?> cadastrarItem(@RequestBody ItemCadastroDTO dto) {
        System.out.println("Tentativa de cadastro do item: " + dto.getNome());

        try {
            Item item = new Item(
                    null,
                    dto.getNome(),
                    dto.getCategoria(),
                    dto.getCondicao(),
                    dto.getTamanho(),
                    dto.getDescricao()
            );

            System.out.println(">>> PROVA DE FOGO: DTO recebido com Doador ID: " + dto.getDoadorId());

            item.setDoadorId(dto.getDoadorId());

            Item itemSalvo = itemService.registrarItem(item);
            return ResponseEntity.ok(itemSalvo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Erro inesperado ao cadastrar o item.");
        }
    }

    // LISTAR TODOS OS ITENS
    @GetMapping("/buscar")
    public ResponseEntity<List<ItemResponseDTO>> buscarItensComFiltros(
        @RequestParam(required = false) String termo, 
        @RequestParam(required = false) String condicao, // (Ainda podemos usá-lo para filtros futuros)
        
        // Novos parâmetros para ordenação
        @RequestParam(required = false, defaultValue = "dataEntrada") String sortBy, 
        @RequestParam(required = false, defaultValue = "DESC") String sortDir 
    ) {
        // Passe os novos parâmetros para o service
        List<ItemResponseDTO> itens = itemService.listarItensComFiltros(termo, condicao, sortBy, sortDir);
        return ResponseEntity.ok(itens);
    }

    // BUSCAR ITEM POR ID
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable String id) {
        Optional<Item> itemOpt = itemService.buscarPorId(id);

        if (itemOpt.isPresent()) {
            return ResponseEntity.ok(itemOpt.get());
        } else {
            return ResponseEntity.status(404).body("Item não encontrado.");
        }
    }

    // ATUALIZAR ITEM
    @PutMapping("/atualizar/{id}")
    public ResponseEntity<?> atualizarItem(@PathVariable String id, @RequestBody ItemCadastroDTO dto) {
        try {
            Item atualizado = itemService.atualizarItem(id, dto);
            return ResponseEntity.ok(atualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    //  DELETAR ITEM
    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<String> deletarItem(@PathVariable String id) {
        boolean removido = itemService.deletarItem(id);

        if (removido) {
            return ResponseEntity.ok("Item removido com sucesso!");
        } else {
            return ResponseEntity.status(404).body("Item não encontrado.");
        }
    }
    
    // RESGATAR ITEM
        @PutMapping("/resgatar/{itemId}")
    public ResponseEntity<?> resgatarItem(
        @PathVariable String itemId,
        @RequestParam String beneficiarioId) {
    try {
        
        Item item = itemService.resgatarItem(itemId, beneficiarioId);
            return ResponseEntity.ok(item);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
        e.printStackTrace();
            return ResponseEntity.internalServerError().body("Erro inesperado ao resgatar o item.");
        }
    }
}

    


