package com.ecommerce.ecommerceapp.controller

import com.ecommerce.ecommerceapp.dto.supplier.CreateSupplierRequest
import com.ecommerce.ecommerceapp.dto.supplier.SupplierDTO
import com.ecommerce.ecommerceapp.dto.supplier.UpdateSupplierRequest
import com.ecommerce.ecommerceapp.service.SupplierService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/suppliers")
class SupplierController(
    private val supplierService: SupplierService
) {

    @GetMapping
    fun getAllSuppliers(): ResponseEntity<List<SupplierDTO>> {
        val suppliers = supplierService.getAllSuppliers()
        return ResponseEntity.ok(suppliers)
    }

    @GetMapping("/{id}")
    fun getSupplierById(@PathVariable id: Long): ResponseEntity<SupplierDTO> {
        val supplier = supplierService.getSupplierById(id)
        return ResponseEntity.ok(supplier)
    }

    @PostMapping
    fun createSupplier(
        @Valid @RequestBody request: CreateSupplierRequest
    ): ResponseEntity<SupplierDTO> {
        val supplier = supplierService.createSupplier(request)
        return ResponseEntity.status(HttpStatus.CREATED).body(supplier)
    }

    @PutMapping("/{id}")
    fun updateSupplier(
        @PathVariable id: Long,
        @Valid @RequestBody request: UpdateSupplierRequest
    ): ResponseEntity<SupplierDTO> {
        val supplier = supplierService.updateSupplier(id, request)
        return ResponseEntity.ok(supplier)
    }

    @DeleteMapping("/{id}")
    fun deleteSupplier(@PathVariable id: Long): ResponseEntity<Void> {
        supplierService.deleteSupplier(id)
        return ResponseEntity.noContent().build()
    }
}