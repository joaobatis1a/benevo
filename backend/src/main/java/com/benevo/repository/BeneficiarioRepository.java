package com.benevo.repository;

import com.benevo.model.Beneficiario;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface BeneficiarioRepository extends MongoRepository<Beneficiario, String> {
    Optional<Beneficiario> findByIdBenevo(String idBenevo);
    
    // CORREÇÃO: Alterado de 'Endereco' para 'BairroCidade' para bater com o Model
    List<Beneficiario> findByNomeContainingIgnoreCaseOrBairroCidadeContainingIgnoreCase(String nome, String bairroCidade);
}