package com.ecommerce.ecommerceapp.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(
    name = "wishlists",
    uniqueConstraints = [
        UniqueConstraint(columnNames = ["user_id", "product_id"])
    ]
)
data class Wishlist(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    val product: Product,

    @Column(nullable = false)
    val addedAt: LocalDateTime = LocalDateTime.now()
)