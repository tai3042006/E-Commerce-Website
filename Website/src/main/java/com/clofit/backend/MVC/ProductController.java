package com.clofit.backend.MVC;

import com.store.models.Product;
import com.store.services.ProductCatalog;
import com.store.strategy.ProductFilterContext;
import com.store.strategy.FilterStrategy;
import java.util.List;

public class ProductController {
    private ProductCatalog catalog;
    private ProductView view;
    private ProductFilterContext filterContext;

    public ProductController(ProductView view) {
        this.catalog = ProductCatalog.getInstance();
        this.view = view;
        this.filterContext = new ProductFilterContext();
    }

    public void addProduct(String name, double price, int stock, com.store.models.Category category) {
        com.store.factory.ProductFactory factory = new com.store.factory.ProductFactory();
        Product p = factory.createProduct(name, price, stock, category);
        catalog.addProduct(p);
    }

    public void setFilterStrategy(FilterStrategy strategy) {
        filterContext.setStrategy(strategy);
        view.displayMessage("Đã bật bộ lọc: " + filterContext.getCurrentStrategyName());
    }

    public void displayAvailableProducts() {
        List<Product> all = catalog.getProducts();
        List<Product> filtered = filterContext.executeFilter(all);
        view.displayProducts(filtered, filterContext.getCurrentStrategyName());
    }

    public void searchProducts(String keyword) {
        List<Product> matches = catalog.searchByKey(keyword);
        view.displayProducts(matches, "Tìm kiếm từ khoá: " + keyword);
    }

    public void showProductDetail(String id) {
        Product p = catalog.getProductById(id);
        if (p != null) {
            view.displayProductDetail(p);
        } else {
            view.displayMessage("Lỗi: Không tìm thấy trang phục có mã số này!");
        }
    }
}