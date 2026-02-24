package com.ecommerce.ecommerceapp.controller

import com.ecommerce.ecommerceapp.dto.wishlist.WishlistItemDTO
import com.ecommerce.ecommerceapp.entity.User
import com.ecommerce.ecommerceapp.service.WishlistService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/wishlist")
class WishlistController(
    private val wishlistService: WishlistService
) {

    // GET /api/wishlist - Get user's wishlist
    @GetMapping
    fun getWishlist(
        @AuthenticationPrincipal user: User
    ): ResponseEntity<List<WishlistItemDTO>> {
        val wishlist = wishlistService.getWishlist(user)
        return ResponseEntity.ok(wishlist)
    }

    // POST /api/wishlist/{productId} - Add product to wishlist
    @PostMapping("/{productId}")
    fun addToWishlist(
        @AuthenticationPrincipal user: User,
        @PathVariable productId: Long
    ): ResponseEntity<WishlistItemDTO> {
        val item = wishlistService.addToWishlist(user, productId)
        return ResponseEntity.status(HttpStatus.CREATED).body(item)
    }

    // DELETE /api/wishlist/{productId} - Remove product from wishlist
    @DeleteMapping("/{productId}")
    fun removeFromWishlist(
        @AuthenticationPrincipal user: User,
        @PathVariable productId: Long
    ): ResponseEntity<Void> {
        wishlistService.removeFromWishlist(user, productId)
        return ResponseEntity.noContent().build()
    }
}