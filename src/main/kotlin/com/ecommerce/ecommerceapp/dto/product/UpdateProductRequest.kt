package com.ecommerce.ecommerceapp.dto.product

import jakarta.validation.constraints.*
import java.math.BigDecimal

data class UpdateProductRequest(
    @field:Size(min = 2, max = 200, message = "Name must be between 2 and 200 characters")
    val name: String? = null,

    @field:Size(max = 5000, message = "Description must be less than 5000 characters")
    val description: String? = null,

    @field:DecimalMin(value = "0.01", message = "Price must be greater than 0")
    val price: BigDecimal? = null,

    @field:Min(value = 0, message = "Stock cannot be negative")
    val stock: Int? = null,

    val imageUrl: String? = null,

    val categoryId: Long? = null,   // Optional - only update if provided

    val supplierId: Long? = null,   // Optional - only update if provided

    val isActive: Boolean? = null   // Can activate/deactivate product
)