package com.ecommerce.ecommerceapp.mapper

import com.ecommerce.ecommerceapp.dto.cart.CartDTO
import com.ecommerce.ecommerceapp.dto.cart.CartItemDTO
import com.ecommerce.ecommerceapp.entity.Cart
import com.ecommerce.ecommerceapp.entity.CartItem
import org.springframework.stereotype.Component
import java.math.BigDecimal

@Component
class CartMapper(
    private val productMapper: ProductMapper
) {

    // CartItem Entity → DTO
    fun cartItemToDTO(cartItem: CartItem): CartItemDTO {
        val subtotal = cartItem.product.price.multiply(BigDecimal(cartItem.quantity))

        return CartItemDTO(
            id = cartItem.id,
            product = productMapper.toDTO(cartItem.product),  // Convert nested product
            quantity = cartItem.quantity,
            subtotal = subtotal,                              // Calculate subtotal
            addedAt = cartItem.addedAt
        )
    }

    // Cart Entity → DTO
    fun toDTO(cart: Cart): CartDTO {
        val itemDTOs = cart.items.map { cartItemToDTO(it) }

        val totalItems = itemDTOs.sumOf { it.quantity }      // Sum all quantities
        val totalPrice = itemDTOs
            .map { it.subtotal }
            .fold(BigDecimal.ZERO) { acc, subtotal -> acc.add(subtotal) }  // Sum all subtotals

        return CartDTO(
            id = cart.id,
            items = itemDTOs,
            totalItems = totalItems,
            totalPrice = totalPrice
        )
    }
}