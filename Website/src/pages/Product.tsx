import { Link, useParams } from "react-router-dom";
import { Breadcrumbs } from "@/components/clofit/Breadcrumbs";
import { ChevronLeft, Share2, Star, Heart, Truck, RotateCcw, Shield, Plus, Minus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/clofit/Layout";
import { Product as ProductType } from "@/data/products";
import { ProductCatalog } from "@/services/ProductCatalog";
import { ProductCard } from "@/components/clofit/ProductCard";
import { ReviewsSection } from "@/components/clofit/ReviewsSection";
import { useCart } from "@/controllers/CartController";
import { useWishlist } from "@/context/WishlistContext";
import { useUI } from "@/context/UIContext";
import { toast } from "sonner";

const Product = () => {
  const { id } = useParams();

  // ── ALL hooks must be declared before any early return ──────────────
  const [product, setProduct]         = useState<ProductType | null>(null);
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  const [loading, setLoading]         = useState(true);
  const [size, setSize]               = useState("");
  const [color, setColor]             = useState<string | undefined>(undefined);
  const [qty, setQty]                 = useState(1);
  const [active, setActive]           = useState(0);
  const { add }        = useCart();
  const { has, toggle } = useWishlist();
  const { openCart }   = useUI();

  useEffect(() => {
    setLoading(true);
    setProduct(null);
    setActive(0);
    setQty(1);

    ProductCatalog.getInstance().loadProducts().then(all => {
      setAllProducts(all);
      const found = all.find(p => p.id === id) ?? null;
      setProduct(found);
      if (found) {
        setSize(found.sizes?.length ? found.sizes[Math.floor(found.sizes.length / 2)] : "M");
        setColor(found.colors?.[0]);
      }
      setLoading(false);
    });
  }, [id]);

  // useMemo must also be unconditional — use safe fallbacks when product is null
  const gallery = useMemo(() => {
    if (!product) return [];
    return product.gallery?.length ? product.gallery : [product.image];
  }, [product]);

  const sizes = useMemo(() => {
    if (!product) return [];
    return product.sizes?.length ? product.sizes : ["XS", "S", "M", "L", "XL", "2XL"];
  }, [product]);

  const related = useMemo(() => {
    if (!product) return [];
    const same   = allProducts.filter(x => x.id !== product.id && x.category === product.category);
    const others = allProducts.filter(x => x.id !== product.id && x.category !== product.category);
    return [...same, ...others].slice(0, 4);
  }, [allProducts, product]);

  // ── Early returns AFTER all hooks ───────────────────────────────────
  if (loading) {
    return (
      <Layout>
        <div className="container-clofit pt-20 text-center text-muted-foreground">Loading…</div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container-clofit pt-20 text-center">
          <p className="text-muted-foreground">Product not found.</p>
          <Link to="/shop" className="mt-4 inline-block text-sm font-semibold text-foreground underline">Back to shop</Link>
        </div>
      </Layout>
    );
  }

  const p   = product;
  const fav = has(p.id);

  const onAdd = () => {
    if (!size) { toast.error("Please select a size"); return; }
    add(p, size, qty);
    toast.success(`${p.name} (${size}) added to cart`);
    openCart();
  };

  return (
    <Layout>
      <section className="container-clofit pt-4 lg:pt-10">
        {/* Mobile header */}
        <div className="flex items-center justify-between md:hidden">
          <Link to="/shop" aria-label="Back" className="-ml-2 p-2"><ChevronLeft className="h-5 w-5" /></Link>
          <h1 className="line-clamp-1 text-base font-semibold">{p.name}</h1>
          <button aria-label="Share" className="p-2"><Share2 className="h-5 w-5" /></button>
        </div>

        <Breadcrumbs crumbs={[{ label: "Shop", to: "/shop" }, { label: p.category }, { label: p.name }]} className="mb-4" />

        <div className="mt-4 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          {/* Gallery */}
          <div className="flex gap-4">
            <div className="hidden flex-col gap-3 lg:flex">
              {gallery.map((g, i) => (
                <button key={i} onClick={() => setActive(i)}
                  className={`h-20 w-20 overflow-hidden rounded-xl border-2 transition-colors
                    ${active === i ? "border-foreground" : "border-transparent opacity-70 hover:opacity-100"}`}>
                  <img src={g} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            <div className="relative flex-1 overflow-hidden rounded-2xl bg-secondary aspect-[3/4]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={active}
                  src={gallery[active]}
                  alt={p.name}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="h-full w-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5 lg:hidden">
                {gallery.map((_, i) => (
                  <button key={i} onClick={() => setActive(i)}
                    className={`h-1.5 rounded-full transition-all ${active === i ? "w-6 bg-foreground" : "w-1.5 bg-foreground/30"}`} />
                ))}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground capitalize">{p.category}</span>

            <div className="mt-2 flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight lg:text-4xl">{p.name}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
              </div>
              <button onClick={() => toggle(p.id)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-secondary">
                <Heart className={`h-4 w-4 ${fav ? "text-destructive" : ""}`} fill={fav ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <p className="text-2xl font-semibold">${p.price} USD</p>
              {p.oldPrice && <p className="line-through text-muted-foreground text-base">${p.oldPrice}</p>}
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3 w-3"
                    fill={i < Math.round(p.rating ?? 0) ? "currentColor" : "none"} strokeWidth={1} />
                ))}
                <span className="ml-1">({p.reviews ?? 0})</span>
              </span>
            </div>

            <p className="mt-2 inline-flex items-center gap-2 text-xs font-medium">
              <span className={`h-1.5 w-1.5 rounded-full ${p.inStock === false ? "bg-destructive" : "bg-emerald-500"}`} />
              {p.inStock === false ? "Out of stock" : "In stock — ships in 24h"}
            </p>

            {p.colors && p.colors.length > 0 && (
              <div className="mt-6">
                <h2 className="text-sm font-semibold">Color</h2>
                <div className="mt-3 flex gap-2">
                  {p.colors.map((c, i) => (
                    <button key={i} onClick={() => setColor(c)} title={c}
                      className={`h-8 w-8 rounded-full border-2 transition-all
                        ${color === c ? "border-foreground scale-110" : "border-border"}`}
                      style={{ background: c }} />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">Select Size</h2>
                <button className="text-xs text-muted-foreground underline-offset-4 hover:underline">Size guide</button>
              </div>
              <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
                {sizes.map(s => (
                  <button key={s} onClick={() => setSize(s)}
                    className={`rounded-pill border py-2.5 text-sm font-medium transition-colors
                      ${size === s ? "border-foreground bg-foreground text-background" : "border-border hover:bg-secondary"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center gap-3 rounded-pill border border-border px-4 py-2.5">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}><Minus className="h-4 w-4" /></button>
                <span className="min-w-[2ch] text-center text-sm font-medium">{qty}</span>
                <button onClick={() => setQty(q => q + 1)}><Plus className="h-4 w-4" /></button>
              </div>
              <motion.button whileTap={{ scale: 0.97 }} onClick={onAdd} disabled={p.inStock === false}
                className="flex-1 rounded-pill bg-foreground py-3.5 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-40">
                {p.inStock === false ? "Out of stock" : "Add to Cart"}
              </motion.button>
            </div>

            <div className="mt-6 grid gap-3 rounded-2xl border border-border p-5 text-sm sm:grid-cols-3">
              <div className="flex items-start gap-3">
                <Truck className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div><p className="font-medium">Free shipping</p><p className="text-xs text-muted-foreground">On orders over $80</p></div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div><p className="font-medium">30-day returns</p><p className="text-xs text-muted-foreground">Easy & free</p></div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div><p className="font-medium">Authentic</p><p className="text-xs text-muted-foreground">Guaranteed</p></div>
              </div>
            </div>

            {p.description && (
              <div className="mt-6 border-t border-border pt-6">
                <h2 className="text-sm font-semibold">Description</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
              </div>
            )}
          </div>
        </div>

        <ReviewsSection
          productId={p.id}
          rating={p.rating ?? 0}
          reviewCount={p.reviews ?? 0}
          onAggregateChange={agg => setProduct(prev => prev ? { ...prev, rating: agg.rating, reviews: agg.reviews } : prev)}
        />

        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="text-xl font-extrabold tracking-tight lg:text-2xl">You May Also Like</h2>
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
              {related.map(rp => <ProductCard key={rp.id} product={rp} />)}
            </div>
          </div>
        )}
      </section>

      <div className="sticky bottom-16 z-30 mt-10 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
        <button onClick={onAdd} disabled={p.inStock === false}
          className="w-full rounded-pill bg-foreground py-3.5 text-sm font-semibold text-background disabled:opacity-40">
          {p.inStock === false ? "Out of stock" : `Add to Cart — $${(p.price * qty).toFixed(2)}`}
        </button>
      </div>
    </Layout>
  );
};
export default Product;
