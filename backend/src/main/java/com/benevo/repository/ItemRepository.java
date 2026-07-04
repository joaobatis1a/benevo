package com.benevo.repository;

import com.benevo.model.Item;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemRepository extends MongoRepository<Item, String> {
    // Consultas complexas são tratadas via MongoTemplate no Service
}