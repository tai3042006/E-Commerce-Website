package com.clofit.backend.MVC;

import com.store.models.Product;
import java.util.List;

public class ProductView implements IView {
    
    @Override
    public void render() {}

    public void displayProducts(List<Product> products, String filterInfo) {
        System.out.println("
----------- DANH SÁCH QUẦN ÁO THỜI TRANG (" + filterInfo + ") -----------");
        if (products.isEmpty()) {
            System.out.println("(Không tìm thấy bộ quần áo phù hợp tiêu chí)");
        } else {
            for (Product p : products) {
                System.out.printf("[%s] %-25s | Phân loại: %-10s | Giá: %-11.1f VND | [Tồn kho: %d, Đánh giá: %.1f sao]
", 
                        p.getId(), p.getName(), p.getCategory().getName(), p.getPrice(), p.getStock(), p.getRating());
            }
        }
        System.out.println("----------------------------------------------------------------------
");
    }

    public void displayProductDetail(Product p) {
        System.out.println("
============= CHI TIẾT SẢN PHẨM SẢN PHẨM =============");
        System.out.println("Mã ID: " + p.getId());
        System.out.println("Tên Gọi: " + p.getName());
        System.out.println("Phân khúc: " + p.getCategory().getName());
        System.out.println("Giá thành: " + p.getPrice() + " VND");
        System.out.println("Mô tả: " + p.getDescription());
        System.out.println("Còn hàng: " + p.getStock() + " chiếc");
        System.out.println("Điểm số: " + p.getRating() + " / 5 sao");
        System.out.println("====================================================
");
    }

    public void displayFilterOptions() {
        System.out.println("Mẹo: Áp dụng Lọc theo Category, Giá tiền hoặc Điểm đánh giá để dễ dàng mua sắm!");
    }

    @Override
    public void displayMessage(String msg) {
        System.out.println("[Catalog Quần Áo]: " + msg);
    }
}