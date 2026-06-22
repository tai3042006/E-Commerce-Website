package com.clofit.backend.MVC;

import com.clofit.backend.model.Order;
import com.clofit.backend.model.OrderItem;

import java.util.List;

public class OrderView implements IView {

    @Override
    public void render() {
    }

    public void displayOrder(Order order) {

        System.out.println("\n============ ORDER CONFIRMATION ============");
        System.out.println("Order ID: " + order.getId());
        System.out.println(
                "Current Status: "
                        + order.getState().getStatus()
                        + " | Last Updated: "
                        + order.getState());

        System.out.println("--------------------------------------------");
        System.out.println("Order Items:");

        for (OrderItem item : order.getItems()) {

            System.out.printf(
                    " + %-20s | Unit Price: %.2f VND | Qty: %d | Subtotal: %.2f VND%n",
                    item.getProduct().getName(),
                    item.getPrice(),
                    item.getQuantity(),
                    item.getSubTotal());
        }

        System.out.println("--------------------------------------------");

        System.out.printf(
                "TOTAL AMOUNT: %.2f VND%n",
                order.getTotal());

        System.out.println("============================================\n");
    }

    public void displayOrdersList(List<Order> orders) {

        System.out.println("\n============== ORDER HISTORY ==============");

        if (orders.isEmpty()) {

            System.out.println("No orders found.");

        } else {

            for (Order order : orders) {

                System.out.printf(
                        "Order #%s | Total: %.2f VND | Status: [%s]%n",
                        order.getId(),
                        order.getTotal(),
                        order.getState().getStatus());
            }
        }

        System.out.println("===========================================\n");
    }

    @Override
    public void displayMessage(String msg) {
        System.out.println("[Order System] " + msg);
    }
}