package com.clofit.model;

/**
 * OrderItem — chi tiết đơn hàng (snapshot tại thời điểm mua).
 * Quan hệ: Order 1-N OrderItem, OrderItem N-1 Product
 *
 * Khác CartItem: OrderItem là immutable snapshot (giá, tên sản phẩm
 * không thay đổi dù Product bị chỉnh sau đó).
 */
public class OrderItem {

    private final int    orderItemId;
    private final int    productId;      // reference — không giữ live Product
    private final String productName;   // snapshot
    private final double unitPrice;     // snapshot
    private final int    quantity;
    private final String category;

    private static int idCounter = 1;

    public OrderItem(CartItem cartItem) {
        this.orderItemId  = idCounter++;
        this.productId    = cartItem.getProduct().getId();
        this.productName  = cartItem.getProduct().getName();
        this.unitPrice    = cartItem.getUnitPrice();
        this.quantity     = cartItem.getQuantity();
        this.category     = cartItem.getProduct().getCategory().getName();
    }

    public double getLineTotal() { return unitPrice * quantity; }

    /* ── Getters (all final — immutable) ── */
    public int    getOrderItemId() { return orderItemId; }
    public int    getProductId()   { return productId; }
    public String getProductName() { return productName; }
    public double getUnitPrice()   { return unitPrice; }
    public int    getQuantity()    { return quantity; }
    public String getCategory()    { return category; }

    @Override
    public String toString() {
        return String.format("  %2dx %-30s  @ $%6.2f = $%7.2f",
                quantity, productName, unitPrice, getLineTotal());
    }
}
