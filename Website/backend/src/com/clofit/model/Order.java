package com.clofit.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Order — đơn hàng.
 * Quan hệ: Order 1-N OrderItem, Order 1-1 PaymentInfo
 * Customer 1-N Order
 *
 * Sequence diagram §3: Order Controller tạo Order từ Cart,
 * tạo OrderItems, xóa Cart.
 */
public class Order {

    public enum Status { PENDING, CONFIRMED, SHIPPING, DELIVERED, CANCELLED }

    private final String          orderId;
    private final Customer        customer;           // back-ref
    private final String          customerEmail;
    private final List<OrderItem> orderItems;         // 1-N OrderItem (snapshot)
    private final double          totalAmount;
    private final PaymentInfo     paymentInfo;        // 1-1 PaymentInfo
    private final LocalDateTime   createdAt;
    private Status                status;

    /**
     * Called by Cart.checkout() — per sequence diagram §3.
     */
    public Order(Customer customer, List<CartItem> cartItems, PaymentInfo paymentInfo) {
        this.orderId       = "CLO-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        this.customer      = customer;
        this.customerEmail = customer.getEmail();
        this.orderItems    = cartItems.stream()
                                .map(OrderItem::new)
                                .collect(Collectors.toList());
        this.totalAmount   = orderItems.stream().mapToDouble(OrderItem::getLineTotal).sum();
        this.paymentInfo   = paymentInfo;
        this.createdAt     = LocalDateTime.now();
        this.status        = Status.PENDING;

        // Process payment immediately on creation
        paymentInfo.processPayment(totalAmount);
    }

    /* ── Methods per class diagram ── */

    /**
     * confirm() — Admin confirms the order.
     */
    public void confirm() {
        if (status != Status.PENDING)
            throw new IllegalStateException("Only PENDING orders can be confirmed");
        status = Status.CONFIRMED;
    }

    /**
     * cancel() — cancel order if not yet shipped.
     */
    public void cancel() {
        if (status == Status.SHIPPING || status == Status.DELIVERED)
            throw new IllegalStateException("Cannot cancel order in status: " + status);
        status = Status.CANCELLED;
    }

    /* ── Getters ── */
    public String          getOrderId()       { return orderId; }
    public Customer        getCustomer()      { return customer; }
    public String          getCustomerEmail() { return customerEmail; }
    public List<OrderItem> getItems()         { return List.copyOf(orderItems); }
    public double          getTotal()         { return totalAmount; }
    public PaymentInfo     getPaymentInfo()   { return paymentInfo; }
    public LocalDateTime   getCreatedAt()     { return createdAt; }
    public Status          getStatus()        { return status; }

    public void setStatus(Status status) { this.status = status; }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
        sb.append(String.format("  Order ID   : %s%n", orderId));
        sb.append(String.format("  Customer   : %s (%s)%n", customer.getName(), customerEmail));
        sb.append(String.format("  Status     : %s%n", status));
        sb.append(String.format("  Payment    : %s%n", paymentInfo.getMethodName()));
        sb.append(String.format("  Created    : %s%n", createdAt));
        sb.append("  Items:\n");
        orderItems.forEach(i -> sb.append(i).append("\n"));
        sb.append(String.format("  TOTAL      : $%.2f%n", totalAmount));
        sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        return sb.toString();
    }
}
