package com.benevo.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.benevo.model.Usuario;
import java.util.Optional;

public interface UsuarioRepository extends MongoRepository<Usuario, String> {
    Optional<Usuario> findByLogin(String login);
}

