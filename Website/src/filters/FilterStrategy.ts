import { Product } from "@/data/products";

export interface FilterStrategy {
  execute(products: Product[]): Product[];
}