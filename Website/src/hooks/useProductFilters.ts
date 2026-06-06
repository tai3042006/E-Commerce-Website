import { useState, useCallback, useMemo } from "react";
import { Product, FilterState, SortConfig } from "@/types/product";

export const useProductFilters = (initialProducts: Product[]) => {
  // Filter state
  const [filterState, setFilterState] = useState<FilterState>({
    categories: [],
    priceRange: [0, 1000],
    rating: 0,
    brands: [],
    colors: [],
    sizes: [],
    tags: [],
  });

  // Sort state
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    sortBy: "newest",
    sortAsc: false,
  });

  // Apply filters to products
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Category filter
      if (filterState.categories.length > 0) {
        const matchesCategory = filterState.categories.some((category) =>
          product.categories.includes(category)
        );
        if (!matchesCategory) return false;
      }

      // Price filter
      if (
        product.price < filterState.priceRange[0] ||
        product.price > filterState.priceRange[1]
      ) {
        return false;
      }

      // Rating filter
      if (filterState.rating > 0 && product.rating < filterState.rating) {
        return false;
      }

      // Brand filter
      if (filterState.brands.length > 0) {
        if (!filterState.brands.includes(product.brand)) {
          return false;
        }
      }

      // Color filter
      if (filterState.colors.length > 0) {
        const matchesColor = filterState.colors.some((color) =>
          product.colors.includes(color)
        );
        if (!matchesColor) return false;
      }

      // Size filter
      if (filterState.sizes.length > 0) {
        const matchesSize = filterState.sizes.some((size) =>
          product.sizes.includes(size)
        );
        if (!matchesSize) return false;
      }

      // Tags filter
      if (filterState.tags.length > 0) {
        const matchesTag = filterState.tags.some((tag) =>
          product.tags.includes(tag)
        );
        if (!matchesTag) return false;
      }

      return true;
    });
  }, [initialProducts, filterState]);

  // Apply sorting
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      let comparison = 0;

      switch (sortConfig.sortBy) {
        case "newest":
          // For demo, we'll use ID timestamp (higher = newer)
          // In real app, we'd have a createdAt field
          comparison =
            b.id.split("-")[2].localeCompare(a.id.split("-")[2]);
          break;
        case "price-low":
          comparison = a.price - b.price;
          break;
        case "price-high":
          comparison = b.price - a.price;
          break;
        case "best-selling":
          // For demo, we'll use review count as proxy for popularity
          comparison = b.reviews - a.reviews;
          break;
        case "highest-rated":
          comparison = b.rating - a.rating;
          if (comparison === 0) {
            comparison = b.reviews - a.reviews;
          }
          break;
        default:
          comparison = 0;
      }

      return sortConfig.sortAsc ? comparison : -comparison;
    });
  }, [filteredProducts, sortConfig]);

  // Filter update functions
  const updateFilters = useCallback((newState: Partial<FilterState>) => {
    setFilterState((prev) => ({ ...prev, ...newState }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilterState({
      categories: [],
      priceRange: [0, 1000],
      rating: 0,
      brands: [],
      colors: [],
      sizes: [],
      tags: [],
    });
  }, []);

  const updateSort = useCallback((newConfig: Partial<SortConfig>) => {
    setSortConfig((prev) => ({ ...prev, ...newConfig }));
  }, []);

  // Get unique values for filter options
  const uniqueValues = useMemo(() => {
    const categories = new Set<string>();
    const brands = new Set<string>();
    const colors = new Set<string>();
    const sizes = new Set<string>();
    const tags = new Set<string>();

    initialProducts.forEach((product) => {
      product.categories.forEach((cat) => categories.add(cat));
      brands.add(product.brand);
      product.colors.forEach((color) => colors.add(color));
      product.sizes.forEach((size) => sizes.add(size));
      product.tags.forEach((tag) => tags.add(tag));
    });

    return {
      categories: Array.from(categories).sort(),
      brands: Array.from(brands).sort(),
      colors: Array.from(colors).sort(),
      sizes: Array.from(sizes).sort(),
      tags: Array.from(tags).sort(),
    };
  }, [initialProducts]);

  return {
    // State
    filterState,
    sortConfig,
    filteredProducts: sortedProducts,
    uniqueValues,

    // Actions
    updateFilters,
    clearFilters,
    updateSort,
  };
};