package com.ecommerce.ecommerceapp.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "feedbacks")
data class Feedback(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,

    // SELECT — reported problem category
    @Column(nullable = false, length = 100)
    val category: String,       // "Products", "Delivery", "Customer Support", "AI Recommendations", "Other"

    // RADIO — overall experience rating
    @Column(nullable = false, length = 50)
    val experience: String,     // "Excellent", "Good", "Satisfactory", "Poor"

    // CHECKBOXES — useful features (stored as comma-separated string)
    @Column(length = 500)
    val usefulFeatures: String?,  // e.g. "Search,AI Recommendations,Wishlist"

    // TEXT — free suggestions
    @Column(columnDefinition = "TEXT")
    val suggestions: String?,

    @Column(nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
)