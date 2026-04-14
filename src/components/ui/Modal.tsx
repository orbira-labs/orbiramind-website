"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { clsx } from "clsx";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  size = "md",
  fullScreen = false,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className={clsx(
        "fixed inset-0 z-50 flex items-center justify-center",
        fullScreen ? "p-0" : "p-4 sm:p-4"
      )}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className={clsx(
          "relative w-full bg-pro-surface shadow-[var(--pro-shadow-lg)]",
          "border border-pro-border overflow-hidden",
          "animate-[modal-in_200ms_ease-out]",
          "flex flex-col",
          fullScreen ? [
            "h-full max-h-full rounded-none",
            "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
            "pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]"
          ] : [
            "rounded-2xl max-h-[90vh]",
            size === "sm" && "max-w-md",
            size === "md" && "max-w-lg",
            size === "lg" && "max-w-2xl"
          ]
        )}
      >
        {title && (
          <div className={clsx(
            "flex items-start justify-between border-b border-pro-border",
            fullScreen ? "px-4 py-3 sm:px-5 sm:py-4" : "px-6 py-5"
          )}>
            <div className="flex-1 min-w-0">
              <h2 className={clsx(
                "font-semibold text-pro-text",
                fullScreen ? "text-base sm:text-lg" : "text-lg"
              )}>{title}</h2>
              {subtitle && (
                <p className="text-sm text-pro-text-tertiary mt-0.5">{subtitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className={clsx(
                "rounded-lg text-pro-text-tertiary hover:text-pro-text hover:bg-pro-surface-alt transition-colors shrink-0 ml-3",
                "min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 p-1.5",
                "flex items-center justify-center"
              )}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className={clsx(
          "overflow-y-auto flex-1",
          fullScreen ? "p-4 sm:p-5" : "px-6 py-5"
        )}>{children}</div>
      </div>
    </div>
  );
}
