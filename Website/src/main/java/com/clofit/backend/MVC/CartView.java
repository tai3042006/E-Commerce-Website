package com.clofit.backend.MVC;

import com.clofit.backend.model.Cart;
import com.clofit.backend.model.CartItem;

public class CartView implements IView {

    @Override
    public void render() {
    }

    public void displayCart(Cart cart) {
        System.out.println("============== SHOPPING CART ==============");

        if (cart.getItems().isEmpty()) {
            System.out.println("Your cart is currently empty.");
        } else {

            for (CartItem item : cart.getItems()) {

                System.out.printf(
                        "- %-18s (Size: %-3s, Color: %-8s) | Unit Price: %.2f VND | Quantity: %2d | Subtotal: %.2f VND%n",
                        item.getProduct().getName(),
                        item.getSize(),
                        item.getColor(),
                        item.getProduct().getPrice(),
                        item.getQuantity(),
                        item.getSubTotal());
            }

            System.out.println("-------------------------------------------");
            System.out.printf(
                    "TOTAL CART VALUE: %.2f VND%n",
                    cart.getTotal());
        }

        System.out.println("===========================================\n");
    }

    @Override
    public void displayMessage(String msg) {
        System.out.println("[Cart] " + msg);
    }
}