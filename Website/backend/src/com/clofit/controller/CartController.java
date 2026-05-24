package com.clofit.controller;

import com.clofit.dao.ProductDAO;
import com.clofit.model.*;

import java.util.Map;

public class CartController {

    private final ProductDAO productDAO;
    private final Customer customer;

    public CartController(
            ProductDAO productDAO,
            Customer customer
    ) {

        this.productDAO = productDAO;
        this.customer = customer;
    }

    public ApiResponse<Cart> addToCart(
            Map<String, String> body
    ) {

        try {

            int productId =
                    Integer.parseInt(body.get("productId"));

            int quantity =
                    Integer.parseInt(body.get("quantity"));

            Product product =
                    productDAO.findById(productId)
                            .orElseThrow();

            customer.getCart().addItem(product, quantity);

            return ApiResponse.ok(
                    customer.getCart(),
                    "Added to cart"
            );

        } catch (Exception e) {

            return ApiResponse.badRequest(
                    e.getMessage()
            );
        }
    }

    public ApiResponse<Cart> removeFromCart(
            Map<String, String> body
    ) {

        try {

            int productId =
                    Integer.parseInt(body.get("productId"));

            customer.getCart().removeItem(productId);

            return ApiResponse.ok(
                    customer.getCart(),
                    "Removed from cart"
            );

        } catch (Exception e) {

            return ApiResponse.badRequest(
                    e.getMessage()
            );
        }
    }

    public ApiResponse<Cart> getCart() {

        return ApiResponse.ok(
                customer.getCart(),
                "Cart fetched"
        );
    }
}
