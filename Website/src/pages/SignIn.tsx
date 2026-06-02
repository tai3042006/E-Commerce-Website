import { Link } from "react-router-dom";
import { Logo } from "@/components/clofit/Logo";

const SignIn = () => (
  <div className="flex min-h-screen items-center justify-center bg-secondary/50 px-4 py-10">
    <div className="w-full max-w-md rounded-3xl bg-background p-8 shadow-soft sm:p-10">
      <div className="text-center">
        <Logo className="text-2xl" />
        <p className="mt-2 text-xs text-muted-foreground">Move with confidence.</p>
        <h1 className="mt-6 text-lg font-bold">Sign In</h1>
      </div>

      <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Email or Phone Number"
          className="w-full rounded-xl border border-input bg-background px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-xl border border-input bg-background px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
        />
        <div className="flex justify-end">
          <button type="button" className="text-xs font-medium text-foreground hover:underline">
            Forgot password?
          </button>
        </div>
        <button
          type="submit"
          className="w-full rounded-pill bg-foreground py-4 text-sm font-semibold text-background transition-opacity hover:opacity-90"
        >
          Sign In
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Don't have account?{" "}
        <Link to="/signup" className="font-semibold text-foreground hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  </div>
);

export default SignIn;
