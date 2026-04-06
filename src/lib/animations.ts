import type { Variants } from "framer-motion";

export const fadeSlideUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -10 },
};

export const fadeSlideIn: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: { opacity: 0, x: 20 },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: { opacity: 0, scale: 0.95 },
};

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 15 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export const cardReveal: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const paragraphReveal: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

export const celebrationPop: Variants = {
  initial: { opacity: 0, scale: 0.5 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

export const hoverLift: Variants = {
  initial: { y: 0, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" },
  hover: { 
    y: -4, 
    boxShadow: "0 12px 40px -8px rgba(0,0,0,0.12)",
    transition: { duration: 0.2, ease: "easeOut" }
  },
  tap: { 
    y: 0, 
    scale: 0.98,
    transition: { duration: 0.1 }
  },
};

export const buttonPress: Variants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: { duration: 0.15, ease: "easeOut" }
  },
  tap: { 
    scale: 0.98,
    transition: { duration: 0.1 }
  },
};

export const iconBounce: Variants = {
  initial: { scale: 1, rotate: 0 },
  hover: { 
    scale: 1.1,
    rotate: [0, -5, 5, 0],
    transition: { duration: 0.3 }
  },
};

export const checkmarkPop: Variants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: [0, 1.2, 1],
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export const shimmer: Variants = {
  initial: { x: "-100%" },
  animate: {
    x: "100%",
    transition: {
      repeat: Infinity,
      repeatType: "loop" as const,
      duration: 1.5,
      ease: "linear",
    },
  },
};

export const pulseGlow: Variants = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: "easeInOut",
    },
  },
};

export const slideInFromRight: Variants = {
  initial: { x: 20, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: { x: 20, opacity: 0 },
};

export const slideInFromBottom: Variants = {
  initial: { y: 20, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: { y: 20, opacity: 0 },
};
