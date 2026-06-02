import { Link } from "react-router-dom";

export const Logo = ({ className = "" }: { className?: string }) => (
  <Link
    to="/"
    aria-label="CloFit home"
    className={`font-extrabold tracking-[0.02em] text-foreground ${className}`}
  >
    CLOFIT
  </Link>
);
