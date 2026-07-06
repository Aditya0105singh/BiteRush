package com.biterush.foodiesapi.controller;

import com.biterush.foodiesapi.io.UserRequest;
import com.biterush.foodiesapi.io.UserResponse;
import com.biterush.foodiesapi.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
@Tag(name = "Auth", description = "Register and login endpoints")
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Register", description = "Creates a new customer account. Role defaults to USER.")
    public UserResponse register(@Valid @RequestBody UserRequest request) {
        return userService.registerUser(request);
    }
}
