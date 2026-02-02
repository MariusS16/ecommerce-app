package com.ecommerce.ecommerceapp.mapper

import com.ecommerce.ecommerceapp.dto.category.CategoryDTO
import com.ecommerce.ecommerceapp.dto.category.CreateCategoryRequest
import com.ecommerce.ecommerceapp.entity.Category
import org.springframework.stereotype.Component
import java.time.LocalDateTime

@Component
class CategoryMapper {

    // Entity -> DTO
    fun toDTO(category: Category): CategoryDTO {
        return CategoryDTO(
            id = category.id,
            name = category.name,
            description = category.description,
            imageUrl = category.imageUrl,
            createdAt = category.createdAt
        )
    }

    // CreateRequest -> Entity
    fun toEntity(request: CreateCategoryRequest): Category {
        return Category(
            name = request.name,
            description = request.description,
            imageUrl = request.imageUrl,
            createdAt = LocalDateTime.now()
        )
    }

    // List<Entity> -> List<DTO>
    fun toDTOList(categories: List<Category>): List<CategoryDTO> {
        return categories.map { toDTO(it) }
    }
}