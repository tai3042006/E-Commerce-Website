import { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Users, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/clofit/Logo";
import { NotificationBell } from "@/components/clofit/NotificationBell";

const navItems = [
  { to: "/admin",           label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products",  label: "Products",  icon: Package },
  { to: "/admin/orders",    label: "Orders",    icon: ShoppingCart },
  { to: "/admin/customers", label: "Customers", icon: Users },
];

export const AdminLayout = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="flex min-h-screen flex-col bg-background">
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="container-clofit flex h-16 items-center justify-between gap-6 lg:h-20">
        <div className="flex items-center gap-3">
          <Logo className="text-xl lg:text-2xl" />
          <span className="hidden rounded-pill bg-secondary px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:inline">
            Admin
          </span>
        </div>

        {/* Right side: notification bell + back to store */}
        <div className="flex items-center gap-2">
          <NotificationBell />
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
