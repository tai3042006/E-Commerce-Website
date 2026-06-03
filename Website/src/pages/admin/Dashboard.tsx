import { useMemo } from "react";
import {
  ArrowDownRight, ArrowUpRight, DollarSign, Package,
  ShoppingCart, Users, TrendingUp,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar,
} from "recharts";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { customers, statusStyles } from "@/data/admin";
import { getProducts } from "@/data/products";
import { useOrders } from "@/context/OrderContext";

// Build daily revenue data from orders for the chart
function buildRevenueData(orders: ReturnType<typeof useOrders>["orders"]) {
  const map: Record<string, number> = {};
  orders.forEach((o) => {
    if (o.status !== "cancelled") {
      map[o.date] = (map[o.date] ?? 0) + o.total;
    }
  });
  // Last 7 unique dates sorted
  const sorted = Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7);
  return sorted.map(([date, revenue]) => ({
    date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    revenue,
  }));
}

// Product revenue breakdown
function buildProductRevenue(orders: ReturnType<typeof useOrders>["orders"]) {
  const map: Record<string, number> = {};
  orders.forEach((o) => {
    if (o.status !== "cancelled") {
      map[o.product] = (map[o.product] ?? 0) + o.total;
    }
  });
  return Object.entries(map)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, revenue]) => ({
      name: name.length > 20 ? name.slice(0, 18) + "…" : name,
      revenue,
    }));
}

const AdminDashboard = () => {
  const { orders, unreadCount } = useOrders();
  const products = getProducts();

  const totalRevenue = useMemo(
    () => orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0),
    [orders]
  );

  const revenueData = useMemo(() => buildRevenueData(orders), [orders]);
  const productRevenue = useMemo(() => buildProductRevenue(orders), [orders]);

  const stats = [
    { label: "Revenue", value: `$${totalRevenue.toLocaleString()}`, change: "+12.4%", up: true, icon: DollarSign },
    { label: "Orders", value: orders.length.toString(), change: "+8.1%", up: true, icon: ShoppingCart },
    { label: "Customers", value: customers.length.toString(), change: "+4.6%", up: true, icon: Users },
    { label: "Products", value: products.length.toString(), change: "-1.2%", up: false, icon: Package },
  ];

  const recent = orders.slice(0, 5);
  const topProducts = [...products]
    .sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0))
    .slice(0, 4);

  return (
    <AdminLayout title="Dashboard">
      {/* New order alert banner */}
      {unreadCount > 0 && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800">
          <TrendingUp className="h-5 w-5 flex-shrink-0 text-emerald-600" />
          <p className="text-sm font-medium">
            🎉 {unreadCount} new order{unreadCount > 1 ? "s" : ""} just came in! Check the Orders tab for details.
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-3 text-2xl font-bold">{s.value}</div>
            <div className={`mt-1 flex items-center gap-1 text-xs font-medium ${s.up ? "text-emerald-600" : "text-red-600"}`}>
              {s.up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              {s.change} vs last month
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Charts */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Area chart - daily revenue */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] lg:col-span-2">
          <h2 className="mb-1 text-lg font-semibold">Revenue over time</h2>
          <p className="mb-5 text-xs text-muted-foreground">Daily revenue (excl. cancelled)</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--foreground))" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="hsl(var(--foreground))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                formatter={(v: number) => [`$${v.toFixed(2)}`, "Revenue"]}
                contentStyle={{
                  background: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--foreground))"
                strokeWidth={2}
                fill="url(#revenueGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </section>

        {/* Bar chart - revenue by product */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <h2 className="mb-1 text-lg font-semibold">By product</h2>
          <p className="mb-5 text-xs text-muted-foreground">Top 5 by revenue</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={productRevenue} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" tickFormatter={(v) => `$${v}`} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                formatter={(v: number) => [`$${v}`, "Revenue"]}
                contentStyle={{
                  background: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="revenue" fill="hsl(var(--foreground))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>

      {/* Recent orders + top products */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent orders</h2>
            <a href="/admin/orders" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              View all
            </a>
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
                {recent.map((o) => (
                  <tr key={o.id} className={o.isNew ? "bg-emerald-50/60" : ""}>
                    <td className="py-3 pr-4 font-medium">
                      {o.id}
                      {o.isNew && (
                        <span className="ml-2 inline-flex rounded-pill bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                          NEW
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">{o.customer}</td>
                    <td className="py-3 pr-4 font-medium">${o.total}</td>
                    <td className="py-3">
                      <span className={`inline-flex rounded-pill px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[o.status]}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <h2 className="mb-4 text-lg font-semibold">Top products</h2>
          <ul className="space-y-4">
            {topProducts.map((p) => (
              <li key={p.id} className="flex items-center gap-3">
                <img src={p.image} alt={p.name} className="h-12 w-12 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.reviews?.toLocaleString()} reviews</div>
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
