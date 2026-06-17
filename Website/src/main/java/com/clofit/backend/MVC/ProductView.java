package com.clofit.backend.MVC;

import com.clofit.backend.model.Product;
import java.util.List;

public class ProductView implements IView {
    
    @Override
    public void render() {}

    public void displayProducts(List<Product> products, String filterInfo) {
        System.out.println("----------- PRODUCT LIST (" + filterInfo + ") -----------");
        if (products.isEmpty()) {
            System.out.println("(No matching products found)");
        } else {
            for (Product p : products) {
                System.out.printf("[%s] %-25s | Category: %-10s | Price: %-11.1f VND | [Stock: %d, Rating: %.1f stars]", 
                        p.getId(), p.getName(), p.getCategory().getName(), p.getPrice(), p.getStock(), p.getRating());
            }
        }
        System.out.println("----------------------------------------------------------------------------------------");
    }

    public void displayProductDetail(Product p) {
        System.out.println("============= PRODUCT DETAILS =============");
        System.out.println("ID: " + p.getId());
        System.out.println("Name: " + p.getName());
        System.out.println("Category: " + p.getCategory().getName());
        System.out.println("Price: " + p.getPrice() + " VND");
        System.out.println("Description: " + p.getDescription());
        System.out.println("Stock: " + p.getStock() + " pieces");
        System.out.println("Rating: " + p.getRating() + " / 5 stars");
        System.out.println("====================================================");
    }

    public void displayFilterOptions() {
        System.out.println("Tip: Apply filtering by Category, Price, or Rating to easily find your desired items!");
    }

    @Override
    public void displayMessage(String msg) {
        System.out.println("[Catalog]: " + msg);
    }
}