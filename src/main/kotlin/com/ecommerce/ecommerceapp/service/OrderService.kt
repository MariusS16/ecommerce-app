package com.ecommerce.ecommerceapp.service

import com.ecommerce.ecommerceapp.dto.order.CreateOrderRequest
import com.ecommerce.ecommerceapp.dto.order.OrderDTO
import com.ecommerce.ecommerceapp.dto.order.UpdateOrderRequest
import com.ecommerce.ecommerceapp.entity.Order
import com.ecommerce.ecommerceapp.entity.OrderItem
import com.ecommerce.ecommerceapp.entity.User
import com.ecommerce.ecommerceapp.enums.OrderStatus
import com.ecommerce.ecommerceapp.mapper.OrderMapper
import com.ecommerce.ecommerceapp.repository.CartItemRepository
import com.ecommerce.ecommerceapp.repository.CartRepository
import com.ecommerce.ecommerceapp.repository.OrderRepository
import com.ecommerce.ecommerceapp.repository.ProductRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal
import java.time.LocalDateTime
import java.time.Year

@Service
@Transactional
class OrderService(
    private val orderRepository: OrderRepository,
    private val cartRepository: CartRepository,
    private val cartItemRepository: CartItemRepository,
    private val orderMapper: OrderMapper,
    private val emailService: EmailService,
    private val productRepository: ProductRepository
) {

    // CREATE order (checkout from cart)
    fun createOrder(user: User, request: CreateOrderRequest): OrderDTO {
        // Get user's cart
        val cart = cartRepository.findByUser(user)
            .orElseThrow { IllegalArgumentException("Cart is empty") }

        // Verify cart has items
        val cartItems = cartItemRepository.findByCart(cart)
        if (cartItems.isEmpty()) {
            throw IllegalArgumentException("Cart is empty")
        }

        // verificăm stocul ÎNAINTE să plasăm comanda
        cartItems.forEach { cartItem ->
            if (cartItem.product.stock < cartItem.quantity) {
                throw IllegalArgumentException(
                    "Stoc insuficient pentru '${cartItem.product.name}'. " +
                            "Disponibil: ${cartItem.product.stock}, solicitat: ${cartItem.quantity}"
                )
            }
        }

        // Generate unique order number (e.g., "ORD-2026-00001")
        val orderNumber = generateOrderNumber()

        // Calculate total price
        val totalPrice = cartItems
            .map { it.product.price.multiply(it.quantity.toBigDecimal()) }
            .fold(BigDecimal.ZERO) { acc, price -> acc.add(price) }

        // Create Order entity
        val order = Order(
            user = user,
            orderNumber = orderNumber,
            items = mutableListOf(),
            status = OrderStatus.PENDING,
            totalPrice = totalPrice,
            shippingAddress = request.shippingAddress,
            shippingCity = request.shippingCity,
            shippingPostalCode = request.shippingPostalCode,
            shippingCountry = request.shippingCountry,
            paymentMethod = request.paymentMethod,
            notes = request.notes,
            createdAt = LocalDateTime.now(),
            updatedAt = LocalDateTime.now()
        )

        val savedOrder = orderRepository.save(order)

        // Convert CartItems → OrderItems (with price snapshot!)
        val orderItems = cartItems.map { cartItem ->
            OrderItem(
                order = savedOrder,
                product = cartItem.product,
                quantity = cartItem.quantity,
                priceAtPurchase = cartItem.product.price
            )
        }

        savedOrder.items.addAll(orderItems)
        orderRepository.save(savedOrder)

        // scădem stocul pentru fiecare produs comandat
        cartItems.forEach { cartItem ->
            val updatedProduct = cartItem.product.copy(
                stock = cartItem.product.stock - cartItem.quantity,
                updatedAt = LocalDateTime.now()
            )
            productRepository.save(updatedProduct)
        }

        emailService.sendOrderConfirmationEmail(user, savedOrder)

        // CLEAR cart after successful order (FIXED!)
        val itemsToDelete = cartItemRepository.findByCart(cart)
        itemsToDelete.forEach { item ->
            cartItemRepository.delete(item)
        }
        cartItemRepository.flush()

        return orderMapper.toDTO(savedOrder)
    }

    // GET user's order history
    fun getOrderHistory(user: User): List<OrderDTO> {
        val orders = orderRepository.findByUserOrderByCreatedAtDesc(user)
        return orderMapper.toDTOList(orders)
    }

    // GET order by ID (user can only see their own orders)
    fun getOrderById(user: User, orderId: Long): OrderDTO {
        val order = orderRepository.findById(orderId)
            .orElseThrow { IllegalArgumentException("Order with id $orderId not found") }

        // Verify order belongs to user
        if (order.user.id != user.id) {
            throw IllegalArgumentException("Access denied")
        }

        return orderMapper.toDTO(order)
    }

    // CANCEL order (user can only cancel PENDING orders)
    fun cancelOrder(user: User, orderId: Long): OrderDTO {
        val order = orderRepository.findById(orderId)
            .orElseThrow { IllegalArgumentException("Order with id $orderId not found") }

        // Verify order belongs to user
        if (order.user.id != user.id) {
            throw IllegalArgumentException("Access denied")
        }

        // Can only cancel PENDING orders
        if (order.status != OrderStatus.PENDING) {
            throw IllegalArgumentException("Cannot cancel order with status ${order.status}")
        }

        val updatedOrder = order.copy(
            status = OrderStatus.CANCELLED,
            updatedAt = LocalDateTime.now()
        )

        val savedOrder = orderRepository.save(updatedOrder)
        return orderMapper.toDTO(savedOrder)
    }

    // UPDATE order status (ADMIN only)
    fun updateOrderStatus(orderId: Long, request: UpdateOrderRequest): OrderDTO {
        val order = orderRepository.findById(orderId)
            .orElseThrow { IllegalArgumentException("Order with id $orderId not found") }

        val updatedOrder = order.copy(
            status = request.status,
            updatedAt = LocalDateTime.now()
        )

        val savedOrder = orderRepository.save(updatedOrder)
        return orderMapper.toDTO(savedOrder)
    }

    // GET all orders (ADMIN only)
    fun getAllOrders(): List<OrderDTO> {
        val orders = orderRepository.findAll()
        return orderMapper.toDTOList(orders)
    }

    // HELPER: Generate unique order number
    private fun generateOrderNumber(): String {
        val year = Year.now().value
        val count = orderRepository.countByYear(year)
        val orderNumber = String.format("ORD-%d-%06d", year, count + 1)

        // Verify uniqueness (should never happen, but just in case)
        if (orderRepository.existsByOrderNumber(orderNumber)) {
            throw IllegalStateException("Order number collision: $orderNumber")
        }

        return orderNumber
    }
}