package com.ecommerce.ecommerceapp.mapper

import com.ecommerce.ecommerceapp.dto.wishlist.WishlistItemDTO
import com.ecommerce.ecommerceapp.entity.Wishlist
import org.springframework.stereotype.Component

@Component
class WishlistMapper(
    private val productMapper: ProductMapper  // Reuse ProductMapper
) {

    // Wishlist Entity → DTO
    fun toDTO(wishlist: Wishlist): WishlistItemDTO {
        return WishlistItemDTO(
            id = wishlist.id,
            product = productMapper.toDTO(wishlist.product),
            addedAt = wishlist.addedAt
        )
    }

    // List<Wishlist> → List<DTO>
    fun toDTOList(wishlists: List<Wishlist>): List<WishlistItemDTO> {
        return wishlists.map { toDTO(it) }
    }
}