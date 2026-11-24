import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { statusStyles, OrderStatus } from "@/data/admin";
import { toast } from "sonner";
import { Banknote, ChevronDown, Download, QrCode } from "lucide-react";
import { authHeaders } from "@/context/AuthContext.hooks";

type ApiOrder = {
  id: string; displayId?: string; customer: string; customerEmail: string; paymentMethod?: string; paidAt?: string; reference?: number;
  date: string; total: number; status: string; product: string;
};

const filters: ("all" | "awaiting_payment" | OrderStatus)[] = ["all", "awaiting_payment", "pending", "processing", "shipped", "delivered", "cancelled"];
const ALL_STATUSES: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];

type OrderDetails = {
  address: string | null; city: string | null; zip: string | null; country: string | null;
  lines: { id: number; name: string; size: string | null; qty: number; price: number }[];
};

const AdminOrders = () => {
  const [details, setDetails] = useState<Record<string, OrderDetails>>({});
  const [orders, setOrders]   = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState<(typeof filters)[number]>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [exporting, setExporting]   = useState(false);

  const loadDetails = async (id: string) => {
    if (details[id]) return;
    try {
      const response = await fetch("/api/orders/" + encodeURIComponent(id) + "/details", { headers: authHeaders() });
      if (!response.ok) throw new Error("Failed to load order details");
      const order: OrderDetails = await response.json();
      setDetails(previous => ({ ...previous, [id]: order }));
    } catch {
      toast.error("Failed to load order details");
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.set("status", filter);
      const url = `/api/orders/export${params.toString() ? "?" + params : ""}`;
      const r = await fetch(url, { headers: authHeaders() });
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
    fetch("/api/orders", { headers: authHeaders() })
      .then(async r => {
        if (!r.ok) throw new Error("Failed to load admin data");
        return r.json();
      })
      .then(setOrders)
      .catch(() => toast.error("Could not load admin data"))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const r = await fetch(`/api/orders/${encodeURIComponent(orderId)}/status`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });
      if (!r.ok) throw new Error("Update failed");
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success(`Order status updated to ${newStatus}.`);
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
            {f.replace("_", " ")} <span className="ml-1 text-xs opacity-70">
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
                <th className="px-5 py-3">Payment</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">Loading orders…</td></tr>
              )}
              {!loading && list.map(o => (
                <tr key={o.id} className="hover:bg-secondary/30">
                  <td className="whitespace-nowrap px-5 py-3 font-medium tabular-nums">{(o.displayId ?? o.id).replace(/^#(?=CF-)/, "")}</td>
                  <td className="px-5 py-3">
                    <div className="font-medium">{o.customer}</div>
                    <div className="text-xs text-muted-foreground">{o.customerEmail}</div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    <details onToggle={event => { if (event.currentTarget.open) void loadDetails(o.id); }}>
                      <summary className="cursor-pointer">{o.product || "Order details"}</summary>
                      {details[o.id] && (
                        <>
                          <ul className="mt-1 text-xs">
                            {details[o.id].lines.map(line => <li key={line.id}>{line.qty} × {line.name}{line.size && " (" + line.size + ")"}</li>)}
                          </ul>
                          <p className="mt-1 text-xs">
                            {[details[o.id].address, details[o.id].city, details[o.id].zip, details[o.id].country].filter(Boolean).join(", ")}
                          </p>
                        </>
                      )}
                    </details>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {o.date ? new Date(o.date).toLocaleDateString("en-US") : "—"}
                  </td>
                  <td className="px-5 py-3 font-semibold">${Number(o.total).toFixed(2)}</td>
                  <td className="px-5 py-3">
                    {!o.paymentMethod && <span className="whitespace-nowrap text-xs text-muted-foreground">{o.paidAt ? "Paid" : o.reference != null ? "Awaiting confirmation" : "Not recorded"}</span>}
                    {o.paymentMethod && (
                      <div className="mb-1.5 flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-muted-foreground">
                        {o.paymentMethod === "cod"
                          ? <><Banknote aria-hidden="true" size={15} /> Cash on delivery</>
                          : <><QrCode aria-hidden="true" size={15} /> Bank transfer</>}
                      </div>
                    )}
                    {o.paymentMethod === "qr" && <small className="mb-1 block text-muted-foreground">Ref. {o.reference}</small>}
                    {o.paymentMethod &&
                      <div className="relative inline-flex items-center">
                        <span aria-hidden="true" className={`pointer-events-none absolute left-3 h-1.5 w-1.5 rounded-full ${o.paidAt ? "bg-emerald-600" : "bg-amber-500"}`} />
                        <select aria-label={`Payment status for ${o.displayId ?? o.id}`} value={o.paidAt ? "paid" : "unpaid"}
                        disabled={!!o.paidAt || !(o.paymentMethod === "qr" && o.status === "awaiting_payment" || o.paymentMethod === "cod" && ["pending", "processing", "shipped", "delivered"].includes(o.status))}
                        className="h-8 cursor-pointer appearance-none rounded-pill border border-border bg-background pl-6 pr-8 text-xs font-medium transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default" onChange={async () => {
                        if (!window.confirm("Confirm that the full payment was received for this order?")) return;
                        try {
                          const response = await fetch("/api/admin/orders/" + o.id + "/confirm-payment", { method: "POST", headers: authHeaders() });
                          if (!response.ok) throw new Error();
                          setOrders(previous => previous.map(order => order.id === o.id ? { ...order, paidAt: new Date().toISOString(), status: order.status === "awaiting_payment" ? "pending" : order.status } : order));
                        } catch { toast.error("Could not confirm payment"); }
                      }}><option value="unpaid">Unpaid</option><option value="paid">Paid</option></select>
                        <ChevronDown aria-hidden="true" size={13} className="pointer-events-none absolute right-2.5 text-muted-foreground" />
                      </div>}
                  </td>
                  <td className="px-5 py-3">
                    <select
                      value={o.status}
                      disabled={updatingId === o.id || o.status === "awaiting_payment"}
                      onChange={e => handleStatusChange(o.id, e.target.value)}
                      className={`rounded-pill border px-2.5 py-1 text-xs font-medium capitalize cursor-pointer focus:outline-none
                        ${statusStyles[o.status as OrderStatus] ?? "bg-secondary border-border"}`}
                    >
                      {o.status === "awaiting_payment" && <option value="awaiting_payment">Awaiting payment</option>}
                      {ALL_STATUSES.map(s => (
                        <option key={s} value={s} className="bg-background text-foreground capitalize">{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {!loading && list.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
export default AdminOrders;
