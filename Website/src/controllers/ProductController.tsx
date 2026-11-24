import { useEffect, useState, type ReactNode } from "react";
import { ProductContext } from "./ProductController.hooks";
import type { Product } from "@/data/products";
import { loadProducts } from "@/services/ProductCatalog";

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    loadProducts().then((result) => {
      if (cancelled) return;
      setProducts(result);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  return <ProductContext.Provider value={{ products, loading }}>{children}</ProductContext.Provider>;
}
