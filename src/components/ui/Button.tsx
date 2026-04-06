"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "accent" | "ghost" | "danger" | "blue" | "orange" | "purple" | "client" | "appointment" | "analysis";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-pro-primary to-pro-primary-hover text-white shadow-sm hover:shadow-md hover:brightness-105",
  secondary:
    "bg-pro-surface text-pro-text border border-pro-border hover:bg-pro-surface-alt hover:border-pro-border-strong hover:shadow-sm",
  accent:
    "bg-gradient-to-r from-pro-accent to-pro-accent-hover text-white shadow-sm hover:shadow-md hover:brightness-105",
  ghost:
    "text-pro-text-secondary hover:bg-pro-surface-alt hover:text-pro-text",
  danger:
    "bg-gradient-to-r from-pro-danger to-[#C0392B] text-white hover:shadow-md",
  blue:
    "bg-gradient-to-r from-[var(--pro-analysis)] to-[var(--pro-analysis-hover)] text-white shadow-md hover:shadow-lg hover:brightness-110",
  orange:
    "bg-white text-pro-text border border-pro-border shadow-[0_2px_8px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.9)] hover:bg-gray-50",
  purple:
    "bg-gradient-to-r from-[var(--pro-appointment)] to-[var(--pro-appointment-hover)] text-white shadow-sm hover:shadow-md hover:brightness-105",
  client:
    "bg-gradient-to-r from-[var(--pro-client)] to-[var(--pro-client-hover)] text-white shadow-sm hover:shadow-md hover:brightness-105",
  appointment:
    "bg-gradient-to-r from-[var(--pro-appointment)] to-[var(--pro-appointment-hover)] text-white shadow-sm hover:shadow-md hover:brightness-105",
  analysis:
    "bg-gradient-to-r from-[var(--pro-analysis)] to-[var(--pro-analysis-hover)] text-white shadow-sm hover:shadow-md hover:brightness-105",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-3.5 py-1.5 text-sm rounded-lg gap-1.5",
  md: "px-4.5 py-2.5 text-sm rounded-xl gap-2",
  lg: "px-6 py-3 text-[15px] rounded-xl gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          "inline-flex items-center justify-center font-medium",
          "transition-all duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pro-primary/40 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none",
          "hover:scale-[1.02] active:scale-[0.97]",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
