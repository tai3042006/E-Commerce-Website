import { useState } from "react";
import { useAuth } from "@/context/AuthContext.hooks";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/clofit/Layout";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await resetPassword(token, password);
      setMessage("Password has been reset successfully. You can now sign in.");
      // Redirect to sign in after a short delay
      setTimeout(() => {
        navigate("/signin");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Layout>
        <section className="container-clofit pt-16 lg:pt-24">
          <div className="mx-auto max-w-md space-y-6 text-center">
            <h1 className="text-2xl font-bold">Invalid Request</h1>
            <p className="text-muted-foreground">
              Missing or invalid reset token. Please request a new password reset.
            </p>
            <Link to="/forgot-password" className="text-primary hover:underline">
              Go to Forgot Password
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="container-clofit pt-16 lg:pt-24">
        <div className="mx-auto max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-center">Reset Password</h1>
            <p className="text-muted-foreground">
              Enter a new password for your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground">
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2 border border-input bg-background/50 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-foreground">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2 border border-input bg-background/50 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50 transition-all"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          {message && (
            <div className="p-4 bg-background rounded-md border border-border text-sm">
              {message}
            </div>
          )}

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive text-destructive rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="text-center text-sm mt-6">
            <Link to="/signin" className="text-primary hover:underline">
              Back to Sign In
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ResetPassword;