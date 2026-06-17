package com.clofit.backend.MVC;

import java.util.ArrayList;
import java.util.List;

import com.clofit.backend.model.Product;
import com.clofit.backend.observer.IObserver;

public class ProductCatalog {
    private static ProductCatalog instance;
    private List<Product> products;
    private List<IObserver> observers;

    private ProductCatalog() {
        products = new ArrayList<>();
        observers = new ArrayList<>();
    }

    public static ProductCatalog getInstance() {
        if (instance == null) {
            instance = new ProductCatalog();
        }
        return instance;
    }

    public void addProduct(Product product) {
        products.add(product);
    }

    public void removeProduct(String productId) {
        products.removeIf(p -> p.getId().equals(productId));
    }

    public Product getProductById(String id) {
        return products.stream()
                .filter(p -> p.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    public List<Product> getAllProducts() {
        return products;
    }

    public List<Product> searchByKeyword(String keyword) {
        List<Product> results = new ArrayList<>();
        for (Product p : products) {
            if (p.getName().toLowerCase().contains(keyword.toLowerCase()) ||
                    p.getDescription().toLowerCase().contains(keyword.toLowerCase())) {
                results.add(p);
            }
        }
        return results;
    }

    public void subscribe(IObserver observer) {
        observers.add(observer);
    }

    public void unsubscribe(IObserver observer) {
        observers.remove(observer);
    }

    public void notifyObservers(String event, Object data) {
        for (IObserver observer : observers) {
            observer.update(event, data);
        }
    }

}
