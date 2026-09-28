package com.smartexpense.backend.controller;

import com.smartexpense.backend.dto.LoginRequest;
import com.smartexpense.backend.dto.LoginResponse;
import com.smartexpense.backend.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
