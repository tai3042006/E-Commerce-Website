import { useEffect, useRef, useState } from "react";
import { ImagePlus, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { toast } from "sonner";
import { ProductCatalog } from "@/services/ProductCatalog";

// ── Types ──────────────────────────────────────────────────────────────────────

type ApiProduct = {
  id: string; name: string; tagline?: string; price: number; oldPrice?: number;
  image?: string; category: string; gender: string; rating: number;
  reviews: number; inStock: boolean;
};

type ProductDetail = ApiProduct & {
  description?: string;
  hoverImage?: string;
  badge?: string;
  sizes?: string[];
  colors?: string[];
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
  const [catError,  setCatError]  = useState(false);
  const [q,         setQ]         = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [form,      setForm]      = useState<AddForm>(EMPTY_FORM);
  const [imageFile,  setImageFile]  = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Data fetching ──────────────────────────────────────────────────────────

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then(r => r.json()),
      fetch("/api/categories").then(r => {
        if (!r.ok) throw new Error("categories failed");
        return r.json();
      }),
    ])
      .then(([prods, cats]) => {
        setProducts(prods);
        // Filter out 'all' — it's a UI-only filter, not a real DB category
        const real = (cats as Category[]).filter(c => c.id !== "all");
        setCategories(real);
        if (real.length && !form.category_id) {
          setForm(f => ({ ...f, category_id: real[0].id }));
        }
      })
      .catch(() => { setCatError(true); })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const field = (key: keyof AddForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setForm(f => ({ ...f, image: "" })); // clear URL field when file chosen
  };

  const handleEditClick = async (p: ApiProduct) => {
    setLoadingEdit(true);
    try {
      const r = await fetch(`/api/products/${p.id}`);
      if (!r.ok) throw new Error("Failed to load product details");
      const detail: ProductDetail = await r.json();
      setForm({
        name:        detail.name ?? "",
        price:       String(detail.price ?? ""),
        category_id: detail.category ?? categories[0]?.id ?? "",
        gender:      detail.gender ?? "unisex",
        tagline:     detail.tagline ?? "",
        description: detail.description ?? "",
        image:       detail.image ?? "",
        badge:       detail.badge ?? "",
        sizes:       (detail.sizes ?? []).join(", "),
        colors:      (detail.colors ?? []).join(", "),
        in_stock:    detail.inStock,
      });
      setImageFile(null);
      setImagePreview("");
      setEditingId(p.id);
      setShowModal(true);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Could not load product for editing");
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleSaveProduct = async () => {
    if (!form.name || !form.price || !form.category_id) {
      toast.error("Name, price and category are required.");
      return;
    }
    setSaving(true);
    try {
      // Upload image file first if one was selected
      let imageUrl = form.image || null;
      if (imageFile) {
        const fd = new FormData();
        fd.append("image", imageFile);
        const upRes = await fetch("/api/upload", { method: "POST", body: fd });
        if (!upRes.ok) throw new Error("Image upload failed");
        const upData = await upRes.json();
        imageUrl = upData.url;
      }

      const body = {
        name:        form.name,
        price:       parseFloat(form.price),
        category_id: form.category_id,
        gender:      form.gender,
        tagline:     form.tagline     || null,
        description: form.description || null,
        image:       imageUrl,
        badge:       form.badge       || null,
        in_stock:    form.in_stock ? 1 : 0,
        sizes:  form.sizes.split(",").map(s => s.trim()).filter(Boolean),
        colors: form.colors.split(",").map(c => c.trim()).filter(Boolean),
      };

      const isEditing = !!editingId;
      const r = await fetch(
        isEditing ? `/api/admin/products/${editingId}` : "/api/admin/products",
        {
          method: isEditing ? "PUT" : "POST",
          headers: authHeaders(),
          body: JSON.stringify(body),
        }
      );
      if (!r.ok) {
        const err = await r.json();
        throw new Error(err.error ?? (isEditing ? "Failed to update product" : "Failed to add product"));
      }
      const saved: ApiProduct = await r.json();

      if (isEditing) {
        setProducts(prev => prev.map(p => (p.id === saved.id ? saved : p)));
      } else {
        setProducts(prev => [saved, ...prev]);
      }
      // Invalidate the singleton cache so customers see the change immediately
      ProductCatalog.getInstance().invalidate();
      setShowModal(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
      setImageFile(null);
      setImagePreview("");
      toast.success(isEditing ? `"${saved.name}" updated.` : `"${saved.name}" added — customers will be notified.`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error saving product");
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

  const handleToggleStock = async (p: ApiProduct) => {
    const next = !p.inStock;
    // Optimistic update
    setProducts(prev => prev.map(x => (x.id === p.id ? { ...x, inStock: next } : x)));
    try {
      const r = await fetch(`/api/admin/products/${p.id}/stock`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ in_stock: next }),
      });
      if (!r.ok) throw new Error("Failed to update stock status");
      ProductCatalog.getInstance().invalidate();
      toast.success(next ? `"${p.name}" is back in stock.` : `"${p.name}" marked out of stock.`);
    } catch {
      // Revert on failure
      setProducts(prev => prev.map(x => (x.id === p.id ? { ...x, inStock: p.inStock } : x)));
      toast.error("Could not update stock status.");
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
          onClick={() => { setEditingId(null); setForm(f => ({ ...EMPTY_FORM, category_id: categories[0]?.id ?? "" })); setShowModal(true); }}
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
                    <button
                      onClick={() => handleToggleStock(p)}
                      title={p.inStock ? "Click to mark out of stock" : "Click to put back in stock"}
                      className={`inline-flex rounded-pill px-2.5 py-1 text-xs font-medium transition-opacity hover:opacity-80
                        ${p.inStock ? "bg-emerald-100 text-emerald-900" : "bg-red-100 text-red-900"}`}>
                      {p.inStock ? "In stock" : "Out of stock"}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditClick(p)}
                        disabled={loadingEdit}
                        className="rounded-lg p-2 hover:bg-secondary transition-colors disabled:opacity-50"
                        aria-label="Edit"
                        title="Edit product"
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
              <h2 className="text-lg font-bold">{editingId ? "Edit Product" : "Add New Product"}</h2>
              <button onClick={() => { setShowModal(false); setEditingId(null); }} className="rounded-full p-1 hover:bg-secondary">
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
                  {catError ? (
                    <p className="h-10 flex items-center rounded-xl border border-red-300 bg-red-50 px-3 text-xs text-red-600">
                      Could not load categories — is the server running?
                    </p>
                  ) : categories.length === 0 ? (
                    <p className="h-10 flex items-center rounded-xl border border-input bg-background px-3 text-xs text-muted-foreground">
                      Loading categories…
                    </p>
                  ) : (
                    <select value={form.category_id} onChange={field("category_id")}
                      className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  )}
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

              {/* Image Upload */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Product Image</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageFile}
                />
                {imagePreview || form.image ? (
                  <div className="relative w-full h-40 rounded-xl overflow-hidden border border-input mb-2">
                    <img src={imagePreview || form.image} alt="preview" className="h-full w-full object-cover" />
                    <button
                      onClick={() => { setImageFile(null); setImagePreview(""); setForm(f => ({ ...f, image: "" })); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                      className="absolute top-2 right-2 rounded-full bg-black/60 p-1 hover:bg-black/80"
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-input py-6 text-sm text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
                  >
                    <ImagePlus className="h-5 w-5" />
                    Click to upload image
                  </button>
                )}
                <p className="mt-1.5 text-xs text-muted-foreground">Or paste an image URL:</p>
                <input value={form.image} onChange={field("image")} placeholder="https://…"
                  disabled={!!imageFile}
                  className="mt-1 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-40" />
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
                onClick={() => { setShowModal(false); setEditingId(null); setImageFile(null); setImagePreview(""); }}
                className="rounded-pill border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProduct}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-pill bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "Saving…" : editingId ? "Save changes" : "Add product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;
