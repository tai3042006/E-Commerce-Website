package com.clofit.backend.MVC;

import com.store.models.Order;
import com.store.models.OrderItem;
import java.util.List;

public class OrderView implements IView {
    
    @Override
    public void render() {}

    public void displayOrder(Order order) {
        System.out.println("
============ XÁC NHẬN HÓA ĐƠN ============");
        System.out.println("Mã Đơn hàng: " + order.getId());
        System.out.println("Ngày phát hóa: " + order.getState().getStatus());
        System.out.println("Trạng thái hiện tại: " + order.getState().getStatus().toUpperCase());
        System.out.println("----------------------------------------------");
        System.out.println("Nội dung dòng vệt hàng:");
        for (OrderItem item : order.getItems()) {
            System.out.printf("  + %20s | Đơn giá: %.1f VND | SL: %d | Th.Tiền: %.1f VND
",
                    item.getProduct().getName(), item.getPrice(), item.getQuantity(), item.getSubTotal());
        }
        System.out.println("----------------------------------------------");
        System.out.printf("TỔNG THANH TOÁN: %.1f VND
", order.getTotal());
        System.out.println("==============================================
");
    }

    public void displayOrdersList(List<Order> orders) {
        System.out.println("
============ LỊCH SỬ ĐƠN HÀNG TOÀN CỦA HÀNG ============");
        if (orders.isEmpty()) {
            System.out.println("(Không có đơn hàng nào trên hệ thống)");
        } else {
            for (Order o : orders) {
                System.out.printf("Đơn #%s | Ngày mua: %s | Giá trị: %.1f VND | Trạng thái: [%s]
",
                        o.getId(), o.getId().substring(4), o.getTotal(), o.getState().getStatus());
            }
        }
        System.out.println("=======================================================
");
    }

    @Override
    public void displayMessage(String msg) {
        System.out.println("[Phần Mềm Đơn Hàng]: " + msg);
    }
}