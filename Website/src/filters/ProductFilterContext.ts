import { FilterStrategy } from "./FilterStrategy";
import { Product } from "@/data/products";

export class ProductFilterContext {
  private strategy: FilterStrategy;

  constructor() {
    // default strategy that returns all products
    this.strategy = new (class implements FilterStrategy {
      execute(products: Product[]): Product[] {
        return products;
      }
    });
  }

  public setStrategy(strategy: FilterStrategy): void {
    this.strategy = strategy;
  }

  public executeFilter(products: Product[]): Product[] {
    return this.strategy.execute(products);
  }
}