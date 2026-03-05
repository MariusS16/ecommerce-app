package com.ecommerce.ecommerceapp.ai.models

/**
 * Result returned by AI providers after searching external platforms
 * Contains list of external products found and AI's reasoning
 */
data class AISearchResult(
    val externalProducts: List<ExternalProduct>,  // Products found on external sites
    val reasoning: String,                         // AI's explanation of search results
    val searchQuery: String                        // Original query (for caching)
)