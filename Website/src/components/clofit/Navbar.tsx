import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, Heart, User, Menu, LogOut } from "lucide-react";
import { Logo } from "./Logo";
import { useEffect, useRef, useState } from "react";
import { useUI } from "@/context/UIContext.hooks";
import { useCart } from "@/controllers/CartController.hooks";
import { useAuth } from "@/context/AuthContext.hooks";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { products, ProductCategory } from "@/data/products";
import { toast } from "sonner";
import { NotificationBell } from "./NotificationBell";

const megaSections: { id: ProductCategory; label: string; route: string; featured: string[] }[] = [
  { id: "hoodies", label: "Hoodies", route: "/shop?category=hoodies", featured: ["Bestsellers", "New arrivals", "Oversized", "Zip-up"] },
  { id: "tees",    label: "Tees",    route: "/shop?category=tees",    featured: ["Crewneck", "Graphic", "Boxy", "Long sleeve"] },
  { id: "shoes",   label: "Shoes",   route: "/shop?category=shoes",   featured: ["Runners", "Court", "Trail", "Slip-ons"] },
];

const topLinks = [
  { to: "/shop",        label: "Shop",  exact: true },
  { to: "/shop/men",    label: "Men" },
  { to: "/shop/women",  label: "Women" },
  { to: "/shop?badge=new", label: "New" },
];

const megaMenuVariants: Variants = {
  initial: {
    y: -20,
    opacity: 0,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 20
    } as const
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 20
    } as const
  },
  exit:    {
    y: -20,
    opacity: 0,
    transition: {
      ease: "easeIn"
    } as const
  }
};

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
}

export const Navbar = () => {
  const { openSearch, openCart, openMenu } = useUI();
  const { count } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled]   = useState(false);
  const [hovered, setHovered]     = useState<ProductCategory | null>(null);
  const [userMenu, setUserMenu]   = useState(false);
  const { pathname } = useLocation();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setHovered(null); setUserMenu(false); }, [pathname]);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out successfully");
    navigate("/");
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-sm border-b border-background/20 shadow-soft" : "bg-background"
      }`}
      onMouseLeave={() => setHovered(null)}
    >
      <div className="container-clofit flex h-16 items-center justify-between gap-6 lg:h-20 px-4 lg:px-6">
        {/* Left */}
        <div className="flex items-center gap-2 lg:gap-10">
          <button onClick={openMenu} aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-secondary/50 md:hidden">
            <Menu className="h-5 w-5" />
          </button>

          <Logo className="text-xl lg:text-2xl" />

          <nav className="hidden items-center gap-1 md:flex">
            {topLinks.map((l) => (
              <NavLink key={l.label} to={l.to} end={l.exact}
                className={({ isActive }) =>
                  `relative inline-flex items-center px-3 py-2 text-sm font-medium transition-colors hover:text-foreground
                  ${isActive ? "text-foreground" : "text-muted-foreground"}`
                }>
                {l.label}
              </NavLink>
            ))}
            {megaSections.map((m) => (
              <div key={m.id} className="relative group" onMouseEnter={() => setHovered(m.id)}>
                <Link to={m.route}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-colors hover:text-foreground
                    ${hovered === m.id ? "text-foreground" : "text-muted-foreground"}`}>
                  {m.label}
                </Link>
              </div>
            ))}
          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1">
          <button onClick={openSearch} aria-label="Search"
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-secondary/50">
            <Search className="h-5 w-5" />
          </button>

          <Link to="/wishlist" aria-label="Wishlist"
            className={`hidden h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-secondary/50 sm:flex
              ${pathname === "/wishlist" ? "bg-secondary/20" : ""}`}>
            <Heart className="h-5 w-5" />
          </Link>

          <button onClick={openCart} aria-label="Cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-secondary/50">
            <ShoppingBag className="h-5 w-5" />
            <AnimatePresence>
              {count > 0 && (
                <motion.span key={count}
                  initial={{ scale: 0, y: -6 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0, y: -6 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-bold text-background">
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Notification bell — only shown when logged in */}
          {user && <NotificationBell />}

          {/* User menu — authenticated */}
          {user ? (
            <div ref={userMenuRef} className="relative ml-2">
              <button onClick={() => setUserMenu(v => !v)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold transition-opacity hover:opacity-80">
                {getInitials(user.name)}
              </button>
              <AnimatePresence>
                {userMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-border bg-background shadow-soft z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-semibold truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <div className="p-1.5">
                      <Link to="/account" onClick={() => setUserMenu(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm hover:bg-secondary transition-colors">
                        <User className="h-4 w-4 text-muted-foreground" /> My Account
                      </Link>
                      <button onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/account" aria-label="Account"
                className={`hidden h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-secondary/50 sm:flex
                  ${pathname === "/account" ? "bg-secondary/20" : ""}`}>
                <User className="h-5 w-5" />
              </Link>
              <Link to="/signin"
                className="ml-2 hidden rounded-pill bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-all
                  hover:opacity-90 hover:-translate-y-0.5 lg:inline-block">
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mega menu */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key={hovered}
            variants={megaMenuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-x-0 top-full hidden border-t border-background/20 bg-background/80 backdrop-blur-sm shadow-lg md:block">
            <div className="container-clofit grid grid-cols-12 gap-8 py-10 px-4 lg:px-6">
              <div className="col-span-3">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Shop {hovered}</p>
                <ul className="mt-5 space-y-4">
                  {megaSections.find(m => m.id === hovered)?.featured.map(f => (
                    <li key={f}>
                      <Link to={megaSections.find(m => m.id === hovered)?.route ?? "/shop"}
                        className="block px-3 py-2 text-base font-medium transition-colors hover:text-foreground text-muted-foreground">
                        {f}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link to={megaSections.find(m => m.id === hovered)?.route ?? "/shop"}
                      className="mt-3 inline-block text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground">
                      View all →
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="col-span-9 grid grid-cols-3 gap-6">
                {products.filter(p => p.category === hovered).slice(0, 3).map((p, i) => (
                  <motion.div key={p.id} initial={{ y: 20, opacity: 0 }}
                    animate={{
                      y: 0,
                      opacity: 1,
                      transition: {
                        delay: i * 0.05,
                        type: "spring" as const,
                        stiffness: 300,
                        damping: 20
                      } as const
                    }}
                    className="group">
                    <Link to={`/product/${p.id}`} className="block">
                      <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-secondary transition-transform duration-700 ease-out group-hover:scale-105">
                        <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground">${p.price} USD</p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
