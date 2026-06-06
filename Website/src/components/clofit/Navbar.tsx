import { NavLink, Link, useLocation } from "react-router-dom";
import { Search, ShoppingBag, Heart, User, Menu } from "lucide-react";
import { Logo } from "./Logo";
import { useEffect, useState } from "react";
import { useUI } from "@/context/UIContext";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { products, ProductCategory } from "@/data/products";

/* ── Mega-menu data ──────────────────────────────────────────────────── */
const megaSections: {
  id: ProductCategory;
  label: string;
  route: string;
  featured: string[];
}[] = [
  {
    id: "hoodies",
    label: "Hoodies",
    route: "/shop?category=hoodies",
    featured: ["Bestsellers", "New arrivals", "Oversized", "Zip-up"],
  },
  {
    id: "tees",
    label: "Tees",
    route: "/shop?category=tees",
    featured: ["Crewneck", "Graphic", "Boxy", "Long sleeve"],
  },
  {
    id: "outerwear",
    label: "Outerwear",
    route: "/shop?category=outerwear",
    featured: ["Puffers", "Overshirts", "Track jackets", "Coats"],
  },
  {
    id: "shoes",
    label: "Shoes",
    route: "/shop/shoes",
    featured: ["Runners", "Court", "Trail", "Slip-ons"],
  },
];

/* ── Primary nav links ──────────────────────────────────────────────── */
const topLinks = [
  { to: "/shop", label: "Shop", exact: true },
  { to: "/shop/men", label: "Men" },
  { to: "/shop/women", label: "Women" },
  { to: "/shop?badge=new", label: "New" },
];

export const Navbar = () => {
  const { openSearch, openCart, openMenu } = useUI();
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<ProductCategory | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mega menu on route change
  useEffect(() => {
    setHovered(null);
  }, [pathname]);

  const isShopActive =
    pathname.startsWith("/shop") ||
    pathname.startsWith("/product");

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled ? "glass-strong border-b border-border" : "bg-background"
      }`}
      onMouseLeave={() => setHovered(null)}
    >
      <div className="container-clofit flex h-16 items-center justify-between gap-6 lg:h-20">
        {/* Left: burger + logo + nav */}
        <div className="flex items-center gap-2 lg:gap-10">
          <button
            onClick={openMenu}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-secondary md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Logo className="text-xl lg:text-2xl" />

          <nav className="hidden items-center gap-1 md:flex">
            {topLinks.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                end={l.exact}
                className={({ isActive }) =>
                  `relative inline-flex items-center px-3 py-2 text-sm font-medium transition-colors hover:text-foreground ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}

            {/* Mega-menu trigger items */}
            {megaSections.map((m) => (
              <div
                key={m.id}
                className="relative"
                onMouseEnter={() => setHovered(m.id)}
              >
                <Link
                  to={m.route}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-colors hover:text-foreground ${
                    hovered === m.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {m.label}
                </Link>
              </div>
            ))}
          </nav>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={openSearch}
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-secondary"
          >
            <Search className="h-5 w-5" />
          </button>

          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className={`hidden h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-secondary sm:flex ${
              pathname === "/wishlist" ? "bg-secondary" : ""
            }`}
          >
            <Heart className="h-5 w-5" />
          </Link>

          <Link
            to="/account"
            aria-label="Account"
            className={`hidden h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-secondary sm:flex ${
              pathname === "/account" ? "bg-secondary" : ""
            }`}
          >
            <User className="h-5 w-5" />
          </Link>

          <button
            onClick={openCart}
            aria-label="Cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-secondary"
          >
            <ShoppingBag className="h-5 w-5" />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-bold text-background"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <Link
            to="/signin"
            className="ml-2 hidden rounded-pill bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-all hover:opacity-90 hover:-translate-y-0.5 lg:inline-block"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Mega menu dropdown */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-full hidden border-t border-border bg-background shadow-pop md:block"
          >
            <div className="container-clofit grid grid-cols-12 gap-8 py-10">
              <div className="col-span-3">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Shop {hovered}
                </p>
                <ul className="mt-5 space-y-3">
                  {megaSections
                    .find((m) => m.id === hovered)
                    ?.featured.map((f) => (
                      <li key={f}>
                        <Link
                          to={
                            megaSections.find((m) => m.id === hovered)
                              ?.route ?? "/shop"
                          }
                          className="group inline-flex items-center text-base font-semibold text-foreground"
                        >
                          <span className="bg-gradient-to-r from-foreground to-foreground bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
                            {f}
                          </span>
                        </Link>
                      </li>
                    ))}
                  <li>
                    <Link
                      to={
                        megaSections.find((m) => m.id === hovered)?.route ??
                        "/shop"
                      }
                      className="mt-3 inline-block text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
                    >
                      View all →
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="col-span-9 grid grid-cols-3 gap-4">
                {products
                  .filter((p) => p.category === hovered)
                  .slice(0, 3)
                  .map((p) => (
                    <Link
                      to={`/product/${p.id}`}
                      key={p.id}
                      className="group"
                    >
                      <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-secondary">
                        <img
                          src={p.image}
                          alt={p.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      </div>
                      <p className="mt-3 text-sm font-semibold">{p.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ${p.price} USD
                      </p>
                    </Link>
                  ))}
                {products.filter((p) => p.category === hovered).length ===
                  0 && (
                  <p className="col-span-3 text-sm text-muted-foreground">
                    No products in this collection yet.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
