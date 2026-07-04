package com.benevo.service;

import com.benevo.model.Usuario; // o molde de usuario q peu fez
import com.benevo.repository.UsuarioRepository; // o acesso pro banco q peu criou
import org.springframework.beans.factory.annotation.Autowired; // o spring pra conectar
import org.springframework.stereotype.Service; // a etiqueta de servico

import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Optional<Usuario> autenticar(String login, String senhaPlana) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByLogin(login);

        if (usuarioOpt.isPresent()) {
            Usuario usuarioDoBanco = usuarioOpt.get();
            if (passwordEncoder.matches(senhaPlana, usuarioDoBanco.getSenha())) {
                return usuarioOpt;
            }
        }
        return Optional.empty();
    }
}