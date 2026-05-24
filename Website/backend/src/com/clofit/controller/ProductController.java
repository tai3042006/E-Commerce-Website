package com.clofit.controller;

import com.clofit.dao.ProductDAO;
import com.clofit.factory.ProductFactory;
import com.clofit.model.Product;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  DESIGN PATTERN: MVC — Controller                            ║
 * ║  ProductController handles HTTP-like requests and delegates  ║
 * ║  to the DAO (model) and returns data for the view/response.  ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * REST Endpoints (mapped in SimpleHttpServer):
 *   GET  /api/products          → list all products (+ ?category=shirt, ?sort=price)
 *   GET  /api/products/{id}     → get one product
 *   GET  /api/products/search   → ?q=keyword
 *   POST /api/products          → create product (from body map)
 *   PUT  /api/products/{id}     → update product
 *   DELETE /api/products/{id}   → delete product
 */
public class ProductController {

    private final ProductDAO productDAO;

    public ProductController(ProductDAO productDAO) {
        this.productDAO = productDAO;
    }

    /* ── GET /api/products ── */
    public ApiResponse<List<Product>> getAllProducts(String category, String sort) {
        List<Product> products;

        if (category != null && !category.isBlank()) {
            products = productDAO.findByCategory(category);
        } else {
            products = productDAO.findAll();
        }

        if ("price-asc".equalsIgnoreCase(sort)) {
            products.sort((a, b) -> Double.compare(a.getPrice(), b.getPrice()));
        } else if ("price-desc".equalsIgnoreCase(sort)) {
            products.sort((a, b) -> Double.compare(b.getPrice(), a.getPrice()));
        } else if ("rating".equalsIgnoreCase(sort)) {
            products.sort((a, b) -> Double.compare(b.getRating(), a.getRating()));
        }

String jsonProducts = products.stream()
        .map(Product::toJson)
        .collect(Collectors.joining(",", "[", "]"));

return ApiResponse.ok(
        jsonProducts,
        products.size() + " product(s) found"
);    }

    /* ── GET /api/products/{id} ── */
    public ApiResponse<Product> getProductById(int id) {
        Optional<Product> product = productDAO.findById(id);
        return product
                .map(p -> ApiResponse.ok(p, "Product found"))
                .orElseGet(() -> ApiResponse.notFound("Product with id " + id + " not found"));
    }

    /* ── GET /api/products/search?q= ── */
    public ApiResponse<List<Product>> searchProducts(String query) {
        if (query == null || query.isBlank()) {
            return ApiResponse.badRequest("Search query 'q' is required");
        }
        List<Product> results = productDAO.search(query);
        return ApiResponse.ok(results, results.size() + " result(s) for '" + query + "'");
    }

    /* ── POST /api/products ── */
    public ApiResponse<Product> createProduct(Map<String, String> body) {
        try {
            String category = body.getOrDefault("category", "tee");
            String name     = body.get("name");
            double price    = Double.parseDouble(body.getOrDefault("price", "0"));

            if (name == null || name.isBlank()) {
                return ApiResponse.badRequest("Field 'name' is required");
            }

            Product product = switch (category.toLowerCase()) {
                case "shirt"  -> ProductFactory.createShirt(name, price);
                case "jacket" -> ProductFactory.createJacket(name, price);
                case "formal" -> ProductFactory.createFormal(name, price);
                default       -> ProductFactory.createTee(name, price);
            };

            productDAO.save(product);
            return ApiResponse.created(product, "Product created successfully");

        } catch (NumberFormatException e) {
            return ApiResponse.badRequest("Invalid 'price' value");
        }
    }

    /* ── PUT /api/products/{id} ── */
    public ApiResponse<Product> updateProduct(int id, Map<String, String> body) {
        try {
            String name  = body.getOrDefault("name", "");
            double price = Double.parseDouble(body.getOrDefault("price", "0"));
            int    stock = Integer.parseInt(body.getOrDefault("stock", "0"));

            Optional<Product> updated = productDAO.update(id, name, price, stock);
            return updated
                    .map(p -> ApiResponse.ok(p, "Product updated"))
                    .orElseGet(() -> ApiResponse.notFound("Product " + id + " not found"));

        } catch (NumberFormatException e) {
            return ApiResponse.badRequest("Invalid numeric field in request body");
        }
    }

    /* ── DELETE /api/products/{id} ── */
    public ApiResponse<Void> deleteProduct(int id) {
        boolean deleted = productDAO.delete(id);
        return deleted
                ? ApiResponse.ok(null, "Product deleted")
                : ApiResponse.notFound("Product " + id + " not found");
    }
}
