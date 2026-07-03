package com.biterush.foodiesapi.service;

import com.biterush.foodiesapi.io.UserRequest;
import com.biterush.foodiesapi.io.UserResponse;

public interface UserService {

    UserResponse registerUser(UserRequest request);

    String findByUserId();
}
