package com.ecommerce.ecommerceapp.repository

import com.ecommerce.ecommerceapp.entity.Feedback
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface FeedbackRepository : JpaRepository<Feedback, Long> {
    fun findAllByOrderByCreatedAtDesc(): List<Feedback>
}