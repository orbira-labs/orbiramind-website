"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { clsx } from "clsx";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  touchFriendly?: boolean;
  showPasswordToggle?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, touchFriendly = false, showPasswordToggle, className, id, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || props.name;
    const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;
    const autoCapitalize =
      props.autoCapitalize ??
      (type === "email" || type === "password" ? "none" : undefined);
    const spellCheck = props.spellCheck ?? (type === "email" ? false : undefined);
    
    const isPassword = type === "password";
    const shouldShowToggle = isPassword && showPasswordToggle !== false;
    const inputType = isPassword && showPassword ? "text" : type;

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
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={inputType}
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
              shouldShowToggle && "pr-12",
              className
            )}
            {...props}
          />
          {shouldShowToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
              className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] text-pro-text-tertiary hover:text-pro-text-secondary transition-colors touch-manipulation"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
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
