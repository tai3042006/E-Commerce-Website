import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { Product, getProduct } from "@/data/products";
import { CartItem } from "@/models/Cart";
import { cartService } from "@/services/CartService";

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

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<Ctx>(() => {
    const service = cartService;
    const detailed = service.getDetailed();
    return {
      items: service.getItems(),
      detailed,
      count: service.getCount(),
      subtotal: service.getSubtotal(),
      add: (p, size, qty) => service.add(p, size, qty),
      remove: (id, size) => service.remove(id, size),
      setQty: (id, size, qty) => service.setQty(id, size, qty),
      clear: () => service.clear(),
    };
  });

  useEffect(() => {
    const service = cartService;
    const handler = () => {
      setState((prev) => ({
        ...prev,
        items: service.getItems(),
        detailed: service.getDetailed(),
        count: service.getCount(),
        subtotal: service.getSubtotal(),
      }));
    };
    const unsubscribe = service.subscribe(handler);
    return unsubscribe;
  }, []);

  return <CartContext.Provider value={state}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};