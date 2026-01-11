package com.ecommerce.ecommerceapp.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "external_recommendations")
data class ExternalRecommendation(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false, length = 500)
    val searchQuery: String,  // Query-ul utilizatorului

    @Column(nullable = false, columnDefinition = "TEXT")
    val recommendationsJson: String,  // JSON cu rezultatele de la AI

    @Column(nullable = false, length = 50)
    val platform: String,  // "eMAG", "Amazon", "Altex", "Multiple"

    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(nullable = false)
    val expiresAt: LocalDateTime = LocalDateTime.now().plusDays(1)  // Expiră după 24h
)