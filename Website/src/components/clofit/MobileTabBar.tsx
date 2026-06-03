import { NavLink } from "react-router-dom";
import { Home, Store, Heart, ShoppingBag, User } from "lucide-react";

const tabs = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/shop", label: "Shop", icon: Store },
  { to: "/favorites", label: "Favorites", icon: Heart },
  { to: "/bag", label: "Bag", icon: ShoppingBag },
  { to: "/profile", label: "Profile", icon: User },
];

export const MobileTabBar = () => (
  <nav
    aria-label="Primary"
    className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
  >
    <ul className="mx-auto flex max-w-md items-stretch justify-around px-2">
      {tabs.map(({ to, label, icon: Icon, end }) => (
        <li key={label} className="flex-1">
          <NavLink
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className="h-5 w-5"
                  fill={isActive ? "currentColor" : "none"}
                  strokeWidth={isActive ? 1.5 : 2}
                />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
);
