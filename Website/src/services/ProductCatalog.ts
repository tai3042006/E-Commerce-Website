import { products as staticProducts, type Product } from "@/data/products";

let catalog: Product[] | undefined;
let pending: Promise<Product[]> | undefined;

export function loadProducts(): Promise<Product[]> {
  if (catalog) return Promise.resolve(catalog);
  pending ??= fetch("/api/products", { signal: AbortSignal.timeout(4000) })
    .then(async (response) => {
      if (!response.ok) throw new Error("Product API unavailable");
      catalog = await response.json();
      return catalog;
    })
    .catch(() => staticProducts)
    .finally(() => { pending = undefined; });
  return pending;
}

export function getProductById(id: string) {
  return catalog?.find((product) => product.id === id);
}

export function invalidateProducts() {
  catalog = undefined;
}
