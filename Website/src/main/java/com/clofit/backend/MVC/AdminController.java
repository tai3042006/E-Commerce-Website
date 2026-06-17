package com.clofit.backend.MVC;

import com.clofit.backend.model.Order;
import com.clofit.backend.observer.IObserver;

import java.util.List;

public class AdminController {

    private AdminService adminService;
    private OrderView orderView;

    public AdminController(OrderView orderView) {
        this.adminService = AdminService.getInstance();
        this.orderView = orderView;
    }

    public void displayRevenue(double totalRevenue, int totalCustomers) {
        AdminView adminView = new AdminView();
        List<Order> allOrders = adminService.getOrderService().getAllOrders();
        adminView.displayDashboard(
                allOrders.size(),
                totalRevenue,
                0,
                totalCustomers);
    }

    public void cancelOrder(String orderId) {
        adminService.getOrderService().cancelOrder(orderId);
        orderView.displayMessage("Order " + orderId + " has been cancelled.");
    }

    public List<Order> getAllOrders() {
        return adminService.getOrderService().getAllOrders();
    }

    public void addAllObservers(IObserver observer) {
        adminService.addObserver(observer);
    }
}
