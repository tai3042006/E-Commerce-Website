package com.clofit.backend.MVC;

import com.clofit.backend.model.Customer;
import com.clofit.backend.model.Order;

public class OrderController {

    private final OrderService orderService;
    private final OrderView orderView;

    public OrderController(OrderView orderView) {
        this.orderView = orderView;
        this.orderService = OrderService.getInstance();
    }

    public Order checkout(Customer customer, String paymentMethod) {

        try {

            CartService cartService = CartService.getInstance();

            Order order = orderService.createOrder(
                    cartService,
                    customer,
                    paymentMethod);

            orderView.displayMessage(
                    "Order created successfully.");

            orderView.displayOrder(order);

            return order;

        } catch (Exception e) {

            orderView.displayMessage(
                    "Checkout failed: " + e.getMessage());

            return null;
        }
    }
}