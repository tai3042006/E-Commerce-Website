import type { CartItem } from "@/models/Cart";
import { getProduct, type Product } from "@/data/products";
import { getProductById } from "@/services/ProductCatalog";

const CART_KEY = "clofit:cart";
const listeners = new Set<() => void>();

function readCart(): CartItem[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(CART_KEY) ?? "[]");
    if (Array.isArray(saved)) {
      return saved.filter((item) => item && typeof item.id === "string" &&
        typeof item.size === "string" && Number.isSafeInteger(item.qty) && item.qty > 0);
    }
  } catch {
    // Unavailable storage falls back to a cart for the current session.
  }
  return [];
}

let items = readCart();

function saveCart(next: CartItem[]) {
  items = next;
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // The current session can still use the cart.
  }
  listeners.forEach((listener) => listener());
}

function getDetailed() {
  return items.flatMap((item) => {
    const product = getProductById(item.id) ?? getProduct(item.id);
    return product ? [{ item, product }] : [];
  });
}

export const cartService = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  },
  getItems: () => [...items],
  getCount: () => items.reduce((sum, item) => sum + item.qty, 0),
  getDetailed,
  getSubtotal: () => getDetailed().reduce((sum, { product, item }) => sum + product.price * item.qty, 0),
  add(product: Product, size: string, qty = 1) {
    if (!Number.isSafeInteger(qty) || qty < 1) return;
    const existing = items.find((item) => item.id === product.id && item.size === size);
    saveCart(existing
      ? items.map((item) => item === existing ? { ...item, qty: item.qty + qty } : item)
      : [...items, { id: product.id, size, qty }]);
  },
  remove(id: string, size: string) {
    saveCart(items.filter((item) => item.id !== id || item.size !== size));
  },
  setQty(id: string, size: string, qty: number) {
    if (!Number.isSafeInteger(qty)) return;
    if (qty <= 0) {
      cartService.remove(id, size);
      return;
    }
    saveCart(items.map((item) => item.id === id && item.size === size ? { ...item, qty } : item));
  },
  clear: () => saveCart([]),
};
