package com.ecommerce.ecommerceapp.controller

import com.ecommerce.ecommerceapp.dto.user.ChangePasswordRequest
import com.ecommerce.ecommerceapp.dto.user.UpdateProfileRequest
import com.ecommerce.ecommerceapp.dto.user.UserProfileDTO
import com.ecommerce.ecommerceapp.entity.User
import com.ecommerce.ecommerceapp.service.UserService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/users")
class UserController(
    private val userService: UserService
) {

    // GET /api/users/me — date profil curent
    @GetMapping("/me")
    fun getProfile(
        @AuthenticationPrincipal user: User
    ): ResponseEntity<UserProfileDTO> {
        return ResponseEntity.ok(userService.getProfile(user))
    }

    // PUT /api/users/me — actualizare date personale
    @PutMapping("/me")
    fun updateProfile(
        @AuthenticationPrincipal user: User,
        @Valid @RequestBody request: UpdateProfileRequest
    ): ResponseEntity<UserProfileDTO> {
        val updated = userService.updateProfile(user, request)
        return ResponseEntity.ok(updated)
    }

    // PUT /api/users/me/password — schimbare parolă
    @PutMapping("/me/password")
    fun changePassword(
        @AuthenticationPrincipal user: User,
        @Valid @RequestBody request: ChangePasswordRequest
    ): ResponseEntity<Map<String, String>> {
        userService.changePassword(user, request)
        return ResponseEntity.ok(mapOf("message" to "Parola a fost schimbată cu succes"))
    }

    // GET /api/users/count — număr total useri (ADMIN only)
    @GetMapping("/count")
    fun getUsersCount(): ResponseEntity<Map<String, Long>> {
        val count = userService.getUsersCount()
        return ResponseEntity.ok(mapOf("count" to count))
    }
}