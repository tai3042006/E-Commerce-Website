import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";

type Ctx = {
  searchOpen: boolean;
  cartOpen: boolean;
  menuOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  openCart: () => void;
  closeCart: () => void;
  openMenu: () => void;
  closeMenu: () => void;
};

const UIContext = createContext<Ctx | null>(null);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [searchOpen, setSearch] = useState(false);
  const [cartOpen, setCart] = useState(false);
  const [menuOpen, setMenu] = useState(false);

  // Cmd/Ctrl+K to open search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearch((v) => !v);
      }
      if (e.key === "Escape") {
        setSearch(false); setCart(false); setMenu(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock body scroll when any overlay is open
  useEffect(() => {
    const open = searchOpen || cartOpen || menuOpen;
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [searchOpen, cartOpen, menuOpen]);

  const value = useMemo<Ctx>(() => ({
    searchOpen, cartOpen, menuOpen,
    openSearch: () => { setSearch(true); setCart(false); setMenu(false); },
    closeSearch: () => setSearch(false),
    openCart: () => { setCart(true); setSearch(false); setMenu(false); },
    closeCart: () => setCart(false),
    openMenu: () => { setMenu(true); setSearch(false); setCart(false); },
    closeMenu: () => setMenu(false),
  }), [searchOpen, cartOpen, menuOpen]);

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return ctx;
};
