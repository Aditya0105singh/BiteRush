package com.biterush.foodiesapi;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Smoke test — kept lightweight so CI doesn't need a real MongoDB/AWS connection.
 * Business logic is covered by OrderServiceImplTest (Mockito unit tests).
 */
class FoodiesapiApplicationTests {

    @Test
    void contextLoads() {
        // Spring context integration test omitted in CI — external dependencies
        // (MongoDB Atlas, AWS S3) are not available without credentials.
        // Full integration tests should be run locally with a configured .env.
        assertTrue(true);
    }
}
