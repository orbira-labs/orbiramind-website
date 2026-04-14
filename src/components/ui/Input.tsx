"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { clsx } from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  touchFriendly?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, touchFriendly = false, className, id, ...props }, ref) => {
    const inputId = id || props.name;
    const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;
    const autoCapitalize =
      props.autoCapitalize ??
      (props.type === "email" || props.type === "password" ? "none" : undefined);
    const spellCheck = props.spellCheck ?? (props.type === "email" ? false : undefined);

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className={clsx(
              "block font-medium text-pro-text",
              touchFriendly ? "text-base sm:text-sm" : "text-sm"
            )}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={describedBy}
          autoCapitalize={autoCapitalize}
          spellCheck={spellCheck}
          className={clsx(
            "w-full rounded-lg border text-pro-text",
            "bg-pro-surface",
            "transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-pro-primary/30 focus:border-pro-primary",
            error
              ? "border-pro-danger focus:ring-pro-danger/30 focus:border-pro-danger"
              : "border-pro-border hover:border-pro-border-strong",
            "disabled:bg-[var(--pro-surface-sunken)] disabled:cursor-not-allowed",
            touchFriendly ? [
              "min-h-[44px] px-4 py-3 text-base sm:text-sm sm:px-3.5 sm:py-2.5 sm:min-h-0",
              "placeholder:text-pro-text-tertiary placeholder:text-base sm:placeholder:text-sm"
            ] : [
              "px-3.5 py-2.5 text-sm",
              "placeholder:text-pro-text-tertiary"
            ],
            className
          )}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-pro-danger">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-pro-text-tertiary">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
