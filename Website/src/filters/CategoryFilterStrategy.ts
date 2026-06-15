import { FilterStrategy } from "./FilterStrategy";
import { Product } from "@/data/products";

export class CategoryFilterStrategy implements FilterStrategy {
  private readonly categories: string[];

  constructor(categories: string[]) {
    this.categories = categories;
  }

  execute(products: Product[]): Product[] {
    if (this.categories.length === 0) return products;
    return products.filter(p => this.categories.includes(p.category));
  }
}