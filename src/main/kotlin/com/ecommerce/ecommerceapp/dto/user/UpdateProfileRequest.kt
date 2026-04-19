package com.ecommerce.ecommerceapp.dto.user

import jakarta.validation.constraints.Size

data class UpdateProfileRequest(
    @field:Size(min = 2, max = 50, message = "Prenumele trebuie să aibă între 2 și 50 de caractere")
    val firstName: String? = null,

    @field:Size(min = 2, max = 50, message = "Numele trebuie să aibă între 2 și 50 de caractere")
    val lastName: String? = null,

    @field:Size(max = 20, message = "Numărul de telefon trebuie să aibă maxim 20 de caractere")
    val phoneNumber: String? = null
)