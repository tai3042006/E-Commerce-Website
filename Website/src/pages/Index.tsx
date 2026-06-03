import { Link } from "react-router-dom";
import { Layout } from "@/components/clofit/Layout";
import { ProductCard } from "@/components/clofit/ProductCard";
import { getProducts } from "@/data/products";
import heroModel from "@/assets/hero-model.jpg";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="container-clofit pt-4 lg:pt-8">
        <div className="relative overflow-hidden rounded-3xl bg-foreground text-background">
          <div className="grid items-stretch lg:grid-cols-2">
            <div className="relative order-1 aspect-[3/4] w-full lg:order-1 lg:aspect-auto lg:min-h-[640px]">
              <img
                src={heroModel}
                alt="Model wearing CloFit Turbo hoodie"
                width={1024}
                height={1280}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/10 to-transparent lg:hidden" />
              {/* Mobile overlay copy */}
              <div className="absolute inset-x-0 bottom-0 p-6 lg:hidden">
                <h1 className="text-3xl font-extrabold tracking-tight text-background">
                  CLOFIT
                </h1>
                <p className="mt-2 max-w-xs text-sm text-background/85">
                  CloFit — where fashion meets motion, and confidence becomes your style.
                </p>
                <div className="mt-5 flex gap-3">
                  <Link
                    to="/signup"
                    className="rounded-pill bg-background px-6 py-2.5 text-sm font-semibold text-foreground transition-opacity hover:opacity-90"
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/signin"
                    className="rounded-pill border border-background/50 px-6 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-background/10"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>

            {/* Desktop right side copy */}
            <div className="order-2 hidden flex-col justify-between p-12 lg:flex xl:p-16">
              <div>
                <span className="inline-block rounded-pill border border-background/30 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-background/80">
                  New Drop / SS26
                </span>
                <h1 className="mt-8 text-6xl font-extrabold leading-[0.95] tracking-tight xl:text-7xl">
                  CLOFIT
                </h1>
                <p className="mt-6 max-w-md text-lg text-background/80">
                  CloFit — where fashion meets motion, and confidence becomes your style.
                </p>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 rounded-pill bg-background px-7 py-3.5 text-sm font-semibold text-foreground transition-transform hover:-translate-y-0.5"
                >
                  Shop the drop
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/signup"
                  className="rounded-pill border border-background/40 px-7 py-3.5 text-sm font-semibold text-background transition-colors hover:bg-background/10"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="container-clofit pt-16 lg:pt-24">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Latest
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
              Featured pieces
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground sm:inline-flex"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {getProducts().slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Promo strip */}
      <section className="container-clofit pt-16 lg:pt-24">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { t: "Free shipping", s: "On all orders over $80" },
            { t: "Easy returns", s: "30 days, no questions" },
            { t: "Member perks", s: "Drops 24h before everyone" },
          ].map((b) => (
            <div
              key={b.t}
              className="rounded-2xl border border-border bg-secondary/50 p-6 transition-colors hover:bg-secondary"
            >
              <h3 className="text-sm font-semibold text-foreground">{b.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.s}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
