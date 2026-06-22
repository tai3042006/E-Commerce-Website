package com.clofit.backend.model;

import java.util.ArrayList;
import java.util.List;

/**
 * <<Model>> Cart
 * Diagram:
 *   id: String
 *   items: List<CartItem>
 *   addItem(CartItem): void
 *   removeItem(String productId): void
 *   updateQuantity(String productId, int): void
 *   getTotal(): double
 *   clear(): void
 *   getItems(): List<CartItem>
 */
public class Cart {

    private String id;
    private List<CartItem> items;

    public Cart(String id) {
        this.id    = id;
        this.items = new ArrayList<>();
    }

    public void addItem(CartItem newItem) {
        for (CartItem item : items) {
            if (item.getProduct().getId().equals(newItem.getProduct().getId()) &&
                item.getSize().equalsIgnoreCase(newItem.getSize()) &&
                item.getColor().equalsIgnoreCase(newItem.getColor())) {
                item.setQuantity(item.getQuantity() + newItem.getQuantity());
                return;
            }
        }
        items.add(newItem);
    }

    public void removeItem(String productId) {
        items.removeIf(item -> item.getProduct().getId().equals(productId));
    }

    public void updateQuantity(String productId, int qty) {
        for (CartItem item : items) {
            if (item.getProduct().getId().equals(productId)) {
                item.setQuantity(qty);
                break;
            }
        }
    }

    public double getTotal() {
        double total = 0;
        for (CartItem item : items) {
            total += item.getSubTotal();
        }
        return total;
    }

    public void clear() {
        items.clear();
    }

    public List<CartItem> getItems() { return items; }
    public String getId()            { return id; }
}
