package com.ecommerce.ecommerceapp.dto.order

import com.ecommerce.ecommerceapp.enums.OrderStatus
import jakarta.validation.constraints.NotNull

data class UpdateOrderRequest(
    @field:NotNull(message = "Status is required")
    val status: OrderStatus  // PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED
)