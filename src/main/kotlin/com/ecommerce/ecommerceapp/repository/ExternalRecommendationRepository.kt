package com.ecommerce.ecommerceapp.repository

import com.ecommerce.ecommerceapp.entity.ExternalRecommendation
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.time.LocalDateTime
import java.util.Optional

@Repository
interface ExternalRecommendationRepository : JpaRepository<ExternalRecommendation, Long> {

    // Găsește cache după search query
    fun findBySearchQuery(searchQuery: String): Optional<ExternalRecommendation>

    // Găsește cache-uri după platforma
    fun findByPlatform(platform: String): List<ExternalRecommendation>

    // Query custom: Gssește cache VALID (nu expirat)
    @Query("SELECT er FROM ExternalRecommendation er WHERE " +
            "er.searchQuery = :query AND er.expiresAt > :now")
    fun findValidCacheByQuery(
        @Param("query") query: String,
        @Param("now") now: LocalDateTime
    ): Optional<ExternalRecommendation>

    // Șterge cache-uri expirate (cleanup job)
    fun deleteByExpiresAtBefore(expiresAt: LocalDateTime)

    // Find recommendations that are still valid (not expired)
    fun findBySearchQueryAndExpiresAtAfter(
        searchQuery: String,
        currentTime: LocalDateTime
    ): List<ExternalRecommendation>
}