package com.ecommerce.ecommerceapp.repository

import com.ecommerce.ecommerceapp.entity.Notification
import com.ecommerce.ecommerceapp.entity.User
import com.ecommerce.ecommerceapp.enums.NotificationType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface NotificationRepository : JpaRepository<Notification, Long> {

    // Toate notificările
    fun findByUser(user: User): List<Notification>

    // Notificari dupa user ID, sortate descrescator (cele mai recente)
    fun findByUserIdOrderByCreatedAtDesc(userId: Long): List<Notification>

    // Notificari necitite
    fun findByUserAndIsRead(user: User, isRead: Boolean): List<Notification>

    // Numarul de notificari necitite
    fun countByUserAndIsRead(user: User, isRead: Boolean): Long

    // Notificari după tip
    fun findByUserAndType(user: User, type: NotificationType): List<Notification>

    // Query custom: Marcheaza toate notificarile ca citite
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.user = :user AND n.isRead = false")
    fun markAllAsReadForUser(@Param("user") user: User)

    // Șterge notificari vechi (cleanup)
    fun deleteByCreatedAtBefore(createdAt: java.time.LocalDateTime)
}