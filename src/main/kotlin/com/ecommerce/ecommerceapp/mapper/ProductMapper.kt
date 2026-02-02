package com.ecommerce.ecommerceapp.mapper

import com.ecommerce.ecommerceapp.dto.product.CreateProductRequest
import com.ecommerce.ecommerceapp.dto.product.ProductDTO
import com.ecommerce.ecommerceapp.entity.Category
import com.ecommerce.ecommerceapp.entity.Product
import com.ecommerce.ecommerceapp.entity.Supplier
import org.springframework.stereotype.Component
import java.time.LocalDateTime

@Component
class ProductMapper(
    private val categoryMapper: CategoryMapper,   // Reuse existing mappers!
    private val supplierMapper: SupplierMapper
) {

    // Entity → DTO (uses CategoryMapper and SupplierMapper internally)
    fun toDTO(product: Product): ProductDTO {
        return ProductDTO(
            id = product.id,
            name = product.name,
            description = product.description,
            price = product.price,
            stock = product.stock,
            imageUrl = product.imageUrl,
            category = categoryMapper.toDTO(product.category),
            supplier = supplierMapper.toDTO(product.supplier),
            isActive = product.isActive,
            createdAt = product.createdAt,
            updatedAt = product.updatedAt
        )
    }

    // CreateRequest → Entity (needs Category and Supplier objects)
    fun toEntity(request: CreateProductRequest, category: Category, supplier: Supplier): Product {
        return Product(
            name = request.name,
            description = request.description,
            price = request.price,
            stock = request.stock,
            imageUrl = request.imageUrl,
            category = category,
            supplier = supplier,
            isActive = true,
            createdAt = LocalDateTime.now(),
            updatedAt = LocalDateTime.now()
        )
    }

    // List<Entity> → List<DTO>
    fun toDTOList(products: List<Product>): List<ProductDTO> {
        return products.map { toDTO(it) }
    }
}