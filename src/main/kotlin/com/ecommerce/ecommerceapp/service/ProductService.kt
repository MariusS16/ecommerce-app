package com.ecommerce.ecommerceapp.service

import com.ecommerce.ecommerceapp.dto.product.CreateProductRequest
import com.ecommerce.ecommerceapp.dto.product.ProductDTO
import com.ecommerce.ecommerceapp.dto.product.UpdateProductRequest
import com.ecommerce.ecommerceapp.mapper.ProductMapper
import com.ecommerce.ecommerceapp.repository.CategoryRepository
import com.ecommerce.ecommerceapp.repository.ProductRepository
import com.ecommerce.ecommerceapp.repository.SupplierRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
@Transactional
class ProductService(
    private val productRepository: ProductRepository,
    private val categoryRepository: CategoryRepository,    // To verify category exists
    private val supplierRepository: SupplierRepository,    // To verify supplier exists
    private val productMapper: ProductMapper
) {

    // READ - Get all products
    fun getAllProducts(): List<ProductDTO> {
        val products = productRepository.findAll()
        return productMapper.toDTOList(products)
    }

    // READ - Get product by ID
    fun getProductById(id: Long): ProductDTO {
        val product = productRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Product with id $id not found") }

        return productMapper.toDTO(product)
    }

    // READ - Get products by category
    fun getProductsByCategory(categoryId: Long): List<ProductDTO> {
        val category = categoryRepository.findById(categoryId)
            .orElseThrow { IllegalArgumentException("Category with id $categoryId not found") }

        val products = productRepository.findByCategory(category)
        return productMapper.toDTOList(products)
    }

    // READ - Search products by name or description
    fun searchProducts(searchTerm: String): List<ProductDTO> {
        val products = productRepository.searchProducts(searchTerm)
        return productMapper.toDTOList(products)
    }

    // READ - Get only active products
    fun getActiveProducts(): List<ProductDTO> {
        val products = productRepository.findByIsActive(true)
        return productMapper.toDTOList(products)
    }

    fun createProduct(request: CreateProductRequest): ProductDTO {
        // Verify category exists
        val category = categoryRepository.findById(request.categoryId)
            .orElseThrow { IllegalArgumentException("Category with id ${request.categoryId} not found") }

        // Verify supplier exists
        val supplier = supplierRepository.findById(request.supplierId)
            .orElseThrow { IllegalArgumentException("Supplier with id ${request.supplierId} not found") }

        // Create product using mapper
        val product = productMapper.toEntity(request, category, supplier)
        val savedProduct = productRepository.save(product)

        return productMapper.toDTO(savedProduct)
    }

    fun updateProduct(id: Long, request: UpdateProductRequest): ProductDTO {
        val product = productRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Product with id $id not found") }

        // If categoryId is provided, verify it exists
        val category = if (request.categoryId != null) {
            categoryRepository.findById(request.categoryId)
                .orElseThrow { IllegalArgumentException("Category with id ${request.categoryId} not found") }
        } else {
            product.category
        }

        val supplier = if (request.supplierId != null) {
            supplierRepository.findById(request.supplierId)
                .orElseThrow { IllegalArgumentException("Supplier with id ${request.supplierId} not found") }
        } else {
            product.supplier
        }

        val updatedProduct = product.copy(
            name = request.name ?: product.name,
            description = request.description ?: product.description,
            price = request.price ?: product.price,
            stock = request.stock ?: product.stock,
            imageUrl = request.imageUrl ?: product.imageUrl,
            category = category,
            supplier = supplier,
            isActive = request.isActive ?: product.isActive,
            updatedAt = LocalDateTime.now()
        )

        val savedProduct = productRepository.save(updatedProduct)
        return productMapper.toDTO(savedProduct)
    }

    fun deleteProduct(id: Long) {
        if (!productRepository.existsById(id)) {
            throw IllegalArgumentException("Product with id $id not found")
        }
        productRepository.deleteById(id)
    }
}