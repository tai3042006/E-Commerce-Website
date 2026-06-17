package com.clofit.backend.singleton;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Cart {

    private String id;
    private List<CartItem> items;

    public Cart() {
        this.id = UUID.randomUUID().toString();
        this.items = new ArrayList<>();
    }

    public void addItem(CartItem item) {
        items.add(item);
    }

    public void removeItem(String productId) {
        items.removeIf(
            item -> item.getProduct().getId().equals(productId)
        );
    }

    public void updateQuantity(String productId, int qty) {

        for (CartItem item : items) {

            if (item.getProduct().getId().equals(productId)) {

                item.setQuantity(qty);
                return;
            }
        }
    }

    public double getTotal() {

        double total = 0;

        for (CartItem item : items) {
            total += item.getQuantity()
                    * item.getProduct().getPrice();
        }

        return total;
    }

    public int getItemCount() {

        int count = 0;

        for (CartItem item : items) {
            count += item.getQuantity();
        }

        return count;
    }

    public void clear() {
        items.clear();
    }

    public List<CartItem> getItems() {
        return items;
    }


    
}