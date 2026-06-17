package com.clofit.backend.model;

/**
 * <<Model>> CartItem
 * Diagram:
 *   product: Product
 *   size: String
 *   color: String
 *   quantity: int
 *   getProduct(): Product
 *   getSubTotal(): double
 *   getQuantity(): int
 *   setQuantity(int): void
 */
public class CartItem {

    private Product product;
    private int quantity;
    private String size;
    private String color;

    public CartItem(Product product, int quantity, String size, String color) {
        this.product  = product;
        this.quantity = quantity;
        this.size     = size;
        this.color    = color;
    }

    public double getSubTotal() {
        return product.getPrice() * quantity;
    }

    public Product getProduct()              { return product; }
    public void setProduct(Product product)  { this.product = product; }

    public int getQuantity()                 { return quantity; }
    public void setQuantity(int quantity)    { this.quantity = quantity; }

    public String getSize()                  { return size; }
    public void setSize(String size)         { this.size = size; }

    public String getColor()                 { return color; }
    public void setColor(String color)       { this.color = color; }
}
