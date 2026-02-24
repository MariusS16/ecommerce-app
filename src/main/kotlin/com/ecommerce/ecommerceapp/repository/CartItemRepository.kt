package com.ecommerce.ecommerceapp.repository

import com.ecommerce.ecommerceapp.entity.Cart
import com.ecommerce.ecommerceapp.entity.CartItem
import com.ecommerce.ecommerceapp.entity.Product
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.util.Optional

@Repository
interface CartItemRepository : JpaRepository<CartItem, Long> {

    fun findByCart(cart: Cart): List<CartItem>

    fun findByCartAndProduct(cart: Cart, product: Product): Optional<CartItem>
}