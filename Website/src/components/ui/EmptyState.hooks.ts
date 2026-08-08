import { MotionProps } from "framer-motion";

export const emptyStateVariants = {
  enter: (direction: "up" | "down" = "up") => ({
    opacity: 0,
    y: direction === "up" ? 20 : -20,
    transition: { type: "spring" as const, stiffness: 300, damping: 20 } as const
  }),
  center: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 20 } as const
  },
  exit: (direction: "up" | "down" = "up") => ({
    opacity: 0,
    y: direction === "up" ? -20 : 20,
    transition: { type: "spring" as const, stiffness: 300, damping: 20 } as const
  }),
};

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionOnClick?: () => void;
  actionTo?: string; // for Link
  illustration?: React.ReactNode;
  className?: string;
  animationDirection?: "up" | "down";
}