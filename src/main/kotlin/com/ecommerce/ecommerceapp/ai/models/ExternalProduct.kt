package com.ecommerce.ecommerceapp.ai.models

import java.math.BigDecimal

/**
 * Represents a product found on external platforms (eMAG, Amazon, Altex, etc.)
 * This is the common format returned by ALL AI providers
 */
data class ExternalProduct(
    val name: String,              // Exact product name from external site
    val price: BigDecimal,         // Price in RON
    val url: String,               // Direct product URL
    val platform: String,          // "eMAG", "Amazon", "Altex", etc.
    val specs: String,             // Key specifications (e.g., "RTX 4060, 16GB RAM")
    val priceDifference: BigDecimal? = null  // Difference vs internal product (calculated later)
)