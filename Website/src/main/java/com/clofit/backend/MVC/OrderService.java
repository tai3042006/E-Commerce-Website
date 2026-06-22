package com.clofit.backend.MVC;

import com.clofit.backend.model.CartItem;
import com.clofit.backend.model.Customer;
import com.clofit.backend.model.Order;
import com.clofit.backend.model.OrderItem;


import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class OrderService implements ISubject {

    private static OrderService instance;

    private List<IObserver> observers;
    private List<Order> orders;

    private OrderService() {
        observers = new ArrayList<>();
        orders = new ArrayList<>();
    }

    public static OrderService getInstance() {
        if (instance == null) {
            instance = new OrderService();
        }
        return instance;
    }

    public Order createOrder(CartService cartService, Customer customer, String paymentMethod) {
        if (cartService.getCart().getItems().isEmpty()) {
            throw new IllegalStateException("Cart is empty");
        }

        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem ci : cartService.getCart().getItems()) {
            orderItems.add(new OrderItem(
                    ci.getProduct(),
                    ci.getQuantity(),
                    ci.getProduct().getPrice()));
        }

        double total = orderItems.stream()
                .mapToDouble(OrderItem::getSubTotal)
                .sum();

        String id = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Order order = new Order(
                id,
                total,
                new Date(System.currentTimeMillis()),
                new PendingState(),
                orderItems,
                customer);

        orders.add(order);
        cartService.clearCart();
        notifyObservers("orderCreated", order);
        return order;
    }

    public void cancelOrder(String orderId) {
        Order order = orders.stream()
                .filter(o -> o.getId().equals(orderId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        order.setState(new CancelledState());
        notifyObservers("orderCancelled", order);
    }

    public List<Order> getOrdersByCustomer(Customer customer) {
        List<Order> result = new ArrayList<>();
        for (Order order : orders) {
            if (order.getCustomer().equals(customer)) {
                result.add(order);
            }
        }
        return result;
    }

    public List<Order> getAllOrders() {
        return orders;
    }

    @Override
    public void subscribe(IObserver observer) {
        observers.add(observer);
    }

    @Override
    public void unsubscribe(IObserver observer) {
        observers.remove(observer);
    }

    @Override
    public void notifyObservers(String event, Object data) {
        for (IObserver observer : observers) {
            observer.update(event, data);
        }
    }
}
