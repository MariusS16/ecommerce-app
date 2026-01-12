package com.ecommerce.ecommerceapp.repository

import com.ecommerce.ecommerceapp.entity.Order
import com.ecommerce.ecommerceapp.entity.User
import com.ecommerce.ecommerceapp.enums.OrderStatus
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface OrderRepository : JpaRepository<Order, Long> {

    fun findByOrderNumber(orderNumber: String): Optional<Order>

    // Toate comenzile unui user
    fun findByUser(user: User): List<Order>

    // Comenzile unui user sortate descrescător (cele mai recente)
    fun findByUserOrderByCreatedAtDesc(user: User): List<Order>

    fun findByUserId(userId: Long): List<Order>

    fun findByStatus(status: OrderStatus): List<Order>

    fun findByUserAndStatus(user: User, status: OrderStatus): List<Order>

    fun existsByOrderNumber(orderNumber: String): Boolean

    // Query custom: Numărul de comenzi dintr-un anumit an (pentru generare order number)
    @Query("SELECT COUNT(o) FROM Order o WHERE YEAR(o.createdAt) = :year")
    fun countByYear(year: Int): Long
}