import { useState } from "react";
import { Mail, Search } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { customers } from "@/data/admin";

const initials = (name: string) =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

const AdminCustomers = () => {
  const [q, setQ] = useState("");
  const list = customers.filter(
    (c) => c.name.toLowerCase().includes(q.toLowerCase()) || c.email.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <AdminLayout title="Customers">
      <div className="mb-6 max-w-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search customers..."
            className="h-11 w-full rounded-pill border border-input bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((c) => (
          <article key={c.id} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background">
                {initials(c.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{c.name}</div>
                <div className="truncate text-xs text-muted-foreground">{c.location}</div>
              </div>
            </div>
            <a href={`mailto:${c.email}`} className="mt-4 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
              <Mail className="h-4 w-4" />
              <span className="truncate">{c.email}</span>
            </a>
            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4 text-center">
              <div>
                <div className="text-lg font-bold">{c.orders}</div>
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Orders</div>
              </div>
              <div>
                <div className="text-lg font-bold">${c.spent}</div>
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Spent</div>
              </div>
              <div>
                <div className="text-lg font-bold">{new Date(c.joined).getFullYear()}</div>
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Joined</div>
              </div>
            </div>
          </article>
        ))}
        {list.length === 0 && (
          <div className="col-span-full rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
            No customers found.
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCustomers;
