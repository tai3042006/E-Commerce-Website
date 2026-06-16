package com.clofit.backend.MVC;

import com.store.models.Product;
import com.store.services.CartService;

public class CartController {
    private CartService cartService;
    private CartView cartView;

    public CartController(CartView cartView) {
        this.cartService = CartService.getInstance();
        this.cartView = cartView;
    }

    public void addProductToCart(Product product, int qty, String size, String color) {
        if (product == null) {
            cartView.displayMessage("Sản phẩm không hợp lệ!");
            return;
        }
        if (product.getStock() < qty) {
            cartView.displayMessage("Sản phẩm "" + product.getName() + "" hiện tại không đủ tồn kho cung ứng!");
            return;
        }
        cartService.addToCart(product, qty, size, color);
        cartView.displayMessage("Thêm "" + product.getName() + "" vào giỏ hàng thành công.");
    }

    public void removeProductFromCart(String productId) {
        cartService.removeFromCart(productId);
        cartView.displayMessage("Đã gỡ sản phẩm!");
    }

    public void showCart() {
        cartView.displayCart(cartService.getCart());
    }

    public void cleanAll() {
        cartService.clearCart();
        cartView.displayMessage("Đã dọn sạch giỏ hàng.");
    }
}