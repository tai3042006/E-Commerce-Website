package com.clofit.backend.MVC;

import java.util.List;
import com.clofit.backend.model.Product;

public interface IFilterStrategy {
    List<Product> filter(List<Product> products);

    String getStrategyName();
}
