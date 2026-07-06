package com.biterush.foodiesapi.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.biterush.foodiesapi.io.FoodRequest;
import com.biterush.foodiesapi.io.FoodResponse;
import com.biterush.foodiesapi.service.FoodService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/foods")
@AllArgsConstructor
@Tag(name = "Food", description = "Browse and manage food items")
public class FoodController {

    private final FoodService foodService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Add a food item (Admin only)",
               description = "Uploads an image to S3 and saves the food item. Requires ADMIN role.")
    public FoodResponse addFood(
            @RequestPart("food") String foodString,
            @RequestPart("file") MultipartFile file) {
        ObjectMapper objectMapper = new ObjectMapper();
        FoodRequest request;
        try {
            request = objectMapper.readValue(foodString, FoodRequest.class);
        } catch (JsonProcessingException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid JSON format");
        }
        return foodService.addFood(request, file);
    }

    @GetMapping
    @Operation(summary = "List food items (paginated)",
               description = "Returns a paginated list of food items. Filter by category using the `category` param.")
    public Page<FoodResponse> readFoods(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Items per page")        @RequestParam(defaultValue = "12") int size,
            @Parameter(description = "Filter by category")   @RequestParam(required = false) String category) {
        return foodService.readFoods(page, size, category);
    }

    @GetMapping("/all")
    @Operation(summary = "Get all food items (no pagination)",
               description = "Returns the complete food list — used by the storefront context loader.")
    public List<FoodResponse> readAllFoods() {
        return foodService.readAllFoods();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single food item by ID")
    public FoodResponse readFood(@PathVariable String id) {
        return foodService.readFood(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a food item (Admin only)",
               description = "Deletes the food item and its S3 image. Requires ADMIN role.")
    public void deleteFood(@PathVariable String id) {
        foodService.deleteFood(id);
    }
}
