package com.clofit.model;

import java.util.ArrayList;
import java.util.List;

public class WishList {
    private String id;
    private List<Product> items;

    public WishList(String id) {
        this.id = id;
        this.items = new ArrayList<>();
    }

    public void addProduct(Product p) {
        if (!containsProduct(p)) {
            items.add(p);
            System.out.println("[Yêu thích]: Đã lưu bộ quần áo "" + p.getName() + "" vào Ưu thích.");
        }
    }

    public void removeProduct(Product p) {
        items.removeIf(item -> item.getId().equals(p.getId()));
        System.out.println("[Yêu thích]: Đã rút quần áo "" + p.getName() + "" khỏi Ưu thích.");
    }

    public boolean containsProduct(Product p) {
        for (Product item : items) {
            if (item.getId().equals(p.getId())) return true;
        }
        return false;
    }

    public List<Product> getItems() {
        return items;
    }
}