export type Product = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  oldPrice?: number;
  image: string; // First image for backward compatibility
  images: string[]; // Gallery of images
  category: string; // Primary category for backward compatibility
  categories: string[]; // All categories this product belongs to
  rating: number; // Average rating (0-5)
  reviews: number; // Number of reviews
  description?: string;
  brand: string;
  colors: string[];
  sizes: string[];
  tags: string[];
  featured: boolean;
  newArrival: boolean;
  bestseller: boolean;
  stock: number;
};

export type CategoryFilter = {
  id: string;
  label: string;
  value: string;
};

export type SortOption = {
  id: string;
  label: string;
  value: string;
};

export type FilterState = {
  categories: string[];
  priceRange: [number, number];
  rating: number;
  brands: string[];
  colors: string[];
  sizes: string[];
  tags: string[];
};

export type SortConfig = {
  sortBy: string; // newest, price-low, price-high, best-selling, highest-rated
  sortAsc: boolean;
};