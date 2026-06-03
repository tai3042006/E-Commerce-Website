import { useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { OrderStatus, statusStyles } from "@/data/admin";
import { useOrders } from "@/context/OrderContext";

const filters: ("all" | OrderStatus)[] = ["all", "pending", "processing", "shipped", "delivered", "cancelled"];

const AdminOrders = () => {
  const { orders } = useOrders();
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const list = useMemo(
    () => (filter === "all" ? orders : orders.filter((o) => o.status === filter)),
    [filter, orders]
  );

  return (
    <AdminLayout title="Orders">
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-pill border px-4 py-2 text-sm font-medium capitalize transition-colors ${
              filter === f
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
            <span className="ml-2 text-xs opacity-70">
              {f === "all" ? orders.length : orders.filter((o) => o.status === f).length}
            </span>
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Items</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {list.map((o) => (
                <tr key={o.id} className={`hover:bg-secondary/30 ${o.isNew ? "bg-emerald-50/60" : ""}`}>
                  <td className="px-5 py-3 font-medium">
                    {o.id}
                    {o.isNew && (
                      <span className="ml-2 inline-flex rounded-pill bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                        NEW
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div>{o.customer}</div>
                    <div className="text-xs text-muted-foreground">{o.email}</div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{o.product}</td>
                  <td className="px-5 py-3 text-muted-foreground">{o.date}</td>
                  <td className="px-5 py-3">{o.items}</td>
                  <td className="px-5 py-3 font-semibold">${o.total}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex rounded-pill px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[o.status]}`}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">
                    No orders in this status.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
