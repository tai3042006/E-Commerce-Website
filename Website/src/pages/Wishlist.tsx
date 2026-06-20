import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/clofit/Layout";
import { ProductCard } from "@/components/clofit/ProductCard";
import { useWishlist } from "@/context/WishlistContext";
import { ProductCatalog } from "@/services/ProductCatalog";
import { Product } from "@/data/products";

const Wishlist = () => {
  const { ids, clear } = useWishlist();
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => { ProductCatalog.getInstance().loadProducts().then(setAllProducts); }, []);

  const items = allProducts.filter(p => ids.includes(p.id));

  return (
    <Layout>
      <section className="container-clofit pt-4 lg:pt-10">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Saved</p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight lg:text-4xl">Wishlist ({items.length})</h1>
          </div>
          {items.length > 0 && <button onClick={clear} className="text-sm font-medium text-muted-foreground hover:text-foreground">Clear all</button>}
        </div>
        {items.length === 0 ? (
          <div className="py-24 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary"><Heart className="h-7 w-7 text-muted-foreground" /></div>
            <h2 className="mt-5 text-lg font-semibold">No saved items yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">Tap the heart icon to save products.</p>
            <Link to="/shop" className="mt-6 inline-block rounded-pill bg-foreground px-6 py-3 text-sm font-semibold text-background">Explore</Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {items.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </Layout>
  );
};
export default Wishlist;
