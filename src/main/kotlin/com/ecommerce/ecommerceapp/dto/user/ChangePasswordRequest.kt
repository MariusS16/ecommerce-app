package com.ecommerce.ecommerceapp.dto.user

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class ChangePasswordRequest(
    @field:NotBlank(message = "Parola curentă este obligatorie")
    val currentPassword: String,

    @field:NotBlank(message = "Parola nouă este obligatorie")
    @field:Size(min = 6, max = 100, message = "Parola nouă trebuie să aibă între 6 și 100 de caractere")
    val newPassword: String
)