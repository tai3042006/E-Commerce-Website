package com.clofit.backend.model;

import java.sql.Date;
import java.util.List;

import com.clofit.backend.state.CancelledState;
import com.clofit.backend.state.IOrderState;
import com.clofit.backend.state.PendingState;

public class Order {

    private String id;
    private double total;
    private Date createdAt;
    private IOrderState state;
    private List<OrderItem> items;
    private Customer customer;

    public Order(
            String id,
            double total,
            Date createdAt,
            IOrderState state,
            List<OrderItem> items,
            Customer customer) {

        this.id = id;
        this.total = total;
        this.createdAt = createdAt;
        this.state = state;
        this.items = items;
        this.customer = customer;
    }

    public Order(
            List<CartItem> cartItems,
            Customer customer,
            String paymentMethod) {

        this.id = "ORD-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        this.customer = customer;
        this.state = new PendingState();
        this.createdAt = new Date(System.currentTimeMillis());

        this.items = new java.util.ArrayList<>();
        double sum = 0;
        for (CartItem ci : cartItems) {
            OrderItem oi = new OrderItem(ci.getProduct(), ci.getQuantity(), ci.getProduct().getPrice());
            this.items.add(oi);
            sum += oi.getSubTotal();
        }
        this.total = sum;
    }

    public void nextState() {
        state.next(this);
    }

    public void cancel() {
        setState(new CancelledState());
    }

    public String getId() {
        return id;
    }

    public double getTotal() {
        return total;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public Customer getCustomer() {
        return customer;
    }

    public String getStatus() {
        return state.getStatus();
    }

    public IOrderState getState() {
        return state;
    }

    public void setState(IOrderState state) {
        this.state = state;
    }
}
