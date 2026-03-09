package com.expensetracker.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Expense {

@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

private String title;
private String category;
private double amount;
private LocalDate expenseDate;
private String paymentMethod;

@ManyToOne
@JoinColumn(name="user_id")
private User user;

public Long getId(){return id;}

public String getTitle(){return title;}
public void setTitle(String title){this.title=title;}

public String getCategory(){return category;}
public void setCategory(String category){this.category=category;}

public double getAmount(){return amount;}
public void setAmount(double amount){this.amount=amount;}

public LocalDate getExpenseDate(){return expenseDate;}
public void setExpenseDate(LocalDate expenseDate){this.expenseDate=expenseDate;}

public String getPaymentMethod(){return paymentMethod;}
public void setPaymentMethod(String paymentMethod){this.paymentMethod=paymentMethod;}

public User getUser(){return user;}
public void setUser(User user){this.user=user;}

}