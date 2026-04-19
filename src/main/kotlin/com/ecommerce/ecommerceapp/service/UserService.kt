package com.ecommerce.ecommerceapp.service

import com.ecommerce.ecommerceapp.dto.user.ChangePasswordRequest
import com.ecommerce.ecommerceapp.dto.user.UpdateProfileRequest
import com.ecommerce.ecommerceapp.dto.user.UserProfileDTO
import com.ecommerce.ecommerceapp.entity.User
import com.ecommerce.ecommerceapp.repository.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
@Transactional
class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
) {

    // ── Citire profil ──
    fun getProfile(user: User): UserProfileDTO {
        return toDTO(user)
    }

    // ── Actualizare date personale ──
    fun updateProfile(user: User, request: UpdateProfileRequest): UserProfileDTO {
        val updated = user.copy(
            firstName   = request.firstName   ?: user.firstName,
            lastName    = request.lastName    ?: user.lastName,
            phoneNumber = request.phoneNumber ?: user.phoneNumber,
            updatedAt   = LocalDateTime.now()
        )
        val saved = userRepository.save(updated)
        return toDTO(saved)
    }

    // ── Schimbare parolă ──
    fun changePassword(user: User, request: ChangePasswordRequest) {
        // Verificăm parola curentă
        if (!passwordEncoder.matches(request.currentPassword, user.password)) {
            throw IllegalArgumentException("Parola curentă este incorectă")
        }

        // Verificăm că noua parolă e diferită
        if (passwordEncoder.matches(request.newPassword, user.password)) {
            throw IllegalArgumentException("Parola nouă trebuie să fie diferită de cea actuală")
        }

        val updated = user.copy(
            password  = passwordEncoder.encode(request.newPassword)
                ?: throw IllegalArgumentException("Password encoding failed"),
            updatedAt = LocalDateTime.now()
        )
        userRepository.save(updated)
    }

    // număr total useri (ADMIN only)
    fun getUsersCount(): Long {
        return userRepository.count()
    }

    // ── Helper Entity → DTO ──
    private fun toDTO(user: User) = UserProfileDTO(
        id          = user.id,
        firstName   = user.firstName,
        lastName    = user.lastName,
        email       = user.email,
        phoneNumber = user.phoneNumber,
        role        = user.role.name,
        createdAt   = user.createdAt
    )
}