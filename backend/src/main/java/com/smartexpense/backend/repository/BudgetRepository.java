package com.smartexpense.backend.repository;

import com.smartexpense.backend.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BudgetRepository
        extends JpaRepository<Budget, Long> {

    List<Budget> findByUserId(Long userId);

}
