package com.ecommerce.ecommerceapp.dto.wishlist

import com.ecommerce.ecommerceapp.dto.product.ProductDTO
import java.time.LocalDateTime

data class WishlistItemDTO(
    val id: Long?,
    val product: ProductDTO,
    val addedAt: LocalDateTime?
)