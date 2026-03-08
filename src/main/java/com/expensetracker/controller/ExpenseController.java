package com.expensetracker.controller;

import com.expensetracker.model.Expense;
import com.expensetracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*") // allow frontend
@RestController
@RequestMapping("/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseRepository repository;

    @GetMapping
    public List<Expense> getAllExpenses() {
        return repository.findAll();
    }

    @PostMapping
    public Expense createExpense(@RequestBody Expense expense) {
        return repository.save(expense);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long id, @RequestBody Expense updatedExpense) {
        return repository.findById(id).map(expense -> {
            expense.setTitle(updatedExpense.getTitle());
            expense.setCategory(updatedExpense.getCategory());
            expense.setAmount(updatedExpense.getAmount());
            expense.setExpenseDate(updatedExpense.getExpenseDate());
            expense.setPaymentMethod(updatedExpense.getPaymentMethod());
            return ResponseEntity.ok(repository.save(expense));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        return repository.findById(id).map(expense -> {
            repository.delete(expense);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<Expense> searchByTitle(@RequestParam String title) {
        return repository.findByTitleContainingIgnoreCase(title);
    }

    @GetMapping("/filter")
    public List<Expense> filterByCategory(@RequestParam String category) {
        return repository.findByCategory(category);
    }
}