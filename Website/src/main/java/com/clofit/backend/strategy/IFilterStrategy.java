package com.clofit.backend.strategy;

import java.util.List;

import com.clofit.backend.model.Product;

public interface IFilterStrategy {
    public List<Product> filter(List<Product> products);

    public String getStrategyName();
}