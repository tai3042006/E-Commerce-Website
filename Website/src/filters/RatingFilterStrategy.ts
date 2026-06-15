import { FilterStrategy } from "./FilterStrategy";
import { Product } from "@/data/products";

export class RatingFilterStrategy implements FilterStrategy {
  private readonly minRating: number | null;

  constructor(minRating: number | null = null) {
    this.minRating = minRating;
  }

  execute(products: Product[]): Product[] {
    if (this.minRating === null) return products;
    return products.filter(p => (p.rating ?? 0) >= this.minRating);
  }
}