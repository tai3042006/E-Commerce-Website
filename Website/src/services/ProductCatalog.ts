import { Product } from "@/data/products";
import { products } from "@/data/products";

export class ProductCatalog {
  private static instance: ProductCatalog;
  private readonly productList: Product[];

  private constructor() {
    this.productList = [...products]; // copy to avoid mutation
  }

  public static getInstance(): ProductCatalog {
    if (!ProductCatalog.instance) {
      ProductCatalog.instance = new ProductCatalog();
    }
    return ProductCatalog.instance;
  }

  public getAllProducts(): Product[] {
    return [...this.productList];
  }

  public getProductById(id: string): Product | undefined {
    return this.productList.find(p => p.id === id);
  }

  // Additional methods can be added as needed
  public filterProducts(callback: (p: Product) => boolean): Product[] {
    return this.productList.filter(callback);
  }

  public searchProducts(keyword: string): Product[] {
    const lower = keyword.toLowerCase();
    return this.productList.filter(p =>
      p.name.toLowerCase().includes(lower) ||
      p.tagline.toLowerCase().includes(lower) ||
      p.category.toLowerCase().includes(lower)
    );
  }

  public addProduct(product: Product): void {
    this.productList.push(product);
  }

  public removeProduct(id: string): void {
    const index = this.productList.findIndex(p => p.id === id);
    if (index !== -1) {
      this.productList.splice(index, 1);
    }
  }
}