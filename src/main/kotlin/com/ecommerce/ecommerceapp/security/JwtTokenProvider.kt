package com.ecommerce.ecommerceapp.security
import com.ecommerce.ecommerceapp.entity.User
import io.jsonwebtoken.*
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.util.Date
import javax.crypto.SecretKey

@Component
class JwtTokenProvider(
    @Value("\${jwt.secret}") private val secretKeyString: String,
    @Value("\${jwt.expiration}") private val expirationMs: Long
) {

    // Create the secret key with explicit algorithm (required in 0.11.5)
//    private val secretKey: SecretKey = Keys.hmacKey(
//        secretKeyString.toByteArray(Charsets.UTF_8),
//        SignatureAlgorithm.HS256
//    )
    private val secretKey: SecretKey = javax.crypto.spec.SecretKeySpec(
        secretKeyString.toByteArray(Charsets.UTF_8),
        "HmacSHA256"
    )

    // GENERATE a new JWT token for a user
    fun generateToken(user: User): String {
        val now = Date()
        val expirationDate = Date(now.time + expirationMs)

        return Jwts.builder()
            .claim("id", user.id)
            .claim("email", user.email)
            .claim("role", user.role.name)
            .setIssuedAt(now)                                  // Use Date, not Instant
            .setExpiration(expirationDate)                     // Use Date, not Instant
            .signWith(secretKey, SignatureAlgorithm.HS256)     // Explicit algorithm
            .compact()
    }

    // VALIDATE if a token is legitimate and not expired
    fun validateToken(token: String): Boolean {
        return try {
            Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)                         // parseClaimsJws, not parseSignedClaims
            true
        } catch (e: Exception) {
            false
        }
    }

    // EXTRACT email from a token
    fun getEmailFromToken(token: String): String {
        val claims = extractClaims(token)
        return claims["email"] as String
    }

    // EXTRACT user ID from a token
    fun getUserIdFromToken(token: String): Long {
        val claims = extractClaims(token)
        return (claims["id"] as Integer).toLong()
    }

    // HELPER - Extract all claims from a token
    private fun extractClaims(token: String): Claims {
        return Jwts.parserBuilder()
            .setSigningKey(secretKey)
            .build()
            .parseClaimsJws(token)                             // parseClaimsJws, not parseSignedClaims
            .body                                              // .body in 0.11.5
    }
}