import { NavLink, Link } from "react-router-dom";
import { Search, ShoppingBag, Heart, User } from "lucide-react";
import { Logo } from "./Logo";
import { useCart } from "@/context/CartContext";

const links = [
  { to: "/shop", label: "Shop" },
  { to: "/shop?category=hoodies", label: "Hoodies" },
  { to: "/shop?category=tees", label: "Tees" },
  { to: "/shop", label: "New" },
];

export const Navbar = () => {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md">
      <div className="container-clofit flex h-16 items-center justify-between gap-6 lg:h-20">
        <div className="flex items-center gap-10">
          <Logo className="text-xl lg:text-2xl" />
          <nav className="hidden items-center gap-7 md:flex">
            {links.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-foreground ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/search"
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
          >
            <Search className="h-5 w-5" />
          </Link>
          <Link
            to="/favorites"
            aria-label="Favorites"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary sm:flex"
          >
            <Heart className="h-5 w-5" />
          </Link>
          <Link
            to="/profile"
            aria-label="Profile"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary sm:flex"
          >
            <User className="h-5 w-5" />
          </Link>
          <Link
            to="/bag"
            aria-label="Bag"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Link>
          <Link
            to="/signin"
            className="ml-2 hidden rounded-pill bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 lg:inline-block"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
};
