package com.ecommerce.ecommerceapp.controller

import com.ecommerce.ecommerceapp.dto.cart.CartDTO
import com.ecommerce.ecommerceapp.dto.cart.CartItemRequest
import com.ecommerce.ecommerceapp.entity.User
import com.ecommerce.ecommerceapp.service.CartService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/cart")
class CartController(
    private val cartService: CartService
) {

    // GET /api/cart/all - Get ALL carts (ADMIN only)
    @GetMapping("/all")
    fun getAllCarts(): ResponseEntity<List<CartDTO>> {
        val carts = cartService.getAllCarts()
        return ResponseEntity.ok(carts)
    }

    // GET /api/cart - Get current user's cart
    @GetMapping
    fun getCart(
        @AuthenticationPrincipal user: User
    ): ResponseEntity<CartDTO> {
        val cart = cartService.getOrCreateCart(user)
        return ResponseEntity.ok(cart)
    }

    // POST /api/cart/items - Add/increment product in cart
    @PostMapping("/items")
    fun addToCart(
        @AuthenticationPrincipal user: User,
        @Valid @RequestBody request: CartItemRequest
    ): ResponseEntity<CartDTO> {
        val cart = cartService.addToCart(user, request)
        return ResponseEntity.ok(cart)
    }

    // PUT /api/cart/items - Update/delete product in cart (set exact quantity)
    @PutMapping("/items")
    fun updateCartItem(
        @AuthenticationPrincipal user: User,
        @Valid @RequestBody request: CartItemRequest
    ): ResponseEntity<CartDTO> {
        val cart = cartService.updateCartItem(user, request)
        return ResponseEntity.ok(cart)
    }

    // DELETE /api/cart/items/{productId} - Remove specific product from cart
    @DeleteMapping("/items/{productId}")
    fun removeFromCart(
        @AuthenticationPrincipal user: User,
        @PathVariable productId: Long
    ): ResponseEntity<CartDTO> {
        val cart = cartService.removeFromCart(user, productId)
        return ResponseEntity.ok(cart)
    }

    // DELETE /api/cart - Clear entire cart
    @DeleteMapping
    fun clearCart(
        @AuthenticationPrincipal user: User
    ): ResponseEntity<CartDTO> {
        val cart = cartService.clearCart(user)
        return ResponseEntity.ok(cart)
    }
}