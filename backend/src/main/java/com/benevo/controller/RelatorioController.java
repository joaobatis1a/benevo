package com.benevo.controller;

import com.benevo.model.Beneficiario;
import com.benevo.model.Doador;
import com.benevo.model.Item;
import com.benevo.service.RelatorioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*; // Importa o CrossOrigin

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin("*") // <--- AQUI ESTÁ A CORREÇÃO (Permite acesso de qualquer lugar)
public class RelatorioController {

    @Autowired
    private RelatorioService relatorioService;

    @GetMapping("/ultimos-doadores")
    public List<Doador> getUltimosDoadores() {
        return relatorioService.getUltimosDoadores();
    }

    @GetMapping("/ultimos-beneficiarios")
    public List<Beneficiario> getUltimosBeneficiarios() {
        return relatorioService.getUltimosBeneficiarios();
    }

    @GetMapping("/ultimas-doacoes")
    public List<Item> getUltimasDoacoes() {
        return relatorioService.getUltimasDoacoes();
    }
}