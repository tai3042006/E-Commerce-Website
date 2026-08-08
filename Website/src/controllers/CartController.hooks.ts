import { createContext, useContext } from "react";
import { Product, getProduct } from "@/data/products";
import { CartItem } from "@/models/Cart";
import { cartService } from "@/services/CartService";

export type Ctx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (p: Product, size: string, qty?: number) => void;
  remove: (id: string, size: string) => void;
  setQty: (id: string, size: string, qty: number) => void;
  clear: () => void;
  detailed: { item: CartItem; product: Product }[];
};

export const CartContext = createContext<Ctx | null>(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};