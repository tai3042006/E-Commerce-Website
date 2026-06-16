package com.clofit.model;


public class OrderItem {
    private Product product;
    private int quantity;
    private double price;

    public OrderItem(Product product, int quantity, double price) {
        this.product = product;
        this.quantity = quantity;
        this.price = price;
    }

    public double getSubTotal() {
        return price * quantity;
    }

    public Product getProduct() { return product; }
    public int getQuantity() { return quantity; }
    public double getPrice() { return price; }
}