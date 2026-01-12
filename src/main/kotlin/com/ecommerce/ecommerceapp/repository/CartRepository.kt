package com.ecommerce.ecommerceapp.repository

import com.ecommerce.ecommerceapp.entity.Cart
import com.ecommerce.ecommerceapp.entity.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface CartRepository : JpaRepository<Cart, Long> {

    fun findByUser(user: User): Optional<Cart>

    fun findByUserId(userId: Long): Optional<Cart>
}