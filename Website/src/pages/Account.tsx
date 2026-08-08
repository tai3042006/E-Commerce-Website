import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, ShoppingBag, Heart, MapPin, CreditCard, Bell, Settings, LogOut, ChevronRight, Package, Star } from "lucide-react";
import { Layout } from "@/components/clofit/Layout";
import { Breadcrumbs } from "@/components/clofit/Breadcrumbs";
import { useAuth } from "@/context/AuthContext.hooks";
import { useWishlist } from "@/context/WishlistContext.hooks";
import { toast } from "sonner";

const TOKEN_KEY = "clofit:token";
const getToken = () => localStorage.getItem(TOKEN_KEY);

const STATUS_COLOR: Record<string, string> = {
  pending: "text-amber-600", processing: "text-blue-600",
  shipped: "text-purple-600", delivered: "text-emerald-600", cancelled: "text-red-600",
};
const STATUS_LABEL: Record<string, string> = {
  pending: "Pending", processing: "Processing",
  shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled",
};

type ApiOrder = {
  id: string;
  date: string;
  total: number;
  status: string;
  product: string;
  items: number;
};

const Account = () => {
  const { user, logout } = useAuth();
  const { ids } = useWishlist();
  const navigate = useNavigate();
  const [myOrders, setMyOrders] = useState<ApiOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (!user) { setMyOrders([]); return; }
    const token = getToken();
    if (!token) return;
    setOrdersLoading(true);
    fetch("/api/orders/my", {
      headers: { "Content-Type": "application/json", "x-auth-token": token },
    })
      .then(r => r.ok ? r.json() : [])
      .then(setMyOrders)
      .catch(() => setMyOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [user]);

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out");
    navigate("/");
  };

  if (!user) {
    return (
      <Layout>
        <section className="container-clofit pt-4 pb-20 lg:pt-10">
          <Breadcrumbs crumbs={[{ label: "Account" }]} className="mb-6" />
          <div className="flex items-center gap-5 rounded-2xl border border-border p-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary"><User className="h-7 w-7 text-muted-foreground" /></div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-extrabold">Guest</h1>
              <p className="text-sm text-muted-foreground">Sign in to view orders, wishlist and more</p>
            </div>
            <Link to="/signin" className="shrink-0 rounded-pill bg-foreground px-5 py-2.5 text-sm font-semibold text-background hover:opacity-90">Sign In</Link>
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account? <Link to="/signup" className="font-semibold text-foreground underline-offset-2 hover:underline">Sign Up</Link>
          </p>
        </section>
      </Layout>
    );
  }

  const initials = user.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  const totalSpent = myOrders.reduce((s, o) => s + o.total, 0);

  return (
    <Layout>
      <section className="container-clofit pt-4 pb-20 lg:pt-10">
        <Breadcrumbs crumbs={[{ label: "Account" }]} className="mb-6" />

        <div className="flex items-center gap-5 rounded-2xl border border-border p-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground text-background text-xl font-bold">{initials}</div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-extrabold">{user.name}</h1>
            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 rounded-pill border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { label: "Orders",   value: myOrders.length, icon: Package },
            { label: "Wishlist", value: ids.length,       icon: Heart },
            { label: "Points",   value: Math.floor(totalSpent), icon: Star },
          ].map(s => (
            <div key={s.label} className="flex flex-col items-center gap-1 rounded-2xl border border-border py-5">
              <s.icon className="h-5 w-5 text-muted-foreground" />
              <p className="text-xl font-extrabold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-base font-semibold">My Orders</h2>
          {ordersLoading ? (
            <div className="rounded-2xl border border-border p-10 text-center text-muted-foreground text-sm">Loading orders…</div>
          ) : myOrders.length === 0 ? (
            <div className="rounded-2xl border border-border p-10 text-center text-muted-foreground">
              <ShoppingBag className="mx-auto h-8 w-8 mb-3" />
              <p>You have no orders yet.</p>
              <Link to="/shop" className="mt-4 inline-block text-sm font-semibold text-foreground underline-offset-2 hover:underline">Shop Now →</Link>
            </div>
          ) : (
            <div className="divide-y divide-border rounded-2xl border border-border overflow-hidden">
              {myOrders.slice(0, 6).map(order => (
                <div key={order.id} className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <p className="text-sm font-semibold">{order.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.date ? new Date(order.date).toLocaleDateString("en-US") : "—"} · {order.items} item{order.items !== 1 ? "s" : ""}
                    </p>
                    <p className="text-xs text-muted-foreground">{order.product}</p>
                    <p className={`text-xs font-medium ${STATUS_COLOR[order.status] || ""}`}>
                      {STATUS_LABEL[order.status] || order.status}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">${Number(order.total).toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 space-y-4">
          {[
            { heading: "Shopping", items: [
              { icon: Heart,      label: "Wishlist", to: "/wishlist" },
              { icon: ShoppingBag,label: "Cart",     to: "/cart" },
            ]},
            { heading: "Account", items: [
              { icon: MapPin,     label: "Shipping Addresses",  to: "/account/addresses" },
              { icon: CreditCard, label: "Payment Methods",     to: "/account/payment-methods" },
              { icon: Bell,       label: "Notifications",       to: "/account/notifications" },
              { icon: Settings,   label: "Settings",            to: "/account/settings" },
            ]},
          ].map(g => (
            <div key={g.heading}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{g.heading}</p>
              <div className="divide-y divide-border rounded-2xl border border-border overflow-hidden">
                {g.items.map(item => (
                  <Link key={item.label} to={item.to} className="flex items-center justify-between px-5 py-4 hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center gap-3"><item.icon className="h-4 w-4 text-muted-foreground" /><span className="text-sm font-medium">{item.label}</span></div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <button onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl border border-border px-5 py-4 text-sm font-medium text-destructive hover:bg-secondary/50">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </section>
    </Layout>
  );
};
export default Account;