import { clsx } from "clsx";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "muted";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-pro-success-light text-pro-success border border-pro-success/15",
  warning: "bg-pro-warning-light text-pro-warning border border-pro-warning/15",
  danger: "bg-pro-danger-light text-pro-danger border border-pro-danger/15",
  info: "bg-pro-primary-light text-pro-primary border border-pro-primary/15",
  muted: "bg-pro-surface-alt text-pro-text-secondary border border-pro-border",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-0.5 text-xs",
};

const dotColors: Record<BadgeVariant, string> = {
  success: "bg-pro-success",
  warning: "bg-pro-warning",
  danger: "bg-pro-danger",
  info: "bg-pro-primary",
  muted: "bg-pro-text-tertiary",
};

export function Badge({
  variant = "muted",
  size = "md",
  dot = false,
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {dot && (
        <span
          className={clsx("h-1.5 w-1.5 rounded-full", dotColors[variant])}
        />
      )}
      {children}
    </span>
  );
}
