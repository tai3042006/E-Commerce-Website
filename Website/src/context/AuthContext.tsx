import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export type User = { id: string; name: string; email: string; phone?: string; role: string };

type AuthCtx = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (u: User) => void;
};

const AuthContext = createContext<AuthCtx | null>(null);

const TOKEN_KEY = "clofit:token";
const getToken = () => localStorage.getItem(TOKEN_KEY);
const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
const clearToken = () => localStorage.removeItem(TOKEN_KEY);

/** Safely parse JSON — never throws on empty body or HTML error pages */
async function safeJson(r: Response): Promise<any> {
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

const authHeaders = () => ({
  "Content-Type": "application/json",
  ...(getToken() ? { "x-auth-token": getToken()! } : {}),
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    fetch("/api/auth/me", { headers: { "x-auth-token": token } })
      .then(r => r.ok ? r.json() : null)
      .then(u => { if (u) setUser(u); else clearToken(); })
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    let r: Response;
    try {
      r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
    } catch {
      throw new Error("Cannot connect to server. Please make sure the backend is running on port 4000.");
    }
    const data = await safeJson(r);
    if (!r.ok) {
      throw new Error(
        data.error === "invalid_credentials"
          ? "Invalid email or password"
          : (data.error ?? "Login failed")
      );
    }
    setToken(data.token);
    setUser(data.user);
  }, []);

  const register = useCallback(async (name: string, email: string, phone: string, password: string) => {
    let r: Response;
    try {
      r = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });
    } catch {
      throw new Error("Cannot connect to server. Please make sure the backend is running on port 4000.");
    }
    const data = await safeJson(r);
    if (!r.ok) {
      throw new Error(
        data.error === "email_taken"
          ? "Email is already registered"
          : (data.error ?? "Registration failed")
      );
    }
    setToken(data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    const token = getToken();
    if (token) fetch("/api/auth/logout", { method: "POST", headers: { "x-auth-token": token } }).catch(() => {});
    clearToken();
    setUser(null);
  }, []);

  const updateUser = useCallback((u: User) => setUser(u), []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
