package com.clofit.backend.model;

/**
 * <<Model>> OrderItem
 * Diagram:
 *   product: Product
 *   quantity: int
 *   price: double
 *   getProduct(): Product
 *   getSubTotal(): double
 *   getPrice(): double
 *   getQuantity(): int
 */
public class OrderItem {

    private Product product;
    private int quantity;
    private double price;

    public OrderItem(Product product, int quantity, double price) {
        this.product  = product;
        this.quantity = quantity;
        this.price    = price;
    }

    public double getSubTotal() { return price * quantity; }

    public Product getProduct() { return product; }
    public int getQuantity()    { return quantity; }
    public double getPrice()    { return price; }
}
