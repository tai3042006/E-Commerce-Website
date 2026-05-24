package com.clofit.factory;

import com.clofit.model.Product;

/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  DESIGN PATTERN: FACTORY METHOD                              ║
 * ║  Centralises Product creation so callers don't need to know  ║
 * ║  constructor details or apply default values manually.       ║
 * ╚══════════════════════════════════════════════════════════════╝
 */
public class ProductFactory {

    private static int idSequence = 100; // starts above seeded data

    /**
     * Generic product builder — apply custom values directly.
     */
    public static Product create(String name, String category,
                                  double price, Double originalPrice,
                                  double rating, int reviewCount,
                                  String badge, int stock) {
        return new Product(++idSequence, name, category, price,
                originalPrice, rating, reviewCount, badge, stock);
    }

    /**
     * Factory method: SHIRT
     * Applies shirt-category defaults (rating 4.5, 0 reviews, no badge, 100 stock).
     */
    public static Product createShirt(String name, double price) {
        return new Product(++idSequence, name, "shirt", price,
                null, 4.5, 0, null, 100);
    }

    /**
     * Factory method: T-SHIRT
     */
    public static Product createTee(String name, double price) {
        return new Product(++idSequence, name, "tee", price,
                null, 4.5, 0, null, 200);
    }

    /**
     * Factory method: JACKET
     */
    public static Product createJacket(String name, double price) {
        return new Product(++idSequence, name, "jacket", price,
                null, 4.5, 0, null, 75);
    }

    /**
     * Factory method: FORMAL
     */
    public static Product createFormal(String name, double price) {
        return new Product(++idSequence, name, "formal", price,
                null, 4.5, 0, null, 60);
    }

    /**
     * Factory method: SALE item — automatically computes original price
     * as price / (1 - discountPct) so the original always looks consistent.
     *
     * @param discountPct fraction, e.g. 0.25 = 25 % off
     */
    public static Product createSaleItem(String name, String category,
                                          double salePrice, double discountPct) {
        double original = Math.round(salePrice / (1.0 - discountPct) / 5.0) * 5.0;
        return new Product(++idSequence, name, category, salePrice,
                original, 4.6, 0, "sale", 50);
    }

    /**
     * Factory method: LIMITED EDITION — low stock, limited badge, premium price.
     */
    public static Product createLimitedEdition(String name, String category, double price) {
        return new Product(++idSequence, name, category, price,
                null, 4.9, 0, "limited", 15);
    }
}
