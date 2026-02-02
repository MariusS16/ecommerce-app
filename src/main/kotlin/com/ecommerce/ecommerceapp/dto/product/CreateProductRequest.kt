package com.ecommerce.ecommerceapp.dto.product

import jakarta.validation.constraints.*
import java.math.BigDecimal

data class CreateProductRequest(
    @field:NotBlank(message = "Product name is required")
    @field:Size(min = 2, max = 200, message = "Name must be between 2 and 200 characters")
    val name: String,

    @field:Size(max = 5000, message = "Description must be less than 5000 characters")
    val description: String? = null,

    @field:NotNull(message = "Price is required")
    @field:DecimalMin(value = "0.01", message = "Price must be greater than 0")
    val price: BigDecimal,

    @field:NotNull(message = "Stock is required")
    @field:Min(value = 0, message = "Stock cannot be negative")
    val stock: Int,

    val imageUrl: String? = null,

    @field:NotNull(message = "Category ID is required")
    val categoryId: Long,           // receive only the ID, not the full object

    @field:NotNull(message = "Supplier ID is required")
    val supplierId: Long            // receive only the ID, not the full object
)