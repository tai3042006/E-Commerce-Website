import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Search, Share2, Star } from "lucide-react";
import { useState } from "react";
import { Layout } from "@/components/clofit/Layout";
import { getProduct, products } from "@/data/products";
import { ProductCard } from "@/components/clofit/ProductCard";
import { toast } from "sonner";

const sizes = ["S", "M", "L", "XL", "2XL"];

const Product = () => {
  const { id } = useParams();
  const product = getProduct(id || "") || products[0];
  const [size, setSize] = useState("L");
  const [favorited, setFavorited] = useState(false);

  return (
    <Layout>
      <section className="container-clofit pt-4 lg:pt-10">
        <div className="flex items-center justify-between md:hidden">
          <Link to="/shop" aria-label="Back" className="-ml-2 p-2">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-base font-semibold">{product.name}</h1>
          <div className="flex items-center">
            <button aria-label="Share" className="p-2">
              <Share2 className="h-5 w-5" />
            </button>
            <Link to="/search" aria-label="Search" className="-mr-2 p-2">
              <Search className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14 lg:pt-4">
          <div className="overflow-hidden rounded-2xl bg-secondary">
            <img
              src={product.image}
              alt={product.name}
              width={1024}
              height={1024}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            <div className="hidden items-center gap-3 lg:flex">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {product.category}
              </span>
            </div>

            <div className="flex items-start justify-between gap-4 lg:mt-3">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight lg:text-4xl">
                  {product.name}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground lg:text-base">
                  {product.tagline}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 text-foreground"
                      fill="currentColor"
                      strokeWidth={0}
                    />
                  ))}
                  <span className="ml-1 text-xs text-muted-foreground">
                    ({(product.reviews ?? 0) >= 1000
                      ? `${((product.reviews ?? 0) / 1000).toFixed(1)}K`
                      : product.reviews})
                  </span>
                </div>
                <p className="mt-2 text-lg font-semibold lg:text-2xl">
                  ${product.price} USD
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-border pt-6">
              <h2 className="text-sm font-semibold">Description</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">Select Size</h2>
                <button className="text-xs font-medium text-muted-foreground underline-offset-4 hover:underline">
                  Size Guide
                </button>
              </div>
              <div className="mt-3 grid grid-cols-5 gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`rounded-pill border py-2.5 text-sm font-medium transition-colors ${
                      size === s
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-foreground hover:bg-secondary"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => toast.success(`Added ${product.name} (${size}) to bag`)}
                className="w-full rounded-pill bg-foreground py-4 text-sm font-semibold text-background transition-opacity hover:opacity-90"
              >
                Add to Bag
              </button>
              <button
                onClick={() => setFavorited((v) => !v)}
                className="w-full rounded-pill border border-foreground py-4 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                {favorited ? "Favorited ♥" : "Favorite ♡"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-xl font-extrabold tracking-tight lg:text-2xl">
            You may also like
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {products.filter((p) => p.id !== product.id).slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Product;
