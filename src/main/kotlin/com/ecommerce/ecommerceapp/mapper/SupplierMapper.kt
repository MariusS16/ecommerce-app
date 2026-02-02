package com.ecommerce.ecommerceapp.mapper

import com.ecommerce.ecommerceapp.dto.supplier.CreateSupplierRequest
import com.ecommerce.ecommerceapp.dto.supplier.SupplierDTO
import com.ecommerce.ecommerceapp.entity.Supplier
import org.springframework.stereotype.Component
import java.time.LocalDateTime

@Component
class SupplierMapper {

    // Entity → DTO
    fun toDTO(supplier: Supplier): SupplierDTO {
        return SupplierDTO(
            id = supplier.id,
            name = supplier.name,
            contactEmail = supplier.contactEmail,
            contactPhone = supplier.contactPhone,
            website = supplier.website,
            address = supplier.address,
            createdAt = supplier.createdAt
        )
    }

    // CreateRequest → Entity
    fun toEntity(request: CreateSupplierRequest): Supplier {
        return Supplier(
            name = request.name,
            contactEmail = request.contactEmail,
            contactPhone = request.contactPhone,
            website = request.website,
            address = request.address,
            createdAt = LocalDateTime.now()
        )
    }

    // List<Entity> → List<DTO>
    fun toDTOList(suppliers: List<Supplier>): List<SupplierDTO> {
        return suppliers.map { toDTO(it) }
    }
}