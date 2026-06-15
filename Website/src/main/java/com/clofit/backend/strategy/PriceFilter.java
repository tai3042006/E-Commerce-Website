package com.clofit.backend.strategy;

import com.clofit.model.Product;
import java.util.ArrayList;
import java.util.List;

public class PriceFilter implements IFilterStrategy {

    private double minPrice;
    private double maxPrice;

    public PriceFilter(double minPrice, double maxPrice) {
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
    }

    @Override
    public List<Product> filter(List<Product> products) {
        List<Product> result = new ArrayList<>();
        if (products == null) {
            return result;
        }
        for (Product product : products) {
            if (product != null && product.getPrice() >= minPrice && product.getPrice() <= maxPrice) {
                result.add(product);
            }
        }
        return result;
    }

    @Override
    public String getStrategyName() {
        return "Price Filter";
    }
}