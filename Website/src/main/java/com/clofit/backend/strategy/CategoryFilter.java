package com.clofit.backend.strategy;

import com.clofit.backend.model.Product;

import java.util.ArrayList;
import java.util.List;

public class CategoryFilter implements IFilterStrategy {

    private String targetCategory;

    public CategoryFilter(String targetCategory) {
        this.targetCategory = targetCategory;
    }

    @Override
    public List<Product> filter(List<Product> products) {
        List<Product> result = new ArrayList<>();
        if (products == null)
            return result;
        for (Product product : products) {
            if (product != null
                    && product.getCategory() != null
                    && targetCategory.equals(product.getCategory().getName())) {
                result.add(product);
            }
        }
        return result;
    }

    @Override
    public String getStrategyName() {
        return "Category Filter";
    }
}
