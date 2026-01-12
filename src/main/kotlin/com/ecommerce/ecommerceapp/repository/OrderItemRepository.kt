package com.ecommerce.ecommerceapp.repository

import com.ecommerce.ecommerceapp.entity.Order
import com.ecommerce.ecommerceapp.entity.OrderItem
import com.ecommerce.ecommerceapp.entity.Product
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface OrderItemRepository : JpaRepository<OrderItem, Long> {

    // Toate itemele
    fun findByOrder(order: Order): List<OrderItem>

    fun findByOrderId(orderId: Long): List<OrderItem>

    // Găsește toate comenzile care conțin un anumit produs
    fun findByProduct(product: Product): List<OrderItem>

    // Query custom: Produse populare (cele mai comandate)
    @Query("SELECT oi.product, SUM(oi.quantity) as totalSold " +
            "FROM OrderItem oi " +
            "GROUP BY oi.product " +
            "ORDER BY totalSold DESC")
    fun findMostOrderedProducts(): List<Any>
}