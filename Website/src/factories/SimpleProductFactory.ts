import { IProductFactory } from "@/factories/IProductFactory";
import { Product } from "@/data/products";

export class SimpleProductFactory implements IProductFactory {
  createProduct(name: string, price: number, stock: number, categoryId: string): Product {
    // We need to create a Product object matching the shape from products.ts
    // For simplicity, we'll return a placeholder; in real app, we would fetch or create properly.
    // Since we don't have an API, we'll just return a dummy product; but we should not break.
    // We'll return a product with dummy data; but better to throw if not implemented.
    throw new Error("SimpleProductFactory not implemented for static data.");
  }
}