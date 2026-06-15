package com.clofit.backend.factory;

import com.clofit.model.Product;

public class ProductFactory implements IProductFactory {

    @Override
    public Product createProduct(
            String name,
            double price,
            int stock,
            String categoryId) {

        Product product = new Product();

        product.setName(name);
        product.setPrice(price);
        product.setStock(stock);

        return product;
    }
}