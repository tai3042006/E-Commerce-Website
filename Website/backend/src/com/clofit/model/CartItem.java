package com.clofit.model;

/**
 * CartItem — chi tiết giỏ hàng.
 * Quan hệ: Cart 1-N CartItem, CartItem N-1 Product
 */
public class CartItem {

    private final int     cartItemId;
    private final Product product;    // N-1 Product
    private int           quantity;
    private final double  unitPrice;  // price snapshot at time of adding

    private static int idCounter = 1;

    public CartItem(Product product, int quantity) {
        this.cartItemId = idCounter++;
        this.product    = product;
        this.quantity   = quantity;
        this.unitPrice  = product.getPrice();
    }

    public double getLineTotal() { return unitPrice * quantity; }

    /* ── Getters / Setters ── */
    public int     getCartItemId() { return cartItemId; }
    public Product getProduct()    { return product; }
    public int     getQuantity()   { return quantity; }
    public double  getUnitPrice()  { return unitPrice; }

    public void setQuantity(int quantity) {
        if (quantity < 0) throw new IllegalArgumentException("Quantity cannot be negative");
        this.quantity = quantity;
    }

    @Override
    public String toString() {
        return String.format("CartItem{id=%d, product='%s', qty=%d, total=%.2f}",
                cartItemId, product.getName(), quantity, getLineTotal());
    }
}
