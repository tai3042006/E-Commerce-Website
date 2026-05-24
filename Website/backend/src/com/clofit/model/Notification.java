package com.clofit.model;

import java.time.LocalDateTime;

/**
 * Notification — thông báo gửi đến User.
 * Quan hệ: User 1-N Notification
 * Phát sinh từ: OrderService (Observer) hoặc Product.notifyObservers()
 */
public class Notification {

    private final int           notificationId;
    private final int           userId;
    private final String        message;
    private final LocalDateTime createdAt;
    private       boolean       isRead;

    private static int idCounter = 1;

    public Notification(int userId, String message) {
        this.notificationId = idCounter++;
        this.userId         = userId;
        this.message        = message;
        this.createdAt      = LocalDateTime.now();
        this.isRead         = false;
    }

    /* ── Methods per class diagram ── */

    /**
     * send() — delivers the notification (print / push / email in production).
     */
    public void send() {
        System.out.printf("[NOTIFICATION #%d → User %d] %s%n",
                notificationId, userId, message);
    }

    public void markAsRead() { this.isRead = true; }

    /* ── Getters ── */
    public int           getNotificationId() { return notificationId; }
    public int           getUserId()         { return userId; }
    public String        getMessage()        { return message; }
    public LocalDateTime getCreatedAt()      { return createdAt; }
    public boolean       isRead()            { return isRead; }

    @Override
    public String toString() {
        return String.format("Notification{id=%d, userId=%d, read=%b, msg='%s'}",
                notificationId, userId, isRead, message);
    }
}
