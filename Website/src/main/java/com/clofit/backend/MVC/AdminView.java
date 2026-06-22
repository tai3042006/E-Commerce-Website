package com.clofit.backend.MVC;

public class AdminView implements IView {

    @Override
    public void render() {
        System.out.println("Admin Dashboard");
    }

    public void displayDashboard(
            int totalOrders,
            double totalRevenue,
            int productCount,
            int totalCustomers) {

        System.out.println("========= ADMIN DASHBOARD =========");
        System.out.println("Total Orders   : " + totalOrders);
        System.out.printf("Total Revenue  : %,.0f VND%n", totalRevenue);
        System.out.println("Products       : " + productCount);
        System.out.println("Total Customers: " + totalCustomers);
        System.out.println("===================================");
    }

    @Override
    public void displayMessage(String msg) {
        System.out.println("[Admin Dashboard] " + msg);
    }
}
