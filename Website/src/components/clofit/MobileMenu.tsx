import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "@/context/UIContext";
import { X, ChevronRight } from "lucide-react";
import { NavLink, Link } from "react-router-dom";

const PRIMARY_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/shop", label: "Shop All", end: true },
  { to: "/shop/men", label: "Men's Collection" },
  { to: "/shop/women", label: "Women's Collection" },
  { to: "/shop/shoes", label: "Shoes" },
  { to: "/shop/accessories", label: "Accessories" },
  { to: "/shop?badge=new", label: "New Arrivals" },
];

const ACCOUNT_LINKS = [
  { to: "/wishlist", label: "Wishlist" },
  { to: "/cart", label: "Cart" },
  { to: "/account", label: "Account" },
];

export const MobileMenu = () => {
  const { menuOpen, closeMenu } = useUI();

  return (
    <AnimatePresence>
      {menuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMenu}
            className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 left-0 z-50 flex w-[88%] max-w-sm flex-col bg-background"
          >
            {/* Header */}
            <div className="flex h-16 items-center justify-between border-b border-border px-5">
              <span className="font-extrabold tracking-tight">CLOFIT</span>
              <button
                aria-label="Close menu"
                onClick={closeMenu}
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-2 py-4">
              {/* Primary navigation */}
              <ul className="space-y-0.5">
                {PRIMARY_LINKS.map((l, i) => (
                  <motion.li
                    key={l.to + l.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 + i * 0.03 }}
                  >
                    <NavLink
                      to={l.to}
                      end={l.end}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `flex items-center justify-between rounded-xl px-4 py-3 text-base font-semibold transition-colors ${
                          isActive
                            ? "bg-secondary text-foreground"
                            : "text-foreground hover:bg-secondary"
                        }`
                      }
                    >
                      {l.label}
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </NavLink>
                  </motion.li>
                ))}
              </ul>

              {/* Account section */}
              <p className="mt-6 px-4 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                My Account
              </p>
              <ul className="mt-2 space-y-0.5">
                {ACCOUNT_LINKS.map((l) => (
                  <li key={l.to}>
                    <NavLink
                      to={l.to}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `flex items-center justify-between rounded-xl px-4 py-2.5 text-sm transition-colors ${
                          isActive
                            ? "bg-secondary font-medium text-foreground"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        }`
                      }
                    >
                      {l.label}
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Footer CTA */}
            <div className="border-t border-border p-5">
              <Link
                to="/signin"
                onClick={closeMenu}
                className="block w-full rounded-pill bg-foreground py-3.5 text-center text-sm font-semibold text-background"
              >
                Sign In
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
