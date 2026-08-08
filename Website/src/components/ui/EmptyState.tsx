import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { emptyStateVariants, EmptyStateProps } from "./EmptyState.hooks";

export const EmptyState = ({
  title,
  description,
  actionLabel,
  actionOnClick,
  actionTo,
  illustration,
  className = "",
  animationDirection = "up",
}: EmptyStateProps) => {
  return (
    <motion.div
      initial={emptyStateVariants.enter(animationDirection)}
      animate={emptyStateVariants.center}
      exit={emptyStateVariants.exit(animationDirection)}
      className={`flex flex-col items-center justify-center text-center px-6 py-12 ${className}`}
    >
      {illustration && (
        <div className="mb-6">{illustration}</div>
      )}
      <h2 className="mb-3 text-xl font-semibold text-foreground">{title}</h2>
      <p className="mb-5 text-sm text-muted-foreground max-w-md">{description}</p>
      {actionLabel ? (
        <div>
          {actionTo ? (
            <Link
              to={actionTo}
              onClick={actionOnClick}
              className={`rounded-pill bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90`}
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={actionOnClick}
              className={`rounded-pill bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90`}
            >
              {actionLabel}
            </button>
          )}
        </div>
      ) : null}
    </motion.div>
  );
};