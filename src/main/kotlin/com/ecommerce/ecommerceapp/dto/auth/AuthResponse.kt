package com.ecommerce.ecommerceapp.dto.auth

data class AuthResponse(
    val token: String,      // JWT token that frontend saves and sends with every request
    val email: String,      // Email of the authenticated user
    val role: String        // Role: USER or ADMIN
)