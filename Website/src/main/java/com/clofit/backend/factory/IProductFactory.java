package com.clofit.backend.factory;

import com.clofit.model.Product;

public interface IProductFactory {
    Product createProduct(
            String name,
            double price,
            int stock,
            String categoryId);
}