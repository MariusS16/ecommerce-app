package com.ecommerce.ecommerceapp.entity

import com.ecommerce.ecommerceapp.enums.OrderStatus
import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDateTime

@Entity
@Table(name = "orders")
data class Order(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false, unique = true, length = 50)
    val orderNumber: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,

    @JsonIgnore
    @OneToMany(mappedBy = "order", cascade = [CascadeType.ALL], orphanRemoval = true)
    val items: MutableList<OrderItem> = mutableListOf(),

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    var status: OrderStatus = OrderStatus.PENDING,

    @Column(nullable = false, precision = 10, scale = 2)
    val totalPrice: BigDecimal,

    @Column(nullable = false, length = 500)
    val shippingAddress: String,

    @Column(nullable = false, length = 100)
    val shippingCity: String,

    @Column(nullable = false, length = 20)
    val shippingPostalCode: String,

    @Column(length = 100)
    val shippingCountry: String = "Romania",

    @Column(nullable = false, length = 50)
    val paymentMethod: String,

    @Column(length = 1000)
    val notes: String? = null,

    @Column(nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(nullable = false)
    val updatedAt: LocalDateTime = LocalDateTime.now()
)