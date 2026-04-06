"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { clsx } from "clsx";

interface TrendIndicatorProps {
  value: number;
  label?: string;
  size?: "sm" | "md";
  showIcon?: boolean;
}

export function TrendIndicator({ 
  value, 
  label = "geçen haftaya göre",
  size = "sm",
  showIcon = true 
}: TrendIndicatorProps) {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  
  const Icon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;
  
  return (
    <div className={clsx(
      "inline-flex items-center gap-1",
      size === "sm" && "text-xs",
      size === "md" && "text-sm",
      isPositive && "text-pro-success",
      !isPositive && !isNeutral && "text-pro-danger",
      isNeutral && "text-pro-text-tertiary"
    )}>
      {showIcon && (
        <Icon className={clsx(
          size === "sm" && "h-3 w-3",
          size === "md" && "h-4 w-4"
        )} />
      )}
      <span className="font-medium">
        {isPositive && "+"}
        {value}%
      </span>
      {label && (
        <span className="text-pro-text-tertiary font-normal">
          {label}
        </span>
      )}
    </div>
  );
}
