package com.ecommerce.ecommerceapp.ai.providers

import com.ecommerce.ecommerceapp.ai.AIProvider
import com.ecommerce.ecommerceapp.ai.models.AISearchResult
import com.ecommerce.ecommerceapp.ai.models.ExternalProduct
import com.ecommerce.ecommerceapp.entity.Product
import com.google.gson.Gson
import com.google.gson.JsonArray
import com.google.gson.JsonObject
import org.slf4j.LoggerFactory
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.MediaType
import org.springframework.web.client.RestTemplate
import java.math.BigDecimal

/**
 * Perplexity AI Provider - Two-Phase Approach for Reliable Product Search
 *
 * APPROACH:
 * Phase 1: Call Perplexity → get real search_results URLs + AI product info
 * Phase 2: Feed those REAL URLs back to AI → ask it to match products to specific URLs
 *
 * This avoids hallucinated URLs completely:
 * - Phase 1 gets real URLs from search_results
 * - Phase 2 AI picks from the real URL list (can't hallucinate from a given list)
 *
 * URL ASSIGNMENT RULES (no S3 fallback with wrong URLs):
 * S1: searchResultIndex matches → use that URL if it's a product page
 * S2: Domain match → find any search_result URL from the correct platform
 * S3: REMOVED — skip product rather than return wrong URL
 */
class PerplexityProvider(
    private val apiKey: String
) : AIProvider {

    private val logger = LoggerFactory.getLogger(PerplexityProvider::class.java)
    private val gson = Gson()
    private val restTemplate = RestTemplate()

    private val apiEndpoint = "https://api.perplexity.ai/chat/completions"

    // Romanian platforms in priority order
    private val romanianDomains = listOf("emag.ro", "altex.ro", "flanco.ro")
    private val fallbackDomain  = "aliexpress.com"

    data class SearchResult(val title: String, val url: String, val snippet: String, val date: String?)

    override fun searchExternalProducts(
        query: String,
        internalProducts: List<Product>
    ): AISearchResult {
        logger.info("🔍 Searching external products for query: '$query'")

        return try {
            // ── PHASE 1: Search Romanian platforms ────────────────────────────
            val phase1Body = buildPhase1Request(query, internalProducts, useRomanianDomains = true)
            val phase1Response = callApi(phase1Body)

            var searchResults = extractSearchResults(phase1Response)
            logger.info("🔗 Real URLs from search_results (${searchResults.size}):")
            searchResults.forEachIndexed { i, sr ->
                logger.info("  [$i] ${sr.url}")
                logger.info("      title: ${sr.title.take(60)}")
            }

            // ── FALLBACK: Nothing on Romanian sites → try AliExpress ──────────
            if (searchResults.isEmpty()) {
                logger.warn("⚠️ No Romanian results — trying AliExpress fallback")
                val fallbackBody = buildPhase1Request(query, internalProducts, useRomanianDomains = false)
                val fallbackResponse = callApi(fallbackBody)
                searchResults = extractSearchResults(fallbackResponse)
                logger.info("🔗 AliExpress fallback results: ${searchResults.size}")
            }

            if (searchResults.isEmpty()) {
                logger.warn("⚠️ No results from any platform")
                return emptyResult(query)
            }

            // ── PHASE 2: Ask AI to match products to specific real URLs ────────
            val phase2Body = buildPhase2Request(query, internalProducts, searchResults)
            val phase2Response = callApi(phase2Body)

            val responseText = extractTextFromResponse(phase2Response)
            logger.info("📥 Phase 2 AI text: ${responseText.take(600)}...")

            val result = parseProducts(responseText, query, searchResults)
            logger.info("✅ Final: ${result.externalProducts.size} products with verified URLs")
            result

        } catch (e: Exception) {
            logger.error("❌ Perplexity API error: ${e.message}", e)
            AISearchResult(
                externalProducts = emptyList(),
                reasoning = "Search unavailable: ${e.message}",
                searchQuery = query
            )
        }
    }

    override fun getProviderName(): String = "Perplexity (sonar)"

    // ─────────────────────────────────────────────────────────────────────────
    // PHASE 1: Initial search
    // ─────────────────────────────────────────────────────────────────────────

    private fun buildPhase1Request(
        query: String,
        internalProducts: List<Product>,
        useRomanianDomains: Boolean
    ): String {
        val internalText = if (internalProducts.isNotEmpty()) {
            internalProducts.joinToString("\n") { "- ${it.name}: ${it.price} RON" }
        } else "No internal products found"

        val enrichedQuery = if (useRomanianDomains)
            "$query pret RON cumpara"
        else
            "$query buy online price"

        val domains = if (useRomanianDomains) romanianDomains else listOf(fallbackDomain)
        val platformNames = if (useRomanianDomains) "eMAG, Altex, Flanco" else "AliExpress"

        return buildRequestJson(
            systemMsg = """
You are a product search assistant for a Romanian e-commerce platform.
Find products matching the user's query on $platformNames.
Return ONLY valid JSON. Do NOT include any URLs in your response.
Extract: product name, price in RON (numeric), platform name, and specifications.
Use searchResultIndex (0-based) to reference which search result the product came from.
""".trimIndent(),
            userMsg = """
PLATFORM CONTEXT: Romanian e-commerce, eMAG partnership (prioritize eMAG).

INTERNAL CATALOG (for price comparison):
$internalText

TASK: Search for "$enrichedQuery". Find TOP 3 products from $platformNames.

For each product, provide:
- name: exact product name
- price: numeric RON value only
- platform: platform name (e.g. "eMAG", "Altex", "Flanco", "AliExpress")
- specs: brief key specifications
- searchResultIndex: 0-based index of the search result this product came from

DO NOT include URLs — only name, price, platform, specs, searchResultIndex.
Prioritize eMAG when prices are within 10%.

OUTPUT (strict JSON only, no markdown):
{
  "externalProducts": [
    {
      "name": "Product name",
      "price": 1299.99,
      "platform": "eMAG",
      "specs": "Brief specs",
      "searchResultIndex": 0
    }
  ],
  "reasoning": "Brief explanation"
}
""".trimIndent(),
            domains = domains,
            query = enrichedQuery
        )
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PHASE 2: Match products to real URLs
    // ─────────────────────────────────────────────────────────────────────────

    private fun buildPhase2Request(
        query: String,
        internalProducts: List<Product>,
        searchResults: List<SearchResult>
    ): String {
        val internalText = if (internalProducts.isNotEmpty()) {
            internalProducts.joinToString("\n") { "- ${it.name}: ${it.price} RON" }
        } else "No internal products found"

        val urlList = searchResults.mapIndexed { i, sr ->
            "[$i] ${sr.url} — ${sr.title.take(80)}"
        }.joinToString("\n")

        return buildRequestJson(
            systemMsg = """
You are a product search assistant for a Romanian e-commerce platform.
You will be given a list of REAL verified URLs found on eMAG, Altex, Flanco, or AliExpress.
Your job is to find products matching the query and assign the MOST RELEVANT URL from the provided list.
Return ONLY valid JSON. Only use URLs from the provided list — do NOT invent any URLs.
""".trimIndent(),
            userMsg = """
QUERY: "$query"

INTERNAL CATALOG (for price comparison):
$internalText

REAL VERIFIED URLs found (choose from these only):
$urlList

TASK: Find TOP 3 products matching "$query" using the URLs above.
For each product:
- name: exact product name from the page at that URL
- price: current price in RON (numeric)
- platform: "eMAG", "Altex", "Flanco", or "AliExpress"
- specs: brief key specifications
- searchResultIndex: the index [N] from the list above that best matches this product

RULES:
- Only use searchResultIndex values from the list above
- Pick the MOST SPECIFIC URL for each product (prefer product pages over category pages)
- Different products should use different searchResultIndex when possible
- Prioritize eMAG results (partnership)
- If no matching URL exists for a product, omit that product

OUTPUT (strict JSON only, no markdown):
{
  "externalProducts": [
    {
      "name": "Product name",
      "price": 1299.99,
      "platform": "eMAG",
      "specs": "Brief specs",
      "searchResultIndex": 2
    }
  ],
  "reasoning": "Brief explanation"
}
""".trimIndent(),
            domains = emptyList(),
            query = query
        )
    }

    // ─────────────────────────────────────────────────────────────────────────
    // REQUEST / RESPONSE HELPERS
    // ─────────────────────────────────────────────────────────────────────────

    private fun buildRequestJson(
        systemMsg: String,
        userMsg: String,
        domains: List<String>,
        query: String
    ): String {
        return gson.toJson(JsonObject().apply {
            addProperty("model", "sonar")

            add("messages", JsonArray().apply {
                add(JsonObject().apply {
                    addProperty("role", "system")
                    addProperty("content", systemMsg)
                })
                add(JsonObject().apply {
                    addProperty("role", "user")
                    addProperty("content", userMsg)
                })
            })

            addProperty("temperature", 0.1)
            addProperty("max_tokens", 2000)
            addProperty("return_citations", true)

            // Domain filter as API parameter — only when domains are specified
            if (domains.isNotEmpty()) {
                add("search_domain_filter", JsonArray().apply {
                    domains.forEach { add(it) }
                })
            }

            // Romanian location context + high context size for product pages
            add("web_search_options", JsonObject().apply {
                add("user_location", JsonObject().apply {
                    addProperty("country", "RO")
                })
                addProperty("search_context_size", "high")
            })
        })
    }

    private fun callApi(requestBody: String): JsonObject {
        val headers = HttpHeaders().apply {
            contentType = MediaType.APPLICATION_JSON
            set("Authorization", "Bearer $apiKey")
        }
        val response = restTemplate.exchange(
            apiEndpoint,
            HttpMethod.POST,
            HttpEntity(requestBody, headers),
            String::class.java
        )
        return gson.fromJson(response.body ?: "{}", JsonObject::class.java)
    }

    /**
     * Extract search_results (real verified URLs with metadata).
     * Falls back to citations array if search_results not present.
     */
    private fun extractSearchResults(fullResponse: JsonObject): List<SearchResult> {
        val srArray = fullResponse.getAsJsonArray("search_results")
        if (srArray != null && srArray.size() > 0) {
            return srArray.mapNotNull { el ->
                try {
                    val obj = el.asJsonObject
                    val url = obj.get("url")?.asString?.takeIf { it.startsWith("http") } ?: return@mapNotNull null
                    SearchResult(
                        title   = obj.get("title")?.asString ?: "",
                        url     = url,
                        snippet = obj.get("snippet")?.asString ?: "",
                        date    = obj.get("date")?.asString
                    )
                } catch (e: Exception) { null }
            }
        }

        val citArray = fullResponse.getAsJsonArray("citations")
        if (citArray != null && citArray.size() > 0) {
            logger.warn("⚠️ search_results not found, using citations fallback")
            return citArray.mapNotNull { el ->
                val url = el.asString?.takeIf { it.startsWith("http") } ?: return@mapNotNull null
                SearchResult(title = "", url = url, snippet = "", date = null)
            }
        }

        return emptyList()
    }

    private fun extractTextFromResponse(fullResponse: JsonObject): String {
        return try {
            fullResponse.getAsJsonArray("choices")
                ?.get(0)?.asJsonObject
                ?.getAsJsonObject("message")
                ?.get("content")?.asString ?: ""
        } catch (e: Exception) {
            logger.error("Failed to extract text: ${e.message}")
            ""
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PRODUCT PARSING
    // ─────────────────────────────────────────────────────────────────────────

    private fun parseProducts(
        responseText: String,
        query: String,
        searchResults: List<SearchResult>
    ): AISearchResult {
        try {
            val jsonText = extractJsonFromText(
                responseText.replace("```json", "").replace("```", "").trim()
            )
            if (jsonText.isBlank()) return emptyResult(query)

            val jsonObject = gson.fromJson(jsonText, JsonObject::class.java)
            val productsArray = jsonObject.getAsJsonArray("externalProducts") ?: return emptyResult(query)

            val products = productsArray.mapNotNull { element ->
                try {
                    val obj     = element.asJsonObject
                    val name    = obj.get("name")?.takeIf { !it.isJsonNull }?.asString ?: return@mapNotNull null
                    val priceEl = obj.get("price")?.takeIf { !it.isJsonNull }           ?: return@mapNotNull null
                    val specs   = obj.get("specs")?.takeIf { !it.isJsonNull }?.asString ?: ""
                    val idx     = obj.get("searchResultIndex")?.takeIf { !it.isJsonNull }?.asInt

                    val price = parsePriceSafely(priceEl) ?: return@mapNotNull null

                    // Resolve URL — S1 (index) then S2 (domain match), NO S3 fallback
                    val url = resolveUrl(idx, obj.get("platform")?.asString, searchResults)
                    if (url == null) {
                        logger.warn("⚠️ No verified URL for '$name' — skipped")
                        return@mapNotNull null
                    }

                    // ✅ FIX: Extract platform FROM URL domain — reliable, not from AI text
                    val platform = platformFromUrl(url)
                        ?: obj.get("platform")?.takeIf { !it.isJsonNull }?.asString
                        ?: "Unknown"

                    logger.info("✅ '$name' | $price RON | $platform | $url")

                    ExternalProduct(name = name, price = price, url = url, platform = platform, specs = specs)

                } catch (e: Exception) {
                    logger.warn("⚠️ Skipping product entry: ${e.message}")
                    null
                }
            }.filterNotNull()

            val reasoning = jsonObject.get("reasoning")?.takeIf { !it.isJsonNull }?.asString
                ?: "Products found via search"

            return AISearchResult(
                externalProducts = products,
                reasoning        = reasoning,
                searchQuery      = query
            )

        } catch (e: Exception) {
            logger.error("❌ Parsing failed: ${e.message}", e)
            return emptyResult(query)
        }
    }

    /**
     * URL resolution — S1 (index) then S2 (domain match). No S3.
     */
    private fun resolveUrl(
        searchResultIndex: Int?,
        aiPlatform: String?,
        searchResults: List<SearchResult>
    ): String? {
        // S1: Direct index match
        if (searchResultIndex != null && searchResultIndex in searchResults.indices) {
            val url = searchResults[searchResultIndex].url
            if (url.startsWith("https://")) {
                logger.debug("🎯 S1 index[$searchResultIndex]: $url")
                return url
            }
        }

        // S2: Any URL from the correct platform domain
        val domain = aiPlatform?.let { platformToDomain(it) }
        if (domain != null) {
            val match = searchResults.firstOrNull { it.url.contains(domain) }
            if (match != null) {
                logger.debug("🎯 S2 domain($domain): ${match.url}")
                return match.url
            }
        }

        return null
    }

    // ─────────────────────────────────────────────────────────────────────────
    // UTILITIES
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * ✅ FIX: Extract platform name from URL domain — reliable vs trusting AI text.
     * e.g. "https://www.emag.ro/..." → "eMAG"
     */
    private fun platformFromUrl(url: String): String? = when {
        url.contains("emag.ro")        -> "eMAG"
        url.contains("altex.ro")       -> "Altex"
        url.contains("flanco.ro")      -> "Flanco"
        url.contains("aliexpress.com") -> "AliExpress"
        else                           -> null
    }

    private fun platformToDomain(platform: String): String? = when (platform.lowercase().trim()) {
        "emag", "emag.ro"              -> "emag.ro"
        "altex", "altex.ro"            -> "altex.ro"
        "flanco", "flanco.ro"          -> "flanco.ro"
        "aliexpress", "aliexpress.com" -> "aliexpress.com"
        else                           -> null
    }

    private fun parsePriceSafely(priceElement: com.google.gson.JsonElement): BigDecimal? {
        return try {
            when {
                priceElement.isJsonPrimitive && priceElement.asJsonPrimitive.isNumber ->
                    BigDecimal(priceElement.asDouble.toString())
                priceElement.isJsonPrimitive && priceElement.asJsonPrimitive.isString -> {
                    val raw = priceElement.asString
                        .replace(" RON", "").replace(" ron", "").trim()
                    val normalized = if (raw.contains(",")) raw.replace(".", "").replace(",", ".") else raw
                    BigDecimal(normalized)
                }
                else -> null
            }
        } catch (e: Exception) {
            logger.warn("Could not parse price: $priceElement")
            null
        }
    }

    private fun extractJsonFromText(text: String): String {
        val start = text.indexOf("{")
        val end   = text.lastIndexOf("}")
        return if (start >= 0 && end > start) text.substring(start, end + 1) else ""
    }

    private fun emptyResult(query: String) = AISearchResult(
        externalProducts = emptyList(),
        reasoning        = "No products found for this query.",
        searchQuery      = query
    )
}