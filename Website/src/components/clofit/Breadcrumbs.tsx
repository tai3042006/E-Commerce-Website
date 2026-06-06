import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export type Crumb = {
  label: string;
  to?: string;
};

interface BreadcrumbsProps {
  crumbs: Crumb[];
  className?: string;
}

export const Breadcrumbs = ({ crumbs, className }: BreadcrumbsProps) => (
  <nav
    aria-label="Breadcrumb"
    className={cn(
      "hidden items-center gap-1 text-xs text-muted-foreground md:flex",
      className
    )}
  >
    <Link
      to="/"
      aria-label="Home"
      className="flex items-center transition-colors hover:text-foreground"
    >
      <Home className="h-3.5 w-3.5" />
    </Link>

    {crumbs.map((crumb, i) => (
      <span key={i} className="flex items-center gap-1">
        <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
        {crumb.to ? (
          <Link
            to={crumb.to}
            className="transition-colors hover:text-foreground"
          >
            {crumb.label}
          </Link>
        ) : (
          <span className="font-medium text-foreground">{crumb.label}</span>
        )}
      </span>
    ))}
  </nav>
);
