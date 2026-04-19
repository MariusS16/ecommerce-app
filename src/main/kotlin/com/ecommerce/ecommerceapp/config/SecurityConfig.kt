package com.ecommerce.ecommerceapp.config

import com.ecommerce.ecommerceapp.security.JwtAuthenticationFilter
import jakarta.servlet.http.HttpServletResponse
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter

@Configuration
@EnableWebSecurity
class SecurityConfig(
    private val jwtAuthenticationFilter: JwtAuthenticationFilter
) {

    @Bean
    fun passwordEncoder(): PasswordEncoder {
        return BCryptPasswordEncoder()
    }

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .cors { cors ->
                cors.configurationSource { _ ->
                    val config = org.springframework.web.cors.CorsConfiguration()
                    config.allowedOrigins = listOf("http://localhost:5173")
                    config.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    config.allowedHeaders = listOf("*")
                    config.allowCredentials = true
                    config
                }
            }
            // Disable CSRF - not needed for stateless REST API
            .csrf { it.disable() }

            // Disable form login - we use JWT, not browser forms
            .formLogin { it.disable() }

            // Disable HTTP Basic - we use Bearer tokens, not username:password headers
            .httpBasic { it.disable() }

            // Stateless sessions - no server-side session storage
            .sessionManagement {
                it.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            }

            // Custom error responses - return JSON instead of empty body
            .exceptionHandling {
                // 401 Unauthorized - when no valid token provided
                it.authenticationEntryPoint { _, response, _ ->
                    response.status = HttpServletResponse.SC_UNAUTHORIZED
                    response.contentType = "application/json"
                    response.writer.write("""{"error": "Unauthorized", "message": "Authentication required"}""")
                }

                // 403 Forbidden - when token is valid but user lacks required role
                it.accessDeniedHandler { _, response, _ ->
                    response.status = HttpServletResponse.SC_FORBIDDEN
                    response.contentType = "application/json"
                    response.writer.write("""{"error": "Forbidden", "message": "You do not have permission to access this resource"}""")
                }
            }

            // Route authorization rules
            .authorizeHttpRequests { requests ->
                requests
                    // PUBLIC routes - anyone can access without token
                    .requestMatchers("/api/auth/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/suppliers/**").permitAll()

                    // ADMIN only routes - requires ROLE_ADMIN
                    .requestMatchers(HttpMethod.POST, "/api/products/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/products/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.POST, "/api/categories/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/categories/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/api/categories/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.POST, "/api/suppliers/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/suppliers/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/api/suppliers/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.GET, "/api/cart/all").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/orders/*/status").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.GET, "/api/orders/all").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.GET, "/api/feedback").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.GET, "/api/users/count").hasRole("ADMIN")

                    // All other routes require authentication (any logged-in user)
                    .anyRequest().authenticated()
            }

            // Add JWT filter before Spring's default authentication filter
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter::class.java)

        return http.build()
    }
}