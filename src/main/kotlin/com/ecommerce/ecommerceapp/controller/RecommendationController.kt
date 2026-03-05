package com.ecommerce.ecommerceapp.controller

import com.ecommerce.ecommerceapp.dto.recommendation.RecommendationDTO
import com.ecommerce.ecommerceapp.service.RecommendationService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

/**
 * REST Controller for AI-powered product recommendations
 *
 * Endpoints:
 * - POST /api/recommendations/search - Search and get recommendations
 */
@RestController
@RequestMapping("/api/recommendations")
class RecommendationController(
    private val recommendationService: RecommendationService
) {

    /**
     * Search for products and get AI-powered recommendations
     *
     * Example:
     * POST /api/recommendations/search?query=laptop gaming
     *
     * Returns:
     * - Internal products from our catalog
     * - External products from eMAG/Amazon/Altex
     * - Recommendation on which to choose
     * - AI reasoning for the recommendation
     */
    @PostMapping("/search")
    fun searchRecommendations(
        @RequestParam query: String
    ): ResponseEntity<RecommendationDTO> {

        // Validate query
        if (query.isBlank()) {
            throw IllegalArgumentException("Search query cannot be empty")
        }

        if (query.length < 3) {
            throw IllegalArgumentException("Search query must be at least 3 characters")
        }

        // Get recommendations
        val recommendations = recommendationService.getRecommendations(query)

        return ResponseEntity.ok(recommendations)
    }
}