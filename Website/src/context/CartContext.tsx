import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { Product, getProduct } from "@/data/products";

export type CartItem = { id: string; size: string; qty: number };

type Ctx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (p: Product, size: string, qty?: number) => void;
  remove: (id: string, size: string) => void;
  setQty: (id: string, size: string, qty: number) => void;
  clear: () => void;
  detailed: { item: CartItem; product: Product }[];
};

const CartContext = createContext<Ctx | null>(null);
const KEY = "clofit:cart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
  });

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(items)); }, [items]);

  const value = useMemo<Ctx>(() => {
    const detailed = items
      .map((it) => ({ item: it, product: getProduct(it.id)! }))
      .filter((d) => d.product);
    return {
      items,
      detailed,
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotal: detailed.reduce((s, d) => s + d.product.price * d.item.qty, 0),
      add: (p, size, qty = 1) =>
        setItems((prev) => {
          const existing = prev.find((x) => x.id === p.id && x.size === size);
          if (existing) return prev.map((x) => x === existing ? { ...x, qty: x.qty + qty } : x);
          return [...prev, { id: p.id, size, qty }];
        }),
      remove: (id, size) => setItems((prev) => prev.filter((x) => !(x.id === id && x.size === size))),
      setQty: (id, size, qty) =>
        setItems((prev) => prev.map((x) => x.id === id && x.size === size ? { ...x, qty: Math.max(1, qty) } : x)),
      clear: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
