"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";
import { clsx } from "clsx";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, id, ...props }, ref) => {
    const selectId = id || props.name;

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-pro-text"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={clsx(
            "w-full rounded-lg border px-3.5 py-2.5 text-sm text-pro-text",
            "bg-pro-surface",
            "transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-pro-primary/30 focus:border-pro-primary",
            error
              ? "border-pro-danger"
              : "border-pro-border hover:border-pro-border-strong",
            "disabled:bg-[var(--pro-surface-sunken)] disabled:cursor-not-allowed",
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
        {error && <p className="text-xs text-pro-danger">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
