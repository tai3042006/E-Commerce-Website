import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowUpRight, Clock, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUI } from "@/context/UIContext";
import { products } from "@/data/products";

const KEY = "clofit:recent-searches";
const TRENDING = ["Oversized hoodie", "Runner low", "Carpenter pant", "Puffer", "Tee"];

export const SearchOverlay = () => {
  const { searchOpen, closeSearch } = useUI();
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [recent, setRecent] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQ("");
    }
  }, [searchOpen]);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q.trim().toLowerCase()), 120);
    return () => clearTimeout(t);
  }, [q]);

  const results = useMemo(() => {
    if (!debounced) return [];
    return products.filter((p) =>
      p.name.toLowerCase().includes(debounced) ||
      p.category.toLowerCase().includes(debounced) ||
      p.tagline.toLowerCase().includes(debounced)
    ).slice(0, 6);
  }, [debounced]);

  const submit = (term?: string) => {
    const v = (term ?? q).trim();
    if (!v) return;
    const next = [v, ...recent.filter((r) => r !== v)].slice(0, 6);
    setRecent(next);
    localStorage.setItem(KEY, JSON.stringify(next));
    closeSearch();
    navigate(`/search?q=${encodeURIComponent(v)}`);
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-xl"
        >
          <div className="container-clofit pt-6 lg:pt-10">
            <form onSubmit={(e) => { e.preventDefault(); submit(); }}
              className="flex items-center gap-3 border-b border-border pb-4">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search hoodies, tees, runners…"
                className="flex-1 bg-transparent text-xl outline-none placeholder:text-muted-foreground lg:text-3xl"
              />
              <button type="button" onClick={closeSearch} aria-label="Close search"
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary">
                <X className="h-5 w-5" />
              </button>
            </form>
          </div>

          <motion.div
            initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05 }}
            className="container-clofit flex-1 overflow-y-auto py-8"
          >
            {!debounced ? (
              <div className="grid gap-10 lg:grid-cols-2">
                <div>
                  <h3 className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" /> Recent
                  </h3>
                  <ul className="mt-4 space-y-1">
                    {recent.length === 0 && <li className="text-sm text-muted-foreground">No recent searches.</li>}
                    {recent.map((r) => (
                      <li key={r}>
                        <button onClick={() => submit(r)} className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-secondary">
                          {r}
                          <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    <TrendingUp className="h-3.5 w-3.5" /> Trending
                  </h3>
                  <ul className="mt-4 space-y-1">
                    {TRENDING.map((t) => (
                      <li key={t}>
                        <button onClick={() => submit(t)} className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-secondary">
                          {t}
                          <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  {results.length} result{results.length === 1 ? "" : "s"}
                </p>
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {results.map((p) => (
                    <Link key={p.id} to={`/product/${p.id}`} onClick={closeSearch} className="group">
                      <div className="aspect-square overflow-hidden rounded-xl bg-secondary">
                        <img src={p.image} alt={p.name} loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                      <p className="mt-2 text-sm font-semibold">{p.name}</p>
                      <p className="text-xs text-muted-foreground">${p.price} USD</p>
                    </Link>
                  ))}
                </div>
                {results.length === 0 && (
                  <p className="mt-8 text-sm text-muted-foreground">No products match "{q}".</p>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
