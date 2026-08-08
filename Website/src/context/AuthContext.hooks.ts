import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export type User = { id: string; name: string; email: string; phone?: string; role: string };
export type AuthApiResponse = { token: string; user: User } | { error?: string };
export type AuthCtx = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (u: User) => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
};

export const AuthContext = createContext<AuthCtx | null>(null);

export const TOKEN_KEY = "clofit:token";
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

/** Safely parse JSON — never throws on empty body or HTML error pages */
export async function safeJson(r: Response): Promise<AuthApiResponse> {
  const text = await r.text();
  if (!text.trim()) return {};
  try {
    return JSON.parse(text);
  } catch {
    // Server returned HTML (502 proxy / nginx) or plain text
    if (r.status === 0 || !r.status) {
      return { error: "Cannot connect to server. Please make sure the backend is running." };
    }
    return { error: `Server error (${r.status}) — backend may be down or misconfigured.` };
  }
}

export const authHeaders = () => ({
  "Content-Type": "application/json",
  ...(getToken() ? { "x-auth-token": getToken()! } : {}),
});

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};