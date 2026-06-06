import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from "react";

type Ctx = {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const WishlistContext = createContext<Ctx | null>(null);
const KEY = "clofit:wishlist";

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [ids, setIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
  });

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(ids)); }, [ids]);

  const value = useMemo<Ctx>(() => ({
    ids,
    has: (id) => ids.includes(id),
    toggle: (id) => setIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]),
    remove: (id) => setIds((prev) => prev.filter((x) => x !== id)),
    clear: () => setIds([]),
  }), [ids]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};
