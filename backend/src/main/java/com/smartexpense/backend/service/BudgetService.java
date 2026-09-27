package com.smartexpense.backend.service;

import com.smartexpense.backend.entity.Budget;
import com.smartexpense.backend.entity.User;
import com.smartexpense.backend.repository.BudgetRepository;
import com.smartexpense.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;

    public BudgetService(
            BudgetRepository budgetRepository,
            UserRepository userRepository) {

        this.budgetRepository = budgetRepository;
        this.userRepository = userRepository;
    }

    public Budget createBudget(
            Budget budget,
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        )
                );

        budget.setUserId(user.getId());

        return budgetRepository.save(budget);
    }

    public List<Budget> getMyBudgets(
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        )
                );

        return budgetRepository.findByUserId(
                user.getId()
        );
    }

    public Budget updateBudget(
            Long id,
            Budget updatedBudget,
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        )
                );

        Budget existingBudget =
                budgetRepository.findById(id)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Budget not found"
                                )
                        );

        if (!existingBudget.getUserId()
                .equals(user.getId())) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You are not allowed to update this budget"
            );
        }

        existingBudget.setCategory(
                updatedBudget.getCategory()
        );

        existingBudget.setAmount(
                updatedBudget.getAmount()
        );

        existingBudget.setBudgetMonth(
                updatedBudget.getBudgetMonth()
        );

        return budgetRepository.save(
                existingBudget
        );
    }

    public void deleteBudget(
            Long id,
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        )
                );

        Budget existingBudget =
                budgetRepository.findById(id)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Budget not found"
                                )
                        );

        if (!existingBudget.getUserId()
                .equals(user.getId())) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You are not allowed to delete this budget"
            );
        }

        budgetRepository.delete(existingBudget);
    }
}