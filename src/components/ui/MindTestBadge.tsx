"use client";

type MindTestSize = "xs" | "sm" | "md" | "lg" | "xl";
type MindTestVariant = "primary" | "white" | "gold" | "muted";

interface MindTestBadgeProps {
  count?: number;
  size?: MindTestSize;
  variant?: MindTestVariant;
  showLabel?: boolean;
  className?: string;
}

const sizeStyles: Record<MindTestSize, { container: string; count: string; label: string }> = {
  xs: {
    container: "gap-0.5",
    count: "text-sm font-bold",
    label: "text-[10px] font-semibold",
  },
  sm: {
    container: "gap-1",
    count: "text-lg font-bold",
    label: "text-xs font-semibold",
  },
  md: {
    container: "gap-1",
    count: "text-2xl font-bold",
    label: "text-sm font-semibold",
  },
  lg: {
    container: "gap-1.5",
    count: "text-4xl font-bold",
    label: "text-xl font-semibold",
  },
  xl: {
    container: "gap-2",
    count: "text-5xl font-bold",
    label: "text-2xl font-semibold",
  },
};

const variantStyles: Record<MindTestVariant, { count: string; label: string }> = {
  primary: {
    count: "text-pro-text",
    label: "text-pro-text-secondary",
  },
  white: {
    count: "text-white",
    label: "text-white/70",
  },
  gold: {
    count: "text-[#8B6914]",
    label: "text-[#8B6914]/70",
  },
  muted: {
    count: "text-pro-text-secondary",
    label: "text-pro-text-tertiary",
  },
};

export function MindTestBadge({
  count,
  size = "md",
  variant = "primary",
  showLabel = true,
  className,
}: MindTestBadgeProps) {
  const sizeStyle = sizeStyles[size];
  const variantStyle = variantStyles[variant];

  const containerClasses = `flex items-end ${sizeStyle.container} ${className || ""}`.trim();
  const countClasses = `${sizeStyle.count} ${variantStyle.count}`;
  const labelClasses = `${sizeStyle.label} ${variantStyle.label} ${count !== undefined ? "mb-0.5" : ""}`.trim();

  return (
    <div className={containerClasses}>
      {count !== undefined && (
        <span className={countClasses}>{count}</span>
      )}
      {showLabel && (
        <span className={labelClasses}>
          MindTest
        </span>
      )}
    </div>
  );
}

export function MindTestInline({
  className,
  variant = "primary",
}: {
  className?: string;
  variant?: MindTestVariant;
}) {
  const variantStyle = variantStyles[variant];
  const classes = `font-semibold ${variantStyle.label} ${className || ""}`.trim();
  
  return (
    <span className={classes}>
      MindTest
    </span>
  );
}
