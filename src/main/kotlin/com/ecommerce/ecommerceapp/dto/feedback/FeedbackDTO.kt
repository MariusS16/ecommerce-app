package com.ecommerce.ecommerceapp.dto.feedback

import java.time.LocalDateTime

data class FeedbackDTO(
    val id: Long?,
    val userId: Long?,
    val userFullName: String,
    val userEmail: String,
    val category: String,
    val experience: String,
    val usefulFeatures: List<String>,
    val suggestions: String?,
    val createdAt: LocalDateTime?
)