package com.clofit.backend.MVC;

import java.util.List;

import com.clofit.backend.model.Product;

public class ProductFilterContext {
    private IFilterStrategy strategy;

    public void setStrategy(IFilterStrategy strategy2) {
        this.strategy = strategy2;
    }

    public String getCurrentStrategyName() {
        if (strategy != null) {
            return strategy.getStrategyName();
        } else {
            return "No filter applied";
        }
    }

    public List<Product> executeFilter(List<Product> products) {
        if (strategy != null) {
            return strategy.filter(products);
        } else {
            return products;
        }
    }
}
