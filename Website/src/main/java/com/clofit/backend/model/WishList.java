package com.clofit.backend.model;

import java.util.ArrayList;
import java.util.List;

public class WishList {

    private String id;
    private List<Product> items;

    public WishList(String id) {
        this.id = id;
        this.items = new ArrayList<>();
    }

    public void addItem(Product p) {
        if (!containsProduct(p)) {
            items.add(p);
            System.out.println("[Favorite]: Added to Favorite: " + p.getName());
        }
    }

    public void addProduct(Product p) {
        addItem(p);
    }

    public void removeItem(Product p) {
        items.removeIf(item -> item.getId().equals(p.getId()));
        System.out.println("[Favorite]: Removed from Favorite: " + p.getName());
    }

    public void removeProduct(Product p) {
        removeItem(p);
    }

    public boolean containsProduct(Product p) {
        for (Product item : items) {
            if (item.getId().equals(p.getId()))
                return true;
        }
        return false;
    }

    public boolean manageItems(String action) {

        return action != null && !action.isEmpty();
    }

    public List<Product> getItems() {
        return items;
    }

    public String getId() {
        return id;
    }
}
