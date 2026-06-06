import { useSearchParams, Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { useMemo, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/clofit/Layout";
import { ProductCard } from "@/components/clofit/ProductCard";
import { products } from "@/data/products";

const SUGGESTIONS = [
  "Hoodie",
  "Runner",
  "Tee",
  "Puffer",
  "Accessories",
  "Shoes",
  "Oversized",
  "Sale",
];

const SearchPage = () => {
  const [params, setParams] = useSearchParams();
  const initialQ = params.get("q") || "";
  const [input, setInput] = useState(initialQ);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync URL → input when param changes (e.g. back/forward)
  useEffect(() => {
    setInput(params.get("q") || "");
  }, [params]);

  const q = useMemo(() => (params.get("q") || "").toLowerCase().trim(), [params]);

  const results = useMemo(() => {
    if (!q) return [];
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [q]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = input.trim();
    if (v) setParams({ q: v });
    else setParams({});
  };

  const clear = () => {
    setInput("");
    setParams({});
    inputRef.current?.focus();
  };

  return (
    <Layout>
      <section className="container-clofit pt-6 pb-20 lg:pt-10">
        {/* Search bar */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/50 px-5 py-3.5 focus-within:border-foreground transition-colors"
        >
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search hoodies, tees, runners…"
            autoFocus
            className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          {input && (
            <button
              type="button"
              onClick={clear}
              aria-label="Clear"
              className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-secondary"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>

        {/* Suggestion chips (shown when no query) */}
        {!q && (
          <div className="mt-8">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground mb-3">
              Popular searches
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setInput(s);
                    setParams({ q: s });
                  }}
                  className="rounded-pill border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:border-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {q && (
          <div className="mt-8">
            <p className="mb-6 text-sm text-muted-foreground">
              {results.length === 0 ? (
                <>No results for <span className="font-semibold text-foreground">"{params.get("q")}"</span></>
              ) : (
                <><span className="font-semibold text-foreground">{results.length}</span> result{results.length !== 1 ? "s" : ""} for <span className="font-semibold text-foreground">"{params.get("q")}"</span></>
              )}
            </p>

            {results.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-base font-semibold">Nothing found.</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try a different term, or browse our collections.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <Link
                    to="/shop"
                    className="rounded-pill bg-foreground px-5 py-2.5 text-sm font-semibold text-background"
                  >
                    Shop All
                  </Link>
                  <button
                    onClick={clear}
                    className="rounded-pill border border-border px-5 py-2.5 text-sm font-medium hover:bg-secondary"
                  >
                    Clear
                  </button>
                </div>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6"
              >
                <AnimatePresence>
                  {results.map((p, i) => (
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
            )}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default SearchPage;
