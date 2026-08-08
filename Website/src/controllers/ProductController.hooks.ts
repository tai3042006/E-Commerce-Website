import { createContext, useContext } from "react";
import { Product } from "@/data/products";
import { ProductCatalog } from "@/services/ProductCatalog";
import { ProductFilterContext } from "@/filters/ProductFilterContext";

export type FilterStrategy = Parameters<ProductFilterContext["setStrategy"]>[0];

export type Ctx = {
  products: Product[];
  filteredProducts: Product[];
  loading: boolean;
  setFilterStrategy: (strategy: FilterStrategy) => void;
};

export const ProductContext = createContext<Ctx | null>(null);

export const useProduct = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProduct must be used within ProductProvider");
  return ctx;
};