package com.clofit.backend.model;

import java.util.Date;

/**
 * Notification — the payload object delivered to observers (AdminObserver /
 * CustomerObserver) whenever ISubject.notifyObservers(event, data) fires.
 *
 * Used by:
 *   - ProductCatalog  -> "productAdded"   (notifies customers of a new product)
 *   - UserController  -> "userRegistered" (notifies admins of a new signup)
 *   - OrderService     -> "orderCreated" / "orderCancelled"
 */
public class Notification {

    private final String id;
    private final String event;
    private final String message;
    private final Date createdAt;
    private boolean read;

    public Notification(String event, String message) {
        this.id = "NTF-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        this.event = event;
        this.message = message;
        this.createdAt = new Date();
        this.read = false;
    }

    public String getId() {
        return id;
    }

    public String getEvent() {
        return event;
    }

    public String getMessage() {
        return message;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public boolean isRead() {
        return read;
    }

    public void markRead() {
        this.read = true;
    }

    @Override
    public String toString() {
        return "[" + event + "] " + message;
    }
}
