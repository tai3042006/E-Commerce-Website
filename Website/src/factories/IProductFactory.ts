import { Product } from "@/data/products";

export interface IProductFactory {
  createProduct(name: string, price: number, stock: number, categoryId: string): Product;
  // Maybe also createProductWithDetails if needed
}