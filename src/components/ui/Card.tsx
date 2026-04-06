import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: "sm" | "md" | "lg" | "none";
  accent?: "primary" | "accent" | "client" | "appointment" | "analysis" | "none";
  variant?: "default" | "elevated" | "flat";
}

export function Card({
  hover = false,
  padding = "md",
  accent = "none",
  variant = "default",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(
        "bg-pro-surface rounded-2xl relative overflow-hidden",
        // Variant styles
        variant === "default" && "border border-pro-border shadow-[var(--pro-shadow-sm)]",
        variant === "elevated" && "border border-pro-border/50 shadow-[var(--pro-shadow-elevated)]",
        variant === "flat" && "border border-pro-border",
        // Hover effects - premium feel
        hover && [
          "transition-all duration-300 ease-out cursor-pointer",
          "hover:shadow-[var(--pro-shadow-hover)] hover:-translate-y-1",
          "hover:border-pro-border-strong",
          "active:translate-y-0 active:shadow-[var(--pro-shadow-md)]"
        ],
        // Padding
        padding === "none" && "p-0",
        padding === "sm" && "p-3.5 sm:p-4",
        padding === "md" && "p-4 sm:p-5",
        padding === "lg" && "p-5 sm:p-6",
        className
      )}
      {...props}
    >
      {accent !== "none" && (
        <div
          className={clsx(
            "absolute top-0 left-0 w-1 h-full rounded-l-2xl",
            accent === "primary" && "bg-gradient-to-b from-pro-primary to-pro-primary-hover",
            accent === "accent" && "bg-gradient-to-b from-pro-accent to-pro-accent-hover",
            accent === "client" && "bg-gradient-to-b from-[var(--pro-client)] to-[var(--pro-client-hover)]",
            accent === "appointment" && "bg-gradient-to-b from-[var(--pro-appointment)] to-[var(--pro-appointment-hover)]",
            accent === "analysis" && "bg-gradient-to-b from-[var(--pro-analysis)] to-[var(--pro-analysis-hover)]"
          )}
        />
      )}
      {children}
    </div>
  );
}
