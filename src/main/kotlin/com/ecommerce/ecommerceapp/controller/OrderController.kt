package com.ecommerce.ecommerceapp.controller

import com.ecommerce.ecommerceapp.dto.order.CreateOrderRequest
import com.ecommerce.ecommerceapp.dto.order.OrderDTO
import com.ecommerce.ecommerceapp.dto.order.UpdateOrderRequest
import com.ecommerce.ecommerceapp.entity.User
import com.ecommerce.ecommerceapp.service.OrderService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/orders")
class OrderController(
    private val orderService: OrderService
) {

    // GET /api/orders - Get user's order history
    @GetMapping
    fun getOrderHistory(
        @AuthenticationPrincipal user: User
    ): ResponseEntity<List<OrderDTO>> {
        val orders = orderService.getOrderHistory(user)
        return ResponseEntity.ok(orders)
    }

    // GET /api/orders/{id} - Get order details
    @GetMapping("/{id}")
    fun getOrderById(
        @AuthenticationPrincipal user: User,
        @PathVariable id: Long
    ): ResponseEntity<OrderDTO> {
        val order = orderService.getOrderById(user, id)
        return ResponseEntity.ok(order)
    }

    // POST /api/orders - Create order (checkout)
    @PostMapping
    fun createOrder(
        @AuthenticationPrincipal user: User,
        @Valid @RequestBody request: CreateOrderRequest
    ): ResponseEntity<OrderDTO> {
        val order = orderService.createOrder(user, request)
        return ResponseEntity.status(HttpStatus.CREATED).body(order)
    }

    // PUT /api/orders/{id}/cancel - Cancel order (USER)
    @PutMapping("/{id}/cancel")
    fun cancelOrder(
        @AuthenticationPrincipal user: User,
        @PathVariable id: Long
    ): ResponseEntity<OrderDTO> {
        val order = orderService.cancelOrder(user, id)
        return ResponseEntity.ok(order)
    }

    // PUT /api/orders/{id}/status - Update order (ADMIN only)
    @PutMapping("/{id}/status")
    fun updateOrderStatus(
        @PathVariable id: Long,
        @Valid @RequestBody request: UpdateOrderRequest
    ): ResponseEntity<OrderDTO> {
        val order = orderService.updateOrderStatus(id, request)
        return ResponseEntity.ok(order)
    }

    // GET /api/orders/all - Get all orders (ADMIN only)
    @GetMapping("/all")
    fun getAllOrders(): ResponseEntity<List<OrderDTO>> {
        val orders = orderService.getAllOrders()
        return ResponseEntity.ok(orders)
    }
}