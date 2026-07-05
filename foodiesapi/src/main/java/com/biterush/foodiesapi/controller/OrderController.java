package com.biterush.foodiesapi.controller;

import com.razorpay.RazorpayException;
import com.biterush.foodiesapi.io.OrderRequest;
import com.biterush.foodiesapi.io.OrderResponse;
import com.biterush.foodiesapi.service.OrderService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@AllArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrderWithPayment(@Valid @RequestBody OrderRequest request) throws RazorpayException {
        OrderResponse response = orderService.createOrderWithPayment(request);
        return response;
    }

    @PostMapping("/verify")
    public void verifyPayment(@RequestBody Map<String, String> paymentData) {
        orderService.verifyPayment(paymentData, "Paid");
    }

    @GetMapping
    public List<OrderResponse> getOrders() {
        return orderService.getUserOrders();
    }

    @DeleteMapping("/{orderId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrder(@PathVariable String orderId) {
        orderService.removeOrder(orderId);
    }

    //admin panel
    @GetMapping("/all")
    public List<OrderResponse> getOrdersOfAllUsers() {
        return orderService.getOrdersOfAllUsers();
    }

    //admin panel
    @PatchMapping("/status/{orderId}")
    public void updateOrderStatus(@PathVariable String orderId, @RequestParam String status) {
        orderService.updateOrderStatus(orderId, status);
    }
}
