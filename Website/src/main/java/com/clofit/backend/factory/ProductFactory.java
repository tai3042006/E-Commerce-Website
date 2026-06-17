package com.clofit.backend.factory;

import com.clofit.backend.model.Category;
import com.clofit.backend.model.Product;

public class ProductFactory implements IProductFactory {

    public Product createProductWithDetails(
            String name,
            double price,
            int stock,
            String description,
            String imageUrl,
            double rating,
            Category category) {

        Product product = createProduct(
                java.util.UUID.randomUUID().toString(),
                name,
                price,
                stock,
                category);

        product.setDescription(description);
        product.setImageUrl(imageUrl);
        product.setRating(rating);

        return product;
    }

    @Override
    public Product createProduct(String id, String name, double price, int stock, Category category) {
        Product product = new Product();

        product.setId(id);
        product.setName(name);
        product.setPrice(price);
        product.setStock(stock);
        product.setCategory(category);

        return product;
    }
}