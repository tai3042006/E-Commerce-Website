import { useState } from "react";
import { useAuth } from "@/context/AuthContext.hooks";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/clofit/Layout";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await forgotPassword(email);
      setMessage("If the email exists, a reset link has been sent to your inbox");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="container-clofit pt-16 lg:pt-24">
        <div className="mx-auto max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-center">Forgot Password</h1>
            <p className="text-muted-foreground">
              Enter your email address to receive a password reset link
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-input bg-background/50 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50 transition-all"
            >
              {loading ? "Sending..." : "Send Reset Link"}
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

          <div className="text-center text-sm">
            <Link to="/signin" className="text-primary hover:underline">
              Remember your password? Sign in
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ForgotPassword;