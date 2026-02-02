package com.ecommerce.ecommerceapp.controller

import com.ecommerce.ecommerceapp.dto.auth.AuthResponse
import com.ecommerce.ecommerceapp.dto.auth.LoginRequest
import com.ecommerce.ecommerceapp.dto.auth.RegisterRequest
import com.ecommerce.ecommerceapp.service.AuthService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")        // All routes start with /api/auth
class AuthController(
    private val authService: AuthService
) {

    // POST /api/auth/register - Register a new user
    @PostMapping("/register")
    fun register(
        @Valid @RequestBody request: RegisterRequest
    ): ResponseEntity<AuthResponse> {
        val response = authService.register(request)
        return ResponseEntity.status(HttpStatus.CREATED).body(response)  // 201 Created
    }

    // POST /api/auth/login - Login an existing user
    @PostMapping("/login")
    fun login(
        @Valid @RequestBody request: LoginRequest
    ): ResponseEntity<AuthResponse> {
        val response = authService.login(request)
        return ResponseEntity.ok(response)  // 200 OK
    }
}