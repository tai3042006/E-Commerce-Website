import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { Product } from "@/data/products";
import { ProductCatalog } from "@/services/ProductCatalog";
import { ProductFilterContext } from "@/filters/ProductFilterContext";
import { IProductFactory } from "@/factories/IProductFactory";
import { SimpleProductFactory } from "@/factories/SimpleProductFactory";

type Ctx = {
  products: Product[];
  filteredProducts: Product[];
  loading: boolean;
  setFilterStrategy: (strategy: any) => void;
  // maybe search
};

const ProductContext = createContext<Ctx | null>(null);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const catalog = ProductCatalog.getInstance();
  const filterContext = new ProductFilterContext();
  const factory = new SimpleProductFactory(); // not used for now

  const [state, setState] = useState<Ctx>({
    products: [],
    filteredProducts: [],
    loading: true,
    setFilterStrategy: (strategy) => {},
  });

  useEffect(() => {
    // Load products (they are already available via catalog)
    const loadProducts = () => {
      const all = catalog.getAllProducts();
      setState(prev => ({
        ...prev,
        products: all,
        filteredProducts: all,
        loading: false,
      }));
    };

    loadProducts();

    // Subscribe to catalog changes? Not needed for static data.
  }, []);

  // We need to update filteredProducts when filter strategy changes.
  // We'll expose a method to set filter strategy and update state.
  const setFilterStrategy = (strategy: FilterStrategy) => {
    filterContext.setStrategy(strategy);
    const filtered = filterContext.executeFilter(state.products);
    setState(prev => ({
      ...prev,
      filteredProducts: filtered,
    }));
  };

  // Memoize the value to avoid unnecessary re-renders
  const value = useMemo<Ctx>(() => ({
    products: state.products,
    filteredProducts: state.filteredProducts,
    loading: state.loading,
    setFilterStrategy,
  }), [state.products, state.filteredProducts, state.loading, setFilterStrategy]);

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProduct = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProduct must be used within ProductProvider");
  return ctx;
};