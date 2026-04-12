import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: "sm" | "md" | "lg" | "none";
  mobilePadding?: "sm" | "md" | "lg" | "none";
  accent?: "primary" | "accent" | "client" | "appointment" | "analysis" | "none";
  variant?: "default" | "elevated" | "flat";
}

const paddingStyles = {
  none: { mobile: "p-0", desktop: "sm:p-0" },
  sm: { mobile: "p-3", desktop: "sm:p-4" },
  md: { mobile: "p-3.5", desktop: "sm:p-5" },
  lg: { mobile: "p-4", desktop: "sm:p-6" },
};

export function Card({
  hover = false,
  padding = "md",
  mobilePadding,
  accent = "none",
  variant = "default",
  className,
  children,
  ...props
}: CardProps) {
  const effectiveMobilePadding = mobilePadding || padding;
  
  return (
    <div
      className={clsx(
        "bg-pro-surface rounded-2xl relative overflow-hidden",
        variant === "default" && "border border-pro-border shadow-[var(--pro-shadow-sm)]",
        variant === "elevated" && "border border-pro-border/50 shadow-[0_8px_24px_rgba(0,0,0,0.12),_6px_6px_20px_rgba(0,0,0,0.08)]",
        variant === "flat" && "border border-pro-border",
        hover && [
          "transition-all duration-300 ease-out cursor-pointer",
          "hover:shadow-[var(--pro-shadow-hover)] hover:-translate-y-1",
          "hover:border-pro-border-strong",
          "active:translate-y-0 active:shadow-[var(--pro-shadow-md)]"
        ],
        paddingStyles[effectiveMobilePadding].mobile,
        paddingStyles[padding].desktop,
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
