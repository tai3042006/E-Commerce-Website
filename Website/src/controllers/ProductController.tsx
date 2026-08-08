import { useState, useEffect, useMemo, useCallback, ReactNode } from "react";
import { ProductContext, type FilterStrategy, type Ctx, useProduct } from "./ProductController.hooks";
import { Product } from "@/data/products";
import { ProductCatalog } from "@/services/ProductCatalog";
import { ProductFilterContext } from "@/filters/ProductFilterContext";

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    ProductCatalog.getInstance()
      .loadProducts()
      .then((all) => {
        if (cancelled) return;
        setProducts(all);
        setFilteredProducts(all);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const setFilterStrategy = useCallback(
    (strategy: FilterStrategy) => {
      const filterContext = new ProductFilterContext();
      filterContext.setStrategy(strategy);
      setFilteredProducts(filterContext.executeFilter(products));
    },
    [products]
  );

  const value = useMemo<Ctx>(
    () => ({ products, filteredProducts, loading, setFilterStrategy }),
    [products, filteredProducts, loading, setFilterStrategy]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};