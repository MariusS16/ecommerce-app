package com.ecommerce.ecommerceapp.controller

import com.ecommerce.ecommerceapp.dto.feedback.CreateFeedbackRequest
import com.ecommerce.ecommerceapp.dto.feedback.FeedbackDTO
import com.ecommerce.ecommerceapp.entity.User
import com.ecommerce.ecommerceapp.service.FeedbackService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/feedback")
class FeedbackController(
    private val feedbackService: FeedbackService
) {

    // POST /api/feedback — public
    @PostMapping
    fun submitFeedback(
        @AuthenticationPrincipal user: User,
        @Valid @RequestBody request: CreateFeedbackRequest
    ): ResponseEntity<FeedbackDTO> {
        val feedback = feedbackService.submitFeedback(request, user)
        return ResponseEntity.status(HttpStatus.CREATED).body(feedback)
    }

    // GET /api/feedback — ADMIN only
    @GetMapping
    fun getAllFeedback(): ResponseEntity<List<FeedbackDTO>> {
        val feedbacks = feedbackService.getAllFeedback()
        return ResponseEntity.ok(feedbacks)
    }
}