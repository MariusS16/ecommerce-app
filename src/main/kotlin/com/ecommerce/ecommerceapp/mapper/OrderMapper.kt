package com.ecommerce.ecommerceapp.mapper

import com.ecommerce.ecommerceapp.dto.order.OrderDTO
import com.ecommerce.ecommerceapp.dto.order.OrderItemDTO
import com.ecommerce.ecommerceapp.entity.Order
import com.ecommerce.ecommerceapp.entity.OrderItem
import org.springframework.stereotype.Component

@Component
class OrderMapper(
    private val productMapper: ProductMapper
) {

    // OrderItem Entity → DTO
    fun orderItemToDTO(orderItem: OrderItem): OrderItemDTO {
        val subtotal = orderItem.priceAtPurchase.multiply(orderItem.quantity.toBigDecimal())

        return OrderItemDTO(
            id = orderItem.id,
            product = productMapper.toDTO(orderItem.product),
            quantity = orderItem.quantity,
            priceAtPurchase = orderItem.priceAtPurchase,
            subtotal = subtotal
        )
    }

    // Order Entity → DTO
    fun toDTO(order: Order): OrderDTO {
        val itemDTOs = order.items.map { orderItemToDTO(it) }

        return OrderDTO(
            id = order.id,
            orderNumber = order.orderNumber,
            items = itemDTOs,
            status = order.status,
            totalPrice = order.totalPrice,
            shippingAddress = order.shippingAddress,
            shippingCity = order.shippingCity,
            shippingPostalCode = order.shippingPostalCode,
            shippingCountry = order.shippingCountry,
            paymentMethod = order.paymentMethod,
            notes = order.notes,
            createdAt = order.createdAt,
            updatedAt = order.updatedAt
        )
    }

    // List<Order> → List<DTO>
    fun toDTOList(orders: List<Order>): List<OrderDTO> {
        return orders.map { toDTO(it) }
    }
}