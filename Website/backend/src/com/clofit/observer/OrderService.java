package com.clofit.observer;

import com.clofit.model.Order;

import java.util.ArrayList;
import java.util.List;

/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  DESIGN PATTERN: OBSERVER — Subject / Publisher              ║
 * ║  OrderService broadcasts order events to all observers.      ║
 * ║  Observers: Email, Inventory, Notification, Analytics        ║
 * ╚══════════════════════════════════════════════════════════════╝
 */
public class OrderService {

    private final List<OrderObserver> observers = new ArrayList<>();
    private final List<Order>         orders    = new ArrayList<>();

    /* ── Observer management ── */
    public void subscribe(OrderObserver observer)   { observers.add(observer); }
    public void unsubscribe(OrderObserver observer) { observers.remove(observer); }

    /* ── Notify ── */
    private void notifyOrderPlaced(Order order) {
        observers.forEach(o -> o.onOrderPlaced(order));
    }

    private void notifyStatusChanged(Order order, Order.Status oldStatus) {
        observers.forEach(o -> o.onOrderStatusChanged(order, oldStatus));
    }

    /* ── Business methods ── */

    /**
     * placeOrder() — đặt hàng, notify tất cả observers.
     * Per sequence diagram §3: OrderController → OrderService.
     */
    public Order placeOrder(Order order) {
        orders.add(order);
        notifyOrderPlaced(order);
        return order;
    }

    /**
     * updateStatus() — Admin cập nhật trạng thái đơn.
     * Per sequence diagram §3 and Admin.manageOrder().
     */
    public Order updateStatus(String orderId, Order.Status newStatus) {
        return orders.stream()
                .filter(o -> o.getOrderId().equals(orderId))
                .findFirst()
                .map(o -> {
                    Order.Status old = o.getStatus();
                    o.setStatus(newStatus);
                    notifyStatusChanged(o, old);
                    return o;
                })
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
    }

    public List<Order> getAllOrders() { return List.copyOf(orders); }

    public List<Order> getOrdersByCustomer(int userId) {
        return orders.stream()
                .filter(o -> o.getCustomer().getUserId() == userId)
                .collect(java.util.stream.Collectors.toList());
    }
}
