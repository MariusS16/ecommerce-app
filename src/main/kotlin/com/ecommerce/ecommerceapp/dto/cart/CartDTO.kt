package com.ecommerce.ecommerceapp.dto.cart

import java.math.BigDecimal

data class CartDTO(
    val id: Long?,
    val items: List<CartItemDTO>,
    val totalItems: Int,               // Sum of all quantities
    val totalPrice: BigDecimal         // Sum of all subtotals
)