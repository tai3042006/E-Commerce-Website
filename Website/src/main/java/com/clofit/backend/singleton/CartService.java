package com.clofit.backend.singleton;

import com.clofit.backend.model.Product;

public class CartService {

	private static CartService instance;
	private Cart cart;

	private CartService() {
		cart = new Cart();
	}

	public static CartService getInstance() {
		if (instance == null) {
			instance = new CartService();
		}
		return instance;
	}

	public void addToCart(Product product,
			int quantity,
			String size,
			String color) {

		cart.addItem(
				new CartItem(product, quantity, size, color));
	}

	public void removeFromCart(String productId) {
		cart.removeItem(productId);
	}

	public void updateQuantity(String productId, int quantity) {
		cart.updateQuantity(productId, quantity);
	}

	public void clearCart() {
		cart = new Cart();
	}

	public Cart getCart() {
		return cart;
	}

	public double getCartTotal() {
		return cart.getTotal();
	}
}