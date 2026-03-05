package com.ecommerce.ecommerceapp.config

import com.ecommerce.ecommerceapp.ai.AIProvider
import com.ecommerce.ecommerceapp.ai.providers.PerplexityProvider
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

/**
 * Spring Configuration for AI Provider
 * Currently using Perplexity API for product search
 */
@Configuration
class AIConfig {

    @Value("\${perplexity.api.key}")
    private lateinit var perplexityApiKey: String

    /**
     * Create Perplexity AI Provider bean
     * Optimized for e-commerce product search with real-time web search
     */
    @Bean
    fun aiProvider(): AIProvider {
        println("✅ Initializing Perplexity AI Provider (sonar-pro)")
        return PerplexityProvider(perplexityApiKey)
    }
}