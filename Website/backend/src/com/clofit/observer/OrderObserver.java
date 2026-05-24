package com.clofit.observer;

import com.clofit.model.Order;

/**
 * OrderObserver — interface cho Observer Pattern (order events).
 *
 * Class diagram §2.4: User là Observer, nhận update(message).
 * OrderObserver extends cơ chế đó cho các service observers
 * (Email, Inventory, Analytics) — pattern vẫn đúng,
 * chỉ subject là OrderService thay vì Product.
 */
public interface OrderObserver {
    void onOrderPlaced(Order order);
    void onOrderStatusChanged(Order order, Order.Status oldStatus);
}
