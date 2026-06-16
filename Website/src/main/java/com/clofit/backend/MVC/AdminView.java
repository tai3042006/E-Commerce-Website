package com.clofit.backend.MVC;

import com.store.models.Product;
import com.store.models.Order;
import java.util.List;

public class AdminView implements IView {
    
    @Override
    public void render() {}

    public void displayDashboard(int totalOrders, double totalRevenue, int productCatalogCount, int observerCount) {
        System.out.println("
========= BẢNG THỐNG KÊ QUẢN TRỊ ADMIN =========");
        System.out.println(" Tổng số lượng đơn hàng: " + totalOrders);
        System.out.println(" Tổng doanh thu mang về: " + totalRevenue + " VND");
        System.out.println(" Số lượng quần áo trong Catalog: " + productCatalogCount);
        System.out.println(" Số lượng lắng nghe hệ thống (Observers): " + observerCount);
        System.out.println("===================================================
");
    }

    @Override
    public void displayMessage(String msg) {
        System.out.println("[Kênh Ban Quản Trị]: " + msg);
    }
}