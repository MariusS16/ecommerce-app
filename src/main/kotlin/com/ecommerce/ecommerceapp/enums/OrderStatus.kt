package com.ecommerce.ecommerceapp.enums

enum class OrderStatus {
    PENDING,        // Comanda plasată, așteaptă procesare
    CONFIRMED,      // Comanda confirmată
    PROCESSING,     // În procesare
    SHIPPED,        // Expediat
    DELIVERED,      // Livrat
    CANCELLED       // Anulat
}