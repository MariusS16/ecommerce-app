package com.ecommerce.ecommerceapp.entity

import com.ecommerce.ecommerceapp.enums.NotificationType
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "notifications")
data class Notification(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,

    @Column(nullable = false, length = 200)
    val title: String,  // "Comanda ta a fost expediată!"

    @Column(nullable = false, columnDefinition = "TEXT")
    val message: String,  // "Comanda #ORD-2026-00001 a fost expediată și va ajunge în 2-3 zile."

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    val type: NotificationType,

    @Column(nullable = false)
    var isRead: Boolean = false,  // var - se poate marca ca citită

    @Column(length = 255)
    val actionUrl: String? = null,  // Link către comandă, produs, etc. (optional)

    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
)