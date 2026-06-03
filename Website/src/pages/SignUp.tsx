import { Link } from "react-router-dom";
import { Logo } from "@/components/clofit/Logo";

const fields = [
  { ph: "Full Name", type: "text" },
  { ph: "Email Address", type: "email" },
  { ph: "Phone Number", type: "tel" },
  { ph: "Password", type: "password" },
  { ph: "Confirm Password", type: "password" },
];

const SignUp = () => (
  <div className="flex min-h-screen items-center justify-center bg-secondary/50 px-4 py-10">
    <div className="w-full max-w-md rounded-3xl bg-background p-8 shadow-soft sm:p-10">
      <div className="text-center">
        <Logo className="text-2xl" />
        <p className="mt-2 text-xs text-muted-foreground">Move with confidence.</p>
        <h1 className="mt-6 text-lg font-bold">Sign Up</h1>
      </div>

      <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
        {fields.map((f) => (
          <input
            key={f.ph}
            type={f.type}
            placeholder={f.ph}
            className="w-full rounded-xl border border-input bg-background px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
          />
        ))}
        <button
          type="submit"
          className="w-full rounded-pill bg-foreground py-4 text-sm font-semibold text-background transition-opacity hover:opacity-90"
        >
          Sign Up
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link to="/signin" className="font-semibold text-foreground hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  </div>
);

export default SignUp;
