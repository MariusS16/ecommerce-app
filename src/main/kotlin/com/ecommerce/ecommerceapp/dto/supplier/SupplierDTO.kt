package com.ecommerce.ecommerceapp.dto.supplier

import java.time.LocalDateTime

data class SupplierDTO(
    val id: Long?,
    val name: String,
    val contactEmail: String,
    val contactPhone: String?,
    val website: String?,
    val address: String?,
    val createdAt: LocalDateTime?
)