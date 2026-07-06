package com.biterush.foodiesapi.service;

import com.biterush.foodiesapi.io.FoodRequest;
import com.biterush.foodiesapi.io.FoodResponse;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FoodService {

    String uploadFile(MultipartFile file);

    FoodResponse addFood(FoodRequest request, MultipartFile file);

    Page<FoodResponse> readFoods(int page, int size, String category);

    List<FoodResponse> readAllFoods();

    FoodResponse readFood(String id);

    boolean deleteFile(String filename);

    void deleteFood(String id);
}
