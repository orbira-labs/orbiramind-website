"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { clsx } from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-pro-text"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            "w-full rounded-lg border px-3.5 py-2.5 text-sm text-pro-text",
            "bg-pro-surface placeholder:text-pro-text-tertiary",
            "transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-pro-primary/30 focus:border-pro-primary",
            error
              ? "border-pro-danger focus:ring-pro-danger/30 focus:border-pro-danger"
              : "border-pro-border hover:border-pro-border-strong",
            "disabled:bg-[var(--pro-surface-sunken)] disabled:cursor-not-allowed",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-pro-danger">{error}</p>}
        {hint && !error && (
          <p className="text-xs text-pro-text-tertiary">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
