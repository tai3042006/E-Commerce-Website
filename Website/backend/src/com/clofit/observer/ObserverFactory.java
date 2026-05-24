package com.clofit.observer;

import com.clofit.model.Notification;
import com.clofit.model.Order;
import com.clofit.model.OrderItem;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

/**
 * EmailNotificationObserver — gửi email xác nhận đơn hàng.
 */
class EmailNotificationObserver implements OrderObserver {

    private static final Logger LOG = Logger.getLogger(EmailNotificationObserver.class.getName());

    @Override
    public void onOrderPlaced(Order order) {
        LOG.info(String.format(
            "[EMAIL] ✉  Confirmation → %s | Order %s | Total $%.2f",
            order.getCustomerEmail(), order.getOrderId(), order.getTotal()));
        // Production: JavaMail / SendGrid
    }

    @Override
    public void onOrderStatusChanged(Order order, Order.Status oldStatus) {
        LOG.info(String.format(
            "[EMAIL] ✉  Status update → %s | %s : %s → %s",
            order.getCustomerEmail(), order.getOrderId(), oldStatus, order.getStatus()));
    }
}


/**
 * InventoryObserver — trừ stock khi đặt hàng, hoàn stock khi huỷ.
 * Dùng Product.updateStock() — đúng với Encapsulation trong class diagram.
 */
class InventoryObserver implements OrderObserver {

    private static final Logger LOG = Logger.getLogger(InventoryObserver.class.getName());

    @Override
    public void onOrderPlaced(Order order) {
        // Needs live Product references — handled via ProductDAO in production
        LOG.info("[INVENTORY] 📦 Decrementing stock for order: " + order.getOrderId());
        order.getItems().forEach(item ->
            LOG.info(String.format("  - %s: -%d", item.getProductName(), item.getQuantity()))
        );
    }

    @Override
    public void onOrderStatusChanged(Order order, Order.Status oldStatus) {
        if (order.getStatus() == Order.Status.CANCELLED) {
            LOG.info("[INVENTORY] 🔄 Restocking items (cancellation): " + order.getOrderId());
            order.getItems().forEach(item ->
                LOG.info(String.format("  + %s: +%d", item.getProductName(), item.getQuantity()))
            );
        }
    }
}


/**
 * NotificationObserver — tạo Notification objects per class diagram.
 * User 1-N Notification: mỗi event tạo 1 Notification record.
 */
class NotificationObserver implements OrderObserver {

    private final List<Notification> notifications = new ArrayList<>();

    @Override
    public void onOrderPlaced(Order order) {
        String msg = String.format(
            "✅ Đặt hàng thành công! Mã đơn: %s | Tổng: $%.2f",
            order.getOrderId(), order.getTotal());

        Notification n = new Notification(order.getCustomer().getUserId(), msg);
        n.send();
        notifications.add(n);

        // Also notify via User.update() — per class diagram Observer
        order.getCustomer().update(msg);
    }

    @Override
    public void onOrderStatusChanged(Order order, Order.Status oldStatus) {
        String msg = String.format(
            "📦 Đơn hàng %s: %s → %s",
            order.getOrderId(), oldStatus, order.getStatus());

        Notification n = new Notification(order.getCustomer().getUserId(), msg);
        n.send();
        notifications.add(n);
        order.getCustomer().update(msg);
    }

    public List<Notification> getAllNotifications() { return List.copyOf(notifications); }
}


/**
 * AnalyticsObserver — theo dõi doanh thu và số đơn hàng.
 */
class AnalyticsObserver implements OrderObserver {

    private static final Logger LOG = Logger.getLogger(AnalyticsObserver.class.getName());

    private int    totalOrders;
    private double totalRevenue;

    @Override
    public void onOrderPlaced(Order order) {
        totalOrders++;
        totalRevenue += order.getTotal();
        LOG.info(String.format(
            "[ANALYTICS] 📊 Orders: %d | Revenue: $%.2f | Avg: $%.2f",
            totalOrders, totalRevenue, totalRevenue / totalOrders));
    }

    @Override
    public void onOrderStatusChanged(Order order, Order.Status oldStatus) {
        if (order.getStatus() == Order.Status.CANCELLED) {
            totalRevenue -= order.getTotal();
            LOG.info("[ANALYTICS] 📉 Revenue adjusted (cancellation): -$" + order.getTotal());
        }
    }

    public int    getTotalOrders()  { return totalOrders; }
    public double getTotalRevenue() { return totalRevenue; }
}


/**
 * ObserverFactory — tạo observer instances (Factory Method).
 */
public class ObserverFactory {
    public static OrderObserver       emailObserver()        { return new EmailNotificationObserver(); }
    public static OrderObserver       inventoryObserver()    { return new InventoryObserver(); }
    public static NotificationObserver notificationObserver() { return new NotificationObserver(); }
    public static AnalyticsObserver   analyticsObserver()    { return new AnalyticsObserver(); }
}
