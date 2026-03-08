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
this.repo=repo;
}

@GetMapping
public List<Expense> getAll(){
return repo.findAll();
}

@PostMapping
public Expense create(@RequestBody Expense e){
return repo.save(e);
}

@PutMapping("/{id}")
public Expense update(@PathVariable Long id,@RequestBody Expense e){

Expense ex = repo.findById(id).orElseThrow();

ex.setTitle(e.getTitle());
ex.setCategory(e.getCategory());
ex.setAmount(e.getAmount());
ex.setExpenseDate(e.getExpenseDate());
ex.setPaymentMethod(e.getPaymentMethod());

return repo.save(ex);
}

@DeleteMapping("/{id}")
public void delete(@PathVariable Long id){
repo.deleteById(id);
}

@GetMapping("/search")
public List<Expense> search(@RequestParam String title){
return repo.findByTitleContainingIgnoreCase(title);
}

@GetMapping("/filter")
public List<Expense> filter(@RequestParam String category){
return repo.findByCategory(category);
}
}