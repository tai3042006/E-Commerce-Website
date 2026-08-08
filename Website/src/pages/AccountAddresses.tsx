import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  Edit,
  MapPin,
  Check,
  List,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Layout } from "@/components/clofit/Layout";
import { Breadcrumbs } from "@/components/clofit/Breadcrumbs";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Button,
  ButtonVariant,
} from "@/components/ui/button";
import {
  Input,
} from "@/components/ui/input";
import {
  Label,
} from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Toast,
} from "@/components/ui/toaster";

interface Address {
  id: string;
  customer_id: string;
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  is_default: boolean;
  created_at: string;
}

const AccountAddresses = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address_line: '',
    city: '',
    is_default: false,
  });

  // Fetch addresses
  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('clofit:token');
      const res = await fetch('/api/addresses', {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || '',
        },
      });
      if (!res.ok) throw new Error('Failed to fetch addresses');
      const data = await res.json();
      setAddresses(data);
    } catch (err) {
      console.error(err);
      // TODO: show error toast
    } finally {
      setLoading(false);
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('clofit:token');
      let res;
      if (modalType === 'add') {
        res = await fetch('/api/addresses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token || '',
          },
          body: JSON.stringify(formData),
        });
      } else {
        if (!editingId) throw new Error('No address being edited');
        res = await fetch(`/api/addresses/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token || '',
          },
          body: JSON.stringify(formData),
        });
      }
      if (!res.ok) throw new Error('Failed to save address');
      await res.json();
      setModalOpen(false);
      setFormData({
        full_name: '',
        phone: '',
        address_line: '',
        city: '',
        is_default: false,
      });
      setEditingId(null);
      fetchAddresses();
    } catch (err) {
      console.error(err);
      // TODO: show error toast
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      const token = localStorage.getItem('clofit:token');
      const res = await fetch(`/api/addresses/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || '',
        },
      });
      if (!res.ok) throw new Error('Failed to delete address');
      fetchAddresses();
    } catch (err) {
      console.error(err);
      // TODO: show error toast
    }
  };

  // Handle set as default
  const handleSetDefault = async (id: string) => {
    try {
      const token = localStorage.getItem('clofit:token');
      const res = await fetch(`/api/addresses/${id}/default`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || '',
        },
      });
      if (!res.ok) throw new Error('Failed to set default address');
      fetchAddresses();
    } catch (err) {
      console.error(err);
      // TODO: show error toast
    }
  };

  // Open modal for add
  const openAddModal = () => {
    setModalType('add');
    setEditingId(null);
    setFormData({
      full_name: '',
      phone: '',
      address_line: '',
      city: '',
      is_default: false,
    });
    setModalOpen(true);
  };

  // Open modal for edit
  const openEditModal = (address: Address) => {
    setModalType('edit');
    setEditingId(address.id);
    setFormData({
      full_name: address.full_name || '',
      phone: address.phone || '',
      address_line: address.address_line || '',
      city: address.city || '',
      is_default: address.is_default === 1 || address.is_default === true,
    });
    setModalOpen(true);
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  if (loading) {
    return (
      <Layout>
        <section className="container-clofit pt-4 pb-20 lg:pt-10">
          <Breadcrumbs crumbs={[{ label: "Account" }, { label: "Shipping Addresses" }]} className="mb-6" />
          <div className="text-center py-10">
            <p className="text-muted-foreground">Loading addresses…</p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="container-clofit pt-4 pb-20 lg:pt-10">
        <Breadcrumbs crumbs={[{ label: "Account" }, { label: "Shipping Addresses" }]} className="mb-6" />
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-lg font-extrabold">Shipping Addresses</h1>
          <Button variant="outline" onClick={openAddModal}>
            Add New Address
          </Button>
        </div>

        {addresses.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              You have no saved addresses yet. Add one to get started.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {addresses.map((addr) => (
              <div key={addr.id} className="flex items-start gap-4 p-4">
                {/* Address details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="font-medium">{addr.full_name}</p>
                  <p className="text-sm text-muted-foreground">{addr.phone}</p>
                  <p className="text-sm">{addr.address_line}, {addr.city}</p>
                  {/* Actions */}
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    {!addr.is_default && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSetDefault(addr.id)}
                        aria-label="Set as default address"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditModal(addr)}
                      aria-label="Edit address"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      ghost
                      size="icon"
                      onClick={() => handleDelete(addr.id)}
                      aria-label="Delete address"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {/* Default indicator */}
                {addr.is_default && (
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

        {/* Add/Edit Address Modal */}
        <DialogTrigger asChild>
          <Button variant="outline" onClick={openAddModal} className="mt-6">
            Add New Address
          </Button>
        </DialogTrigger>
        <Dialog>
          <DialogContent className="w-full max-w-md">
            <DialogHeader>
              <DialogTitle>
                {modalType === 'add' ? 'Add New Address' : 'Edit Address'}
              </DialogTitle>
              <DialogDescription>
                Fill in the address details below.
              </DialogDescription>
            </DialogHeader>
            <Form onSubmit={handleSubmit}>
              <FormControl>
                <FormField>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormField>
              </FormControl>
              <FormControl>
                <FormField>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormField>
              </FormControl>
              <FormControl>
                <FormField>
                  <FormLabel>Address Line</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123 Main St"
                      value={formData.address_line}
                      onChange={(e) => setFormData({ ...formData, address_line: e.target.value })}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormField>
              </FormControl>
              <FormControl>
                <FormField>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="New York"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormField>
              </FormControl>
              <FormControl>
                <FormField>
                  <FormLabel>Set as default address</FormLabel>
                  <FormControl>
                    <Input
                      type="checkbox"
                      checked={formData.is_default}
                      onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                    />
                  </FormControl>
                  <FormDescription>
                    If checked, this address will be used as the default for checkout.
                  </FormDescription>
                </FormField>
              </FormControl>
              <FormControl>
                <FormLabel>&nbsp;</FormLabel>
                <FormControl>
                  <Button type="submit" variant="default" className="w-full">
                    {modalType === 'add' ? 'Add Address' : 'Save Changes'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setModalOpen(false);
                      setFormData({
                        full_name: '',
                        phone: '',
                        address_line: '',
                        city: '',
                        is_default: false,
                      });
                      setEditingId(null);
                    }}
                    className="w-full mt-2"
                  >
                    Cancel
                  </Button>
                </FormControl>
              </FormControl>
            </Form>
          </DialogContent>
        </Dialog>
      </section>
    </Layout>
  );
};

export default AccountAddresses;