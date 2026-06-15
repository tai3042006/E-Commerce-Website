import { Link, useSearchParams } from "react-router-dom";
import {
  SlidersHorizontal,
  X,
  LayoutGrid,
  List,
  ArrowUpDown,
  ChevronLeft,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/clofit/Layout";
import { ProductCard } from "@/components/clofit/ProductCard";
import { Breadcrumbs } from "@/components/clofit/Breadcrumbs";
import { products, Product, ProductCategory, categories } from "@/data/products";
import { Slider } from "@/components/ui/slider";
import { useUI } from "@/context/UIContext";

type Sort =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "newest"
  | "alpha-asc"
  | "alpha-desc";

const AllProducts = () => {
  const [params, setParams] = useSearchParams();
  const { openSearch } = useUI();
  const [sort, setSort] = useState<Sort>("featured");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [priceMax, setPriceMax] = useState(300);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categoryParam = (params.get("category") as ProductCategory) || "all";
  const genderParam = params.get("gender");
  const badgeParam = params.get("badge");
  const subcategoryParam = params.get("subcategory");
  const q = params.get("q")?.toLowerCase() || "";

  const setCategory = (id: string) => {
    const next = new URLSearchParams(params);
    if (id === "all") next.delete("category"); else next.set("category", id);
    setParams(next);
  };

  const setGender = (id: string) => {
    const next = new URLSearchParams(params);
    if (id) next.set("gender", id); else next.delete("gender");
    setParams(next);
  };

  const setBadge = (id: string) => {
    const next = new URLSearchParams(params);
    if (id) next.set("badge", id); else next.delete("badge");
    setParams(next);
  };

  const setSubcategory = (id: string) => {
    const next = new URLSearchParams(params);
    if (id) next.set("subcategory", id); else next.delete("subcategory");
    setParams(next);
  };

  const filtered = useMemo<Product[]>(() => {
    let list = products.slice();

    // Category filter
    if (categoryParam !== "all") {
      list = list.filter((p) => p.category === categoryParam);
    }

    // Gender filter
    if (genderParam) {
      list = list.filter(
        (p) => p.gender === genderParam || p.gender === "unisex"
      );
    }

    // Badge filter
    if (badgeParam) {
      list = list.filter((p) => p.badge === badgeParam);
    }

    // Subcategory filter
    if (subcategoryParam && subcategoryParam.trim() !== "") {
      switch (subcategoryParam) {
        case "bestseller":
          list = list.filter((p) => p.badge === "bestseller");
          break;
        case "new":
          list = list.filter((p) => p.badge === "new");
          break;
        case "oversized":
          list = list.filter((p) =>
            (p.tagline + p.name)
              .toLowerCase()
              .includes("oversized") ||
            (p.tagline + p.name)
              .toLowerCase()
              .includes("boxy")
          );
          break;
        case "zip":
          list = list.filter((p) =>
            (p.name + (p.description || ""))
              .toLowerCase()
              .includes("zip") ||
            (p.name + (p.description || ""))
              .toLowerCase()
              .includes("zipped")
          );
          break;
        // Tees-specific subcategories
        case "graphic":
          list = list.filter((p) =>
            (p.name + p.tagline + (p.description || ""))
              .toLowerCase()
              .includes("graphic")
          );
          break;
        case "boxy":
          list = list.filter((p) =>
            (p.name + p.tagline + (p.description || ""))
              .toLowerCase()
              .includes("boxy")
          );
          break;
        case "long-sleeve":
          list = list.filter((p) =>
            (p.name + p.tagline + (p.description || ""))
              .toLowerCase()
              .includes("long sleeve") ||
            (p.name + p.tagline + (p.description || ""))
              .toLowerCase()
              .includes("longsleeve")
          );
          break;
        // Shoe-specific subcategories
        case "runners":
          list = list.filter((p) =>
            (p.name + p.tagline + (p.description || ""))
              .toLowerCase()
              .includes("runner")
          );
          break;
        case "court":
          list = list.filter((p) =>
            (p.name + p.tagline + (p.description || ""))
              .toLowerCase()
              .includes("court")
          );
          break;
        case "trail":
          list = list.filter((p) =>
            (p.name + p.tagline + (p.description || ""))
              .toLowerCase()
              .includes("trail")
          );
          break;
        case "slip-ons":
          list = list.filter((p) =>
            (p.name + p.tagline + (p.description || ""))
              .toLowerCase()
              .includes("slip")
          );
          break;
        default:
          break;
      }
    }

    // Search query filter
    if (q) {
      list = list.filter((p) =>
        (p.name + p.tagline + p.category).toLowerCase().includes(q)
      );
    }

    // Price filter
    list = list.filter((p) => p.price <= priceMax);

    // Sorting
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort(
          (a, b) => (b.rating ?? 0) - (a.rating ?? 0)
        );
        break;
      case "newest":
        list.sort(
          (a, b) =>
            (b.badge === "new" ? 1 : 0) - (a.badge === "new" ? 1 : 0)
        );
        break;
      case "alpha-asc":
        list.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;
      case "alpha-desc":
        list.sort((a, b) =>
          b.name.localeCompare(a.name)
        );
        break;
      default: // featured
        // No sorting for featured (default order)
        break;
    }

    return list;
  }, [
    categoryParam,
    genderParam,
    badgeParam,
    subcategoryParam,
    q,
    sort,
    view,
    priceMax,
    products,
  ]);

  const heading =
    categoryParam === "all"
      ? "Shop all"
      : categories.find((c) => c.id === categoryParam)?.label ||
        categoryParam;

  return (
    <Layout>
      <section className="container-clofit pt-4 lg:pt-10">
        {/* Mobile header */}
        <div className="flex items-center justify-between md:hidden">
          <Link to="/" aria-label="Back" className="-ml-2 p-2">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-base font-semibold">{heading}</h1>
          <button onClick={openSearch} aria-label="Search" className="-mr-2 p-2">
            <Search className="h-5 w-5" />
          </button>
        </div>

        {/* Desktop header */}
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

        {/* Category pills (for all categories when no specific category selected) */}
        {categoryParam === "all" && (
          <div className="mt-6 -mx-5 overflow-x-auto px-5 no-scrollbar md:mx-0 md:px-0">
            <div className="flex gap-2 whitespace-nowrap">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`rounded-pill border px-4 py-2 text-sm font-medium transition-colors ${
                    c.id === categoryParam
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:bg-secondary"
                  }`}
                >
                  {c.label}
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
            {(
              categoryParam !== "all" ||
              genderParam ||
              badgeParam ||
              subcategoryParam ||
              q ||
              priceMax < 300
            ) && (
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
                className={`flex h-7 w-7 items-center justify-center rounded-full ${
                  view === "grid" ? "bg-foreground text-background" : "text-muted-foreground"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView("list")}
                aria-label="List view"
                className={`flex h-7 w-7 items-center justify-center rounded-full ${
                  view === "list" ? "bg-foreground text-background" : "text-muted-foreground"
                }`}
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
                <option value="alpha-asc">Name: A to Z</option>
                <option value="alpha-desc">Name: Z to A</option>
              </select>
            </label>
          </div>
        </div>

        {/* Products */}
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
                  transition={{ delay: Math.min(i * 0.03, 0.3), duration: 0.3 }}
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
                            (genderParam || "") === g.k
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
                    <h3 className="mb-3 text-sm font-semibold">Category</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setCategory(c.id)}
                          className={`rounded-pill border px-4 py-1.5 text-sm transition-colors ${
                            c.id === categoryParam
                              ? "border-foreground bg-foreground text-background"
                              : "border-border hover:bg-secondary"
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
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
                            (badgeParam || "") === b.k
                              ? "border-foreground bg-foreground text-background"
                              : "border-border hover:bg-secondary"
                          }`}
                        >
                          {b.l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-3 text-sm font-semibold">Subcategory</h3>
                    <div className="flex flex-wrap gap-2">
                      {/* Dynamic subcategory options based on current filters */}
                      {[
                        { k: "", l: "All" },
                        { k: "bestseller", l: "Bestsellers" },
                        { k: "new", l: "New Arrivals" },
                        { k: "oversized", l: "Oversized" },
                        { k: "zip", l: "Zip-up" },
                        { k: "graphic", l: "Graphic" },
                        { k: "boxy", l: "Boxy" },
                        { k: "long-sleeve", l: "Long Sleeve" },
                        { k: "runners", l: "Running" },
                        { k: "court", l: "Casual" },
                        { k: "trail", l: "Trail" },
                        { k: "slip-ons", l: "Slip-ons" },
                      ].map((sc) => (
                        <button
                          key={sc.l}
                          onClick={() => {
                            const n = new URLSearchParams(params);
                            if (sc.k) n.set("subcategory", sc.k);
                            else n.delete("subcategory");
                            setParams(n);
                          }}
                          className={`rounded-pill border px-4 py-1.5 text-sm transition-colors ${
                            (subcategoryParam || "") === sc.k
                              ? "border-foreground bg-foreground text-background"
                              : "border-border hover:bg-secondary"
                          }`}
                        >
                          {sc.l}
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
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-sm font-semibold">Sort by</h3>
                      <span className="text-sm text-muted-foreground">{sort}</span>
                    </div>
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value as Sort)}
                      className="bg-transparent text-sm font-medium outline-none w-full"
                    >
                      <option value="featured">Featured</option>
                      <option value="newest">Newest</option>
                      <option value="price-asc">Price: low to high</option>
                      <option value="price-desc">Price: high to low</option>
                      <option value="rating">Top rated</option>
                      <option value="alpha-asc">Name: A to Z</option>
                      <option value="alpha-desc">Name: Z to A</option>
                    </select>
                  </div>
                </div>
                <div className="border-t border-border p-5 space-y-2">
                  <button
                    onClick={() => setFiltersOpen(false)}
                    className="w-full rounded-pill bg-foreground py-3.5 text-sm font-semibold text-background"
                  >
                    Show {filtered.length} products
                  </button>
                  {(
                    categoryParam !== "all" ||
                    genderParam ||
                    badgeParam ||
                    subcategoryParam ||
                    q ||
                    priceMax < 300
                  ) && (
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
      </section>
    </Layout>
  );
};

export default AllProducts;