package com.biterush.foodiesapi.controller;

import com.razorpay.RazorpayException;
import com.biterush.foodiesapi.io.OrderRequest;
import com.biterush.foodiesapi.io.OrderResponse;
import com.biterush.foodiesapi.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@AllArgsConstructor
@Tag(name = "Orders", description = "Place orders, verify payment, and manage order history")
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create order + Razorpay payment intent",
               description = "Creates an order and returns a Razorpay order ID for client-side checkout.")
    public OrderResponse createOrderWithPayment(@Valid @RequestBody OrderRequest request) throws RazorpayException {
        return orderService.createOrderWithPayment(request);
    }

    @PostMapping("/verify")
    @Operation(summary = "Verify Razorpay payment",
               description = "Validates the HMAC-SHA256 signature from Razorpay and marks the order as Paid.")
    public void verifyPayment(@RequestBody Map<String, String> paymentData) {
        orderService.verifyPayment(paymentData, "Paid");
    }

    @GetMapping
    @Operation(summary = "Get current user's orders")
    public List<OrderResponse> getOrders() {
        return orderService.getUserOrders();
    }

    @DeleteMapping("/{orderId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Cancel / delete an order")
    public void deleteOrder(@PathVariable String orderId) {
        orderService.removeOrder(orderId);
    }

    @GetMapping("/all")
    @Operation(summary = "Get all orders (Admin only)",
               description = "Returns orders for every user. Requires ADMIN role.")
    public List<OrderResponse> getOrdersOfAllUsers() {
        return orderService.getOrdersOfAllUsers();
    }

    @PatchMapping("/status/{orderId}")
    @Operation(summary = "Update order status (Admin only)",
               description = "Sets order status to one of: Pending, Preparing, Out for Delivery, Delivered, Cancelled.")
    public void updateOrderStatus(@PathVariable String orderId, @RequestParam String status) {
        orderService.updateOrderStatus(orderId, status);
    }
}
