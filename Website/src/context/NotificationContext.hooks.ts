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

export type NotifCtx = {
  unread:          number;
  notifications:   Notification[];
  loading:         boolean;
  refresh:         () => Promise<void>;
  markAllRead:     () => Promise<void>;
  markOneRead:     (id: string) => Promise<void>;
};

// ── Context ────────────────────────────────────────────────────────────────────

export const NotifContext = createContext<NotifCtx | null>(null);

export const TOKEN_KEY = "clofit:token";
export const getToken  = () => localStorage.getItem(TOKEN_KEY);

export const authHeaders = () => ({
  "Content-Type": "application/json",
  ...(getToken() ? { "x-auth-token": getToken()! } : {}),
});

export const POLL_MS = 30_000; // 30 seconds

// ── Hook ───────────────────────────────────────────────────────────────────────

export const useNotifications = () => {
  const ctx = useContext(NotifContext);
  if (!ctx) throw new Error("useNotifications must be inside NotificationProvider");
  return ctx;
};