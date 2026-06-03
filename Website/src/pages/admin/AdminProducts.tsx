import { useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getProducts, addProduct, updateProduct, deleteProduct, Product } from "@/data/products";

const AdminProducts = () => {
  const [q, setQ] = useState("");
  const [products, setProducts] = useState<Product[]>(getProducts());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Product>>({});

  // Refresh products when the tab becomes visible or periodically
  // In a real app, you'd use a proper state management solution
  const refreshProducts = () => {
    setProducts(getProducts());
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(q.toLowerCase())
  );

  const handleAddProduct = () => {
    // Generate a simple ID - in a real app you'd use UUID or similar
    const newProduct: Product = {
      id: `product-${Date.now()}`,
      name: "New Product",
      tagline: "New product tagline",
      price: 0,
      image: "/assets/product-hoodie-white.jpg", // Default image
      category: "other",
    };

    addProduct(newProduct);
    refreshProducts();
    setEditingId(newProduct.id);
    setEditData({});
  };

  const handleSaveProduct = (id: string) => {
    if (editingId === id) {
      updateProduct(id, editData);
      setEditingId(null);
      setEditData({});
      refreshProducts();
    }
  };

  const handleDeleteProduct = (id: string) => {
    deleteProduct(id);
    refreshProducts();
    if (editingId === id) {
      setEditingId(null);
      setEditData({});
    }
  };

  const handleEditProduct = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setEditingId(id);
      setEditData({}); // Reset edit data
    }
  };

  const handleEditDataChange = (field: keyof Product, value: any) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <AdminLayout title="Products">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products..."
            className="h-11 w-full rounded-pill border border-input bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button className="inline-flex items-center gap-2 rounded-pill bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90" onClick={handleAddProduct}>
          <Plus className="h-4 w-4" /> Add product
        </button>
      </div>

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
              {filtered.map((p) => {
                const isEditing = editingId === p.id;
                return (
                  <tr key={p.id} className="hover:bg-secondary/30">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="h-12 w-12 rounded-lg object-cover" />
                        <div>
                          {isEditing ? (
                            <input
                              value={editData.name || p.name}
                              onChange={(e) => handleEditDataChange('name', e.target.value)}
                              className="border border-input bg-background px-2 py-1 rounded w-full max-w-xs"
                              autoFocus
                            />
                          ) : (
                            <div className="font-medium">{p.name}</div>
                          )}
                          {isEditing ? (
                            <input
                              value={editData.tagline || p.tagline}
                              onChange={(e) => handleEditDataChange('tagline', e.target.value)}
                              className="border border-input bg-background px-2 py-1 rounded w-full max-w-xs mt-1"
                            />
                          ) : (
                            <div className="text-xs text-muted-foreground">{p.tagline}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 capitalize text-muted-foreground">
                      {isEditing ? (
                        <select
                          value={editData.category || p.category}
                          onChange={(e) => handleEditDataChange('category', e.target.value)}
                          className="border border-input bg-background px-2 py-1 rounded w-full"
                        >
                          <option value="tees">Tees</option>
                          <option value="hoodies">Hoodies</option>
                          <option value="outerwear">Outerwear</option>
                          <option value="accessories">Accessories</option>
                          <option value="other">Other</option>
                        </select>
                      ) : (
                        <span>{p.category}</span>
                      )}
                    </td>
                    <td className="px-5 py-3 font-medium">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={editData.price !== undefined ? editData.price : p.price}
                            onChange={(e) => handleEditDataChange('price', parseFloat(e.target.value) || 0)}
                            className="border border-input bg-background px-2 py-1 rounded w-full"
                            min="0"
                            step="0.01"
                          />
                          <span className="text-xs text-muted-foreground">USD</span>
                        </div>
                      ) : (
                        <>
                          ${p.price}
                          {p.oldPrice && <span className="ml-2 text-xs price-strike">${p.oldPrice}</span>}
                        </>
                      )}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={editData.rating !== undefined ? editData.rating : (p.rating || 0)}
                            onChange={(e) => handleEditDataChange('rating', parseFloat(e.target.value) || 0)}
                            className="border border-input bg-background px-2 py-1 rounded w-full"
                            min="0"
                            max="5"
                            step="0.1"
                          />
                          <input
                            type="number"
                            value={editData.reviews !== undefined ? editData.reviews : (p.reviews || 0)}
                            onChange={(e) => handleEditDataChange('reviews', parseInt(e.target.value) || 0)}
                            className="border border-input bg-background px-2 py-1 rounded w-full"
                            min="0"
                          />
                        </div>
                      ) : (
                        <>
                          {p.rating ?? "—"} ({p.reviews ?? 0})
                        </>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex rounded-pill bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-900">In stock</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleSaveProduct(p.id)}
                              className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground px-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setEditData({});
                              }}
                              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              aria-label="Edit"
                              onClick={() => handleEditProduct(p.id)}
                              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              aria-label="Delete"
                              onClick={() => handleDeleteProduct(p.id)}
                              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">No products found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
