package com.benevo.repository;

import com.benevo.model.Doador;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DoadorRepository extends MongoRepository<Doador, String> {
    Optional<Doador> findByEmail(String email);
}