package com.ecommerce.ecommerceapp.entity

import com.ecommerce.ecommerceapp.enums.Role
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "users")
data class User(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false, length = 50)
    val firstName: String,

    @Column(nullable = false, length = 50)
    val lastName: String,

    @Column(nullable = false, unique = true, length = 100)
    val email: String,

    @Column(nullable = false)
    val password: String,

    @Column(length = 20)
    val phoneNumber: String? = null,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    val role: Role = Role.USER,

    @Column(nullable = false)
    val isEmailConfirmed: Boolean = false,

    @Column(length = 255)
    val emailConfirmationToken: String? = null,

    @Column(nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(nullable = false)
    val updatedAt: LocalDateTime = LocalDateTime.now()
)