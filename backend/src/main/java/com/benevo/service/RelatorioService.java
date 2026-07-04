package com.benevo.service;

import com.benevo.model.Beneficiario;
import com.benevo.model.Doador;
import com.benevo.model.Item;
import com.benevo.repository.BeneficiarioRepository;
import com.benevo.repository.DoadorRepository;
import com.benevo.repository.ItemRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.util.List;

@Service
public class RelatorioService {

    @Autowired
    private DoadorRepository doadorRepository;

    @Autowired
    private BeneficiarioRepository beneficiarioRepository;

    @Autowired
    private ItemRepository itemRepository;

    public List<Doador> getUltimosDoadores() {
        return doadorRepository.findAll(
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "_id"))
        ).getContent();
    }

    public List<Beneficiario> getUltimosBeneficiarios() {
        return beneficiarioRepository.findAll(
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "_id"))
        ).getContent();
    }

    public List<Item> getUltimasDoacoes() {
        return itemRepository.findAll(
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "dataEntrada"))
        ).getContent();
    }
}
