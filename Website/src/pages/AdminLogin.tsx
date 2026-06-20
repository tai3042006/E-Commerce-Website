import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/clofit/Logo";
import { toast } from "sonner";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";

const AdminLogin = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect after render (not during it) to avoid the
  // "Cannot update a component while rendering" warning.
  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin", { replace: true });
    }
  }, [user, navigate]);

  if (user?.role === "admin") {
    return null;
  }
  if (user && user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4">
        <div className="w-full max-w-md rounded-2xl border border-destructive/30 bg-background p-8 text-center shadow-xl">
          <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-destructive" />
          <h2 className="text-lg font-bold">Access Denied</h2>
          <p className="mt-2 text-sm text-muted-foreground">You are logged in as a customer. Admin credentials are required.</p>
          <Link to="/" className="mt-6 inline-block text-sm font-medium text-foreground underline">Back to store</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      const token = localStorage.getItem("clofit:token");
      if (!token) throw new Error("Login failed");
      const r = await fetch("/api/auth/me", { headers: { "x-auth-token": token } });
      const u = await r.json();
      if (u.role !== "admin") {
        await fetch("/api/auth/logout", { method: "POST", headers: { "x-auth-token": token } });
        localStorage.removeItem("clofit:token");
        window.location.reload();
        throw new Error("Access denied. Admin privileges required.");
      }
      toast.success("Welcome, Admin!");
      navigate("/admin", { replace: true });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-background p-8 shadow-xl">
          <div className="mb-8 flex flex-col items-center gap-3">
            <Logo className="text-2xl" />
            <span className="rounded-pill bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Admin Panel</span>
            <p className="text-center text-sm text-muted-foreground">Sign in with admin credentials to continue</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@clofit.com"
                required
                autoComplete="username"
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="h-11 w-full rounded-xl border border-input bg-background px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-pill bg-foreground py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Signing in…" : "Sign in to Admin"}
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">← Back to store</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminLogin;
