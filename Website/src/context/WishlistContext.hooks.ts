import { createContext, useContext, useMemo } from "react";

export type Ctx = {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const WishlistContext = createContext<Ctx | null>(null);
export const KEY = "clofit:wishlist";

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};