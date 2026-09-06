package com.smartexpense.backend.controller;

import com.smartexpense.backend.dto.ExpenseRequest;
import com.smartexpense.backend.dto.ExpenseResponse;
import com.smartexpense.backend.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping
    public ResponseEntity<ExpenseResponse> createExpense(
            @Valid @RequestBody ExpenseRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        ExpenseResponse response =
                expenseService.createExpense(request, email);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getMyExpenses(
            Authentication authentication) {

        String email = authentication.getName();

        List<ExpenseResponse> expenses =
                expenseService.getMyExpenses(email);

        return ResponseEntity.ok(expenses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponse> updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody ExpenseRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        ExpenseResponse response =
                expenseService.updateExpense(id, request, email);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteExpense(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();

        expenseService.deleteExpense(id, email);

        return ResponseEntity.ok(
                "Expense deleted successfully"
        );
    }
}
