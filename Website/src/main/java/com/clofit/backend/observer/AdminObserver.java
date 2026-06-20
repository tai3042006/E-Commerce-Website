package com.clofit.backend.observer;

import com.clofit.backend.model.Admin;
import com.clofit.backend.model.Notification;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * AdminObserver — concrete Observer that represents a single Admin's
 * notification inbox. Subscribed (via AdminService) so that it receives
 * "userRegistered", "orderCreated" and "orderCancelled" events whenever they
 * occur elsewhere in the system.
 */
public class AdminObserver implements IObserver {

    private Admin admin;
    private final List<Notification> notifications = new ArrayList<>();

    public AdminObserver(Admin admin) {
        this.admin = admin;
    }

    public Admin getAdmin() {
        return admin;
    }

    @Override
    public void update(String event, Object data) {
        String message = buildMessage(event, data);
        Notification notification = new Notification(event, message);
        notifications.add(notification);
        System.out.println("[Admin: " + admin.getName() + "] New notification -> " + notification);
    }

    private String buildMessage(String event, Object data) {
        switch (event) {
            case "userRegistered":
                return "New user registered: " + data;
            case "orderCreated":
                return "New order placed: " + data;
            case "orderCancelled":
                return "Order cancelled: " + data;
            default:
                return event + ": " + data;
        }
    }

    /** All notifications received by this admin, most recent first. */
    public List<Notification> getNotifications() {
        List<Notification> reversed = new ArrayList<>(notifications);
        Collections.reverse(reversed);
        return reversed;
    }

    public List<Notification> getUnreadNotifications() {
        List<Notification> unread = new ArrayList<>();
        for (Notification n : notifications) {
            if (!n.isRead()) unread.add(n);
        }
        return unread;
    }

    public int getUnreadCount() {
        return getUnreadNotifications().size();
    }

    public void markAllAsRead() {
        for (Notification n : notifications) {
            n.markRead();
        }
    }
}
