import { CartItem } from "@/models/Cart";
import { Product, getProduct } from "@/data/products";

class CartService {
  private static instance: CartService;
  private items: CartItem[] = [];
  private listeners: (() => void)[] = [];

  private constructor() {
    this.loadFromLocalStorage();
  }

  public static getInstance(): CartService {
    if (!CartService.instance) {
      CartService.instance = new CartService();
    }
    return CartService.instance;
  }

  private loadFromLocalStorage(): void {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("clofit:cart");
      if (saved) {
        this.items = JSON.parse(saved);
      }
    } catch {
      this.items = [];
    }
    this.emitChange();
  }

  private saveToLocalStorage(): void {
    try {
      localStorage.setItem("clofit:cart", JSON.stringify(this.items));
    } catch {
      // ignore
    }
  }

  private emitChange(): void {
    this.listeners.forEach((listener) => listener());
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public getItems(): CartItem[] {
    return [...this.items]; // return copy
  }

  public getCount(): number {
    return this.items.reduce((sum, item) => sum + item.qty, 0);
  }

  public getSubtotal(): number {
    return this.getDetailed().reduce((sum, { product, item }) => sum + product.price * item.qty, 0);
  }

  public getDetailed(): { item: CartItem; product: Product }[] {
    return this.items
      .map((it) => ({ item: it, product: getProduct(it.id)! }))
      .filter((d): d is { item: CartItem; product: Product } => d.product !== undefined);
  }

  public add(product: Product, size: string, qty: number = 1): void {
    const existing = this.items.find((x) => x.id === product.id && x.size === size);
    if (existing) {
      this.items = this.items.map((x) =>
        x === existing ? { ...x, qty: x.qty + qty } : x
      );
    } else {
      this.items = [...this.items, { id: product.id, size, qty }];
    }
    this.saveToLocalStorage();
    this.emitChange();
  }

  public remove(id: string, size: string): void {
    this.items = this.items.filter((x) => !(x.id === id && x.size === size));
    this.saveToLocalStorage();
    this.emitChange();
  }

  public setQty(id: string, size: string, qty: number): void {
    this.items = this.items.map((x) =>
      x.id === id && x.size === size ? { ...x, qty: Math.max(1, qty) } : x
    );
    this.saveToLocalStorage();
    this.emitChange();
  }

  public clear(): void {
    this.items = [];
    this.saveToLocalStorage();
    this.emitChange();
  }
}

export const cartService = CartService.getInstance();