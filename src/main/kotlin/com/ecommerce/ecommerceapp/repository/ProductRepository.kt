package com.ecommerce.ecommerceapp.repository

import com.ecommerce.ecommerceapp.entity.Category
import com.ecommerce.ecommerceapp.entity.Product
import com.ecommerce.ecommerceapp.entity.Supplier
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.math.BigDecimal

@Repository
interface ProductRepository : JpaRepository<Product, Long> {

    fun findByCategory(category: Category): List<Product>

    fun findBySupplier(supplier: Supplier): List<Product>

    fun findByNameContainingIgnoreCase(name: String): List<Product>

    fun findByIsActive(isActive: Boolean): List<Product>

    fun findByCategoryAndIsActive(category: Category, isActive: Boolean): List<Product>

    fun findByStockGreaterThan(stock: Int): List<Product>

    fun findByPriceBetween(minPrice: BigDecimal, maxPrice: BigDecimal): List<Product>

    // Query custom: Căutare avansata (nume SAU descriere)
    @Query("SELECT p FROM Product p WHERE " +
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    fun searchProducts(@Param("searchTerm") searchTerm: String): List<Product>

    // Query custom: Produse populare (in stoc + active)
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.stock > 0 ORDER BY p.createdAt DESC")
    fun findPopularProducts(): List<Product>
}