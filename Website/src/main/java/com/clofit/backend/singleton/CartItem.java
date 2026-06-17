package com.clofit.backend.singleton;

import com.clofit.backend.model.Product;

public class CartItem {

    private Product product;
    private int quantity;
    private String size;
    private String color;

    public CartItem(Product product,
            int quantity,
            String size,
            String color) {

        this.product = product;
        this.quantity = quantity;
        this.size = size;
        this.color = color;
    }

    public double getSubtotal() {
        return product.getPrice() * quantity;
    }

    public Product getProduct() {
        return product;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}