package com.biterush.foodiesapi.controller;

import com.biterush.foodiesapi.io.CartRequest;
import com.biterush.foodiesapi.io.CartResponse;
import com.biterush.foodiesapi.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/cart")
@AllArgsConstructor
@Tag(name = "Cart", description = "Shopping cart operations")
public class CartController {

    private final CartService cartService;

    @PostMapping
    @Operation(summary = "Add item to cart")
    public CartResponse addToCart(@RequestBody CartRequest request) {
        if (request.getFoodId() == null || request.getFoodId().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "foodId not found");
        }
        return cartService.addToCart(request);
    }

    @GetMapping
    @Operation(summary = "Get current user's cart")
    public CartResponse getCart() {
        return cartService.getCart();
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Clear the cart")
    public void clearCart() {
        cartService.clearCart();
    }

    @PostMapping("/remove")
    @Operation(summary = "Remove one unit of an item from cart")
    public CartResponse removeFromCart(@RequestBody CartRequest request) {
        if (request.getFoodId() == null || request.getFoodId().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "foodId not found");
        }
        return cartService.removeFromCart(request);
    }
}
