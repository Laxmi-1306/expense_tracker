package com.expensetracker.controller;

import com.expensetracker.model.User;
import com.expensetracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("/auth")
public class AuthController {

@Autowired
private UserRepository userRepo;

// Register
@PostMapping("/register")
public ResponseEntity<String> register(@RequestBody User user){

if(userRepo.findByEmail(user.getEmail()).isPresent()){
return ResponseEntity.badRequest().body("EMAIL_EXISTS");
}

userRepo.save(user);

return ResponseEntity.ok("SUCCESS");
}

// Login
@PostMapping("/login")
public ResponseEntity<String> login(@RequestBody User user){

return userRepo.findByEmail(user.getEmail())
.filter(u -> u.getPassword().equals(user.getPassword()))
.map(u -> ResponseEntity.ok(u.getId().toString()))
.orElse(ResponseEntity.status(401).body("FAIL"));

}

}