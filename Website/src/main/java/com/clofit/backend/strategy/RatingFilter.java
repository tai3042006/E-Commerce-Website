package com.clofit.backend.strategy;

import java.util.ArrayList;
import java.util.List;

import com.clofit.model.Product;

public class RatingFilter  implements IFilterStrategy {

    private double minRating;

    public RatingFilter(double minRating) {
        this.minRating = minRating;
    }

    @Override
    public List<Product> filter(List<Product> products) {
        List<Product> result = new ArrayList<>();
        if (products == null) {
            return result;
        }
        for (Product product : products) {
            if (product != null && product.getRating() >= minRating) {
                result.add(product);
            }
        }
        return result;
    }

    @Override
    public String getStrategyName() {
        return "Rating Filter";
    }

}
