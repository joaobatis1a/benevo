package com.benevo.controller;

import com.benevo.model.Doador;
import com.benevo.service.DoadorService;
import com.benevo.dto.LoginResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/doadores")
@CrossOrigin("*")
public class DoadorController {

    @Autowired
    private DoadorService doadorService;

    @PostMapping("/registrar")
    public ResponseEntity<?> registrarDoador(@RequestBody Doador doador) {
        try {
            Doador novoDoador = doadorService.registrarDoador(doador);
            return ResponseEntity.ok(novoDoador); 
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginDoador(@RequestBody Doador loginRequest) {
        Optional<Doador> doadorOpt = doadorService.autenticarDoador(
            loginRequest.getEmail(), 
            loginRequest.getSenha()
        );

        if (doadorOpt.isPresent()) {
            Doador doador = doadorOpt.get();
            // CORREÇÃO: Adicionado null no final (Doador não tem ID curto)
            LoginResponseDTO resposta = new LoginResponseDTO(
                doador.getId(),
                "token_doador_mock_" + doador.getId(),
                "DOADOR",
                doador.getNome(),
                null 
            );
            return ResponseEntity.ok(resposta);
        } else {
            return ResponseEntity.status(401).body("Email ou senha inválidos.");
        }
    }
}