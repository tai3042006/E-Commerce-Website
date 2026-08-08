import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  CreditCard,
  Trash2,
  Edit,
  Check,
} from "lucide-react";
import { Layout } from "@/components/clofit/Layout";
import { Breadcrumbs } from "@/components/clofit/Breadcrumbs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaymentMethod {
  id: string;
  customer_id: string;
  card_brand: string;
  last4: string;
  expiry_month: number;
  expiry_year: number;
  is_default: boolean;
  created_at: string;
}

// Raw shape as returned by the API before is_default is normalized to boolean
type PaymentMethodResponse = Omit<PaymentMethod, "is_default"> & {
  is_default: number | boolean;
};

const AccountPaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    card_brand: "",
    last4: "",
    expiry_month: "",
    expiry_year: "",
    is_default: false,
  });
  const [yearOptions, setYearOptions] = useState<number[]>([]);

  // Generate year options (current year to current year + 10)
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => currentYear + i);
    setYearOptions(years);
  }, []);

  // Fetch payment methods
  const fetchPaymentMethods = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("clofit:token");
      const res = await fetch("/api/payment-methods", {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token || "",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch payment methods");
      const data: PaymentMethodResponse[] = await res.json();
      // Convert is_default to boolean (0 or 1 -> false or true)
      const converted = data.map((method) => ({
        ...method,
        is_default: method.is_default === 1 || method.is_default === true,
      }));
      setPaymentMethods(converted);
    } catch (err) {
      console.error(err);
      toast.error("Could not load payment methods");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.card_brand || !formData.last4 || !formData.expiry_month || !formData.expiry_year) {
      toast.error("Please fill in all fields");
      return;
    }
    if (formData.last4.length !== 4 || !/^\d{4}$/.test(formData.last4)) {
      toast.error("Last 4 digits must be exactly 4 numbers");
      return;
    }
    const month = parseInt(formData.expiry_month, 10);
    if (month < 1 || month > 12) {
      toast.error("Invalid expiry month");
      return;
    }
    const year = parseInt(formData.expiry_year, 10);
    const currentYear = new Date().getFullYear();
    if (year < currentYear) {
      toast.error("Card has already expired");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("clofit:token");
      const body = JSON.stringify({
        ...formData,
        expiry_month: month,
        expiry_year: year,
      });
      const res =
        modalType === "add"
          ? await fetch("/api/payment-methods", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-auth-token": token || "",
              },
              body,
            })
          : await fetch(`/api/payment-methods/${editingId}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                "x-auth-token": token || "",
              },
              body,
            });

      if (!res.ok) throw new Error("Failed to save payment method");
      await res.json();
      toast.success(modalType === "add" ? "Payment method added" : "Payment method updated");
      closeModal();
      fetchPaymentMethods();
    } catch (err) {
      console.error(err);
      toast.error("Could not save payment method");
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this payment method?")) return;
    try {
      const token = localStorage.getItem("clofit:token");
      const res = await fetch(`/api/payment-methods/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token || "",
        },
      });
      if (!res.ok) throw new Error("Failed to delete payment method");
      toast.success("Payment method removed");
      fetchPaymentMethods();
    } catch (err) {
      console.error(err);
      toast.error("Could not delete payment method");
    }
  };

  // Handle set as default
  const handleSetDefault = async (id: string) => {
    try {
      const token = localStorage.getItem("clofit:token");
      const res = await fetch(`/api/payment-methods/${id}/default`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token || "",
        },
      });
      if (!res.ok) throw new Error("Failed to set default payment method");
      fetchPaymentMethods();
    } catch (err) {
      console.error(err);
      toast.error("Could not set default payment method");
    }
  };

  const resetForm = () => {
    setFormData({
      card_brand: "",
      last4: "",
      expiry_month: "",
      expiry_year: "",
      is_default: false,
    });
    setEditingId(null);
  };

  const closeModal = () => {
    setModalOpen(false);
    resetForm();
  };

  const openAddModal = () => {
    setModalType("add");
    resetForm();
    setModalOpen(true);
  };

  const openEditModal = (method: PaymentMethod) => {
    setModalType("edit");
    setEditingId(method.id);
    setFormData({
      card_brand: method.card_brand || "",
      last4: method.last4 || "",
      expiry_month: method.expiry_month.toString().padStart(2, "0"),
      expiry_year: method.expiry_year.toString(),
      is_default: method.is_default,
    });
    setModalOpen(true);
  };

  if (loading) {
    return (
      <Layout>
        <section className="container-clofit pt-4 pb-20 lg:pt-10">
          <Breadcrumbs crumbs={[{ label: "Account" }, { label: "Payment Methods" }]} className="mb-6" />
          <div className="text-center py-10">
            <p className="text-muted-foreground">Loading payment methods…</p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="container-clofit pt-4 pb-20 lg:pt-10">
        <Breadcrumbs crumbs={[{ label: "Account" }, { label: "Payment Methods" }]} className="mb-6" />
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-lg font-extrabold">Payment Methods</h1>
          <Button variant="outline" onClick={openAddModal}>
            <CreditCard className="h-4 w-4 mr-2" />
            Add Payment Method
          </Button>
        </div>

        {paymentMethods.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              You have no saved payment methods yet. Add one to get started.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Demo only — no real charges.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-start gap-4 p-4">
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="font-medium">
                    {method.card_brand.toUpperCase()} •••• {method.last4}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Expires {method.expiry_month}/{method.expiry_year}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    {!method.is_default && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSetDefault(method.id)}
                        aria-label="Set as default payment method"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditModal(method)}
                      aria-label="Edit payment method"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(method.id)}
                      aria-label="Delete payment method"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {method.is_default && (
                  <div className="flex-shrink-0 mt-2">
                    <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">
                      Default
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Payment Method Modal */}
        <Dialog open={modalOpen} onOpenChange={(open) => (open ? setModalOpen(true) : closeModal())}>
          <DialogContent className="w-full max-w-md">
            <DialogHeader>
              <DialogTitle>{modalType === "add" ? "Add Payment Method" : "Edit Payment Method"}</DialogTitle>
              <DialogDescription>Fill in the payment method details below.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card_brand">Card Brand</Label>
                <Select
                  value={formData.card_brand}
                  onValueChange={(value) => setFormData({ ...formData, card_brand: value })}
                >
                  <SelectTrigger id="card_brand">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visa">Visa</SelectItem>
                    <SelectItem value="mastercard">Mastercard</SelectItem>
                    <SelectItem value="amex">American Express</SelectItem>
                    <SelectItem value="discover">Discover</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="last4">Last 4 Digits</Label>
                <Input
                  id="last4"
                  placeholder="1234"
                  value={formData.last4}
                  onChange={(e) => setFormData({ ...formData, last4: e.target.value.replace(/\D/g, "") })}
                  required
                  maxLength={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry_month">Expiry Month</Label>
                  <Select
                    value={formData.expiry_month}
                    onValueChange={(value) => setFormData({ ...formData, expiry_month: value })}
                  >
                    <SelectTrigger id="expiry_month">
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(12)].map((_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1).padStart(2, "0")}>
                          {String(i + 1).padStart(2, "0")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiry_year">Expiry Year</Label>
                  <Select
                    value={formData.expiry_year}
                    onValueChange={(value) => setFormData({ ...formData, expiry_year: value })}
                  >
                    <SelectTrigger id="expiry_year">
                      <SelectValue placeholder="YYYY" />
                    </SelectTrigger>
                    <SelectContent>
                      {yearOptions.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="is_default"
                  type="checkbox"
                  checked={formData.is_default}
                  onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="is_default" className="cursor-pointer">
                  Set as default payment method
                </Label>
              </div>

              <div className="pt-2">
                <Button type="submit" variant="default" className="w-full" disabled={saving}>
                  {saving ? "Saving…" : modalType === "add" ? "Add Payment Method" : "Save Changes"}
                </Button>
                <Button type="button" variant="outline" onClick={closeModal} className="w-full mt-2">
                  Cancel
                </Button>
              </div>
            </form>

            <DialogFooter>
              <p className="text-xs text-muted-foreground">
                Demo only — no real charges. This is a mock implementation for demonstration purposes.
              </p>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </Layout>
  );
};

export default AccountPaymentMethods;