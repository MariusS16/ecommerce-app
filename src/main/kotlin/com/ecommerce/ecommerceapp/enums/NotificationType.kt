package com.ecommerce.ecommerceapp.enums

enum class NotificationType {
    ORDER_CONFIRMED,    // "Comanda ta a fost confirmată"
    ORDER_SHIPPED,      // "Comanda ta a fost expediată"
    ORDER_DELIVERED,    // "Comanda ta a fost livrată"
    STOCK_ALERT,        // "Produsul X este din nou în stoc"
    PRICE_DROP,         // "Produsul X s-a ieftinit"
    PROMOTION,          // "Ofertă specială!"
    ACCOUNT             // "Email confirmat", "Parolă schimbată", etc.
}