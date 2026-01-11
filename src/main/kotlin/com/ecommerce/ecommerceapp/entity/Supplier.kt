package com.ecommerce.ecommerceapp.entity

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "suppliers")
data class Supplier(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false, length = 100)
    val name: String,

    @Column(nullable = false, unique = true, length = 100)
    val contactEmail: String,

    @Column(length = 20)
    val contactPhone: String? = null,

    @Column(length = 255)
    val website: String? = null,

    @Column(length = 500)
    val address: String? = null,

    @JsonIgnore
    @OneToMany(mappedBy = "supplier", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    val products: MutableList<Product> = mutableListOf(),

    @Column(nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
)