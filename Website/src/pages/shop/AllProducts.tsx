import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  X,
  LayoutGrid,
  List,
  ArrowUpDown,
  ArrowRight,
} from "lucide-react";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/clofit/Layout";
import { ProductCard } from "@/components/clofit/ProductCard";
import { products, Product } from "@/data/products";
import { Slider } from "@/components/ui/slider";
import { useUI } from "@/context/UIContext";

type Sort = "featured" | "price-asc" | "price-desc" | "rating" | "newest";

const COLLECTIONS = [
  {
    to: "/shop/men",
    label: "Men's",
    sub: "Hoodies, Tees, Outerwear",
    bg: "from-zinc-900 to-zinc-700",
  },
  {
    to: "/shop/women",
    label: "Women's",
    sub: "Dresses, Tees, Outerwear",
    bg: "from-stone-700 to-stone-500",
  },
  {
    to: "/shop/shoes",
    label: "Shoes",
    sub: "Runners, Court, Trail",
    bg: "from-neutral-800 to-neutral-600",
  },
  {
    to: "/shop/accessories",
    label: "Accessories",
    sub: "Bags, Caps, Beanies",
    bg: "from-slate-800 to-slate-600",
  },
];

const AllProducts = () => {
  const [params, setParams] = useSearchParams();
  const { openSearch } = useUI();

  const q = params.get("q")?.toLowerCase() || "";
  const badge = params.get("badge");
  const gender = params.get("gender");

  const [sort, setSort] = useState<Sort>("featured");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [priceMax, setPriceMax] = useState(300);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo<Product[]>(() => {
    let list = products.slice();
    if (gender)
      list = list.filter((p) => p.gender === gender || p.gender === "unisex");
    if (badge) list = list.filter((p) => p.badge === badge);
    if (q)
      list = list.filter((p) =>
        (p.name + p.tagline + p.category).toLowerCase().includes(q)
      );
    list = list.filter((p) => p.price <= priceMax);
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case "newest":
        list.sort(
          (a, b) =>
            (b.badge === "new" ? 1 : 0) - (a.badge === "new" ? 1 : 0)
        );
        break;
    }
    return list;
  }, [gender, badge, q, sort, priceMax]);

  const heading = q
    ? `"${q}"`
    : badge === "new"
    ? "New Arrivals"
    : gender === "men"
    ? "Men's"
    : gender === "women"
    ? "Women's"
    : "Shop All";

  const hasActiveFilters = !!(gender || badge || q || priceMax < 300);

  return (
    <Layout>
      <section className="container-clofit pt-4 lg:pt-10">
        {/* Header */}
        <div className="hidden items-end justify-between md:flex">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Catalog
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight lg:text-5xl">
              {heading}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {filtered.length} products
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between md:hidden">
          <h1 className="text-base font-semibold">{heading}</h1>
          <button
            onClick={openSearch}
            aria-label="Search"
            className="-mr-2 p-2"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>

        {/* Collection links */}
        {!q && !badge && !gender && (
          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {COLLECTIONS.map((c) => (
              <Link
                key={c.to}
                to={c.to}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${c.bg} p-5 text-white transition-transform hover:-translate-y-0.5 hover:shadow-pop`}
              >
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-white/70">
                  Collection
                </p>
                <h3 className="mt-1 text-lg font-extrabold">{c.label}</h3>
                <p className="mt-0.5 text-xs text-white/60">{c.sub}</p>
                <ArrowRight className="absolute bottom-4 right-4 h-4 w-4 text-white/40 transition-transform group-hover:translate-x-1 group-hover:text-white/80" />
              </Link>
            ))}
          </div>
        )}

        {/* Toolbar */}
        <div className="mt-6 flex items-center justify-between gap-2 border-y border-border py-3">
          <button
            onClick={() => setFiltersOpen(true)}
            className="inline-flex items-center gap-2 rounded-pill border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
            {hasActiveFilters && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[9px] font-bold text-background">
                !
              </span>
            )}
          </button>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1 rounded-pill border border-border p-1 sm:flex">
              <button
                onClick={() => setView("grid")}
                aria-label="Grid view"
                className={`flex h-7 w-7 items-center justify-center rounded-full ${view === "grid" ? "bg-foreground text-background" : "text-muted-foreground"}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView("list")}
                aria-label="List view"
                className={`flex h-7 w-7 items-center justify-center rounded-full ${view === "list" ? "bg-foreground text-background" : "text-muted-foreground"}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <label className="inline-flex items-center gap-2 rounded-pill border border-border px-3 py-2 text-sm">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="bg-transparent text-sm font-medium outline-none"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="rating">Top rated</option>
              </select>
            </label>
          </div>
        </div>

        {/* Grid / List */}
        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-base font-semibold">
              No products match your filters.
            </p>
            <button
              onClick={() => {
                setParams(new URLSearchParams());
                setPriceMax(300);
              }}
              className="mt-4 rounded-pill border border-border px-5 py-2 text-sm font-medium hover:bg-secondary"
            >
              Clear filters
            </button>
          </div>
        ) : view === "grid" ? (
          <motion.div
            layout
            className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:mt-10 lg:grid-cols-4 lg:gap-x-6"
          >
            <AnimatePresence>
              {filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    delay: Math.min(i * 0.03, 0.3),
                    duration: 0.3,
                  }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="mt-6 divide-y divide-border">
            {filtered.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="flex items-center gap-5 py-4 transition-colors hover:bg-secondary/40"
              >
                <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-secondary">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-sm text-muted-foreground">{p.tagline}</p>
                </div>
                <p className="font-semibold">${p.price}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Filters drawer */}
      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFiltersOpen(false)}
              className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 z-50 flex w-full max-w-sm flex-col bg-background shadow-glow"
            >
              <div className="flex h-16 items-center justify-between border-b border-border px-5">
                <h2 className="text-base font-semibold">Filters</h2>
                <button
                  onClick={() => setFiltersOpen(false)}
                  aria-label="Close"
                  className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 space-y-8 overflow-y-auto p-5">
                <div>
                  <h3 className="mb-3 text-sm font-semibold">Gender</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { k: "", l: "All" },
                      { k: "men", l: "Men" },
                      { k: "women", l: "Women" },
                      { k: "unisex", l: "Unisex" },
                    ].map((g) => (
                      <button
                        key={g.l}
                        onClick={() => {
                          const n = new URLSearchParams(params);
                          if (g.k) n.set("gender", g.k);
                          else n.delete("gender");
                          setParams(n);
                        }}
                        className={`rounded-pill border px-4 py-1.5 text-sm transition-colors ${
                          (gender || "") === g.k
                            ? "border-foreground bg-foreground text-background"
                            : "border-border hover:bg-secondary"
                        }`}
                      >
                        {g.l}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Max price</h3>
                    <span className="text-sm text-muted-foreground">
                      ${priceMax}
                    </span>
                  </div>
                  <Slider
                    value={[priceMax]}
                    min={20}
                    max={300}
                    step={5}
                    onValueChange={(v) => setPriceMax(v[0])}
                  />
                </div>
                <div>
                  <h3 className="mb-3 text-sm font-semibold">Badge</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { k: "", l: "All" },
                      { k: "new", l: "New" },
                      { k: "sale", l: "Sale" },
                      { k: "bestseller", l: "Bestseller" },
                    ].map((b) => (
                      <button
                        key={b.l}
                        onClick={() => {
                          const n = new URLSearchParams(params);
                          if (b.k) n.set("badge", b.k);
                          else n.delete("badge");
                          setParams(n);
                        }}
                        className={`rounded-pill border px-4 py-1.5 text-sm transition-colors ${
                          (params.get("badge") || "") === b.k
                            ? "border-foreground bg-foreground text-background"
                            : "border-border hover:bg-secondary"
                        }`}
                      >
                        {b.l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="border-t border-border p-5 space-y-2">
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="w-full rounded-pill bg-foreground py-3.5 text-sm font-semibold text-background"
                >
                  Show {filtered.length} products
                </button>
                {hasActiveFilters && (
                  <button
                    onClick={() => {
                      setParams(new URLSearchParams());
                      setPriceMax(300);
                    }}
                    className="w-full rounded-pill border border-border py-3 text-sm font-medium hover:bg-secondary"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default AllProducts;
