import { Link, useParams } from "react-router-dom";
import { Breadcrumbs } from "@/components/clofit/Breadcrumbs";
import { ChevronLeft, Search, Share2, Star, Heart, Truck, RotateCcw, Shield, Plus, Minus } from "lucide-react";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/clofit/Layout";
import { getProduct, products } from "@/data/products";
import { ProductCard } from "@/components/clofit/ProductCard";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useUI } from "@/context/UIContext";
import { toast } from "sonner";

const Product = () => {
  const { id } = useParams();
  const product = getProduct(id || "") || products[0];
  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const sizes = product.sizes || ["S", "M", "L", "XL", "2XL"];
  const [size, setSize] = useState(sizes[Math.floor(sizes.length / 2)]);
  const [color, setColor] = useState(product.colors?.[0]);
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const { openCart } = useUI();

  const fav = has(product.id);

  const related = useMemo(
    () => products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4)
      .concat(products.filter((p) => p.id !== product.id && p.category !== product.category)).slice(0, 4),
    [product.id, product.category]
  );

  const onAdd = () => {
    add(product, size, qty);
    toast.success(`Added ${product.name} (${size})`);
    openCart();
  };

  return (
    <Layout>
      <section className="container-clofit pt-4 lg:pt-10">
        <div className="flex items-center justify-between md:hidden">
          <Link to="/shop" aria-label="Back" className="-ml-2 p-2">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="line-clamp-1 text-base font-semibold">{product.name}</h1>
          <div className="flex items-center">
            <button aria-label="Share" className="p-2"><Share2 className="h-5 w-5" /></button>
            <Link to="/shop" aria-label="Search" className="-mr-2 p-2"><Search className="h-5 w-5" /></Link>
          </div>
        </div>

        {/* Route-aware breadcrumbs */}
        {(() => {
          const catRouteMap: Record<string, string> = {
            shoes: "/shop/shoes",
            accessories: "/shop/accessories",
          };
          const catRoute = catRouteMap[product.category] ?? `/shop?category=${product.category}`;
          const catLabel = product.category.charAt(0).toUpperCase() + product.category.slice(1);
          return (
            <Breadcrumbs
              crumbs={[
                { label: "Shop", to: "/shop" },
                { label: catLabel, to: catRoute },
                { label: product.name },
              ]}
              className="mb-4"
            />
          );
        })()}

        <div className="mt-4 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          {/* Gallery */}
          <div className="flex gap-4">
            <div className="hidden flex-col gap-3 lg:flex">
              {gallery.map((g, i) => (
                <button key={i} onClick={() => setActive(i)}
                  className={`h-20 w-20 overflow-hidden rounded-xl border-2 transition-colors ${active === i ? "border-foreground" : "border-transparent opacity-70 hover:opacity-100"}`}>
                  <img src={g} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            <div className="relative flex-1 overflow-hidden rounded-2xl bg-secondary">
              <AnimatePresence mode="wait">
                <motion.img
                  key={active}
                  src={gallery[active]}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="h-full w-full object-cover"
                />
              </AnimatePresence>
              {/* mobile dots */}
              <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5 lg:hidden">
                {gallery.map((_, i) => (
                  <button key={i} onClick={() => setActive(i)} aria-label={`Image ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${active === i ? "w-6 bg-foreground" : "w-1.5 bg-foreground/30"}`} />
                ))}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{product.category}</span>
            <div className="mt-2 flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight lg:text-4xl">{product.name}</h1>
                <p className="mt-1 text-sm text-muted-foreground lg:text-base">{product.tagline}</p>
              </div>
              <button onClick={() => toggle(product.id)} aria-label="Wishlist"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary">
                <Heart className={`h-4 w-4 ${fav ? "text-destructive" : ""}`} fill={fav ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <p className="text-2xl font-semibold lg:text-3xl">${product.price} USD</p>
              {product.oldPrice && <p className="price-strike text-base">${product.oldPrice}</p>}
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3 w-3" fill={i < Math.round(product.rating ?? 0) ? "currentColor" : "none"} strokeWidth={1} />
                ))}
                <span className="ml-1">({product.reviews})</span>
              </span>
            </div>

            <p className="mt-2 inline-flex items-center gap-2 text-xs font-medium">
              <span className={`h-1.5 w-1.5 rounded-full ${product.inStock === false ? "bg-destructive" : "bg-[hsl(var(--success))]"}`} />
              {product.inStock === false ? "Sold out" : "In stock — ships within 24h"}
            </p>

            {product.colors && product.colors.length > 0 && (
              <div className="mt-6">
                <h2 className="text-sm font-semibold">Color</h2>
                <div className="mt-3 flex gap-2">
                  {product.colors.map((c, i) => (
                    <button key={i} onClick={() => setColor(c)} aria-label={`Color ${i + 1}`}
                      className={`h-8 w-8 rounded-full border-2 transition-all ${color === c ? "border-foreground scale-110" : "border-border"}`}
                      style={{ background: c }} />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">Select size</h2>
                <button className="text-xs font-medium text-muted-foreground underline-offset-4 hover:underline">Size guide</button>
              </div>
              <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
                {sizes.map((s) => (
                  <button key={s} onClick={() => setSize(s)}
                    className={`rounded-pill border py-2.5 text-sm font-medium transition-colors ${size === s ? "border-foreground bg-foreground text-background" : "border-border hover:bg-secondary"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center gap-3 rounded-pill border border-border px-4 py-2.5">
                <button aria-label="Decrease" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus className="h-4 w-4" /></button>
                <span className="min-w-[2ch] text-center text-sm font-medium">{qty}</span>
                <button aria-label="Increase" onClick={() => setQty((q) => q + 1)}><Plus className="h-4 w-4" /></button>
              </div>
              <motion.button whileTap={{ scale: 0.97 }} onClick={onAdd} disabled={product.inStock === false}
                className="flex-1 rounded-pill bg-foreground py-3.5 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-40">
                {product.inStock === false ? "Sold out" : "Add to bag"}
              </motion.button>
            </div>

            <div className="mt-6 grid gap-3 rounded-2xl border border-border p-5 text-sm sm:grid-cols-3">
              <div className="flex items-start gap-3"><Truck className="h-4 w-4 mt-0.5 text-muted-foreground" /><div><p className="font-medium">Free shipping</p><p className="text-xs text-muted-foreground">Over $80</p></div></div>
              <div className="flex items-start gap-3"><RotateCcw className="h-4 w-4 mt-0.5 text-muted-foreground" /><div><p className="font-medium">30-day returns</p><p className="text-xs text-muted-foreground">Easy returns</p></div></div>
              <div className="flex items-start gap-3"><Shield className="h-4 w-4 mt-0.5 text-muted-foreground" /><div><p className="font-medium">Authentic</p><p className="text-xs text-muted-foreground">Guaranteed</p></div></div>
            </div>

            <div className="mt-6 border-t border-border pt-6">
              <h2 className="text-sm font-semibold">Description</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-xl font-extrabold tracking-tight lg:text-2xl">You may also like</h2>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {related.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Sticky mobile add-to-cart */}
      <div className="sticky bottom-16 z-30 mt-10 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
        <button onClick={onAdd} disabled={product.inStock === false}
          className="w-full rounded-pill bg-foreground py-3.5 text-sm font-semibold text-background disabled:opacity-40">
          {product.inStock === false ? "Sold out" : `Add to bag — $${(product.price * qty).toFixed(2)}`}
        </button>
      </div>
    </Layout>
  );
};

export default Product;
