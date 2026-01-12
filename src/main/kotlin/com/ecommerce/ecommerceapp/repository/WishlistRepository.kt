package com.ecommerce.ecommerceapp.repository

import com.ecommerce.ecommerceapp.entity.Product
import com.ecommerce.ecommerceapp.entity.User
import com.ecommerce.ecommerceapp.entity.Wishlist
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface WishlistRepository : JpaRepository<Wishlist, Long> {

    fun findByUser(user: User): List<Wishlist>

    fun findByUserId(userId: Long): List<Wishlist>

    // Verifică dacă user-ul are produsul în wishlist
    fun findByUserAndProduct(user: User, product: Product): Optional<Wishlist>

    // Verifică dacă produsul e în wishlist-ul user-ului
    fun existsByUserAndProduct(user: User, product: Product): Boolean

    fun deleteByUserAndProduct(user: User, product: Product)
}