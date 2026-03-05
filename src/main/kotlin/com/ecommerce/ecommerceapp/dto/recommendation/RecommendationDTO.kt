package com.ecommerce.ecommerceapp.dto.recommendation

import com.ecommerce.ecommerceapp.dto.product.ProductDTO
import java.math.BigDecimal

/**
 * Response DTO for recommendation endpoint
 * Contains both internal and external product recommendations
 */
data class RecommendationDTO(
    val recommendation: String,              // "internal", "external", or "both"
    val reasoning: String,                   // AI's explanation
    val internalProducts: List<ProductDTO>, // Products from our catalog
    val externalProducts: List<ExternalProductDTO>, // Products from external sites
    val query: String                        // Original search query
)

/**
 * External product in recommendation response
 */
data class ExternalProductDTO(
    val name: String,
    val price: BigDecimal,
    val url: String,
    val platform: String,
    val specs: String,
    val priceDifference: BigDecimal?,        // Difference vs cheapest internal product
    val percentageDifference: Double?        // % difference vs internal
)
