import { NavLink, Link, useLocation } from "react-router-dom";
import { Search, ShoppingBag, Heart, User, Menu } from "lucide-react";
import { Logo } from "./Logo";
import { useEffect, useState } from "react";
import { useUI } from "@/context/UIContext";
import { useCart } from "@/controllers/CartController";
import { motion, AnimatePresence, Variants } from "framer-motion";
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
    id: "shoes",
    label: "Shoes",
    route: "/shop?category=shoes",
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

const navLinkVariants: Variants = {
  initial: { y: -10, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 20 } },
  exit: { y: -10, opacity: 0, transition: { ease: "easeIn" } },
};

const megaMenuVariants: Variants = {
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 400, damping: 20 } },
  exit: { y: -20, opacity: 0, transition: { ease: "easeIn" } },
};

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
        scrolled
          ? "bg-background/80 backdrop-blur-sm border-b border-background/20 shadow-soft"
          : "bg-background"
      }`}
      onMouseLeave={() => setHovered(null)}
    >
      <div className="container-clofit flex h-16 items-center justify-between gap-6 lg:h-20 px-4 lg:px-6">
        {/* Left: burger + logo + nav */}
        <div className="flex items-center gap-2 lg:gap-10">
          <button
            onClick={openMenu}
            aria-label="Open menu"
            aria-controls="mega-menu"
            aria-expanded={!!hovered}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-secondary/50 md:hidden"
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
                className={({ isActive, href }) => `
                  relative inline-flex items-center px-3 py-2 text-sm font-medium transition-colors hover:text-foreground
                  ${isActive ? "text-foreground" : "text-muted-foreground"}
                  after:content[''] after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:w-0 after:bg-foreground after:transition-width duration-300
                  ${isActive ? "after:w-full" : "hover:after:w-full"}
                `}
              >
                {l.label}
              </NavLink>
            ))}

            {/* Mega-menu trigger items */}
            {megaSections.map((m) => (
              <div
                key={m.id}
                className="relative group"
                onMouseEnter={() => setHovered(m.id)}
                onMouseLeave={() => {
                  // Only close if not hovering over mega menu
                  // We'll handle this via CSS/JS but for simplicity we keep
                }}
              >
                <Link
                  to={m.route}
                  className={`
                    inline-flex items-center px-3 py-2 text-sm font-medium transition-colors hover:text-foreground
                    ${hovered === m.id ? "text-foreground" : "text-muted-foreground"}
                    after:content[''] after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:w-0 after:bg-foreground after:transition-width duration-300
                    ${hovered === m.id ? "after:w-full" : "hover:after:w-full"}
                  `}
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
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-secondary/50"
          >
            <Search className="h-5 w-5" />
          </button>

          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className={`
              hidden h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-secondary/50 sm:flex
              ${pathname === "/wishlist" ? "bg-secondary/20" : ""}
            `}
          >
            <Heart className="h-5 w-5" />
          </Link>

          <Link
            to="/account"
            aria-label="Account"
            className={`
              hidden h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-secondary/50 sm:flex
              ${pathname === "/account" ? "bg-secondary/20" : ""}
            `}
          >
            <User className="h-5 w-5" />
          </Link>

          <button
            onClick={openCart}
            aria-label="Cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-secondary/50"
          >
            <ShoppingBag className="h-5 w-5" />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0, y: -6 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0, y: -6 }}
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
            className={`
              ml-2 hidden rounded-pill bg-foreground/20 px-5 py-2.5 text-sm font-medium text-background transition-all
              hover:bg-foreground/30 hover:-translate-y-0.5 lg:inline-block
            `}
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Mega menu dropdown */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key={hovered}
            initial={megaMenuVariants.initial}
            animate={megaMenuVariants.animate}
            exit={megaMenuVariants.exit}
            className={`absolute inset-x-0 top-full hidden border-t border-background/20 bg-background/80 backdrop-blur-sm shadow-lg md:block`}
          >
            <div className="container-clofit grid grid-cols-12 gap-8 py-10 px-4 lg:px-6">
              <div className="col-span-3">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Shop {hovered}
                </p>
                <ul className="mt-5 space-y-4">
                  {megaSections
                    .find((m) => m.id === hovered)
                    ?.featured.map((f, index) => (
                      <li key={f}>
                        <Link
                          to={(() => {
                            const baseRoute =
                              megaSections.find((m) => m.id === hovered)?.route ?? "/shop";
                            // Properly handle URL construction with or without query parameters
                            const url = new URL(baseRoute, window.location.origin);
                            let subcategoryValue = "";
                            const lowerF = f.toLowerCase();
                            if (lowerF === "bestsellers") {
                              subcategoryValue = "bestseller";
                            } else if (lowerF === "new arrivals") {
                              subcategoryValue = "new";
                            } else if (lowerF.includes("oversized")) {
                              subcategoryValue = "oversized";
                            } else if (lowerF.includes("zip")) {
                              subcategoryValue = "zip";
                            } else if (lowerF === "crewneck") {
                              // Crewneck is often the default, so no special subcategory
                              subcategoryValue = "";
                            } else if (lowerF.includes("graphic")) {
                              subcategoryValue = "graphic";
                            } else if (lowerF.includes("boxy")) {
                              subcategoryValue = "boxy";
                            } else if (lowerF.includes("long sleeve") || lowerF.includes("longsleeve")) {
                              subcategoryValue = "long-sleeve";
                            } else if (lowerF.includes("runner")) {
                              subcategoryValue = "runners";
                            } else if (lowerF.includes("court")) {
                              subcategoryValue = "court";
                            } else if (lowerF.includes("trail")) {
                              subcategoryValue = "trail";
                            } else if (lowerF.includes("slip")) {
                              subcategoryValue = "slip-ons";
                            }
                            if (subcategoryValue) {
                              url.searchParams.set("subcategory", subcategoryValue);
                            }
                            return url.pathname + url.search;
                          })()}
                          className={`
                            group block px-3 py-2 text-base font-medium transition-colors hover:text-foreground
                            after:content[''] after:absolute after:left-0 after:-bottom-0.5 after:h-[1px] after:w-0 after:bg-foreground after:transition-width duration-300
                            hover:after:w-full
                          `}
                        >
                          {f}
                        </Link>
                      </li>
                    ))}
                  <li>
                    <Link
                      to={
                        megaSections.find((m) => m.id === hovered)?.route ?? "/shop"
                      }
                      className={`
                        mt-3 inline-block text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground
                      `}
                    >
                      View all →
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="col-span-9 grid grid-cols-3 gap-6">
                {products
                  .filter((p) => p.category === hovered)
                  .slice(0, 3)
                  .map((p, index) => (
                    <motion.div
                      key={p.id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1, transition: { delay: index * 0.05, type: "spring", stiffness: 300, damping: 20 } }}
                      className="group"
                    >
                      <Link
                        to={`/product/${p.id}`}
                        className="block"
                      >
                        <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-secondary transition-transform duration-700 ease-out group-hover:scale-105">
                          <img
                            src={p.image}
                            alt={p.name}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <p className="mt-3 text-sm font-semibold text-foreground">{p.name}</p>
                        <p className="text-xs text-muted-foreground">${p.price} USD</p>
                      </Link>
                    </motion.div>
                  ))}
                {products.filter((p) => p.category === hovered).length === 0 && (
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