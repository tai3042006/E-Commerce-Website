package com.clofit.controller;

import com.clofit.model.Order;
import com.clofit.observer.OrderService;

import java.util.List;
import java.util.Map;

public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    public ApiResponse<List<Order>> getAllOrders() {

        return ApiResponse.ok(
                orderService.getAllOrders(),
                "Orders fetched successfully"
        );
    }

    public ApiResponse<Order> updateStatus(
            String orderId,
            Map<String, String> body
    ) {

        try {

            String statusText = body.get("status");

            Order.Status status =
                    Order.Status.valueOf(statusText.toUpperCase());

            Order order =
                    orderService.updateStatus(orderId, status);

            return ApiResponse.ok(order, "Order updated");

        } catch (Exception e) {

            return ApiResponse.badRequest(e.getMessage());
        }
    }
}
