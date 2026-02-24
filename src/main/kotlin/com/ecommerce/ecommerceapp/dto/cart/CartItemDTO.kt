package com.ecommerce.ecommerceapp.dto.cart

import com.ecommerce.ecommerceapp.dto.product.ProductDTO
import java.math.BigDecimal
import java.time.LocalDateTime

data class CartItemDTO(
    val id: Long?,
    val product: ProductDTO,           // Full product details
    val quantity: Int,
    val subtotal: BigDecimal,          // Calculated: product.price * quantity
    val addedAt: LocalDateTime?
)