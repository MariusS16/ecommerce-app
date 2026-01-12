package com.ecommerce.ecommerceapp.repository

import com.ecommerce.ecommerceapp.enums.Role
import com.ecommerce.ecommerceapp.entity.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface UserRepository : JpaRepository<User, Long> {

    fun findByEmail(email: String): Optional<User>

    fun existsByEmail(email: String): Boolean

    fun findByRole(role: Role): List<User>

    fun findByEmailConfirmationToken(token: String): Optional<User>

    fun findByIsEmailConfirmed(confirmed: Boolean): List<User>
}