package com.biterush.foodiesapi.service;

import com.biterush.foodiesapi.entity.FoodEntity;
import com.biterush.foodiesapi.entity.OrderEntity;
import com.biterush.foodiesapi.io.OrderItem;
import com.biterush.foodiesapi.io.OrderRequest;
import com.biterush.foodiesapi.io.OrderResponse;
import com.biterush.foodiesapi.repository.CartRespository;
import com.biterush.foodiesapi.repository.FoodRepository;
import com.biterush.foodiesapi.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceImplTest {

    @Mock private OrderRepository orderRepository;
    @Mock private UserService userService;
    @Mock private CartRespository cartRespository;
    @Mock private FoodRepository foodRepository;

    @InjectMocks
    private OrderServiceImpl orderService;

    private static final String TEST_USER_ID = "user123";
    private static final String RAZORPAY_SECRET = "test_secret_key";

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(orderService, "RAZORPAY_SECRET", RAZORPAY_SECRET);
        ReflectionTestUtils.setField(orderService, "RAZORPAY_KEY", "rzp_test_dummy");
    }

    @Test
    void verifyPayment_invalidSignature_throwsBadRequest() {
        Map<String, String> paymentData = Map.of(
                "razorpay_order_id", "order_123",
                "razorpay_payment_id", "pay_456",
                "razorpay_signature", "wrong_signature"
        );

        assertThatThrownBy(() -> orderService.verifyPayment(paymentData, "Paid"))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Invalid payment signature");
    }

    @Test
    void verifyPayment_validSignature_marksOrderAsPaid() {
        String orderId = "order_abc";
        String paymentId = "pay_xyz";
        String signature = computeHmac(orderId + "|" + paymentId, RAZORPAY_SECRET);

        OrderEntity order = OrderEntity.builder()
                .id("db_order_1")
                .userId(TEST_USER_ID)
                .orderedItems(List.of())
                .build();

        when(orderRepository.findByRazorpayOrderId(orderId)).thenReturn(Optional.of(order));
        when(userService.findByUserId()).thenReturn(TEST_USER_ID);
        when(orderRepository.save(any())).thenReturn(order);

        orderService.verifyPayment(
                Map.of("razorpay_order_id", orderId, "razorpay_payment_id", paymentId, "razorpay_signature", signature),
                "Paid"
        );

        verify(cartRespository).deleteByUserId(TEST_USER_ID);
        assertThat(order.getPaymentStatus()).isEqualTo("Paid");
        assertThat(order.getRazorpayPaymentId()).isEqualTo(paymentId);
    }

    @Test
    void verifyPayment_wrongOwner_throwsForbidden() {
        String orderId = "order_abc";
        String paymentId = "pay_xyz";
        String signature = computeHmac(orderId + "|" + paymentId, RAZORPAY_SECRET);

        OrderEntity order = OrderEntity.builder()
                .userId("other_user")
                .build();

        when(orderRepository.findByRazorpayOrderId(orderId)).thenReturn(Optional.of(order));
        when(userService.findByUserId()).thenReturn(TEST_USER_ID);

        assertThatThrownBy(() -> orderService.verifyPayment(
                Map.of("razorpay_order_id", orderId, "razorpay_payment_id", paymentId, "razorpay_signature", signature),
                "Paid"
        ))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Access denied");
    }

    @Test
    void getUserOrders_returnsOnlyCurrentUserOrders() {
        OrderEntity o1 = OrderEntity.builder().id("o1").userId(TEST_USER_ID).orderedItems(List.of()).build();
        OrderEntity o2 = OrderEntity.builder().id("o2").userId(TEST_USER_ID).orderedItems(List.of()).build();

        when(userService.findByUserId()).thenReturn(TEST_USER_ID);
        when(orderRepository.findByUserId(TEST_USER_ID)).thenReturn(List.of(o1, o2));

        List<OrderResponse> result = orderService.getUserOrders();

        assertThat(result).hasSize(2);
        verify(orderRepository).findByUserId(TEST_USER_ID);
        verify(orderRepository, never()).findAll();
    }

    @Test
    void removeOrder_wrongOwner_throwsForbidden() {
        OrderEntity order = OrderEntity.builder().id("order1").userId("other_user").build();

        when(orderRepository.findById("order1")).thenReturn(Optional.of(order));
        when(userService.findByUserId()).thenReturn(TEST_USER_ID);

        assertThatThrownBy(() -> orderService.removeOrder("order1"))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Access denied");

        verify(orderRepository, never()).deleteById(any());
    }

    @Test
    void updateOrderStatus_setsStatusCorrectly() {
        OrderEntity order = OrderEntity.builder().id("order1").orderStatus("Pending").build();

        when(orderRepository.findById("order1")).thenReturn(Optional.of(order));
        when(orderRepository.save(any())).thenReturn(order);

        orderService.updateOrderStatus("order1", "Delivered");

        assertThat(order.getOrderStatus()).isEqualTo("Delivered");
        verify(orderRepository).save(order);
    }

    private String computeHmac(String data, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
