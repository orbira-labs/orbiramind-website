"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "success" | "warning" | "danger";
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

const variantClasses = {
  primary: "bg-pro-primary",
  success: "bg-pro-success",
  warning: "bg-pro-warning",
  danger: "bg-pro-danger",
};

const variantBgClasses = {
  primary: "bg-pro-primary-light",
  success: "bg-pro-success-light",
  warning: "bg-pro-warning-light",
  danger: "bg-pro-danger-light",
};

export function ProgressBar({
  value,
  max = 100,
  size = "md",
  variant = "primary",
  showLabel = false,
  animated = true,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-pro-text-secondary">İlerleme</span>
          <span className="text-xs font-medium text-pro-text">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={clsx(
        "w-full rounded-full overflow-hidden",
        variantBgClasses[variant],
        sizeClasses[size]
      )}>
        <motion.div
          className={clsx("h-full rounded-full", variantClasses[variant])}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: "primary" | "success" | "warning" | "danger";
  showValue?: boolean;
  animated?: boolean;
  className?: string;
}

export function CircularProgress({
  value,
  max = 100,
  size = 48,
  strokeWidth = 4,
  variant = "primary",
  showValue = true,
  animated = true,
  className,
}: CircularProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colorMap = {
    primary: "#5B7B6A",
    success: "#27AE60",
    warning: "#F39C12",
    danger: "#E74C3C",
  };

  return (
    <div className={clsx("relative inline-flex", className)} style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E0DB"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colorMap[variant]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={animated ? { strokeDashoffset: circumference } : { strokeDashoffset }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold text-pro-text">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
}

interface StepsProgressProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
  variant?: "primary" | "success";
  className?: string;
}

export function StepsProgress({
  currentStep,
  totalSteps,
  labels,
  variant = "primary",
  className,
}: StepsProgressProps) {
  return (
    <div className={clsx("w-full", className)}>
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <div key={index} className="flex items-center flex-1 last:flex-none">
              <motion.div
                className={clsx(
                  "h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                  isCompleted && variant === "primary" && "bg-pro-primary text-white",
                  isCompleted && variant === "success" && "bg-pro-success text-white",
                  isCurrent && "bg-pro-primary-light text-pro-primary border-2 border-pro-primary",
                  !isCompleted && !isCurrent && "bg-pro-surface-alt text-pro-text-tertiary"
                )}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </motion.div>
              
              {index < totalSteps - 1 && (
                <div className="flex-1 h-0.5 mx-2 bg-pro-surface-alt overflow-hidden">
                  <motion.div
                    className={clsx(
                      "h-full",
                      variant === "primary" ? "bg-pro-primary" : "bg-pro-success"
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: isCompleted ? "100%" : "0%" }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {labels && (
        <div className="flex items-center justify-between mt-2">
          {labels.map((label, index) => (
            <span
              key={index}
              className={clsx(
                "text-[10px] text-center",
                index <= currentStep ? "text-pro-text-secondary" : "text-pro-text-tertiary",
                index === 0 && "text-left",
                index === labels.length - 1 && "text-right flex-none"
              )}
              style={{ flex: index === labels.length - 1 ? "none" : 1 }}
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "white";
  className?: string;
}

const spinnerSizes = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export function Spinner({ size = "md", variant = "primary", className }: SpinnerProps) {
  return (
    <svg
      className={clsx(
        "animate-spin",
        spinnerSizes[size],
        variant === "primary" ? "text-pro-primary" : "text-white",
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
