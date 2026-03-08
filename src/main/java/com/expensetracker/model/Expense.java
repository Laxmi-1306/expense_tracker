package com.expensetracker.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String category;
    private Double amount;
    private LocalDate expenseDate;
    private String paymentMethod;
    private LocalDateTime createdDateTime;

    public Expense() {} // default constructor

    public Expense(String title, String category, Double amount, LocalDate expenseDate, String paymentMethod) {
        this.title = title;
        this.category = category;
        this.amount = amount;
        this.expenseDate = expenseDate;
        this.paymentMethod = paymentMethod;
        this.createdDateTime = LocalDateTime.now();
    }

    // ===== GETTERS =====
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getCategory() { return category; }
    public Double getAmount() { return amount; }
    public LocalDate getExpenseDate() { return expenseDate; }
    public String getPaymentMethod() { return paymentMethod; }
    public LocalDateTime getCreatedDateTime() { return createdDateTime; }

    // ===== SETTERS =====
    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setCategory(String category) { this.category = category; }
    public void setAmount(Double amount) { this.amount = amount; }
    public void setExpenseDate(LocalDate expenseDate) { this.expenseDate = expenseDate; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public void setCreatedDateTime(LocalDateTime createdDateTime) { this.createdDateTime = createdDateTime; }
}