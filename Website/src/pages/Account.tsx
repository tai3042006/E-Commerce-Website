import { Link } from "react-router-dom";
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Package,
  Star,
} from "lucide-react";
import { Layout } from "@/components/clofit/Layout";
import { Breadcrumbs } from "@/components/clofit/Breadcrumbs";

const RECENT_ORDERS = [
  {
    id: "CF-8821",
    date: "Jun 3, 2026",
    status: "Delivered",
    items: 2,
    total: 137,
    statusColor: "text-emerald-600",
  },
  {
    id: "CF-8754",
    date: "May 18, 2026",
    status: "Delivered",
    items: 1,
    total: 69,
    statusColor: "text-emerald-600",
  },
  {
    id: "CF-8690",
    date: "May 1, 2026",
    status: "Returned",
    items: 3,
    total: 218,
    statusColor: "text-amber-600",
  },
];

const MENU_GROUPS = [
  {
    heading: "Shopping",
    items: [
      { icon: ShoppingBag, label: "My Orders", to: "/account#orders" },
      { icon: Heart, label: "Wishlist", to: "/wishlist" },
      { icon: Star, label: "Reviews", to: "/account#reviews" },
    ],
  },
  {
    heading: "Account",
    items: [
      { icon: MapPin, label: "Addresses", to: "/account#addresses" },
      { icon: CreditCard, label: "Payment Methods", to: "/account#payment" },
      { icon: Bell, label: "Notifications", to: "/account#notifications" },
      { icon: Settings, label: "Settings", to: "/account#settings" },
    ],
  },
];

const Account = () => {
  return (
    <Layout>
      <section className="container-clofit pt-4 pb-20 lg:pt-10">
        <Breadcrumbs crumbs={[{ label: "Account" }]} className="mb-6" />

        {/* Profile card */}
        <div className="flex items-center gap-5 rounded-2xl border border-border p-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <User className="h-7 w-7 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-extrabold tracking-tight">
              Guest User
            </h1>
            <p className="text-sm text-muted-foreground truncate">
              Sign in to access your orders, wishlist & more
            </p>
          </div>
          <Link
            to="/signin"
            className="shrink-0 rounded-pill bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
          >
            Sign In
          </Link>
        </div>

        {/* Stats row */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { label: "Orders", value: "3", icon: Package },
            { label: "Wishlist", value: "0", icon: Heart },
            { label: "Reviews", value: "5", icon: Star },
          ].map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-1 rounded-2xl border border-border py-5"
            >
              <s.icon className="h-5 w-5 text-muted-foreground" />
              <p className="text-xl font-extrabold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Recent orders */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold">Recent Orders</h2>
            <button className="text-xs font-medium text-muted-foreground hover:text-foreground">
              View all
            </button>
          </div>
          <div className="divide-y divide-border rounded-2xl border border-border overflow-hidden">
            {RECENT_ORDERS.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-secondary/40 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                    <Package className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{order.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.date} · {order.items} item{order.items > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">${order.total}</p>
                  <p className={`text-xs font-medium ${order.statusColor}`}>
                    {order.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu groups */}
        {MENU_GROUPS.map((group) => (
          <div key={group.heading} className="mt-8">
            <p className="mb-2 px-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {group.heading}
            </p>
            <div className="divide-y divide-border rounded-2xl border border-border overflow-hidden">
              {group.items.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-secondary/40"
                >
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                  <span className="flex-1 text-sm font-medium">
                    {item.label}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Sign out */}
        <button className="mt-6 flex w-full items-center gap-3 rounded-2xl border border-border px-5 py-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-destructive">
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </section>
    </Layout>
  );
};

export default Account;
