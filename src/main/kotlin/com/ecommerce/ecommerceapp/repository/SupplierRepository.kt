package com.ecommerce.ecommerceapp.repository

import com.ecommerce.ecommerceapp.entity.Supplier
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface SupplierRepository : JpaRepository<Supplier, Long> {

    fun findByName(name: String): Optional<Supplier>

    fun findByContactEmail(email: String): Optional<Supplier>

    fun existsByContactEmail(email: String): Boolean

    fun findByNameContainingIgnoreCase(name: String): List<Supplier>
}