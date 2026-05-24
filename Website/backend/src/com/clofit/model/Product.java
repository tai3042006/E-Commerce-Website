package com.clofit.model;

import java.util.ArrayList;
import java.util.List;

/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║ Product — Entity Class ║
 * ║ Observer SUBJECT: khi thay đổi stock/price, ║
 * ║ gọi notifyObservers() → User.update(message) ║
 * ║ Quan hệ: Product N-1 Category, Product 1-N Review ║
 * ╚══════════════════════════════════════════════════════════════╝
 */
public class Product {

    // ── Encapsulation: all private ──
    private final int id;
    private String name;
    private String description;
    private double price;
    private Double originalPrice;
    private double rating;
    private int reviewCount;
    private String badge;
    private int stock;
    private Category category; // N-1 Category
    private String[] images; // image paths / emojis

    // ── Observer: list of subscribed users ──
    private final List<User> observers = new ArrayList<>(); // User 1-N Notification
    private final List<Review> reviews = new ArrayList<>(); // Product 1-N Review

    public Product(int id, String name, String category,
            double price, Double originalPrice,
            double rating, int reviewCount,
            String badge, int stock) {
        this.id = id;
        this.name = name;
        this.description = "Premium quality " + name;
        this.price = price;
        this.originalPrice = originalPrice;
        this.rating = rating;
        this.reviewCount = reviewCount;
        this.badge = badge;
        this.stock = stock;
        this.category = new Category(category, "");
        this.images = new String[] {};
    }

    /* ── Observer Pattern: Product as Subject ── */

    public void registerObserver(User user) {
        if (!observers.contains(user))
            observers.add(user);
    }

    public void removeObserver(User user) {
        observers.remove(user);
    }

    /**
     * notifyObservers() — per class diagram §2.4
     * Called when stock or price changes.
     */
    public void notifyObservers(String message) {
        observers.forEach(u -> u.update(message));
    }

    /* ── Stock management (Encapsulation example) ── */

    /**
     * updateStock() — only way to mutate stock from outside.
     * Tính đóng gói: stock không thể sửa trực tiếp.
     */
    public void updateStock(int delta) {
        int before = this.stock;
        this.stock = Math.max(0, this.stock + delta);
        if (this.stock < 10) {
            notifyObservers("⚠️ Low stock alert for: " + name +
                    " (" + this.stock + " left)");
        }
        if (before > 0 && this.stock == 0) {
            notifyObservers("❌ Out of stock: " + name);
        }
    }

    /* ── Review integration ── */

    public void addReview(Review review) {
        reviews.add(review);
        // Recalculate average rating
        this.reviewCount = reviews.size();
        this.rating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(rating);
    }

    public List<Review> getReviews() {
        return List.copyOf(reviews);
    }

    /* ── Getters ── */
    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public double getPrice() {
        return price;
    }

    public Double getOriginalPrice() {
        return originalPrice;
    }

    public double getRating() {
        return rating;
    }

    public int getReviewCount() {
        return reviewCount;
    }

    public String getBadge() {
        return badge;
    }

    public int getStock() {
        return stock;
    }

    public Category getCategory() {
        return category;
    }

    public String[] getImages() {
        return images;
    }

    /* ── Setters ── */
    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String desc) {
        this.description = desc;
    }

    public void setPrice(double price) {
        this.price = price;
        notifyObservers("💰 Price updated for: " + name + " → $" + price);
    }

    public void setBadge(String badge) {
        this.badge = badge;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public void setImages(String[] images) {
        this.images = images;
    }

    // Direct stock setter (for InventoryObserver restocking)
    public void setStock(int stock) {
        this.stock = stock;
    }

    public boolean isInStock() {
        return stock > 0;
    }

    @Override
    public String toString() {
        return String.format("Product{id=%d, name='%s', category='%s', price=%.2f, stock=%d}",
                id, name, category.getName(), price, stock);
    }
public String toJson() {

    return String.format("""
        {
          "id": %d,
          "name": "%s",
          "price": %.2f,
          "stock": %d,
          "category": "%s",
          "rating": %.1f
        }
        """,
        id,
        name,
        price,
        stock,
        category.getName(),
        rating
    );
}
