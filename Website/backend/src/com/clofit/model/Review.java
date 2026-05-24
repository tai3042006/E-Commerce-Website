package com.clofit.model;

import java.time.LocalDateTime;

/**
 * Review — đánh giá sản phẩm.
 * Quan hệ: Customer 1-N Review, Product 1-N Review
 * Review là cầu nối giữa Customer và Product (per class diagram §2.5)
 */
public class Review {

    private final int           reviewId;
    private final Customer      customer;    // N-1 Customer
    private final Product       product;    // N-1 Product
    private final int           rating;     // 1-5
    private final String        comment;
    private final LocalDateTime createdAt;
    private       boolean       verified;   // verified purchase

    private static int idCounter = 1;

    public Review(Customer customer, Product product, int rating, String comment) {
        if (rating < 1 || rating > 5)
            throw new IllegalArgumentException("Rating must be 1–5");
        this.reviewId  = idCounter++;
        this.customer  = customer;
        this.product   = product;
        this.rating    = rating;
        this.comment   = comment;
        this.createdAt = LocalDateTime.now();
        this.verified  = false;
    }

    /* ── Getters ── */
    public int           getReviewId()  { return reviewId; }
    public Customer      getCustomer()  { return customer; }
    public Product       getProduct()   { return product; }
    public int           getRating()    { return rating; }
    public String        getComment()   { return comment; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public boolean       isVerified()   { return verified; }

    public void setVerified(boolean verified) { this.verified = verified; }

    @Override
    public String toString() {
        return String.format("Review{id=%d, product='%s', rating=%d, by='%s', verified=%b}",
                reviewId, product.getName(), rating, customer.getName(), verified);
    }
}
