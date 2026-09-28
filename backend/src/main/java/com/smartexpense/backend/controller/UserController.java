package com.smartexpense.backend.controller;

import com.smartexpense.backend.dto.UserRequest;
import com.smartexpense.backend.dto.UserResponse;
import com.smartexpense.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {

        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<UserResponse> registerUser(
            @Valid @RequestBody UserRequest request) {

        UserResponse response = userService.registerUser(request);

        return ResponseEntity.ok(response);
    }
    @GetMapping
    public ResponseEntity<java.util.List<UserResponse>> getUsers() {

        return ResponseEntity.ok(userService.getAllUsers());
    }
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(
            @PathVariable Long id) {

        UserResponse response = userService.getUserById(id);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public UserResponse updateUser(
            @PathVariable Long id,
            @RequestBody UserRequest request) {

        return userService.updateUser(id, request);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {

        userService.deleteUser(id);

        return ResponseEntity.ok("User deleted successfully");
    }
}
