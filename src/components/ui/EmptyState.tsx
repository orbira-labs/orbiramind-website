"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./Button";
import { scaleIn } from "@/lib/animations";
import { clsx } from "clsx";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  actionVariant?: "primary" | "accent" | "blue" | "client" | "appointment" | "analysis";
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  compact?: boolean;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  actionVariant = "primary",
  secondaryActionLabel,
  onSecondaryAction,
  compact = false,
}: EmptyStateProps) {
  return (
    <motion.div
      variants={scaleIn}
      initial="initial"
      animate="animate"
      className={clsx(
        "flex flex-col items-center justify-center px-4 text-center",
        compact ? "py-8 sm:py-12" : "py-12"
      )}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className={clsx("relative", compact ? "mb-3 sm:mb-5" : "mb-5")}
      >
        <div className={clsx(
          "rounded-2xl bg-gradient-to-br from-pro-primary-light to-[var(--pro-surface-alt)] flex items-center justify-center",
          compact ? "h-12 w-12 sm:h-16 sm:w-16" : "h-16 w-16"
        )}>
          <Icon className={clsx(
            "text-pro-primary",
            compact ? "h-5 w-5 sm:h-7 sm:w-7" : "h-7 w-7"
          )} />
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
          className={clsx(
            "absolute rounded-full bg-pro-accent-light border-2 border-pro-surface",
            compact ? "-top-0.5 -right-0.5 h-3 w-3 sm:-top-1 sm:-right-1 sm:h-4 sm:w-4" : "-top-1 -right-1 h-4 w-4"
          )}
        />
      </motion.div>
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className={clsx(
          "font-semibold text-pro-text",
          compact ? "text-sm sm:text-base mb-1 sm:mb-1.5" : "text-base mb-1.5"
        )}
      >
        {title}
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={clsx(
          "text-pro-text-secondary max-w-xs leading-relaxed",
          compact ? "text-xs sm:text-sm mb-4 sm:mb-5" : "text-sm mb-5"
        )}
      >
        {description}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto"
      >
        {actionLabel && actionHref && (
          <Link href={actionHref} className="w-full sm:w-auto">
            <Button variant={actionVariant} size="md" fullWidth className="sm:w-auto">
              {actionLabel}
            </Button>
          </Link>
        )}
        {actionLabel && onAction && !actionHref && (
          <Button variant={actionVariant} size="md" onClick={onAction} fullWidth className="sm:w-auto">
            {actionLabel}
          </Button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <Button variant="secondary" size="md" onClick={onSecondaryAction} fullWidth className="sm:w-auto">
            {secondaryActionLabel}
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
}
