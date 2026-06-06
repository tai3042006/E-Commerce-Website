import { Link, useSearchParams } from "react-router-dom";
import {
  SlidersHorizontal,
  X,
  LayoutGrid,
  List,
  ArrowUpDown,
} from "lucide-react";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/clofit/Layout";
import { ProductCard } from "@/components/clofit/ProductCard";
import { Breadcrumbs } from "@/components/clofit/Breadcrumbs";
import { products, Product, ProductCategory } from "@/data/products";
import { Slider } from "@/components/ui/slider";

type Sort = "featured" | "price-asc" | "price-desc" | "rating" | "newest";

export interface CollectionConfig {
  /** Display title, e.g. "Men's Collection" */
  title: string;
  /** Short subtitle / description */
  subtitle: string;
  /** Last breadcrumb label */
  crumbLabel: string;
  /** Base filter applied before user filters */
  baseFilter: (p: Product) => boolean;
}

interface Props {
  config: CollectionConfig;
}

const CollectionPage = ({ config }: Props) => {
  const [params, setParams] = useSearchParams();
  const [sort, setSort] = useState<Sort>("featured");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [priceMax, setPriceMax] = useState(300);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const badgeParam = params.get("badge");

  const filtered = useMemo<Product[]>(() => {
    let list = products.filter(config.baseFilter);
    if (badgeParam) list = list.filter((p) => p.badge === badgeParam);
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
  }, [config, badgeParam, sort, priceMax]);

  const hasActiveFilters = !!(badgeParam || priceMax < 300);

  // Subcategory chips based on what's in this collection
  const presentCategories = useMemo(() => {
    const cats = new Set(products.filter(config.baseFilter).map((p) => p.category));
    return Array.from(cats) as ProductCategory[];
  }, [config]);

  const [catFilter, setCatFilter] = useState<ProductCategory | "all">("all");

  const finalFiltered = useMemo(() => {
    if (catFilter === "all") return filtered;
    return filtered.filter((p) => p.category === catFilter);
  }, [filtered, catFilter]);

  return (
    <Layout>
      <section className="container-clofit pt-4 lg:pt-10">
        {/* Breadcrumbs */}
        <Breadcrumbs
          crumbs={[
            { label: "Shop", to: "/shop" },
            { label: config.crumbLabel },
          ]}
          className="mb-6"
        />

        {/* Page header */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Collection
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight lg:text-5xl">
              {config.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {config.subtitle} · {finalFiltered.length} products
            </p>
          </div>
        </div>

        {/* Category sub-chips */}
        {presentCategories.length > 1 && (
          <div className="mt-6 -mx-5 overflow-x-auto px-5 no-scrollbar md:mx-0 md:px-0">
            <div className="flex gap-2 whitespace-nowrap">
              <button
                onClick={() => setCatFilter("all")}
                className={`rounded-pill border px-4 py-2 text-sm font-medium transition-colors ${
                  catFilter === "all"
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:bg-secondary"
                }`}
              >
                All
              </button>
              {presentCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    setCatFilter(catFilter === cat ? "all" : cat)
                  }
                  className={`rounded-pill border px-4 py-2 text-sm font-medium transition-colors capitalize ${
                    catFilter === cat
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:bg-secondary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="mt-5 flex items-center justify-between gap-2 border-y border-border py-3">
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

        {/* Products */}
        {finalFiltered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-base font-semibold">
              No products match your filters.
            </p>
            <button
              onClick={() => {
                setParams(new URLSearchParams());
                setPriceMax(300);
                setCatFilter("all");
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
              {finalFiltered.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.3), duration: 0.3 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="mt-6 divide-y divide-border">
            {finalFiltered.map((p) => (
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
                  Show {finalFiltered.length} products
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

export default CollectionPage;

/* ── Individual route wrappers ─────────────────────────────────────────── */

export const MenCollection = () => (
  <CollectionPage
    config={{
      title: "Men's Collection",
      subtitle: "Hoodies, Tees, Outerwear & more",
      crumbLabel: "Men's",
      baseFilter: (p) => p.gender === "men" || p.gender === "unisex",
    }}
  />
);

export const WomenCollection = () => (
  <CollectionPage
    config={{
      title: "Women's Collection",
      subtitle: "Dresses, Tees, Outerwear & more",
      crumbLabel: "Women's",
      baseFilter: (p) => p.gender === "women" || p.gender === "unisex",
    }}
  />
);

export const ShoesCollection = () => (
  <CollectionPage
    config={{
      title: "Shoes",
      subtitle: "Runners, Court, Trail & Slip-ons",
      crumbLabel: "Shoes",
      baseFilter: (p) => p.category === "shoes",
    }}
  />
);

export const AccessoriesCollection = () => (
  <CollectionPage
    config={{
      title: "Accessories",
      subtitle: "Bags, Caps, Beanies & more",
      crumbLabel: "Accessories",
      baseFilter: (p) => p.category === "accessories",
    }}
  />
);
