package com.clofit.model;

import java.util.ArrayList;
import java.util.List;

/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  Customer — kế thừa từ User                                  ║
 * ║  Có: address, cart (1-1), orders (1-N), reviews (1-N)        ║
 * ╚══════════════════════════════════════════════════════════════╝
 */
public class Customer extends User {

    private String       address;
    private final Cart   cart;                           // 1-1 relationship
    private final List<Order>  orderHistory = new ArrayList<>(); // 1-N
    private final List<Review> reviews      = new ArrayList<>(); // 1-N

    public Customer(String name, String phone, String email,
                    String password, String address) {
        super(name, phone, email, password);
        this.address = address;
        this.cart    = new Cart(this.getUserId());       // auto-create cart
    }

    /* ── Methods per class diagram ── */

    /**
     * placeOrder() — converts current cart into an Order.
     * Sequence: Cart → Order (per sequence diagram §3)
     */
    public Order placeOrder(PaymentInfo paymentInfo) {
        if (cart.isEmpty()) throw new IllegalStateException("Cart is empty");
        Order order = cart.checkout(this, paymentInfo);
        orderHistory.add(order);
        cart.clear();
        return order;
    }

    public List<Order> viewOrderHistory() {
        return List.copyOf(orderHistory);
    }

    /**
     * addReview() — customer writes a review after purchase.
     */
    public Review addReview(Product product, int rating, String comment) {
        Review review = new Review(this, product, rating, comment);
        reviews.add(review);
        product.addReview(review);
        return review;
    }

    @Override
    public String getRole() { return "CUSTOMER"; }

    /* ── Getters / Setters ── */
    public String       getAddress()     { return address; }
    public Cart         getCart()        { return cart; }
    public List<Review> getReviews()     { return List.copyOf(reviews); }

    public void setAddress(String address) { this.address = address; }
}
