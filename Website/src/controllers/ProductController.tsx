import { createContext, useContext, useEffect, useMemo, useState, useCallback, ReactNode } from "react";
import { Product } from "@/data/products";
import { ProductCatalog } from "@/services/ProductCatalog";
import { ProductFilterContext } from "@/filters/ProductFilterContext";

type FilterStrategy = Parameters<ProductFilterContext["setStrategy"]>[0];

type Ctx = {
  products: Product[];
  filteredProducts: Product[];
  loading: boolean;
  setFilterStrategy: (strategy: FilterStrategy) => void;
};

const ProductContext = createContext<Ctx | null>(null);

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

export const useProduct = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProduct must be used within ProductProvider");
  return ctx;
};
