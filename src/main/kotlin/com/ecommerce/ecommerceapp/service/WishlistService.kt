package com.ecommerce.ecommerceapp.service

import com.ecommerce.ecommerceapp.dto.wishlist.WishlistItemDTO
import com.ecommerce.ecommerceapp.entity.User
import com.ecommerce.ecommerceapp.entity.Wishlist
import com.ecommerce.ecommerceapp.mapper.WishlistMapper
import com.ecommerce.ecommerceapp.repository.ProductRepository
import com.ecommerce.ecommerceapp.repository.WishlistRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
@Transactional
class WishlistService(
    private val wishlistRepository: WishlistRepository,
    private val productRepository: ProductRepository,
    private val wishlistMapper: WishlistMapper
) {

    // GET user's wishlist
    fun getWishlist(user: User): List<WishlistItemDTO> {
        val wishlistItems = wishlistRepository.findByUser(user)
        return wishlistMapper.toDTOList(wishlistItems)
    }

    // ADD product to wishlist
    fun addToWishlist(user: User, productId: Long): WishlistItemDTO {
        // Verify product exists
        val product = productRepository.findById(productId)
            .orElseThrow { IllegalArgumentException("Product with id $productId not found") }

        // Check if already in wishlist
        if (wishlistRepository.existsByUserAndProduct(user, product)) {
            throw IllegalArgumentException("Product already in wishlist")
        }

        // Create wishlist item
        val wishlistItem = Wishlist(
            user = user,
            product = product,
            addedAt = LocalDateTime.now()
        )

        val savedItem = wishlistRepository.save(wishlistItem)
        return wishlistMapper.toDTO(savedItem)
    }

    // REMOVE product from wishlist
    fun removeFromWishlist(user: User, productId: Long) {
        val product = productRepository.findById(productId)
            .orElseThrow { IllegalArgumentException("Product with id $productId not found") }

        val wishlistItem = wishlistRepository.findByUserAndProduct(user, product)
            .orElseThrow { IllegalArgumentException("Product not in wishlist") }

        wishlistRepository.delete(wishlistItem)
    }
}