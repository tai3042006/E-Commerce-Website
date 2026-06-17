package com.clofit.backend.MVC;

import com.clofit.backend.model.Customer;
import com.clofit.backend.model.Order;
import com.clofit.backend.model.Payment;
import com.clofit.backend.model.Product;

/**
 * <<Controller>> CartController
 */
public class CartController {

    private CartService cartService;
    private CartView cartView;

    public CartController(CartView cartView) {
        this.cartService = CartService.getInstance();
        this.cartView    = cartView;
    }

    public void addProductToCart(Product product, int qty, String size, String color) {
        if (product == null) {
            cartView.displayMessage("Invalid product.");
            return;
        }
        if (qty <= 0) {
            cartView.displayMessage("Quantity must be greater than zero.");
            return;
        }
        if (product.getStock() < qty) {
            cartView.displayMessage(
                    "Product \"" + product.getName() + "\" is currently out of stock.");
            return;
        }
        cartService.addToCart(product, qty, size, color);
        cartView.displayMessage(
                "Product \"" + product.getName() + "\" has been added to your cart successfully.");
    }

    public void removeProductFromCart(String productId) {
        cartService.removeFromCart(productId);
        cartView.displayMessage("Product removed from cart successfully.");
    }

    public void updateCartProducts(String id, int qty) {
        cartService.addCartProducts(id, qty);
        cartView.displayMessage("Cart updated.");
    }

    public void viewCart() {
        cartView.displayCart(cartService.getCart());
    }

    public void cleanAll() {
        cartService.clearCart();
        cartView.displayMessage("Your cart has been cleared.");
    }

    /**
     * checkout delegates directly to OrderService — no OrderController/OrderView
     * instantiated here, keeping CartController's dependency only on CartService
     * and OrderService as shown in the diagram.
     */
    public Order checkout(Customer customer, Payment paymentMethod) {
        try {
            Order order = OrderService.getInstance()
                    .createOrder(cartService, customer, paymentMethod.getMethod());
            cartView.displayMessage("Checkout successful. Order ID: " + order.getId());
            return order;
        } catch (Exception e) {
            cartView.displayMessage("Checkout failed: " + e.getMessage());
            return null;
        }
    }
}
