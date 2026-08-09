import { useState, useEffect, useCallback, ReactNode } from "react";
import { AuthContext, User, AuthApiResponse, AuthCtx, TOKEN_KEY, getToken, setToken, clearToken, safeJson, authHeaders, useAuth } from "./AuthContext.hooks";

export { AuthContext, useAuth };
export type { User, AuthApiResponse, AuthCtx };

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
    const { token, user } = data as { token: string; user: User };
    setToken(token);
    setUser(user);
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
    const { token, user } = data as { token: string; user: User };
    setToken(token);
    setUser(user);
  }, []);

  const logout = useCallback(async () => {
    const token = getToken();
    if (token) {
      try {
        await fetch("/api/auth/logout", { method: "POST", headers: { "x-auth-token": token } });
      } catch {
        // ignore error
      }
    }
    clearToken();
    setUser(null);
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    const r = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await safeJson(r);
    if (!r.ok) {
      throw new Error(data.error ?? "Forgot password failed");
    }
  }, []);

  const resetPassword = useCallback(async (token: string, password: string) => {
    const r = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await safeJson(r);
    if (!r.ok) {
      throw new Error(data.error ?? "Reset password failed");
    }
  }, []);

  const updateUser = useCallback((u: User) => setUser(u), []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, forgotPassword, resetPassword, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
