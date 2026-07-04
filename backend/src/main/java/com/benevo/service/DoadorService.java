package com.benevo.service;

import com.benevo.model.Doador;
import com.benevo.repository.DoadorRepository;
import com.benevo.util.ValidarCPF;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DoadorService {

    @Autowired
    private DoadorRepository doadorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Doador registrarDoador(Doador doador) {
    if (doador.getEmail() == null || doador.getEmail().isEmpty()) {
        throw new IllegalArgumentException("O e-mail é obrigatório.");
    }

    if (doador.getCpfCnpj() == null || !ValidarCPF.isCPF(doador.getCpfCnpj())) {
        throw new IllegalArgumentException("O CPF é inválido ou está formatado incorretamente.");
    }

    if (doadorRepository.findByEmail(doador.getEmail()).isPresent()) {
        throw new IllegalArgumentException("Já existe um doador com este e-mail.");
    }

    String senhaCriptografada = passwordEncoder.encode(doador.getSenha());
    doador.setSenha(senhaCriptografada);

    return doadorRepository.save(doador);
}

    // Autenticar doador
    public Optional<Doador> autenticarDoador(String email, String senhaPlana) {
        Optional<Doador> doadorOpt = doadorRepository.findByEmail(email);

        if (doadorOpt.isPresent()) {
            Doador doador = doadorOpt.get();
            if (passwordEncoder.matches(senhaPlana, doador.getSenha())) {
                return doadorOpt;
            }
        }

        return Optional.empty();
    }
}
