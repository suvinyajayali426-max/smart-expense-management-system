package com.smartexpense.backend.controller;

import com.smartexpense.backend.entity.Budget;
import com.smartexpense.backend.service.BudgetService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(
            BudgetService budgetService) {

        this.budgetService = budgetService;
    }

    @PostMapping
    public ResponseEntity<Budget> createBudget(
            @RequestBody Budget budget,
            Authentication authentication) {

        String email = authentication.getName();

        Budget response =
                budgetService.createBudget(
                        budget,
                        email
                );

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<Budget>> getMyBudgets(
            Authentication authentication) {

        String email = authentication.getName();

        List<Budget> budgets =
                budgetService.getMyBudgets(email);

        return ResponseEntity.ok(budgets);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Budget> updateBudget(
            @PathVariable Long id,
            @RequestBody Budget budget,
            Authentication authentication) {

        String email = authentication.getName();

        Budget response =
                budgetService.updateBudget(
                        id,
                        budget,
                        email
                );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBudget(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();

        budgetService.deleteBudget(
                id,
                email
        );

        return ResponseEntity.ok(
                "Budget deleted successfully"
        );
    }
}
