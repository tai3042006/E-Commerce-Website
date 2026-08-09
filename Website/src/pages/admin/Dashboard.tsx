import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight, DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuth } from "@/context/AuthContext.hooks";
import { authHeaders } from "@/context/AuthContext.hooks";
import { statusStyles } from "@/data/admin";

type Order    = { id: string; customer: string; total: number; status: string; date: string; product: string };
type Customer = { id: string; name: string; email: string; location: string; orders: number; spent: number };
type Product  = { id: string; name: string; image: string; price: number; reviews: number };

const AdminDashboard = () => {
  const { user } = useAuth();
  const [orders,    setOrders]    = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products,  setProducts]  = useState<Product[]>([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/orders", { headers: authHeaders() }).then(r => r.json()),
      fetch("/api/customers", { headers: authHeaders() }).then(r => r.json()),
      fetch("/api/products").then(r => r.json()),
    ]).then(([o, c, p]) => {
      setOrders(o);
      setCustomers(c);
      setProducts(p);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const revenue = orders.reduce((s, o) => s + Number(o.total), 0);

  const stats = [
    { label: "Revenue",   value: `$${revenue.toLocaleString()}`,  change: "+12.4%", up: true,  icon: DollarSign },
    { label: "Orders",    value: orders.length.toString(),         change: "+8.1%",  up: true,  icon: ShoppingCart },
    { label: "Customers", value: customers.length.toString(),      change: "+4.6%",  up: true,  icon: Users },
    { label: "Products",  value: products.length.toString(),       change: "-1.2%",  up: false, icon: Package },
  ];

  const recent      = orders.slice(0, 5);
  const topProducts = [...products].sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0)).slice(0, 4);

  return (
    <AdminLayout title="Dashboard">
      {user && (
        <p className="mb-6 text-sm text-muted-foreground">
          Logged in as <span className="font-semibold text-foreground">{user.name}</span> · {user.email}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(s => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-3 text-2xl font-bold">{loading ? "—" : s.value}</div>
            <div className={`mt-1 flex items-center gap-1 text-xs font-medium ${s.up ? "text-emerald-600" : "text-red-600"}`}>
              {s.up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              {s.change} vs last month
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <a href="/admin/orders" className="text-sm font-medium text-muted-foreground hover:text-foreground">View all</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="pb-3 pr-4">Order</th>
                  <th className="pb-3 pr-4">Customer</th>
                  <th className="pb-3 pr-4">Total</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading && (
                  <tr><td colSpan={4} className="py-6 text-center text-muted-foreground text-xs">Loading…</td></tr>
                )}
                {!loading && recent.map(o => (
                  <tr key={o.id}>
                    <td className="py-3 pr-4 font-medium">{o.id}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{o.customer}</td>
                    <td className="py-3 pr-4 font-medium">${Number(o.total).toFixed(2)}</td>
                    <td className="py-3">
                      <span className={`inline-flex rounded-pill px-2.5 py-1 text-xs font-medium capitalize
                        ${statusStyles[o.status as keyof typeof statusStyles] ?? "bg-secondary"}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {!loading && recent.length === 0 && (
                  <tr><td colSpan={4} className="py-6 text-center text-muted-foreground text-xs">No orders yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <h2 className="mb-4 text-lg font-semibold">Top Products</h2>
          <ul className="space-y-4">
            {loading && <li className="text-sm text-muted-foreground">Loading…</li>}
            {!loading && topProducts.map(p => (
              <li key={p.id} className="flex items-center gap-3">
                <img src={p.image} alt={p.name} className="h-12 w-12 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{(p.reviews ?? 0).toLocaleString()} reviews</div>
                </div>
                <div className="text-sm font-semibold">${p.price}</div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AdminLayout>
  );
};
export default AdminDashboard;
