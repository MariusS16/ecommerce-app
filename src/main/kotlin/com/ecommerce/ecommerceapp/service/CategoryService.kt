package com.ecommerce.ecommerceapp.service

import com.ecommerce.ecommerceapp.dto.category.CategoryDTO
import com.ecommerce.ecommerceapp.dto.category.CreateCategoryRequest
import com.ecommerce.ecommerceapp.dto.category.UpdateCategoryRequest
import com.ecommerce.ecommerceapp.mapper.CategoryMapper
import com.ecommerce.ecommerceapp.repository.CategoryRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class CategoryService(
    private val categoryRepository: CategoryRepository,
    private val categoryMapper: CategoryMapper
) {

    fun createCategory(request: CreateCategoryRequest): CategoryDTO {
        if (categoryRepository.existsByName(request.name)) {
            throw IllegalArgumentException("Category with name '${request.name}' already exists")
        }

        val category = categoryMapper.toEntity(request)
        val savedCategory = categoryRepository.save(category)

        return categoryMapper.toDTO(savedCategory)
    }

    fun getAllCategories(): List<CategoryDTO> {
        val categories = categoryRepository.findAll()
        return categoryMapper.toDTOList(categories)
    }

    fun getCategoryById(id: Long): CategoryDTO {
        val category = categoryRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Category with id $id not found") }

        return categoryMapper.toDTO(category)
    }

    fun updateCategory(id: Long, request: UpdateCategoryRequest): CategoryDTO {
        val category = categoryRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Category with id $id not found") }

        if (request.name != null && request.name != category.name) {
            if (categoryRepository.existsByName(request.name)) {
                throw IllegalArgumentException("Category with name '${request.name}' already exists")
            }
        }

        val updatedCategory = category.copy(
            name = request.name ?: category.name,
            description = request.description ?: category.description,
            imageUrl = request.imageUrl ?: category.imageUrl
        )

        val savedCategory = categoryRepository.save(updatedCategory)
        return categoryMapper.toDTO(savedCategory)
    }

    fun deleteCategory(id: Long) {
        if (!categoryRepository.existsById(id)) {
            throw IllegalArgumentException("Category with id $id not found")
        }
        categoryRepository.deleteById(id)
    }
}