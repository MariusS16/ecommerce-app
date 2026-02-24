package com.ecommerce.ecommerceapp.dto.cart

import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotNull

data class CartItemRequest(
    @field:NotNull(message = "Product ID is required")
    val productId: Long,

    @field:NotNull(message = "Quantity is required")
    @field:Min(value = 0, message = "Quantity cannot be negative")
    val quantity: Int
)