package com.expensetracker.controller;

import com.expensetracker.model.Expense;
import com.expensetracker.repository.ExpenseRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/expenses")
public class ExpenseController {

    private final ExpenseRepository repo;

    public ExpenseController(ExpenseRepository repo){
        this.repo = repo;
    }

    // ================= GET ALL EXPENSES (with optional title search) =================
    @GetMapping
    public List<Expense> getAll(@RequestParam Long userId,
                                @RequestParam(required = false) String title){
        List<Expense> list = repo.findByUserId(userId);

        if(title != null && !title.isBlank()){
            String lower = title.toLowerCase();
            list = list.stream()
                       .filter(e -> e.getTitle().toLowerCase().contains(lower))
                       .toList();
        }

        return list;
    }

    // ================= GET SINGLE EXPENSE =================
    @GetMapping("/{id}")
    public Expense getExpense(@PathVariable Long id){
        return repo.findById(id).orElse(null);
    }

    // ================= CREATE EXPENSE =================
    @PostMapping
    public Expense create(@RequestBody Expense e){
        return repo.save(e);
    }

    // ================= UPDATE EXPENSE =================
    @PutMapping("/{id}")
    public Expense update(@PathVariable Long id, @RequestBody Expense e){
        Expense ex = repo.findById(id).orElseThrow();
        ex.setTitle(e.getTitle());
        ex.setCategory(e.getCategory());
        ex.setAmount(e.getAmount());
        ex.setExpenseDate(e.getExpenseDate());
        ex.setPaymentMethod(e.getPaymentMethod());
        if(e.getUser() != null){
            ex.setUser(e.getUser());
        }
        return repo.save(ex);
    }

    // ================= DELETE =================
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        repo.deleteById(id);
    }
}