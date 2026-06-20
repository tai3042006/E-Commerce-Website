import { useEffect, useState } from "react";
import { Mail, Search } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";

type Customer = { id: string; name: string; email: string; joined: string; orders: number; spent: number; location: string };

const initials = (name: string) => name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("/api/customers").then(r => r.json()).then(setCustomers).catch(() => {});
  }, []);

  const list = customers.filter(c =>
    c.name.toLowerCase().includes(q.toLowerCase()) || c.email.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <AdminLayout title="Customers">
      <div className="mb-6 max-w-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search customers..."
            className="h-11 w-full rounded-pill border border-input bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map(c => (
          <div key={c.id} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-semibold">{initials(c.name)}</div>
              <div className="min-w-0"><p className="truncate font-medium">{c.name}</p><p className="truncate text-xs text-muted-foreground">{c.location}</p></div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{c.email}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-secondary/60 p-3"><p className="text-xs text-muted-foreground">Orders</p><p className="mt-0.5 font-semibold">{c.orders}</p></div>
              <div className="rounded-xl bg-secondary/60 p-3"><p className="text-xs text-muted-foreground">Spent</p><p className="mt-0.5 font-semibold">${c.spent}</p></div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Joined {typeof c.joined === "string" ? c.joined.slice(0,10) : c.joined}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};
export default AdminCustomers;
