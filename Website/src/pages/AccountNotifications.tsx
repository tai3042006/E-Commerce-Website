import { useEffect, useState, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Check,
} from "lucide-react";
import { Layout } from "@/components/clofit/Layout";
import { Breadcrumbs } from "@/components/clofit/Breadcrumbs";
import {
  Button,
} from "@/components/ui/button";
import {
  Separator,
} from "@/components/ui/separator";
import {
  Checkbox,
} from "@/components/ui/checkbox";
import {
  Toaster,
} from "@/components/ui/toaster";

type Notification = {
  id: string;
  event: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
};

const AccountNotifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [page, setPage] = useState(0);
  const limit = 20;
  const totalRef = useRef(0);
  const hasMoreRef = useRef(true);

  // Fetch notifications
  const fetchNotifications = useCallback(async (newPage: number) => {
    if (newPage > 0 && fetchingMore) return;
    setLoading(newPage === 0);
    setFetchingMore(newPage > 0);
    try {
      const token = localStorage.getItem('clofit:token');
      const res = await fetch(`/api/notifications?limit=${limit}&offset=${newPage * limit}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || '',
        },
      });
      if (!res.ok) throw new Error('Failed to fetch notifications');
      const data = await res.json();
      totalRef.current = data.total;
      hasMoreRef.current = notifications.length + (newPage === 0 ? 0 : data.items.length) < totalRef.current;
      if (newPage === 0) {
        setNotifications(data.items);
      } else {
        setNotifications((prev) => [...prev, ...data.items]);
      }
    } catch (err) {
      console.error(err);
      // TODO: show error toast
    } finally {
      setLoading(false);
      setFetchingMore(false);
    }
  }, [notifications.length, fetchingMore]);

  // Handle mark as read for a single notification
  const handleMarkAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem('clofit:token');
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || '',
        },
      });
      if (!res.ok) throw new Error('Failed to mark as read');
      // Update locally
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error(err);
      // TODO: show error toast
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    if (!window.confirm('Mark all notifications as read?')) return;
    try {
      const token = localStorage.getItem('clofit:token');
      const res = await fetch(`/api/notifications/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || '',
        },
      });
      if (!res.ok) throw new Error('Failed to mark all as read');
      // Update locally
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
      // TODO: show error toast
    }
  };

  // Handle filter change
  const handleFilterChange = (value: 'all' | 'unread' | 'read') => {
    setFilter(value);
    setPage(0);
    fetchNotifications(0);
  };

  useEffect(() => {
    fetchNotifications(0);
  }, [filter, fetchNotifications]);

  // Infinite scroll observer
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading || fetchingMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMoreRef.current) {
        setPage((prev) => prev + 1);
      }
    });
    if (node) observerRef.current.observe(node);
  }, [loading, fetchingMore]);

  useEffect(() => {
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'read') return n.isRead;
    return true;
  });

  return (
    <Layout>
      <section className="container-clofit pt-4 pb-20 lg:pt-10">
        <Breadcrumbs crumbs={[{ label: "Account" }, { label: "Notifications" }]} className="mb-6" />
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-lg font-extrabold">Notifications</h1>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleMarkAllAsRead}
              disabled={notifications.every((n) => n.isRead) || loading}
            >
              Mark All as Read
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Bell className="h-4 w-4" />
              <span>
                {notifications.filter((n) => !n.isRead).length} unread
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 rounded-bordered border border-border px-3 py-2">
            <label className="text-xs font-medium text-muted-foreground">
              Show:
            </label>
            <div className="flex items-center gap-2">
              <label className="cursor-pointer text-sm font-medium">
                <Checkbox
                  checked={filter === 'all'}
                  onChange={() => handleFilterChange('all')}
                />
                All
              </label>
              <label className="cursor-pointer text-sm font-medium">
                <Checkbox
                  checked={filter === 'unread'}
                  onChange={() => handleFilterChange('unread')}
                />
                Unread
              </label>
              <label className="cursor-pointer text-sm font-medium">
                <Checkbox
                  checked={filter === 'read'}
                  onChange={() => handleFilterChange('read')}
                />
                Read
              </label>
            </div>
          </div>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              You have no notifications yet.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`cursor-pointer p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors ${
                  !notification.isRead ? 'bg-primary/5' : ''
                }`}
                onClick={() => {
                  if (!notification.isRead) {
                    handleMarkAsRead(notification.id);
                  }
                  // Optionally navigate to link if provided
                  if (notification.link) {
                    navigate(notification.link);
                  }
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{notification.event}</h3>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm">{notification.message}</p>
                    {notification.link && (
                      <p className="text-xs text-muted-foreground truncate">
                        {notification.link}
                      </p>
                    )}
                  </div>
                </div>
                {!notification.isRead && (
                  <div className="absolute inset-0" />
                )}
              </div>
            ))}
            {fetchingMore && (
              <div className="text-center py-4">
                <p className="text-muted-foreground">Loading more…</p>
              </div>
            )}
          </div>
        )}

        {/* Toast for marking as read (optional) */}
        {/* We'll rely on the local update for now */}
      </section>
    </Layout>
  );
};

export default AccountNotifications;