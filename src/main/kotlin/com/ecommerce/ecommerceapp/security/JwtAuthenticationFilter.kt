package com.ecommerce.ecommerceapp.security

import com.ecommerce.ecommerceapp.repository.UserRepository
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class JwtAuthenticationFilter(
    private val jwtTokenProvider: JwtTokenProvider,
    private val userRepository: UserRepository
) : OncePerRequestFilter() {    // OncePerRequestFilter = runs exactly ONCE per request

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        try {
            // Step 1: Try to extract the token from the Authorization header
            val token = extractTokenFromHeader(request)

            // Step 2: If token exists AND is valid → authenticate the user
            if (token != null && jwtTokenProvider.validateToken(token)) {

                // Step 3: Get email from token
                val email = jwtTokenProvider.getEmailFromToken(token)

                // Step 4: Load user from database
                val user = userRepository.findByEmail(email).orElse(null)

                if (user != null) {
                    // Step 5: Create authorities based on role
                    val authorities = listOf(SimpleGrantedAuthority("ROLE_${user.role.name}"))

                    // Step 6: Create Authentication object
                    val authentication = UsernamePasswordAuthenticationToken(
                        user,
                        null,
                        authorities
                    )

                    // Step 7: Put into SecurityContext
                    SecurityContextHolder.getContext().authentication = authentication
                }
            }
        } catch (e: Exception) {
            // If anything goes wrong during token processing, just continue without authentication
            // The request will be handled as unauthenticated by Spring Security
            SecurityContextHolder.clearContext()
        }

        // Step 8: Continue with the request regardless of authentication result
        filterChain.doFilter(request, response)
    }

    // HELPER - Extract token from "Authorization: Bearer <token>" header
    private fun extractTokenFromHeader(request: HttpServletRequest): String? {
        val authorizationHeader = request.getHeader("Authorization")

        // Header looks like: "Bearer eyJhbGciOiJ..."
        // We need to extract only: "eyJhbGciOiJ..."
        return if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            authorizationHeader.substring(7)  // Remove "Bearer " (7 characters)
        } else {
            null  // No token found
        }
    }
}