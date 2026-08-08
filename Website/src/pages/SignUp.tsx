import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/components/clofit/Logo";
import { useAuth } from "@/context/AuthContext.hooks";
import { toast } from "sonner";
interface FormValues {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
}

const SignUp = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormValues>({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const set = (k: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error("Passwords do not match"); return; }
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.phone, form.password);
      toast.success("Account created successfully!");
      navigate("/");
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
          <h1 className="mt-6 text-lg font-bold">Create Account</h1>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {[
            { ph: "Full Name", type: "text",     k: "name",     req: true },
            { ph: "Email",     type: "email",    k: "email",    req: true },
            { ph: "Phone",     type: "tel",      k: "phone",    req: false },
            { ph: "Password",  type: "password", k: "password", req: true },
            { ph: "Confirm Password", type: "password", k: "confirm", req: true },
          ].map(f => (
            <input key={f.k} type={f.type} placeholder={f.ph} value={form[f.k]} onChange={set(f.k)} required={f.req}
              className="w-full rounded-xl border border-input bg-background px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none" />
          ))}
          <button type="submit" disabled={loading}
            className="w-full rounded-pill bg-foreground py-4 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-50">
            {loading ? "Creating account…" : "Sign Up"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link to="/signin" className="font-semibold text-foreground hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};
export default SignUp;
