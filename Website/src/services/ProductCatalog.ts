import { Product } from "@/data/products";
import { products as staticProducts } from "@/data/products";

const API_BASE = "/api";

export class ProductCatalog {
  private static instance: ProductCatalog;
  private productList: Product[] = [];
  private loaded = false;

  private constructor() {}

  public static getInstance(): ProductCatalog {
    if (!ProductCatalog.instance) {
      ProductCatalog.instance = new ProductCatalog();
    }
    return ProductCatalog.instance;
  }

  /** Fetch products from the API; falls back to static data if the server is unreachable. */
  public async loadProducts(): Promise<Product[]> {
    if (this.loaded) return [...this.productList];

    try {
      const res = await fetch(`${API_BASE}/products`, { signal: AbortSignal.timeout(4000) });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data: Product[] = await res.json();
      this.productList = data;
      this.loaded = true;
      console.info(`[ProductCatalog] Loaded ${data.length} products from API`);
    } catch (err) {
      console.warn("[ProductCatalog] API unavailable, using static data:", err);
      this.productList = [...staticProducts];
      this.loaded = true;
    }

    return [...this.productList];
  }

  public getAllProducts(): Product[] {
    // Synchronous — returns whatever is already cached (may be empty before loadProducts resolves)
    return [...this.productList];
  }

  public getProductById(id: string): Product | undefined {
    return this.productList.find((p) => p.id === id);
  }

  public filterProducts(callback: (p: Product) => boolean): Product[] {
    return this.productList.filter(callback);
  }

  public searchProducts(keyword: string): Product[] {
    const lower = keyword.toLowerCase();
    return this.productList.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        (p.tagline ?? "").toLowerCase().includes(lower) ||
        p.category.toLowerCase().includes(lower)
    );
  }

  /** Force a fresh fetch from the API on the next loadProducts() call. */
  public invalidate(): void {
    this.loaded = false;
    this.productList = [];
    console.info('[ProductCatalog] Cache invalidated — will reload on next fetch');
  }

  public addProduct(product: Product): void {
    this.productList.push(product);
  }

  public removeProduct(id: string): void {
    const index = this.productList.findIndex((p) => p.id === id);
    if (index !== -1) this.productList.splice(index, 1);
  }
}
