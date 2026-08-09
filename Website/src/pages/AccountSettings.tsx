import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext.hooks";
import { Layout } from "@/components/clofit/Layout";
import { Breadcrumbs } from "@/components/clofit/Breadcrumbs";
import {
  Button,
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
  Separator,
} from "@/components/ui/separator";
import {
  Toaster,
} from "@/components/ui/toaster";

const AccountSettings = () => {
  const { user } = useAuth();
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
  });

  // Handle profile update
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const token = localStorage.getItem('clofit:token');
      const res = await fetch('/api/settings/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || '',
        },
        body: JSON.stringify(profileData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }
      const updatedUser = await res.json();
      // Update the user in context? We'll rely on the auth context to refresh on next render.
      // For now, we'll just show a success toast.
      // TODO: show success toast
    } catch (err) {
      console.error(err);
      // TODO: show error toast
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle password change
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    try {
      const token = localStorage.getItem('clofit:token');
      const res = await fetch('/api/settings/password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || '',
        },
        body: JSON.stringify(passwordData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to change password');
      }
      // Clear the form
      setPasswordData({
        old_password: '',
        new_password: '',
      });
      // TODO: show success toast
    } catch (err) {
      console.error(err);
      // TODO: show error toast
    } finally {
      setPasswordLoading(false);
    }
  };

  useEffect(() => {
    // Reset profile data when user changes (though it should be stable)
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  return (
    <Layout>
      <section className="container-clofit pt-4 pb-20 lg:pt-10">
        <Breadcrumbs crumbs={[{ label: "Account" }, { label: "Settings" }]} className="mb-6" />
        <h1 className="text-lg font-extrabold">Settings</h1>

        {/* Profile Form */}
        <div className="mt-6">
          <h2 className="mb-4 text-base font-semibold">Profile</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="Enter your phone number"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              />
            </div>

            <div className="pt-4">
              <Button type="submit" variant="default" disabled={profileLoading} className="w-full">
                {profileLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>

        <Separator className="my-6" />

        {/* Password Form */}
        <div className="mt-6">
          <h2 className="mb-4 text-base font-semibold">Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="old_password">Current Password</Label>
              <Input
                id="old_password"
                type="password"
                placeholder="Enter your current password"
                value={passwordData.old_password}
                onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new_password">New Password</Label>
              <Input
                id="new_password"
                type="password"
                placeholder="Enter your new password"
                value={passwordData.new_password}
                onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                required
                minLength={6}
              />
            </div>

            <div className="pt-4">
              <Button type="submit" variant="default" disabled={passwordLoading} className="w-full">
                {passwordLoading ? 'Changing...' : 'Change Password'}
              </Button>
            </div>
          </form>
          <p className="mt-2 text-xs text-muted-foreground">
            Your new password must be at least 6 characters long.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default AccountSettings;