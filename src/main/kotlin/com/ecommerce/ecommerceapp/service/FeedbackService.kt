package com.ecommerce.ecommerceapp.service

import com.ecommerce.ecommerceapp.dto.feedback.CreateFeedbackRequest
import com.ecommerce.ecommerceapp.dto.feedback.FeedbackDTO
import com.ecommerce.ecommerceapp.entity.Feedback
import com.ecommerce.ecommerceapp.entity.User
import com.ecommerce.ecommerceapp.repository.FeedbackRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
@Transactional
class FeedbackService(
    private val feedbackRepository: FeedbackRepository
) {

    fun submitFeedback(request: CreateFeedbackRequest, user: User): FeedbackDTO {
        val feedback = Feedback(
            user = user,
            category = request.category,
            experience = request.experience,
            usefulFeatures = request.usefulFeatures
                .joinToString(",")
                .takeIf { it.isNotBlank() },
            suggestions = request.suggestions,
            createdAt = LocalDateTime.now()
        )
        val saved = feedbackRepository.save(feedback)
        return toDTO(saved)
    }

    fun getAllFeedback(): List<FeedbackDTO> {
        return feedbackRepository.findAllByOrderByCreatedAtDesc().map { toDTO(it) }
    }

    private fun toDTO(feedback: Feedback): FeedbackDTO {
        return FeedbackDTO(
            id = feedback.id,
            userId = feedback.user.id,
            userFullName = "${feedback.user.firstName} ${feedback.user.lastName}",
            userEmail = feedback.user.email,
            category = feedback.category,
            experience = feedback.experience,
            usefulFeatures = feedback.usefulFeatures
                ?.split(",")
                ?.filter { it.isNotBlank() }
                ?: emptyList(),
            suggestions = feedback.suggestions,
            createdAt = feedback.createdAt
        )
    }
}