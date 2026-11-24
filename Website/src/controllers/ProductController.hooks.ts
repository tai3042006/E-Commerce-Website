import { createContext, useContext } from "react";
import { Product } from "@/data/products";
type Ctx = {
  products: Product[];
  loading: boolean;
};

export const ProductContext = createContext<Ctx | null>(null);

export const useProduct = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProduct must be used within ProductProvider");
  return ctx;
};