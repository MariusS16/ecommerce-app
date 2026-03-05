package com.ecommerce.ecommerceapp.service

import com.ecommerce.ecommerceapp.ai.AIProvider
import com.ecommerce.ecommerceapp.dto.product.ProductDTO
import com.ecommerce.ecommerceapp.dto.recommendation.ExternalProductDTO
import com.ecommerce.ecommerceapp.dto.recommendation.RecommendationDTO
import com.ecommerce.ecommerceapp.entity.ExternalRecommendation
import com.ecommerce.ecommerceapp.mapper.ProductMapper
import com.ecommerce.ecommerceapp.repository.ExternalRecommendationRepository
import com.ecommerce.ecommerceapp.repository.ProductRepository
import com.google.gson.Gson
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal
import java.math.RoundingMode
import java.time.LocalDateTime
import com.google.gson.GsonBuilder
import com.google.gson.JsonDeserializationContext
import com.google.gson.JsonDeserializer
import com.google.gson.JsonElement
import com.google.gson.JsonPrimitive
import com.google.gson.JsonSerializationContext
import com.google.gson.JsonSerializer
import java.lang.reflect.Type

@Service
@Transactional
class RecommendationService(
    private val aiProvider: AIProvider,  // ← Injected based on configuration!
    private val productRepository: ProductRepository,
    private val externalRecommendationRepository: ExternalRecommendationRepository,
    private val productMapper: ProductMapper
) {

    private val logger = LoggerFactory.getLogger(RecommendationService::class.java)
    // Gson with LocalDateTime support
    private val gson = GsonBuilder()
        .registerTypeAdapter(LocalDateTime::class.java, object : JsonSerializer<LocalDateTime> {
            override fun serialize(
                src: LocalDateTime?,
                typeOfSrc: Type?,
                context: JsonSerializationContext?
            ): JsonElement {
                return JsonPrimitive(src?.toString())
            }
        })
        .registerTypeAdapter(LocalDateTime::class.java, object : JsonDeserializer<LocalDateTime> {
            override fun deserialize(
                json: JsonElement?,
                typeOfT: Type?,
                context: JsonDeserializationContext?
            ): LocalDateTime {
                return LocalDateTime.parse(json?.asString)
            }
        })
        .create()

    /**
     * Get product recommendations based on search query
     * Compares internal catalog with external platforms
     */
    fun getRecommendations(query: String): RecommendationDTO {
        logger.info("Getting recommendations for query: '$query'")

        // Step 1: Check cache (avoid unnecessary AI calls)
        val cachedRecommendation = getCachedRecommendation(query)
        if (cachedRecommendation != null) {
            logger.info("Returning cached recommendation for query: '$query'")
            return cachedRecommendation
        }

        // Step 2: Search internal catalog
        val internalProducts = productRepository.searchByName(query)
        logger.info("Found ${internalProducts.size} internal products")

        // Step 3: Call AI to search external platforms
        val aiResult = aiProvider.searchExternalProducts(query, internalProducts)
        logger.info("AI found ${aiResult.externalProducts.size} external products")

        // Step 4: Make recommendation decision
        val recommendation = makeDecision(internalProducts.map { productMapper.toDTO(it) }, aiResult)

        // Step 5: Cache the result
        cacheRecommendation(query, recommendation, aiResult)

        return recommendation
    }

    /**
     * Check if we have a cached recommendation (< 24 hours old)
     */
    private fun getCachedRecommendation(query: String): RecommendationDTO? {
        val cached = externalRecommendationRepository.findBySearchQueryAndExpiresAtAfter(
            searchQuery = query,
            currentTime = LocalDateTime.now()
        )

        if (cached.isEmpty()) return null

        // Use most recent cache entry
        val latest = cached.maxByOrNull { it.createdAt ?: LocalDateTime.MIN } ?: return null

        // Parse cached JSON back to DTO
        return try {
            gson.fromJson(latest.recommendationsJson, RecommendationDTO::class.java)
        } catch (e: Exception) {
            logger.warn("Failed to parse cached recommendation: ${e.message}")
            null
        }
    }

    /**
     * Cache recommendation for 24 hours
     */
    private fun cacheRecommendation(query: String, recommendation: RecommendationDTO, aiResult: com.ecommerce.ecommerceapp.ai.models.AISearchResult) {
        try {
            val recommendationJson = gson.toJson(recommendation)

            val cacheEntry = ExternalRecommendation(
                searchQuery = query,
                recommendationsJson = recommendationJson,
                platform = aiProvider.getProviderName(),
                createdAt = LocalDateTime.now(),
                expiresAt = LocalDateTime.now().plusHours(24)
            )

            externalRecommendationRepository.save(cacheEntry)
            logger.info("Cached recommendation for query: '$query'")
        } catch (e: Exception) {
            logger.error("Failed to cache recommendation: ${e.message}", e)
            // Don't fail the request if caching fails
        }
    }

    /**
     * Decision logic: Should we recommend internal or external products?
     */
    private fun makeDecision(
        internalProducts: List<ProductDTO>,
        aiResult: com.ecommerce.ecommerceapp.ai.models.AISearchResult
    ): RecommendationDTO {

        // Convert external products to DTOs with price comparison
        val externalProductDTOs = aiResult.externalProducts.map { external ->
            val cheapestInternal = internalProducts.minByOrNull { it.price }

            val priceDiff = if (cheapestInternal != null) {
                external.price.subtract(cheapestInternal.price)
            } else null

            val percentageDiff = if (cheapestInternal != null && cheapestInternal.price > BigDecimal.ZERO) {
                priceDiff!!.divide(cheapestInternal.price, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal(100))
                    .toDouble()
            } else null

            ExternalProductDTO(
                name = external.name,
                price = external.price,
                url = external.url,
                platform = external.platform,
                specs = external.specs,
                priceDifference = priceDiff,
                percentageDifference = percentageDiff
            )
        }

        // Decision logic
        val recommendationType = when {
            internalProducts.isEmpty() && externalProductDTOs.isEmpty() -> {
                // No products found anywhere
                "none"
            }
            internalProducts.isEmpty() -> {
                // Only external products available
                "external"
            }
            externalProductDTOs.isEmpty() -> {
                // Only internal products available
                "internal"
            }
            else -> {
                // Both available - compare prices
                val cheapestInternal = internalProducts.minByOrNull { it.price }!!
                val cheapestExternal = externalProductDTOs.minByOrNull { it.price }!!

                val priceDiffPercentage = cheapestExternal.price
                    .subtract(cheapestInternal.price)
                    .divide(cheapestInternal.price, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal(100))

                when {
                    priceDiffPercentage.toDouble() < -15.0 -> "external"  // External is >15% cheaper
                    priceDiffPercentage.toDouble() > 10.0 -> "internal"   // Internal is >10% cheaper
                    else -> "both"  // Prices are comparable, show both
                }
            }
        }

        val reasoning = buildReasoning(recommendationType, internalProducts, externalProductDTOs, aiResult.reasoning)

        return RecommendationDTO(
            recommendation = recommendationType,
            reasoning = reasoning,
            internalProducts = internalProducts,
            externalProducts = externalProductDTOs,
            query = aiResult.searchQuery
        )
    }

    /**
     * Build human-readable reasoning for the recommendation
     */
    private fun buildReasoning(
        recommendationType: String,
        internalProducts: List<ProductDTO>,
        externalProducts: List<ExternalProductDTO>,
        aiReasoning: String
    ): String {
        return when (recommendationType) {
            "internal" -> {
                "Recomandăm produsele noastre - avem cele mai bune prețuri și livrare rapidă."
            }
            "external" -> {
                "Recomandăm produse de pe platforme externe pentru cea mai bună valoare. $aiReasoning"
            }
            "both" -> {
                "Am găsit opțiuni bune atât în catalogul nostru cât și pe platforme externe. Compară prețurile și alege ce ți se potrivește cel mai bine. $aiReasoning"
            }
            else -> {
                "Nu am găsit produse potrivite pentru căutarea ta. Încearcă un alt termen de căutare."
            }
        }
    }
}
