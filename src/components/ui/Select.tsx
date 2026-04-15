"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";
import { clsx } from "clsx";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  touchFriendly?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, touchFriendly = false, className, id, ...props }, ref) => {
    const selectId = id || props.name;
    const describedBy = error ? `${selectId}-error` : undefined;

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className={clsx(
              "block font-medium text-pro-text",
              touchFriendly ? "text-base sm:text-sm" : "text-sm"
            )}
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={describedBy}
          className={clsx(
            "w-full rounded-lg border text-pro-text",
            "bg-pro-surface",
            "transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-pro-primary/30 focus:border-pro-primary",
            error
              ? "border-pro-danger"
              : "border-pro-border hover:border-pro-border-strong",
            "disabled:bg-[var(--pro-surface-sunken)] disabled:cursor-not-allowed",
            touchFriendly
              ? "min-h-[48px] px-4 py-3 text-base sm:text-sm sm:px-3.5 sm:py-2.5 sm:min-h-0"
              : "px-3.5 py-2.5 text-sm",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={`${selectId}-error`} className="text-xs text-pro-danger">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
