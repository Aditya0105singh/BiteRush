package com.biterush.foodiesapi.io;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class OrderRequest {

    @NotEmpty(message = "Order must contain at least one item")
    private List<OrderItem> orderedItems;

    @NotBlank(message = "Delivery address is required")
    private String userAddress;

    private double amount;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    private String orderStatus;
}
