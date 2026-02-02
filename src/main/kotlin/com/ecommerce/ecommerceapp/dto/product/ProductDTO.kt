package com.ecommerce.ecommerceapp.dto.product

import com.ecommerce.ecommerceapp.dto.category.CategoryDTO
import com.ecommerce.ecommerceapp.dto.supplier.SupplierDTO
import java.math.BigDecimal
import java.time.LocalDateTime

data class ProductDTO(
    val id: Long?,
    val name: String,
    val description: String?,
    val price: BigDecimal,
    val stock: Int,
    val imageUrl: String?,
    val category: CategoryDTO,      // Full category details in response
    val supplier: SupplierDTO,      // Full supplier details in response
    val isActive: Boolean,
    val createdAt: LocalDateTime?,
    val updatedAt: LocalDateTime?
)