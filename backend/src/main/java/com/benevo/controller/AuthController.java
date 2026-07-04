package com.benevo.controller;

import com.benevo.dto.LoginRequestDTO;
import com.benevo.dto.LoginResponseDTO;
import com.benevo.model.Usuario;
import com.benevo.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<?> fazerLogin(@RequestBody LoginRequestDTO loginDTO) {
        
        System.out.println("Tentativa de login admin para: " + loginDTO.getLogin());

        Optional<Usuario> usuarioOpt = usuarioService.autenticar(loginDTO.getLogin(), loginDTO.getSenha());

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            // CORREÇÃO: Adicionado null no final
            LoginResponseDTO resposta = new LoginResponseDTO(
                usuario.getId(),
                "token_admin_mock_" + usuario.getId(),
                usuario.getRole(),
                usuario.getLogin(),
                null
            );
            return ResponseEntity.ok(resposta);
        } else {
            return ResponseEntity.status(401).body("Login e/ou senha inválidos");
        }
    }
}