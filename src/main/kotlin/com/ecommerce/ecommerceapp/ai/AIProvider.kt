package com.ecommerce.ecommerceapp.ai

import com.ecommerce.ecommerceapp.ai.models.AISearchResult
import com.ecommerce.ecommerceapp.entity.Product

/**
 * Interface for AI providers (Gemini, Perplexity, etc.)
 *
 * Any AI provider MUST implement this interface to be used in the system.
 * This allows easy switching between providers without changing business logic.
 *
 * Design Pattern: Strategy Pattern
 * Benefit: Swap AI providers by changing one line in configuration
 */
interface AIProvider {

    /**
     * Search for products on external platforms and compare with internal catalog
     *
     * @param query User's search query (e.g., "laptop gaming RTX 4060")
     * @param internalProducts Products from our internal catalog matching the query
     * @return AISearchResult containing external products and reasoning
     */
    fun searchExternalProducts(
        query: String,
        internalProducts: List<Product>
    ): AISearchResult

    /**
     * Get the name of this AI provider (for logging/debugging)
     */
    fun getProviderName(): String
}