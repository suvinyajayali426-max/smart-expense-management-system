package com.smartexpense.backend.service;

import com.smartexpense.backend.entity.Income;
import com.smartexpense.backend.entity.User;
import com.smartexpense.backend.repository.IncomeRepository;
import com.smartexpense.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class IncomeService {

    private final IncomeRepository incomeRepository;
    private final UserRepository userRepository;

    public IncomeService(
            IncomeRepository incomeRepository,
            UserRepository userRepository) {

        this.incomeRepository = incomeRepository;
        this.userRepository = userRepository;
    }

    public Income createIncome(Income income, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        )
                );

        income.setUserId(user.getId());

        return incomeRepository.save(income);
    }

    public List<Income> getMyIncome(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        )
                );

        return incomeRepository.findByUserId(user.getId());
    }

    public Income updateIncome(
            Long id,
            Income updatedIncome,
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        )
                );

        Income existingIncome = incomeRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Income not found"
                        )
                );

        if (!existingIncome.getUserId().equals(user.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You are not allowed to update this income"
            );
        }

        existingIncome.setTitle(updatedIncome.getTitle());
        existingIncome.setAmount(updatedIncome.getAmount());
        existingIncome.setSource(updatedIncome.getSource());
        existingIncome.setIncomeDate(updatedIncome.getIncomeDate());
        existingIncome.setDescription(updatedIncome.getDescription());

        return incomeRepository.save(existingIncome);
    }

    public void deleteIncome(Long id, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        )
                );

        Income existingIncome = incomeRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Income not found"
                        )
                );

        if (!existingIncome.getUserId().equals(user.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You are not allowed to delete this income"
            );
        }

        incomeRepository.delete(existingIncome);
    }
}