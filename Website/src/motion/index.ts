import { Variants } from "framer-motion";

// Container variants for staggering children
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Item variants for staggered appearance
export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// Scale variant for hover effects
export const scaleVariants = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
};

// Fade in variant
export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

// Slide up variant
export const slideUpVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

// Slide down variant
export const slideDownVariants = {
  hidden: { y: -30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

// Stagger container for lists
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Motion presets for different sections
export const motionPresets = {
  hero: {
    outer: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.8 } } },
    title: { hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.8, delay: 0.2 } } },
    subtitle: { hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.8, delay: 0.4 } } },
    image: { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 1, delay: 0.6 } } },
  },
  navbar: {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  },
  search: {
    panel: { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } } },
    input: { focus: { scale: 1.02 }, blur: { scale: 1 } },
    suggestions: {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    },
  },
  productCard: {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
    imageHover: { scale: 1.05 },
  },
  statistics: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 1.2, delay: 0.3 },
    },
  },
  testimonials: {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
  },
  categories: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 0, y: 0, transition: { duration: 0.5 } },
  },
  modals: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  },
  wishlist: {
    liked: { scale: [0.5, 1.2, 1], transition: { type: "spring", damping: 15 } },
  },
  cart: {
    itemAdded: { scale: [1, 1.2, 1], transition: { type: "spring", damping: 10 } },
  },
  buttons: {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  },
  tabs: {
    indicator: { x: 0, transition: { type: "spring", stiffness: 300, damping: 20 } },
  },
  inputs: {
    focus: { borderColor: "primary", boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" },
    blur: { borderColor: "border", boxShadow: "none" },
  },
  loading: {
    pulse: { opacity: [0.3, 1, 0.3], transition: { repeat: Infinity, duration: 1.5 } },
  },
};