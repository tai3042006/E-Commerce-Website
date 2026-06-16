package com.clofit.backend.MVC;

import com.store.models.Customer;
import com.store.models.Order;
import com.store.services.OrderService;
import com.store.services.CartService;

public class OrderController {
    private OrderService orderService;
    private OrderView orderView;

    public OrderController(OrderView orderView) {
        this.orderService = OrderService.getInstance();
        this.orderView = orderView;
    }

    public Order checkout(Customer customer, String paymentMethod) {
        try {
            CartService cartService = CartService.getInstance();
            Order order = orderService.createOrder(cartService, customer, paymentMethod);
            orderView.displayMessage("Tạo hóa đơn thành công và tự động clear giỏ hàng!");
            orderView.displayOrder(order);
            return order;
        } catch (Exception e) {
            orderView.displayMessage("Thanh toán bất thành: " + e.getMessage());
            return null;
        }
    }

    public void updateOrderStatus(String orderId) {
        orderService.advanceOrderStatus(orderId);
    }

    public void cancelOrder(String orderId) {
        orderService.cancelOrder(orderId);
    }

    public void viewAllOrders() {
        orderView.displayOrdersList(orderService.getOrders());
    }
}