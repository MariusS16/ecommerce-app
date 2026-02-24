package com.ecommerce.ecommerceapp.dto.order

import com.ecommerce.ecommerceapp.dto.product.ProductDTO
import java.math.BigDecimal

data class OrderItemDTO(
    val id: Long?,
    val product: ProductDTO,           // Full product details
    val quantity: Int,
    val priceAtPurchase: BigDecimal,   // Price snapshot at time of order
    val subtotal: BigDecimal           // priceAtPurchase * quantity
)