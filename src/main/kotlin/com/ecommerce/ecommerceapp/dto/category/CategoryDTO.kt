package com.ecommerce.ecommerceapp.dto.category

import java.time.LocalDateTime

data class CategoryDTO(
    val id: Long?,
    val name: String,
    val description: String?,
    val imageUrl: String?,
    val createdAt: LocalDateTime?
)