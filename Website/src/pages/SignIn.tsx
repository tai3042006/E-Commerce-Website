import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Logo } from "@/components/clofit/Logo";
import { useAuth } from "@/context/AuthContext.hooks";
import { toast } from "sonner";

const SignIn = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  interface LocationState {
    from?: string;
  }
  const from = (location.state as LocationState)?.from || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-background p-8 shadow-soft sm:p-10">
        <div className="text-center">
          <Logo className="text-2xl" />
          <p className="mt-2 text-xs text-muted-foreground">Move with confidence.</p>
          <h1 className="mt-6 text-lg font-bold">Sign In</h1>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required
            className="w-full rounded-xl border border-input bg-background px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
            className="w-full rounded-xl border border-input bg-background px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none" />
          <button type="submit" disabled={loading}
            className="w-full rounded-pill bg-foreground py-4 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-50">
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="font-semibold text-foreground hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};
export default SignIn;
