package com.clofit.backend.MVC;

import com.store.models.Cart;
import com.store.models.CartItem;

public class CartView implements IView {
    
    @Override
    public void render() {}

    public void displayCart(Cart cart) {
        System.out.println("
============ GIỎ HÀNG CỦA BẠN ============");
        if (cart.getItems().isEmpty()) {
            System.out.println("Giỏ hàng của bạn đang trống! Hãy chọn những bộ cánh ưng ý nhất.");
        } else {
            for (CartItem item : cart.getItems()) {
                System.out.printf("- %-18s (Size: %-3s, Màu: %-5s) | Đơn giá: %.1f VND | Số lượng: %2d -> Thành tiền: %.1f VND
",
                        item.getProduct().getName(), item.getSize(), item.getColor(), 
                        item.getProduct().getPrice(), item.getQuantity(), item.getSubTotal());
            }
            System.out.println("----------------------------------------------");
            System.out.printf("TỔNG GIÁ TRỊ GIỎ HÀNG: %.1f VND
", cart.getTotal());
        }
        System.out.println("==============================================
");
    }

    @Override
    public void displayMessage(String msg) {
        System.out.println("[Giỏ Hàng]: " + msg);
    }
}