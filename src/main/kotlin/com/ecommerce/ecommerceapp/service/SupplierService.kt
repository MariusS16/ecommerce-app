package com.ecommerce.ecommerceapp.service

import com.ecommerce.ecommerceapp.dto.supplier.CreateSupplierRequest
import com.ecommerce.ecommerceapp.dto.supplier.SupplierDTO
import com.ecommerce.ecommerceapp.dto.supplier.UpdateSupplierRequest
import com.ecommerce.ecommerceapp.mapper.SupplierMapper
import com.ecommerce.ecommerceapp.repository.SupplierRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class SupplierService(
    private val supplierRepository: SupplierRepository,
    private val supplierMapper: SupplierMapper
) {

    fun getAllSuppliers(): List<SupplierDTO> {
        val suppliers = supplierRepository.findAll()
        return supplierMapper.toDTOList(suppliers)
    }

    fun getSupplierById(id: Long): SupplierDTO {
        val supplier = supplierRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Supplier with id $id not found") }

        return supplierMapper.toDTO(supplier)
    }

    fun createSupplier(request: CreateSupplierRequest): SupplierDTO {
        if (supplierRepository.existsByContactEmail(request.contactEmail)) {
            throw IllegalArgumentException("Supplier with email '${request.contactEmail}' already exists")
        }

        val supplier = supplierMapper.toEntity(request)
        val savedSupplier = supplierRepository.save(supplier)

        return supplierMapper.toDTO(savedSupplier)
    }

    fun updateSupplier(id: Long, request: UpdateSupplierRequest): SupplierDTO {
        val supplier = supplierRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Supplier with id $id not found") }

        if (request.contactEmail != null && request.contactEmail != supplier.contactEmail) {
            if (supplierRepository.existsByContactEmail(request.contactEmail)) {
                throw IllegalArgumentException("Supplier with email '${request.contactEmail}' already exists")
            }
        }

        val updatedSupplier = supplier.copy(
            name = request.name ?: supplier.name,
            contactEmail = request.contactEmail ?: supplier.contactEmail,
            contactPhone = request.contactPhone ?: supplier.contactPhone,
            website = request.website ?: supplier.website,
            address = request.address ?: supplier.address
        )

        val savedSupplier = supplierRepository.save(updatedSupplier)
        return supplierMapper.toDTO(savedSupplier)
    }

    fun deleteSupplier(id: Long) {
        if (!supplierRepository.existsById(id)) {
            throw IllegalArgumentException("Supplier with id $id not found")
        }
        supplierRepository.deleteById(id)
    }
}