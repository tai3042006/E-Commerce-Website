package com.clofit.backend.factory;

import com.clofit.backend.model.Category;
import com.clofit.backend.model.Product;

/**
 * <<Factory>> IProductFactory
 * Diagram: createProduct(String name, double price, int stock, Category category): Product
 * Also supports id overload used by ProductController.
 */
public interface IProductFactory {

    Product createProduct(
            String id,
            String name,
            double price,
            int stock,
            Category category);
}
