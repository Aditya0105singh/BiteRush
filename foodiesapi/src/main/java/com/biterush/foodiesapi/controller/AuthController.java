package com.biterush.foodiesapi.controller;

import com.biterush.foodiesapi.io.AuthenticationRequest;
import com.biterush.foodiesapi.io.AuthenticationResponse;
import com.biterush.foodiesapi.io.GoogleAuthRequest;
import com.biterush.foodiesapi.service.AppUserDetailsService;
import com.biterush.foodiesapi.service.UserService;
import com.biterush.foodiesapi.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
@Tag(name = "Auth", description = "Register and login endpoints")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AppUserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final RestTemplate restTemplate;
    private final UserService userService;

    @PostMapping("/login")
    @Operation(summary = "Login", description = "Authenticates with email + password and returns a JWT token.")
    public AuthenticationResponse login(@Valid @RequestBody AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        final String jwtToken = jwtUtil.generateToken(userDetails);
        return new AuthenticationResponse(request.getEmail(), jwtToken);
    }

    @PostMapping("/auth/google")
    @Operation(summary = "Google Login", description = "Verify a Google ID token, create account if new, and return a JWT.")
    public AuthenticationResponse googleLogin(@RequestBody GoogleAuthRequest request) {
        String url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + request.getToken();
        Map<String, Object> googleData;
        try {
            ResponseEntity<Map<String, Object>> resp = restTemplate.exchange(
                    url, HttpMethod.GET, null,
                    new ParameterizedTypeReference<Map<String, Object>>() {});
            googleData = resp.getBody();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Google token");
        }
        if (googleData == null || googleData.get("email") == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Google token");
        }
        String email = (String) googleData.get("email");
        String name = googleData.containsKey("name") ? (String) googleData.get("name") : email.split("@")[0];

        userService.findOrCreateGoogleUser(email, name);

        final UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        final String jwtToken = jwtUtil.generateToken(userDetails);
        return new AuthenticationResponse(email, jwtToken);
    }
}
