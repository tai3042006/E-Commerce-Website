import { Link, useSearchParams } from "react-router-dom";
import { ChevronLeft, Search } from "lucide-react";
import { Layout } from "@/components/clofit/Layout";
import { ProductCard } from "@/components/clofit/ProductCard";
import { getProducts } from "@/data/products";
import { useState, useMemo } from "react";

const CATEGORIES = ["All", "Hoodies", "Tees", "Outerwear", "Accessories"];

const Shop = () => {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get("category") || "All";
  const normalizedInit =
    CATEGORIES.find((c) => c.toLowerCase() === initialCat.toLowerCase()) || "All";

  const [activeCategory, setActiveCategory] = useState(normalizedInit);
  const allProducts = useMemo(() => getProducts(), []);

  const products = useMemo(() => {
    if (activeCategory === "All") return allProducts;
    return allProducts.filter(
      (p) => p.category.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [allProducts, activeCategory]);

  return (
    <Layout>
      <section className="container-clofit pt-4 lg:pt-10">
        {/* Mobile header */}
        <div className="flex items-center justify-between md:hidden">
          <Link to="/" aria-label="Back" className="-ml-2 p-2">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-base font-semibold lowercase">
            {activeCategory === "All" ? "shop all" : activeCategory.toLowerCase()}
          </h1>
          <button aria-label="Search" className="-mr-2 p-2">
            <Search className="h-5 w-5" />
          </button>
        </div>

        {/* Desktop header */}
        <div className="hidden items-end justify-between md:flex">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Catalog
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight lg:text-4xl">
              Shop all
            </h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`rounded-pill border px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === c
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-foreground hover:bg-secondary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile category pills */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 md:hidden">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`flex-shrink-0 rounded-pill border px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === c
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-foreground hover:bg-secondary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <p className="text-muted-foreground">
              No products in "{activeCategory}" yet.
            </p>
            <button
              onClick={() => setActiveCategory("All")}
              className="text-sm font-medium underline underline-offset-4"
            >
              View all
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:mt-10 lg:grid-cols-4 lg:gap-x-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Shop;
