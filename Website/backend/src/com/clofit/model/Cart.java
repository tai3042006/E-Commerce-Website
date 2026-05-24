package com.clofit.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Cart — giỏ hàng của Customer.
 * Quan hệ: User 1-1 Cart, Cart 1-N CartItem
 *
 * Sequence diagram §2: Cart Controller thêm CartItem vào Cart
 */
public class Cart {

    private final int          cartId;
    private final int          userId;
    private final List<CartItem> cartItems = new ArrayList<>(); // 1-N CartItem

    private static int idCounter = 1;

    public Cart(int userId) {
        this.cartId = idCounter++;
        this.userId = userId;
    }

    /* ── Methods per class diagram ── */

    /**
     * addItem() — thêm sản phẩm vào giỏ.
     * Nếu sản phẩm đã có, tăng số lượng.
     */
    public CartItem addItem(Product product, int quantity) {
        if (!product.isInStock()) {
            throw new IllegalStateException("Product out of stock: " + product.getName());
        }
        Optional<CartItem> existing = cartItems.stream()
                .filter(ci -> ci.getProduct().getId() == product.getId())
                .findFirst();
        if (existing.isPresent()) {
            existing.get().setQuantity(existing.get().getQuantity() + quantity);
            return existing.get();
        }
        CartItem item = new CartItem(product, quantity);
        cartItems.add(item);
        return item;
    }

    /**
     * removeItem() — xóa sản phẩm khỏi giỏ theo productId.
     */
    public boolean removeItem(int productId) {
        return cartItems.removeIf(ci -> ci.getProduct().getId() == productId);
    }

    /**
     * updateQuantity() — cập nhật số lượng. quantity=0 → xóa item.
     */
    public void updateQuantity(int productId, int quantity) {
        if (quantity <= 0) { removeItem(productId); return; }
        cartItems.stream()
                .filter(ci -> ci.getProduct().getId() == productId)
                .findFirst()
                .ifPresent(ci -> ci.setQuantity(quantity));
    }

    /**
     * getTotal() — tổng tiền giỏ hàng.
     */
    public double getTotal() {
        return cartItems.stream().mapToDouble(CartItem::getLineTotal).sum();
    }

    /**
     * checkout() — chuyển Cart → Order (per sequence diagram §3).
     */
    public Order checkout(Customer customer, PaymentInfo paymentInfo) {
        if (isEmpty()) throw new IllegalStateException("Cannot checkout empty cart");
        return new Order(customer, new ArrayList<>(cartItems), paymentInfo);
    }

    public void clear() { cartItems.clear(); }

    public boolean isEmpty() { return cartItems.isEmpty(); }

    /* ── Getters ── */
    public int              getCartId()   { return cartId; }
    public int              getUserId()   { return userId; }
    public List<CartItem>   getCartItems(){ return List.copyOf(cartItems); }
    public int              getItemCount(){ return cartItems.stream().mapToInt(CartItem::getQuantity).sum(); }

    @Override
    public String toString() {
        return String.format("Cart{id=%d, userId=%d, items=%d, total=%.2f}",
                cartId, userId, cartItems.size(), getTotal());
    }
}
