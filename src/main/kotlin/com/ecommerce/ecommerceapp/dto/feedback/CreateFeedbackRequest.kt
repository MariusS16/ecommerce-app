package com.ecommerce.ecommerceapp.dto.feedback

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class CreateFeedbackRequest(

    @field:NotBlank(message = "Category is required")
    val category: String,

    @field:NotBlank(message = "Experience rating is required")
    val experience: String,

    val usefulFeatures: List<String> = emptyList(),

    @field:Size(max = 2000, message = "Suggestions must be less than 2000 characters")
    val suggestions: String? = null
)