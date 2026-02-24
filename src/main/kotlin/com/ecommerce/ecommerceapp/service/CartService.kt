package com.ecommerce.ecommerceapp.service

import com.ecommerce.ecommerceapp.dto.cart.CartDTO
import com.ecommerce.ecommerceapp.dto.cart.CartItemRequest
import com.ecommerce.ecommerceapp.entity.Cart
import com.ecommerce.ecommerceapp.entity.CartItem
import com.ecommerce.ecommerceapp.entity.User
import com.ecommerce.ecommerceapp.mapper.CartMapper
import com.ecommerce.ecommerceapp.repository.CartItemRepository
import com.ecommerce.ecommerceapp.repository.CartRepository
import com.ecommerce.ecommerceapp.repository.ProductRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
@Transactional
class CartService(
    private val cartRepository: CartRepository,
    private val cartItemRepository: CartItemRepository,
    private val productRepository: ProductRepository,
    private val cartMapper: CartMapper
) {

    fun getAllCarts(): List<CartDTO> {
        val carts = cartRepository.findAll()
        return carts.map { cartMapper.toDTO(it) }
    }

    // GET user's cart (create if doesn't exist)
    fun getOrCreateCart(user: User): CartDTO {
        val cart = cartRepository.findByUser(user).orElseGet {
            // Cart doesn't exist → create a new empty cart
            val newCart = Cart(
                user = user,
                items = mutableListOf(),
                createdAt = LocalDateTime.now()
            )
            cartRepository.save(newCart)
        }

        return cartMapper.toDTO(cart)
    }

    // ADD or INCREMENT product in cart
    fun addToCart(user: User, request: CartItemRequest): CartDTO {
        // Get or create cart
        val cart = cartRepository.findByUser(user).orElseGet {
            val newCart = Cart(
                user = user,
                items = mutableListOf(),
                createdAt = LocalDateTime.now()
            )
            cartRepository.save(newCart)
        }

        // Verify product exists and is active
        val product = productRepository.findById(request.productId)
            .orElseThrow { IllegalArgumentException("Product with id ${request.productId} not found") }

        if (!product.isActive) {
            throw IllegalArgumentException("Product is not available")
        }

        // Check if product already in cart
        val existingItem = cartItemRepository.findByCartAndProduct(cart, product)

        if (existingItem.isPresent) {
            // Product already in cart → INCREMENT quantity
            val item = existingItem.get()
            val updatedItem = item.copy(
                quantity = item.quantity + request.quantity  // Add to existing
            )
            cartItemRepository.save(updatedItem)
        } else {
            // Product NOT in cart → ADD new item
            val newItem = CartItem(
                cart = cart,
                product = product,
                quantity = request.quantity,
                addedAt = LocalDateTime.now()
            )
            cartItemRepository.save(newItem)
        }

        // Return updated cart
        val updatedCart = cartRepository.findByUser(user).get()
        return cartMapper.toDTO(updatedCart)
    }

    // UPDATE or DELETE cart item (set exact quantity)
    fun updateCartItem(user: User, request: CartItemRequest): CartDTO {
        val cart = cartRepository.findByUser(user)
            .orElseThrow { IllegalArgumentException("Cart not found") }

        val product = productRepository.findById(request.productId)
            .orElseThrow { IllegalArgumentException("Product with id ${request.productId} not found") }

        val cartItem = cartItemRepository.findByCartAndProduct(cart, product)
            .orElseThrow { IllegalArgumentException("Product not in cart") }

        //If quantity <= 0 → DELETE item
        if (request.quantity <= 0) {
            cartItemRepository.delete(cartItem)
            cartItemRepository.flush()
        } else {
            // Set exact quantity (not increment!)
            val updatedItem = cartItem.copy(quantity = request.quantity)
            cartItemRepository.save(updatedItem)
        }

        // Return updated cart
        val updatedCart = cartRepository.findByUser(user).get()
        return cartMapper.toDTO(updatedCart)
    }

    // REMOVE product from cart
    fun removeFromCart(user: User, productId: Long): CartDTO {
        val cart = cartRepository.findByUser(user)
            .orElseThrow { IllegalArgumentException("Cart not found") }

        val product = productRepository.findById(productId)
            .orElseThrow { IllegalArgumentException("Product with id $productId not found") }

        val cartItem = cartItemRepository.findByCartAndProduct(cart, product)
            .orElseThrow { IllegalArgumentException("Product not in cart") }

        // Delete the cart item
        cartItemRepository.delete(cartItem)
        cartItemRepository.flush()

        // Return updated cart
        val updatedCart = cartRepository.findByUser(user).get()
        return cartMapper.toDTO(updatedCart)
    }

    // CLEAR entire cart
    fun clearCart(user: User): CartDTO {
        val cart = cartRepository.findByUser(user)
            .orElseThrow { IllegalArgumentException("Cart not found") }

        val itemsToDelete = cartItemRepository.findByCart(cart)

        itemsToDelete.forEach { item ->
            println("=== Deleting item with id: ${item.id} ===")
            cartItemRepository.delete(item)
        }

        cartItemRepository.flush()

        // Return empty cart
        val updatedCart = cartRepository.findByUser(user).get()
        return cartMapper.toDTO(updatedCart)
    }
}