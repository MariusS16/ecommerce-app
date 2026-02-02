package com.ecommerce.ecommerceapp.controller

import com.ecommerce.ecommerceapp.dto.product.CreateProductRequest
import com.ecommerce.ecommerceapp.dto.product.ProductDTO
import com.ecommerce.ecommerceapp.dto.product.UpdateProductRequest
import com.ecommerce.ecommerceapp.service.ProductService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/products")
class ProductController(
    private val productService: ProductService
) {

    @GetMapping
    fun getAllProducts(): ResponseEntity<List<ProductDTO>> {
        val products = productService.getAllProducts()
        return ResponseEntity.ok(products)
    }

    @GetMapping("/{id}")
    fun getProductById(@PathVariable id: Long): ResponseEntity<ProductDTO> {
        val product = productService.getProductById(id)
        return ResponseEntity.ok(product)
    }

    @GetMapping("/category/{categoryId}")
    fun getProductsByCategory(@PathVariable categoryId: Long): ResponseEntity<List<ProductDTO>> {
        val products = productService.getProductsByCategory(categoryId)
        return ResponseEntity.ok(products)
    }

    // GET /api/products/search?term=laptop - Search products
    @GetMapping("/search")
    fun searchProducts(@RequestParam("term") term: String): ResponseEntity<List<ProductDTO>> {
        val products = productService.searchProducts(term)
        return ResponseEntity.ok(products)
    }

    @GetMapping("/active")
    fun getActiveProducts(): ResponseEntity<List<ProductDTO>> {
        val products = productService.getActiveProducts()
        return ResponseEntity.ok(products)
    }

    @PostMapping
    fun createProduct(
        @Valid @RequestBody request: CreateProductRequest
    ): ResponseEntity<ProductDTO> {
        val product = productService.createProduct(request)
        return ResponseEntity.status(HttpStatus.CREATED).body(product)
    }

    @PutMapping("/{id}")
    fun updateProduct(
        @PathVariable id: Long,
        @Valid @RequestBody request: UpdateProductRequest
    ): ResponseEntity<ProductDTO> {
        val product = productService.updateProduct(id, request)
        return ResponseEntity.ok(product)
    }

    @DeleteMapping("/{id}")
    fun deleteProduct(@PathVariable id: Long): ResponseEntity<Void> {
        productService.deleteProduct(id)
        return ResponseEntity.noContent().build()
    }
}