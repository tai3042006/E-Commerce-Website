package com.clofit.backend.MVC;

import com.clofit.backend.model.Cart;
import com.clofit.backend.model.CartItem;
import com.clofit.backend.model.Product;

public class CartService {

    private static CartService instance;
    private Cart cart;

    private CartService() {
        this.cart = new Cart("CART-" + java.util.UUID.randomUUID().toString());
    }

    public static CartService getInstance() {
        if (instance == null) {
            instance = new CartService();
        }
        return instance;
    }

    public void addToCart(Product product, int quantity, String size, String color) {
        CartItem item = new CartItem(product, quantity, size, color);
        cart.addItem(item);
    }

    public void removeFromCart(String productId) {
        cart.removeItem(productId);
    }

    public void addCartProducts(String productId, int qty) {
        cart.updateQuantity(productId, qty);
    }

    public void updateQuantity(String productId, int quantity) {
        cart.updateQuantity(productId, quantity);
    }

    public void clearCart() {
        cart.clear();
    }

    public Cart getCart() {
        return cart;
    }

    public double getTotal() {
        return cart.getTotal();
    }

    public double getCartTotal() {
        return cart.getTotal();
    }
}
