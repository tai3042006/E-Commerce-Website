package com.clofit.backend.strategy;

import com.clofit.model.Product;
import java.util.List;

public interface IFilterStrategy {
    List<Product> filter(List<Product> products);
    String getStrategyName();
}