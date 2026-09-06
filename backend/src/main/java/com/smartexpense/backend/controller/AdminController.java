package com.smartexpense.backend.controller;

import com.smartexpense.backend.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final UserService userService;
    public AdminController(UserService userService) {
        this.userService = userService;
    }


    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {

        return Map.of(
                "message", "Welcome to Admin Dashboard",
                "totalUsers", userService.getUserCount()
        );
    }
}