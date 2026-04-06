"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { clsx } from "clsx";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

export function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className={clsx(
          "relative w-full bg-pro-surface rounded-2xl shadow-[var(--pro-shadow-lg)]",
          "border border-pro-border overflow-hidden",
          "animate-[modal-in_200ms_ease-out]",
          "max-h-[90vh] flex flex-col",
          size === "sm" && "max-w-md",
          size === "md" && "max-w-lg",
          size === "lg" && "max-w-2xl"
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-pro-border">
            <h2 className="text-lg font-semibold text-pro-text">{title}</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-pro-text-tertiary hover:text-pro-text hover:bg-pro-surface-alt transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
