package com.ecommerce.ecommerceapp.dto.category

import jakarta.validation.constraints.Size

data class UpdateCategoryRequest(
    @field:Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    val name: String? = null,

    @field:Size(max = 500, message = "Description must be less than 500 characters")
    val description: String? = null,

    val imageUrl: String? = null
)