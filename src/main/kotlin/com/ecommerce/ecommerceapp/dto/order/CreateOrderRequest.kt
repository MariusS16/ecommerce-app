package com.ecommerce.ecommerceapp.dto.order

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class CreateOrderRequest(
    // Shipping address
    @field:NotBlank(message = "Shipping address is required")
    @field:Size(max = 255, message = "Address must be less than 255 characters")
    val shippingAddress: String,

    @field:NotBlank(message = "City is required")
    @field:Size(max = 100, message = "City must be less than 100 characters")
    val shippingCity: String,

    @field:NotBlank(message = "Postal code is required")
    @field:Size(max = 20, message = "Postal code must be less than 20 characters")
    val shippingPostalCode: String,

    @field:NotBlank(message = "Country is required")
    @field:Size(max = 100, message = "Country must be less than 100 characters")
    val shippingCountry: String,

    // Payment method
    @field:NotBlank(message = "Payment method is required")
    @field:Size(max = 50, message = "Payment method must be less than 50 characters")
    val paymentMethod: String,  // e.g., "Credit Card", "PayPal", "Cash on Delivery"

    // Optional notes
    @field:Size(max = 500, message = "Notes must be less than 500 characters")
    val notes: String? = null
)