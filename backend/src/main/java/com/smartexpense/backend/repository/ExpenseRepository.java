package com.smartexpense.backend.repository;

import com.smartexpense.backend.entity.Expense;
import com.smartexpense.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUser(User user);
}