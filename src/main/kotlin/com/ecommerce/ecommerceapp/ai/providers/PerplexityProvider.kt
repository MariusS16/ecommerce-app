package com.ecommerce.ecommerceapp.ai.providers

import com.ecommerce.ecommerceapp.ai.AIProvider
import com.ecommerce.ecommerceapp.ai.models.AISearchResult
import com.ecommerce.ecommerceapp.ai.models.ExternalProduct
import com.ecommerce.ecommerceapp.entity.Product
import com.google.gson.Gson
import com.google.gson.JsonObject
import org.slf4j.LoggerFactory
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.MediaType
import org.springframework.web.client.RestTemplate
import java.math.BigDecimal

/**
 * Perplexity AI Provider - Optimized for E-commerce Product Search
 *
 * Uses Perplexity's sonar-pro model with real-time web search capabilities.
 * Specialized for finding products on Romanian e-commerce platforms.
 *
 * Features:
 * - Real-time web search on eMAG, Altex, Amazon
 * - Direct product URLs extraction
 * - Current price information
 * - Partnership-aware recommendations (prioritizes eMAG)
 */
class PerplexityProvider(
    private val apiKey: String
) : AIProvider {

    private val logger = LoggerFactory.getLogger(PerplexityProvider::class.java)
    private val gson = Gson()
    private val restTemplate = RestTemplate()

    private val apiEndpoint = "https://api.perplexity.ai/chat/completions"

    override fun searchExternalProducts(
        query: String,
        internalProducts: List<Product>
    ): AISearchResult {
        logger.info("🔍 Searching external products with Perplexity for query: '$query'")

        return try {
            val prompt = buildPrompt(query, internalProducts)
            val requestBody = buildRequestBody(prompt)

            val headers = HttpHeaders().apply {
                contentType = MediaType.APPLICATION_JSON
                set("Authorization", "Bearer $apiKey")
            }

            val request = HttpEntity(requestBody, headers)

            logger.debug("📡 Calling Perplexity API...")

            val response = restTemplate.exchange(
                apiEndpoint,
                HttpMethod.POST,
                request,
                String::class.java
            )

            val responseText = extractTextFromResponse(response.body ?: "")
            logger.info("📥 Full AI Response: $responseText")
            logger.debug("📥 Response received: ${responseText.take(200)}...")

            val result = parseResponse(responseText, query)

            logger.info("✅ Found ${result.externalProducts.size} external products")
            result

        } catch (e: Exception) {
            logger.error("❌ Error calling Perplexity API: ${e.message}", e)
            AISearchResult(
                externalProducts = emptyList(),
                reasoning = "Search unavailable: ${e.message}",
                searchQuery = query
            )
        }
    }

    override fun getProviderName(): String = "Perplexity (sonar-pro)"

    /**
     * Build optimized request body for Perplexity API
     */
    private fun buildRequestBody(prompt: String): String {
        val requestJson = JsonObject().apply {
            addProperty("model", "sonar-pro")

            val messagesArray = com.google.gson.JsonArray().apply {
                val messageObj = JsonObject().apply {
                    addProperty("role", "user")
                    addProperty("content", prompt)
                }
                add(messageObj)
            }
            add("messages", messagesArray)

            // Optimized parameters for product search
            addProperty("temperature", 0.1)
            addProperty("max_tokens", 3000)
            addProperty("top_p", 0.9)
            addProperty("return_citations", true)
            addProperty("search_recency_filter", "month")

//            // Domain filtering - search ONLY on target platforms
//            val searchDomainFilter = com.google.gson.JsonArray().apply {
//                add("emag.ro")
//                add("altex.ro")
//                add("amazon.ro")
//            }
//            add("search_domain_filter", searchDomainFilter)
        }

        return gson.toJson(requestJson)
    }

    /**
     * Extract text content from Perplexity API response
     */
    private fun extractTextFromResponse(responseBody: String): String {
        try {
            val jsonResponse = gson.fromJson(responseBody, JsonObject::class.java)
            val choices = jsonResponse.getAsJsonArray("choices")

            if (choices != null && choices.size() > 0) {
                val firstChoice = choices[0].asJsonObject
                val message = firstChoice.getAsJsonObject("message")
                return message.get("content").asString
            }

            throw IllegalStateException("No content found in response")

        } catch (e: Exception) {
            logger.error("Failed to extract text from response: ${e.message}")
            throw e
        }
    }

    /**
     * Build optimized prompt for product search
     */
    private fun buildPrompt(query: String, internalProducts: List<Product>): String {
        val internalProductsText = if (internalProducts.isNotEmpty()) {
            internalProducts.joinToString("\n") { product ->
                "- ${product.name}: ${product.price} RON (Stock: ${product.stock})"
            }
        } else {
            "No matching products in internal catalog"
        }

        return """
Eu Vând Consola PlayStation 5 (PS5) Slim pentru 3100 RON (noua).

Cautați Consola PlayStation 5 (PS5) Slim pe emag.ro (PRIORITATE - avem parteneriat), amazon.ro, altex.ro .


Comparați: preț, specificații, recenzii, disponibilitate.


TREBUIE să includeți: numele exact al produsului, prețul în RON, URL direct !!, OPTIONAL url poza.


DECIZIE: Recomandați intern SAU extern (de preferință eMAG dacă este comparabil).


FORMAT: JSON cu argumentare.""".trimIndent()
    }

    /**
     * Parse AI response into structured result
     * Handles null values gracefully
     */
    private fun parseResponse(responseText: String, query: String): AISearchResult {
        try {
            logger.info("🔧 Parsing response for query: '$query'")

            val cleanedText = responseText
                .replace("```json", "")
                .replace("```", "")
                .trim()

            val jsonText = extractJsonFromText(cleanedText)
            logger.debug("Extracted JSON: $jsonText")

            val jsonObject = gson.fromJson(jsonText, JsonObject::class.java)

            val productsArray = jsonObject.getAsJsonArray("externalProducts")
            val externalProducts = productsArray?.mapNotNull { element ->
                try {
                    val productObj = element.asJsonObject

                    // Safe extraction with null checks
                    val name = productObj.get("name")?.takeIf { !it.isJsonNull }?.asString
                    val priceElement = productObj.get("price")?.takeIf { !it.isJsonNull }
                    val url = productObj.get("url")?.takeIf { !it.isJsonNull }?.asString
                    val platform = productObj.get("platform")?.takeIf { !it.isJsonNull }?.asString
                    val specs = productObj.get("specs")?.takeIf { !it.isJsonNull }?.asString ?: ""

                    // Skip product if essential fields are missing
                    if (name == null || priceElement == null || url == null || platform == null) {
                        logger.warn("⚠️ Skipping product with missing essential fields: name=$name, price=$priceElement, url=$url, platform=$platform")
                        return@mapNotNull null
                    }

                    // Parse price safely
                    val price = try {
                        when {
                            priceElement.isJsonPrimitive && priceElement.asJsonPrimitive.isNumber -> {
                                BigDecimal(priceElement.asDouble.toString())
                            }
                            priceElement.isJsonPrimitive && priceElement.asJsonPrimitive.isString -> {
                                // Try to parse price from string (e.g., "4299.99")
                                BigDecimal(priceElement.asString.replace(",", "").replace(" RON", ""))
                            }
                            else -> {
                                logger.warn("⚠️ Invalid price format: $priceElement")
                                return@mapNotNull null
                            }
                        }
                    } catch (e: Exception) {
                        logger.warn("⚠️ Failed to parse price: ${e.message}")
                        return@mapNotNull null
                    }

                    // Validate URL format
                    if (!url.startsWith("http")) {
                        logger.warn("⚠️ Invalid URL format: $url")
                        return@mapNotNull null
                    }

                    ExternalProduct(
                        name = name,
                        price = price,
                        url = url,
                        platform = platform,
                        specs = specs
                    )
                } catch (e: Exception) {
                    logger.warn("⚠️ Error parsing product: ${e.message}")
                    null
                }
            }?.filterNotNull() ?: emptyList()

            val reasoning = jsonObject.get("reasoning")
                ?.takeIf { !it.isJsonNull }
                ?.asString
                ?: "Products found via search"

            logger.info("✅ Successfully parsed ${externalProducts.size} valid products")

            return AISearchResult(
                externalProducts = externalProducts,
                reasoning = reasoning,
                searchQuery = query
            )

        } catch (e: Exception) {
            logger.error("❌ Error parsing response: ${e.message}", e)
            logger.debug("Response was: $responseText")

            return AISearchResult(
                externalProducts = emptyList(),
                reasoning = "Could not parse search results. Please try a different search term.",
                searchQuery = query
            )
        }
    }

    /**
     * Extract JSON object from text that might contain explanations
     */
    private fun extractJsonFromText(text: String): String {
        val jsonStart = text.indexOf("{")
        val jsonEnd = text.lastIndexOf("}")

        return if (jsonStart >= 0 && jsonEnd > jsonStart) {
            text.substring(jsonStart, jsonEnd + 1)
        } else {
            text
        }
    }
}