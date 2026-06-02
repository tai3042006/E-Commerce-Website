import { Link } from "react-router-dom";
import { ChevronLeft, Search } from "lucide-react";
import { Layout } from "@/components/clofit/Layout";
import { ProductCard } from "@/components/clofit/ProductCard";
import { products } from "@/data/products";

const categories = ["All", "Hoodies", "Tees", "Outerwear", "Accessories"];

const Shop = () => (
  <Layout>
    <section className="container-clofit pt-4 lg:pt-10">
      <div className="flex items-center justify-between md:hidden">
        <Link to="/" aria-label="Back" className="-ml-2 p-2">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-base font-semibold lowercase">hoodies</h1>
        <Link to="/search" aria-label="Search" className="-mr-2 p-2">
          <Search className="h-5 w-5" />
        </Link>
      </div>

      <div className="hidden items-end justify-between md:flex">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Catalog
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight lg:text-4xl">
            Shop all
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {categories.map((c, i) => (
            <button
              key={c}
              className={`rounded-pill border px-4 py-2 text-sm font-medium transition-colors ${
                i === 0
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-foreground hover:bg-secondary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:mt-10 lg:grid-cols-4 lg:gap-x-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  </Layout>
);

export default Shop;
