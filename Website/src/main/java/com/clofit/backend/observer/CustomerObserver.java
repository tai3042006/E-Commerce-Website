package com.clofit.backend.observer;

import com.clofit.backend.model.Customer;
import com.clofit.backend.model.Notification;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * CustomerObserver — concrete Observer that represents a single Customer's
 * notification inbox. Subscribed to ProductCatalog so the customer is
 * notified whenever the admin adds a new product ("productAdded"), and to
 * OrderService so they're notified about their own order status changes.
 */
public class CustomerObserver implements IObserver {

    private Customer customer;
    private final List<Notification> notifications = new ArrayList<>();

    public CustomerObserver(Customer customer) {
        this.customer = customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Customer getCustomer() {
        return customer;
    }

    @Override
    public void update(String event, Object data) {
        String message = buildMessage(event, data);
        Notification notification = new Notification(event, message);
        notifications.add(notification);
        System.out.println("[Customer: " + customer.getName() + "] New notification -> " + notification);
    }

    private String buildMessage(String event, Object data) {
        switch (event) {
            case "productAdded":
                return "New product available: " + data;
            case "orderCreated":
                return "Your order was placed: " + data;
            case "orderCancelled":
                return "Your order was cancelled: " + data;
            default:
                return event + ": " + data;
        }
    }

    /** All notifications received by this customer, most recent first. */
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
