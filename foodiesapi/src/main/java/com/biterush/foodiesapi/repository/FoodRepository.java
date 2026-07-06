package com.biterush.foodiesapi.repository;

import com.biterush.foodiesapi.entity.FoodEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FoodRepository extends MongoRepository<FoodEntity, String> {

    Page<FoodEntity> findByCategoryIgnoreCase(String category, Pageable pageable);
}
