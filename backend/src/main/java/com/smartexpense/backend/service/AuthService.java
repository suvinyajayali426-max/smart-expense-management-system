package com.smartexpense.backend.service;

import com.smartexpense.backend.dto.LoginRequest;
import com.smartexpense.backend.dto.LoginResponse;
import com.smartexpense.backend.entity.User;
import com.smartexpense.backend.repository.UserRepository;
import com.smartexpense.backend.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password")
                );

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException("Invalid email or password");
        }
        String token = jwtService.generateToken(user.getEmail());


        return new LoginResponse(
                "Login successful",
                user.getEmail(),
                user.getRole(),
                token
        );
    }
}