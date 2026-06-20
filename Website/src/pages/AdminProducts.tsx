import { useEffect, useState } from "react";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { toast } from "sonner";
import { ProductCatalog } from "@/services/ProductCatalog";

// ── Types ──────────────────────────────────────────────────────────────────────

type ApiProduct = {
  id: string; name: string; tagline?: string; price: number; oldPrice?: number;
  image?: string; category: string; gender: string; rating: number;
  reviews: number; inStock: boolean;
};

type Category = { id: string; label: string };

type AddForm = {
  name: string; price: string; category_id: string; gender: string;
  tagline: string; description: string; image: string; badge: string;
  sizes: string; colors: string; in_stock: boolean;
};

const EMPTY_FORM: AddForm = {
  name: "", price: "", category_id: "", gender: "unisex",
  tagline: "", description: "", image: "", badge: "",
  sizes: "XS, S, M, L, XL", colors: "", in_stock: true,
};

const TOKEN_KEY = "clofit:token";
const getToken  = () => localStorage.getItem(TOKEN_KEY);
const authHeaders = () => ({
  "Content-Type": "application/json",
  ...(getToken() ? { "x-auth-token": getToken()! } : {}),
});

// ── Component ─────────────────────────────────────────────────────────────────

const AdminProducts = () => {
  const [products,  setProducts]  = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [q,         setQ]         = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [form,      setForm]      = useState<AddForm>(EMPTY_FORM);

  // ── Data fetching ──────────────────────────────────────────────────────────

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then(r => r.json()),
      fetch("/api/categories").then(r => r.json()),
    ])
      .then(([prods, cats]) => {
        setProducts(prods);
        setCategories(cats);
        if (cats.length && !form.category_id) {
          setForm(f => ({ ...f, category_id: cats[0].id }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const field = (key: keyof AddForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleAddProduct = async () => {
    if (!form.name || !form.price || !form.category_id) {
      toast.error("Name, price and category are required.");
      return;
    }
    setSaving(true);
    try {
      const body = {
        name:        form.name,
        price:       parseFloat(form.price),
        category_id: form.category_id,
        gender:      form.gender,
        tagline:     form.tagline     || null,
        description: form.description || null,
        image:       form.image       || null,
        badge:       form.badge       || null,
        in_stock:    form.in_stock ? 1 : 0,
        sizes:  form.sizes.split(",").map(s => s.trim()).filter(Boolean),
        colors: form.colors.split(",").map(c => c.trim()).filter(Boolean),
      };
      const r = await fetch("/api/admin/products", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(body),
      });
      if (!r.ok) {
        const err = await r.json();
        throw new Error(err.error ?? "Failed to add product");
      }
      const newProduct: ApiProduct = await r.json();
      setProducts(prev => [newProduct, ...prev]);
      // Invalidate the singleton cache so customers see the new product immediately
      ProductCatalog.getInstance().invalidate();
      setShowModal(false);
      setForm(EMPTY_FORM);
      toast.success(`"${newProduct.name}" added — customers will be notified.`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error adding product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      const r = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!r.ok) throw new Error("Delete failed");
      setProducts(prev => prev.filter(p => p.id !== id));
      // Invalidate the singleton cache so customers see the deletion immediately
      ProductCatalog.getInstance().invalidate();
      toast.success(`"${name}" deleted.`);
    } catch {
      toast.error("Could not delete product.");
    }
  };

  const filtered = products.filter(
    p => p.name.toLowerCase().includes(q.toLowerCase())
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <AdminLayout title="Products">
      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search products…"
            className="h-11 w-full rounded-pill border border-input bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          onClick={() => { setForm(f => ({ ...f, category_id: categories[0]?.id ?? "" })); setShowModal(true); }}
          className="inline-flex items-center gap-2 rounded-pill bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Add product
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Rating</th>
                <th className="px-5 py-3">Stock</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">
                    Loading products…
                  </td>
                </tr>
              )}
              {!loading && filtered.map(p => (
                <tr key={p.id} className="hover:bg-secondary/30">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {p.image
                        ? <img src={p.image} alt={p.name} className="h-12 w-12 rounded-lg object-cover" />
                        : <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground text-xs">N/A</div>
                      }
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{p.tagline}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 capitalize text-muted-foreground">{p.category}</td>
                  <td className="px-5 py-3 font-medium">
                    ${p.price}
                    {p.oldPrice && (
                      <span className="ml-2 text-xs line-through text-muted-foreground">${p.oldPrice}</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {p.rating ?? "—"} ({p.reviews ?? 0})
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex rounded-pill px-2.5 py-1 text-xs font-medium
                      ${p.inStock ? "bg-emerald-100 text-emerald-900" : "bg-red-100 text-red-900"}`}>
                      {p.inStock ? "In stock" : "Out of stock"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="rounded-lg p-2 hover:bg-secondary transition-colors"
                        aria-label="Edit"
                        title="Edit (coming soon)"
                      >
                        <Pencil className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="rounded-lg p-2 hover:bg-red-50 transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add Product Modal ───────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-background p-6 shadow-xl overflow-y-auto max-h-[90vh]">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold">Add New Product</h2>
              <button onClick={() => setShowModal(false)} className="rounded-full p-1 hover:bg-secondary">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Name *</label>
                <input value={form.name} onChange={field("name")} placeholder="Air Runner Sneaker"
                  className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>

              {/* Price + Category (row) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Price (USD) *</label>
                  <input type="number" step="0.01" min="0" value={form.price} onChange={field("price")} placeholder="89.99"
                    className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Category *</label>
                  <select value={form.category_id} onChange={field("category_id")}
                    className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Gender + Badge (row) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Gender</label>
                  <select value={form.gender} onChange={field("gender")}
                    className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="unisex">Unisex</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Badge</label>
                  <select value={form.badge} onChange={field("badge")}
                    className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">None</option>
                    <option value="new">New</option>
                    <option value="sale">Sale</option>
                    <option value="bestseller">Bestseller</option>
                  </select>
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Tagline</label>
                <input value={form.tagline} onChange={field("tagline")} placeholder="Short catchy phrase"
                  className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Description</label>
                <textarea value={form.description} onChange={field("description")} rows={3}
                  placeholder="Product description…"
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>

              {/* Image URL */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Image URL</label>
                <input value={form.image} onChange={field("image")} placeholder="https://…"
                  className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>

              {/* Sizes */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Sizes <span className="font-normal">(comma-separated)</span>
                </label>
                <input value={form.sizes} onChange={field("sizes")} placeholder="XS, S, M, L, XL"
                  className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>

              {/* Colors */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Colors <span className="font-normal">(hex, comma-separated)</span>
                </label>
                <input value={form.colors} onChange={field("colors")} placeholder="#000000, #ffffff"
                  className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>

              {/* In stock toggle */}
              <label className="flex cursor-pointer items-center gap-3">
                <div
                  onClick={() => setForm(f => ({ ...f, in_stock: !f.in_stock }))}
                  className={`relative h-6 w-11 rounded-full transition-colors
                    ${form.in_stock ? "bg-foreground" : "bg-secondary"}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform
                    ${form.in_stock ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
                <span className="text-sm font-medium">In stock</span>
              </label>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-pill border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-pill bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Add product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;
