package com.clofit.dao;

import com.clofit.model.Category;
import com.clofit.model.Product;

import java.util.*;
import java.util.stream.Collectors;

/**
 * ProductDAO — Data-Access Object for Product entities.
 * Updated: seeded data now uses proper Category objects.
 */
public class ProductDAO {

    private final DatabaseConnection db = DatabaseConnection.getInstance();
    private final Map<Integer, Product> store = new LinkedHashMap<>();

    // Category registry
    private final Map<String, Category> categories = new LinkedHashMap<>();

    private int nextId = 1;

    public ProductDAO() {
        initCategories();
        seedData();
    }

    /* ── Category management ── */
    private void initCategories() {
        categories.put("shirt",       new Category("shirt",       "Classic and casual shirts"));
        categories.put("tee",         new Category("tee",         "T-shirts and tops"));
        categories.put("jacket",      new Category("jacket",      "Jackets and outerwear"));
        categories.put("formal",      new Category("formal",      "Formal and business wear"));
        categories.put("accessories", new Category("accessories", "Accessories and extras"));
    }

    public Map<String, Category> getCategories() { return Map.copyOf(categories); }
    public Category getCategory(String name) { return categories.get(name.toLowerCase()); }

    /* ── CRUD ── */
    public Product save(Product product) {
        db.query("INSERT INTO products ... (simulated)");
        // Assign proper Category object if category string matches
        String catName = product.getCategory().getName().toLowerCase();
        if (categories.containsKey(catName)) {
            product.setCategory(categories.get(catName));
        }
        store.put(product.getId(), product);
        return product;
    }

    public Optional<Product> findById(int id) {
        db.query("SELECT * FROM products WHERE id=" + id);
        return Optional.ofNullable(store.get(id));
    }

    public List<Product> findAll() {
        db.query("SELECT * FROM products");
        return new ArrayList<>(store.values());
    }

    public List<Product> findByCategory(String categoryName) {
        db.query("SELECT * FROM products WHERE category='" + categoryName + "'");
        return store.values().stream()
                .filter(p -> p.getCategory().getName().equalsIgnoreCase(categoryName))
                .collect(Collectors.toList());
    }

    public List<Product> findInStock() {
        return store.values().stream().filter(Product::isInStock).collect(Collectors.toList());
    }

    public List<Product> search(String query) {
        String q = query.toLowerCase();
        return store.values().stream()
                .filter(p -> p.getName().toLowerCase().contains(q)
                          || p.getCategory().getName().toLowerCase().contains(q)
                          || p.getDescription().toLowerCase().contains(q))
                .collect(Collectors.toList());
    }

    public Optional<Product> update(int id, String name, double price, int stock) {
        return findById(id).map(p -> {
            p.setName(name);
            p.setPrice(price);
            p.updateStock(stock - p.getStock()); // use updateStock() for Observer notifications
            db.query("UPDATE products SET name='" + name + "' WHERE id=" + id);
            return p;
        });
    }

    public boolean delete(int id) {
        db.query("DELETE FROM products WHERE id=" + id);
        return store.remove(id) != null;
    }

    /* ── Seed ── */
    private void seedData() {
        save(new Product(nextId++, "Classic Oxford Shirt",    "shirt",   89.00, null,  4.9, 342, "new",     150));
        save(new Product(nextId++, "Minimal Graphic Tee",     "tee",     45.00, null,  4.7, 218, "new",     300));
        save(new Product(nextId++, "Harrington Jacket",       "jacket", 149.00, 199.0, 4.8, 187, "sale",     80));
        save(new Product(nextId++, "Linen Formal Shirt",      "formal", 110.00, null,  4.6,  95, null,      120));
        save(new Product(nextId++, "Oversized Vintage Tee",   "tee",     55.00, null,  4.9, 412, "limited",  45));
        save(new Product(nextId++, "Striped Maritime Shirt",  "shirt",   79.00, null,  4.5, 156, null,      200));
        save(new Product(nextId++, "Essential Crew Neck",     "tee",     38.00, null,  4.8, 534, "new",     500));
        save(new Product(nextId++, "Denim Overshirt",         "jacket", 125.00, 165.0, 4.6,  78, "sale",     60));
        save(new Product(nextId++, "Italian Linen Blazer",    "formal", 220.00, null,  4.9,  62, "limited",  20));
        save(new Product(nextId++, "Camp Collar Summer Shirt","shirt",   72.00, null,  4.7, 203, null,      175));
        save(new Product(nextId++, "Drop-Shoulder Pocket Tee","tee",     48.00, null,  4.6, 167, null,      260));
        save(new Product(nextId++, "Technical Field Jacket",  "jacket", 195.00, null,  4.8,  44, "new",      55));
    }
}
