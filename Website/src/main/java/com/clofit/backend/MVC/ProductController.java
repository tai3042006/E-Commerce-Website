package com.clofit.backend.MVC;

import com.clofit.backend.model.Category;
import com.clofit.backend.model.Product;
import com.clofit.backend.factory.IProductFactory;
import com.clofit.backend.singleton.CartService;

import java.util.List;

public class ProductController {

    private ProductCatalog productCatalog;
    private ProductView productView;
    private ProductFilterContext filterContext;
    private IProductFactory productFactory;

    public ProductController(ProductCatalog productCatalog, ProductView productView,
            ProductFilterContext filterContext, IProductFactory productFactory) {
        this.productCatalog = productCatalog;
        this.productView = productView;
        this.filterContext = filterContext;
        this.productFactory = productFactory;
    }

    public void addProduct(String name, double price, int stock, String category) {
        String id = "P" + (productCatalog.getAllProducts().size() + 1);
        Category cat = new Category();
        cat.setName(category);
        Product product = productFactory.createProduct(id, name, price, stock, cat);
        productCatalog.addProduct(product);
        productView.displayProducts(productCatalog.getAllProducts(), id);
    }

    public void removeProduct(String id) {
        productCatalog.removeProduct(id);
        productView.displayMessage("Product " + id + " removed.");
    }

    public List<Product> getFilterProducts() {
        List<Product> filtered = filterContext.executeFilter(productCatalog.getAllProducts());
        productView.displayProducts(filtered, filterContext.getCurrentStrategyName());
        return filtered;
    }

    public void setFilterStrategy(IFilterStrategy strategy) {
        filterContext.setStrategy(strategy);
    }

    public Product addProductWithDetails(String name, double price, int stock,
            String imageUrl, double rating,
            Category category, String description) {
        String id = "P" + (productCatalog.getAllProducts().size() + 1);
        Product product = productFactory.createProduct(id, name, price, stock, category);
        product.setDescription(description);
        product.setImageUrl(imageUrl);
        product.setRating(rating);
        productCatalog.addProduct(product);
        return product;
    }

    public List<Product> searchProducts(String keyword) {
        List<Product> results = productCatalog.searchByKeyword(keyword);
        productView.displayProducts(results, "Search: '" + keyword + "'");
        return results;
    }

    public Product getProductById(String id) {
        Product p = productCatalog.getProductById(id);
        if (p != null) {
            productView.displayProductDetail(p);
        } else {
            productView.displayMessage("Product with ID '" + id + "' not found.");
        }
        return p;
    }
}
