package com.smartexpense.backend.controller;

import com.smartexpense.backend.entity.Income;
import com.smartexpense.backend.service.IncomeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/income")
public class IncomeController {

    private final IncomeService incomeService;

    public IncomeController(IncomeService incomeService) {
        this.incomeService = incomeService;
    }

    @PostMapping
    public ResponseEntity<Income> createIncome(
            @RequestBody Income income,
            Authentication authentication) {

        String email = authentication.getName();

        Income response =
                incomeService.createIncome(income, email);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<Income>> getMyIncome(
            Authentication authentication) {

        String email = authentication.getName();

        List<Income> incomes =
                incomeService.getMyIncome(email);

        return ResponseEntity.ok(incomes);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Income> updateIncome(
            @PathVariable Long id,
            @RequestBody Income income,
            Authentication authentication) {

        String email = authentication.getName();

        Income response =
                incomeService.updateIncome(id, income, email);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteIncome(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();

        incomeService.deleteIncome(id, email);

        return ResponseEntity.ok(
                "Income deleted successfully"
        );
    }
}