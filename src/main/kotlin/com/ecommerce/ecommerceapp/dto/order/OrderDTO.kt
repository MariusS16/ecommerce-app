package com.ecommerce.ecommerceapp.dto.order

import com.ecommerce.ecommerceapp.enums.OrderStatus
import java.math.BigDecimal
import java.time.LocalDateTime

data class OrderDTO(
    val id: Long?,
    val orderNumber: String,           // e.g., "ORD-2026-00001"
    val items: List<OrderItemDTO>,
    val status: OrderStatus,
    val totalPrice: BigDecimal,

    // Shipping address
    val shippingAddress: String,
    val shippingCity: String,
    val shippingPostalCode: String,
    val shippingCountry: String,

    // Payment & notes
    val paymentMethod: String,
    val notes: String?,

    val createdAt: LocalDateTime?,
    val updatedAt: LocalDateTime?
)