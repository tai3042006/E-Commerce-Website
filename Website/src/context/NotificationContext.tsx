/**
 * NotificationContext — implements the client-side half of the Observer pattern.
 *
 * Polls GET /api/notifications/count every 30 s while the user is logged in.
 * When the unread count rises, fetches the newest items and fires a toast for
 * each new notification, matching the Java CustomerObserver / AdminObserver
 * update() behaviour.
 */

import {
  createContext, useContext, useEffect, useRef,
  useState, useCallback, ReactNode,
} from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

// ── Types ─────────────────────────────────────────────────────────────────────

export type Notification = {
  id: string;
  event: string;
  message: string;
  link?: string | null;
  isRead: boolean;
  createdAt: string;
};

type NotifCtx = {
  unread:          number;
  notifications:   Notification[];
  loading:         boolean;
  refresh:         () => Promise<void>;
  markAllRead:     () => Promise<void>;
  markOneRead:     (id: string) => Promise<void>;
};

const NotifContext = createContext<NotifCtx | null>(null);

const TOKEN_KEY = "clofit:token";
const getToken  = () => localStorage.getItem(TOKEN_KEY);

const authHeaders = () => ({
  "Content-Type": "application/json",
  ...(getToken() ? { "x-auth-token": getToken()! } : {}),
});

const POLL_MS = 30_000; // 30 seconds

// ── Provider ──────────────────────────────────────────────────────────────────

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread,        setUnread]         = useState(0);
  const [loading,       setLoading]        = useState(false);

  // Track the last known unread count to detect increases
  const prevUnreadRef  = useRef<number>(0);
  // Track ids we have already toasted so we don't repeat after re-mount
  const toastedIds     = useRef<Set<string>>(new Set());

  const fetchCount = useCallback(async () => {
    if (!user) return;
    try {
      const r = await fetch("/api/notifications/count", { headers: authHeaders() });
      if (!r.ok) return;
      const { unread: newCount } = await r.json();
      setUnread(newCount);
      return newCount as number;
    } catch {
      return undefined;
    }
  }, [user]);

  const fetchList = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const r = await fetch("/api/notifications?limit=30", { headers: authHeaders() });
      if (!r.ok) return;
      const { items } = await r.json();
      setNotifications(items);
      setUnread(items.filter((n: Notification) => !n.isRead).length);
      return items as Notification[];
    } catch {
      return undefined;
    } finally {
      setLoading(false);
    }
  }, [user]);

  /** Called both on mount and after polling detects a count increase. */
  const refresh = useCallback(async () => {
    const items = await fetchList();
    if (!items) return;

    // Toast any newly arrived unread notifications
    const fresh = items.filter((n) => !n.isRead && !toastedIds.current.has(n.id));
    for (const n of fresh) {
      toastedIds.current.add(n.id);
      toast(n.message, {
        description: new Date(n.createdAt).toLocaleString(),
        duration: 5000,
        ...(n.link
          ? { action: { label: "View", onClick: () => { window.location.href = n.link!; } } }
          : {}),
      });
    }
  }, [fetchList]);

  const markAllRead = useCallback(async () => {
    if (!user) return;
    await fetch("/api/notifications/read", {
      method: "PATCH",
      headers: authHeaders(),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnread(0);
  }, [user]);

  const markOneRead = useCallback(async (id: string) => {
    if (!user) return;
    await fetch(`/api/notifications/${id}/read`, {
      method: "PATCH",
      headers: authHeaders(),
    });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnread((c) => Math.max(0, c - 1));
  }, [user]);

  // Initial fetch on login
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnread(0);
      prevUnreadRef.current = 0;
      toastedIds.current.clear();
      return;
    }
    refresh();
  }, [user, refresh]);

  // Polling
  useEffect(() => {
    if (!user) return;

    const tick = async () => {
      const newCount = await fetchCount();
      if (newCount === undefined) return;
      if (newCount > prevUnreadRef.current) {
        prevUnreadRef.current = newCount;
        await refresh();
      }
    };

    const id = setInterval(tick, POLL_MS);
    return () => clearInterval(id);
  }, [user, fetchCount, refresh]);

  return (
    <NotifContext.Provider
      value={{ unread, notifications, loading, refresh, markAllRead, markOneRead }}
    >
      {children}
    </NotifContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotifContext);
  if (!ctx) throw new Error("useNotifications must be inside NotificationProvider");
  return ctx;
};
