package com.ecommerce.ecommerceapp.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "cart_items")
data class CartItem(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    val cart: Cart,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    val product: Product,

    @Column(nullable = false)
    var quantity: Int = 1,

    @Column(nullable = false)
    val addedAt: LocalDateTime = LocalDateTime.now()
)