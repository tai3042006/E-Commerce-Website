/**
 * NotificationBell — bell icon with unread badge + dropdown panel.
 * Shared between the customer Navbar and the admin AdminLayout header.
 *
 * Mirrors the Notification inbox exposed by AdminObserver.getNotifications()
 * and CustomerObserver.getNotifications() in the Java backend layer.
 */

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useNotifications, Notification } from "@/context/NotificationContext";
import { useNavigate } from "react-router-dom";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const secs  = Math.floor(diff / 1000);
  if (secs < 60)   return "just now";
  const mins  = Math.floor(secs / 60);
  if (mins < 60)   return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24)  return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function eventLabel(event: string): string {
  const map: Record<string, string> = {
    userRegistered: "🧑 New User",
    productAdded:   "🛍️ New Product",
    orderCreated:   "📦 New Order",
    orderCancelled: "❌ Order Cancelled",
  };
  return map[event] ?? event;
}

interface Props {
  /** Extra CSS classes to add to the bell button wrapper */
  className?: string;
}

export const NotificationBell = ({ className = "" }: Props) => {
  const { unread, notifications, loading, markAllRead, markOneRead, refresh } =
    useNotifications();
  const [open, setOpen] = useState(false);
  const panelRef        = useRef<HTMLDivElement>(null);
  const navigate        = useNavigate();

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = () => {
    setOpen((v) => !v);
    if (!open) refresh();
  };

  const handleClick = (n: Notification) => {
    markOneRead(n.id);
    setOpen(false);
    if (n.link) navigate(n.link);
  };

  return (
    <div ref={panelRef} className={`relative ${className}`}>
      {/* Bell button */}
      <button
        onClick={handleOpen}
        aria-label="Notifications"
        className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-secondary/50"
      >
        <Bell className="h-5 w-5" />
        <AnimatePresence>
          {unread > 0 && (
            <motion.span
              key={unread}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center
                         rounded-full bg-red-500 px-1 text-[10px] font-bold text-white"
            >
              {unread > 99 ? "99+" : unread}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border border-border
                       bg-background shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="text-sm font-semibold">Notifications</span>
              {unread > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-border">
              {loading && (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                  Loading…
                </div>
              )}
              {!loading && notifications.length === 0 && (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No notifications yet.
                </div>
              )}
              {!loading &&
                notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleClick(n)}
                    className={`w-full text-left px-4 py-3 transition-colors hover:bg-secondary/50
                      ${!n.isRead ? "bg-secondary/30" : ""}`}
                  >
                    <div className="flex items-start gap-2">
                      {/* Unread dot */}
                      <span
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full
                          ${!n.isRead ? "bg-blue-500" : "bg-transparent"}`}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-muted-foreground">
                          {eventLabel(n.event)}
                        </p>
                        <p className="mt-0.5 truncate text-sm">{n.message}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {timeAgo(n.createdAt)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
