package com.ecommerce.ecommerceapp.dto.supplier

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.Size

data class UpdateSupplierRequest(
    @field:Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    val name: String? = null,

    @field:Email(message = "Invalid email format")
    val contactEmail: String? = null,

    @field:Size(max = 20, message = "Phone number must be less than 20 characters")
    val contactPhone: String? = null,

    @field:Size(max = 255, message = "Website URL must be less than 255 characters")
    val website: String? = null,

    @field:Size(max = 500, message = "Address must be less than 500 characters")
    val address: String? = null
)