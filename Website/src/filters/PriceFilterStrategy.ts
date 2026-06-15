import { FilterStrategy } from "./FilterStrategy";
import { Product } from "@/data/products";

export class PriceFilterStrategy implements FilterStrategy {
  private readonly minPrice: number | null;
  private readonly maxPrice: number | null;

  constructor(minPrice: number | null = null, maxPrice: number | null = null) {
    this.minPrice = minPrice;
    this.maxPrice = maxPrice;
  }

  execute(products: Product[]): Product[] {
    return products.filter(p => {
      if (this.minPrice !== null && p.price < this.minPrice) return false;
      if (this.maxPrice !== null && p.price > this.maxPrice) return false;
      return true;
    });
  }
}