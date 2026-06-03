import { ReactNode, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Users, ArrowLeft, Bell } from "lucide-react";
import { Logo } from "@/components/clofit/Logo";
import { useOrders } from "@/context/OrderContext";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/customers", label: "Customers", icon: Users },
];

export const AdminLayout = ({ title, children }: { title: string; children: ReactNode }) => {
  const { unreadCount, markAllRead } = useOrders();
  const location = useLocation();

  // Mark all read when visiting orders or dashboard
  useEffect(() => {
    if (location.pathname === "/admin" || location.pathname === "/admin/orders") {
      markAllRead();
    }
  }, [location.pathname, markAllRead]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="container-clofit flex h-16 items-center justify-between gap-6 lg:h-20">
          <div className="flex items-center gap-3">
            <Logo className="text-xl lg:text-2xl" />
            <span className="hidden rounded-pill bg-secondary px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:inline">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <Link
              to="/admin/orders"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 animate-pulse items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
            <Link
              to="/"
              className="flex items-center gap-2 rounded-pill border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to store</span>
            </Link>
          </div>
        </div>
        <nav className="container-clofit -mb-px flex items-center gap-1 overflow-x-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.label === "Orders" && unreadCount > 0 && (
                <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="flex-1">
        <div className="container-clofit py-8 lg:py-12">
          <h1 className="mb-8 text-3xl font-bold tracking-tight lg:text-4xl">{title}</h1>
          {children}
        </div>
      </main>
    </div>
  );
};
