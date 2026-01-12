package com.ecommerce.ecommerceapp.repository

import com.ecommerce.ecommerceapp.entity.Category
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface CategoryRepository : JpaRepository<Category, Long> {

    fun findByName(name: String): Optional<Category>

    fun existsByName(name: String): Boolean

    fun findByNameContainingIgnoreCase(name: String): List<Category>
}