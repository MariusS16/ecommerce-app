package com.ecommerce.ecommerceapp.dto.user

import java.time.LocalDateTime

data class UserProfileDTO(
    val id: Long?,
    val firstName: String,
    val lastName: String,
    val email: String,
    val phoneNumber: String?,
    val role: String,
    val createdAt: LocalDateTime?
)