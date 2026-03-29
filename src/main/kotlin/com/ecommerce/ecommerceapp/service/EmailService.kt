package com.ecommerce.ecommerceapp.service

import com.ecommerce.ecommerceapp.entity.Order
import com.ecommerce.ecommerceapp.entity.User
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service
import java.text.NumberFormat
import java.time.format.DateTimeFormatter
import java.util.Locale

@Service
class EmailService(
    // JavaMailSender e injectat automat de Spring
    // folosind configurarea din application.properties
    private val mailSender: JavaMailSender
) {
    private val logger = LoggerFactory.getLogger(EmailService::class.java)

    // Citim valorile custom din application.properties
    @Value("\${app.mail.from}")
    private lateinit var fromEmail: String

    @Value("\${app.mail.from-name}")
    private lateinit var fromName: String

    // ══════════════════════════════════════════
    // HELPER — formatare preț în RON
    // ══════════════════════════════════════════
    private fun formatPrice(price: java.math.BigDecimal): String {
        val formatter = NumberFormat.getNumberInstance(Locale("ro", "RO"))
        formatter.minimumFractionDigits = 2
        formatter.maximumFractionDigits = 2
        return "${formatter.format(price)} RON"
    }

    // ══════════════════════════════════════════
    // HELPER — trimitere email generic
    // Folosit intern de celelalte metode
    // ══════════════════════════════════════════
    private fun sendEmail(
        to: String,
        subject: String,
        htmlContent: String
    ) {
        try {
            // MimeMessage = emailul propriu-zis (format MIME standard)
            val message = mailSender.createMimeMessage()

            // MimeMessageHelper = wrapper care face mai ușor să setezi
            // destinatar, subiect, conținut HTML etc.
            // true = suportă HTML și atașamente
            val helper = MimeMessageHelper(message, true, "UTF-8")

            // Setăm expeditorul — apare ca "TrustCart <adresa@gmail.com>"
            helper.setFrom(fromEmail, fromName)

            // Destinatarul
            helper.setTo(to)

            // Subiectul emailului
            helper.setSubject(subject)

            // Conținutul — true = e HTML, nu text simplu
            helper.setText(htmlContent, true)

            // Trimitem efectiv emailul prin SMTP
            mailSender.send(message)

            logger.info("✅ Email trimis cu succes către: $to | Subiect: $subject")

        } catch (e: Exception) {
            // NU aruncăm excepția mai departe — nu vrem ca o eroare
            // la email să blocheze înregistrarea sau comanda
            logger.error("❌ Eroare la trimiterea emailului către $to: ${e.message}")
        }
    }

    // ══════════════════════════════════════════
    // EMAIL 1 — Bun venit la înregistrare
    // ══════════════════════════════════════════

    // @Async = metoda rulează pe un thread separat, în background
    // AuthService nu așteaptă să se termine — răspunde imediat userului
    @Async
    fun sendWelcomeEmail(user: User) {
        val subject = "Bun venit la TrustCart, ${user.firstName}! 🎉"
        val html = buildWelcomeTemplate(user)
        sendEmail(user.email, subject, html)
    }

    // ══════════════════════════════════════════
    // EMAIL 2 — Confirmare comandă
    // ══════════════════════════════════════════
    @Async
    fun sendOrderConfirmationEmail(user: User, order: Order) {
        val subject = "Comanda ta #${order.orderNumber} a fost plasată cu succes! 📦"
        val html = buildOrderConfirmationTemplate(user, order)
        sendEmail(user.email, subject, html)
    }

    // ══════════════════════════════════════════
    // TEMPLATE 1 — HTML pentru Welcome Email
    // ══════════════════════════════════════════
    private fun buildWelcomeTemplate(user: User): String {
        // Triple quotes în Kotlin = string multiline, perfect pentru HTML
        return """
            <!DOCTYPE html>
            <html lang="ro">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Bun venit la TrustCart</title>
            </head>
            <body style="margin:0;padding:0;background-color:#F8FAFC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                
                <!-- Wrapper principal -->
                <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
                    
                    <!-- Header cu logo -->
                    <div style="text-align:center;margin-bottom:32px;">
                        <h1 style="margin:0;font-size:28px;font-weight:800;background:linear-gradient(135deg,#6366F1,#10B981);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">
                            TrustCart
                        </h1>
                        <p style="margin:4px 0 0;font-size:13px;color:#9CA3AF;">Consilierul tău de încredere</p>
                    </div>
                    
                    <!-- Card principal -->
                    <div style="background:white;border-radius:16px;padding:40px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border:1px solid #E5E7EB;">
                        
                        <!-- Emoji + Titlu -->
                        <div style="text-align:center;margin-bottom:28px;">
                            <div style="font-size:48px;margin-bottom:16px;">🎉</div>
                            <h2 style="margin:0;font-size:24px;font-weight:800;color:#111827;">
                                Bun venit, ${user.firstName}!
                            </h2>
                            <p style="margin:8px 0 0;font-size:15px;color:#6B7280;">
                                Contul tău TrustCart a fost creat cu succes.
                            </p>
                        </div>
                        
                        <!-- Divider -->
                        <div style="height:1px;background:#F3F4F6;margin:24px 0;"></div>
                        
                        <!-- Detalii cont -->
                        <div style="margin-bottom:28px;">
                            <p style="margin:0 0 12px;font-size:14px;font-weight:600;color:#374151;">
                                Detaliile contului tău:
                            </p>
                            <div style="background:#F9FAFB;border-radius:10px;padding:16px;border:1px solid #E5E7EB;">
                                <p style="margin:0 0 8px;font-size:13px;color:#6B7280;">
                                    <strong style="color:#111827;">Nume:</strong> 
                                    ${user.firstName} ${user.lastName}
                                </p>
                                <p style="margin:0;font-size:13px;color:#6B7280;">
                                    <strong style="color:#111827;">Email:</strong> 
                                    ${user.email}
                                </p>
                            </div>
                        </div>
                        
                        <!-- Ce poți face -->
                        <div style="margin-bottom:28px;">
                            <p style="margin:0 0 14px;font-size:14px;font-weight:600;color:#374151;">
                                Cu TrustCart poți:
                            </p>
                            <div style="display:flex;flex-direction:column;gap:10px;">
                                ${featureItem("🛒", "Cumpără produse din catalogul nostru")}
                                ${featureItem("✨", "Primești recomandări AI pentru cele mai bune prețuri")}
                                ${featureItem("❤️", "Salvezi produse favorite în Wishlist")}
                                ${featureItem("📦", "Urmărești comenzile în timp real")}
                            </div>
                        </div>
                        
                        <!-- Buton CTA -->
                        <div style="text-align:center;">
                            <a href="http://localhost:5173/products" 
                               style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#6366F1,#4F46E5);color:white;text-decoration:none;border-radius:10px;font-size:15px;font-weight:700;box-shadow:0 4px 14px rgba(99,102,241,0.35);">
                                Explorează produsele →
                            </a>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div style="text-align:center;margin-top:24px;">
                        <p style="margin:0;font-size:12px;color:#9CA3AF;">
                            © 2026 TrustCart · Universitatea Transilvania din Brașov
                        </p>
                        <p style="margin:4px 0 0;font-size:12px;color:#9CA3AF;">
                            Ai primit acest email deoarece ți-ai creat un cont pe TrustCart.
                        </p>
                    </div>
                    
                </div>
            </body>
            </html>
        """.trimIndent()
    }

    // ══════════════════════════════════════════
    // TEMPLATE 2 — HTML pentru Order Confirmation
    // ══════════════════════════════════════════
    private fun buildOrderConfirmationTemplate(user: User, order: Order): String {
        // Construim rândurile cu produse din comandă
        val itemsHtml = order.items.joinToString("") { item ->
            """
            <tr>
                <td style="padding:12px 0;border-bottom:1px solid #F3F4F6;">
                    <span style="font-size:13px;font-weight:600;color:#111827;">
                        ${item.product.name}
                    </span>
                </td>
                <td style="padding:12px 0;border-bottom:1px solid #F3F4F6;text-align:center;">
                    <span style="font-size:13px;color:#6B7280;">x${item.quantity}</span>
                </td>
                <td style="padding:12px 0;border-bottom:1px solid #F3F4F6;text-align:right;">
                    <span style="font-size:13px;font-weight:700;color:#111827;">
                        ${formatPrice(item.priceAtPurchase.multiply(item.quantity.toBigDecimal()))}
                    </span>
                </td>
            </tr>
            """.trimIndent()
        }

        // Formatăm data comenzii
        val formatter = DateTimeFormatter.ofPattern("dd MMMM yyyy, HH:mm", Locale("ro"))
        val formattedDate = order.createdAt.format(formatter)

        return """
            <!DOCTYPE html>
            <html lang="ro">
            <head>
                <meta charset="UTF-8">
                <title>Confirmare comandă</title>
            </head>
            <body style="margin:0;padding:0;background-color:#F8FAFC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                
                <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
                    
                    <!-- Header -->
                    <div style="text-align:center;margin-bottom:32px;">
                        <h1 style="margin:0;font-size:28px;font-weight:800;background:linear-gradient(135deg,#6366F1,#10B981);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">
                            TrustCart
                        </h1>
                    </div>
                    
                    <!-- Card principal -->
                    <div style="background:white;border-radius:16px;padding:40px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border:1px solid #E5E7EB;">
                        
                        <!-- Status confirmat -->
                        <div style="text-align:center;margin-bottom:28px;">
                            <div style="width:64px;height:64px;background:#D1FAE5;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:28px;">
                                ✅
                            </div>
                            <h2 style="margin:0;font-size:22px;font-weight:800;color:#111827;">
                                Comanda ta a fost plasată!
                            </h2>
                            <p style="margin:8px 0 0;font-size:14px;color:#6B7280;">
                                Salut, ${user.firstName}! Îți mulțumim pentru comandă.
                            </p>
                        </div>
                        
                        <!-- Badge număr comandă -->
                        <div style="text-align:center;margin-bottom:28px;">
                            <span style="display:inline-block;background:#EEF2FF;color:#4F46E5;padding:6px 16px;border-radius:20px;font-size:13px;font-weight:700;">
                                🧾 #${order.orderNumber}
                            </span>
                        </div>
                        
                        <!-- Info comandă -->
                        <div style="background:#F9FAFB;border-radius:10px;padding:16px;border:1px solid #E5E7EB;margin-bottom:24px;">
                            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                                <span style="font-size:13px;color:#6B7280;">Data plasării:</span>
                                <span style="font-size:13px;font-weight:600;color:#111827;">$formattedDate</span>
                            </div>
                            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                                <span style="font-size:13px;color:#6B7280;">Metodă plată:</span>
                                <span style="font-size:13px;font-weight:600;color:#111827;">${order.paymentMethod}</span>
                            </div>
                            <div style="display:flex;justify-content:space-between;">
                                <span style="font-size:13px;color:#6B7280;">Adresă livrare:</span>
                                <span style="font-size:13px;font-weight:600;color:#111827;text-align:right;max-width:300px;">
                                    ${order.shippingAddress}, ${order.shippingCity}
                                </span>
                            </div>
                        </div>
                        
                        <!-- Produse comandate -->
                        <div style="margin-bottom:24px;">
                            <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#111827;">
                                Produse comandate:
                            </p>
                            <table style="width:100%;border-collapse:collapse;">
                                <thead>
                                    <tr>
                                        <th style="text-align:left;font-size:11px;color:#9CA3AF;font-weight:600;text-transform:uppercase;letter-spacing:.05em;padding-bottom:8px;">
                                            Produs
                                        </th>
                                        <th style="text-align:center;font-size:11px;color:#9CA3AF;font-weight:600;text-transform:uppercase;letter-spacing:.05em;padding-bottom:8px;">
                                            Cant.
                                        </th>
                                        <th style="text-align:right;font-size:11px;color:#9CA3AF;font-weight:600;text-transform:uppercase;letter-spacing:.05em;padding-bottom:8px;">
                                            Preț
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    $itemsHtml
                                </tbody>
                            </table>
                        </div>
                        
                        <!-- Total -->
                        <div style="background:#F9FAFB;border-radius:10px;padding:16px;border:1px solid #E5E7EB;margin-bottom:28px;">
                            <div style="display:flex;justify-content:space-between;align-items:center;">
                                <span style="font-size:15px;font-weight:800;color:#111827;">Total plătit:</span>
                                <span style="font-size:20px;font-weight:800;color:#111827;">
                                    ${formatPrice(order.totalPrice)}
                                </span>
                            </div>
                        </div>
                        
                        <!-- Buton Vezi comanda -->
                        <div style="text-align:center;">
                            <a href="http://localhost:5173/orders/${order.id}"
                               style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#6366F1,#4F46E5);color:white;text-decoration:none;border-radius:10px;font-size:15px;font-weight:700;box-shadow:0 4px 14px rgba(99,102,241,0.35);">
                                Urmărește comanda →
                            </a>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div style="text-align:center;margin-top:24px;">
                        <p style="margin:0;font-size:12px;color:#9CA3AF;">
                            © 2026 TrustCart · Universitatea Transilvania din Brașov
                        </p>
                    </div>
                    
                </div>
            </body>
            </html>
        """.trimIndent()
    }

    // ══════════════════════════════════════════
    // HELPER privat — construiește un feature item
    // pentru welcome email (emoji + text)
    // ══════════════════════════════════════════
    private fun featureItem(emoji: String, text: String): String {
        return """
            <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:#F9FAFB;border-radius:8px;border:1px solid #E5E7EB;">
                <span style="font-size:18px;">$emoji</span>
                <span style="font-size:13px;color:#374151;font-weight:500;">$text</span>
            </div>
        """.trimIndent()
    }
}