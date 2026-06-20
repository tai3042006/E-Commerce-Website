import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { statusStyles, OrderStatus } from "@/data/admin";
import { toast } from "sonner";
import { Download } from "lucide-react";

type ApiOrder = {
  id: string; customer: string; customerEmail: string;
  date: string; total: number; status: string; product: string;
};

const filters: ("all" | OrderStatus)[] = ["all", "pending", "processing", "shipped", "delivered", "cancelled"];
const ALL_STATUSES: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];

const TOKEN_KEY = "clofit:token";
const getToken = () => localStorage.getItem(TOKEN_KEY);

const AdminOrders = () => {
  const [orders, setOrders]   = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState<(typeof filters)[number]>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [exporting, setExporting]   = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.set("status", filter);
      const url = `/api/orders/export${params.toString() ? "?" + params : ""}`;
      const r = await fetch(url);
      if (!r.ok) throw new Error("Export failed");
      const blob = await r.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `clofit-revenue-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(a.href);
      toast.success("Revenue report exported!");
    } catch {
      toast.error("Failed to export report.");
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    fetch("/api/orders")
      .then(r => r.json())
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const token = getToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["x-auth-token"] = token;

      const r = await fetch(`/api/orders/${encodeURIComponent(orderId)}/status`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status: newStatus }),
      });
      if (!r.ok) throw new Error("Update failed");
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success(`Order ${orderId} updated to "${newStatus}"`);
    } catch {
      toast.error("Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const list = useMemo(
    () => filter === "all" ? orders : orders.filter(o => o.status === filter),
    [orders, filter]
  );

  return (
    <AdminLayout title="Orders">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-pill border px-4 py-2 text-sm font-medium capitalize transition-colors
              ${filter === f ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground"}`}>
            {f} <span className="ml-1 text-xs opacity-70">
              {f === "all" ? orders.length : orders.filter(o => o.status === f).length}
            </span>
          </button>
        ))}
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="inline-flex items-center gap-2 rounded-pill border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          {exporting ? "Exporting…" : "Xuất doanh thu (CSV)"}
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">Loading orders…</td></tr>
              )}
              {!loading && list.map(o => (
                <tr key={o.id} className="hover:bg-secondary/30">
                  <td className="px-5 py-3 font-medium">{o.id}</td>
                  <td className="px-5 py-3">
                    <div className="font-medium">{o.customer}</div>
                    <div className="text-xs text-muted-foreground">{o.customerEmail}</div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{o.product}</td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {o.date ? new Date(o.date).toLocaleDateString("en-US") : "—"}
                  </td>
                  <td className="px-5 py-3 font-semibold">${Number(o.total).toFixed(2)}</td>
                  <td className="px-5 py-3">
                    <select
                      value={o.status}
                      disabled={updatingId === o.id}
                      onChange={e => handleStatusChange(o.id, e.target.value)}
                      className={`rounded-pill border px-2.5 py-1 text-xs font-medium capitalize cursor-pointer focus:outline-none
                        ${statusStyles[o.status as OrderStatus] ?? "bg-secondary border-border"}`}
                    >
                      {ALL_STATUSES.map(s => (
                        <option key={s} value={s} className="bg-background text-foreground capitalize">{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {!loading && list.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
export default AdminOrders;
