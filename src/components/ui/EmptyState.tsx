"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./Button";
import { scaleIn } from "@/lib/animations";

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
}: EmptyStateProps) {
  return (
    <motion.div
      variants={scaleIn}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="relative mb-5"
      >
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-pro-primary-light to-[var(--pro-surface-alt)] flex items-center justify-center">
          <Icon className="h-7 w-7 text-pro-primary" />
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
          className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-pro-accent-light border-2 border-pro-surface"
        />
      </motion.div>
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-base font-semibold text-pro-text mb-1.5"
      >
        {title}
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-sm text-pro-text-secondary max-w-xs leading-relaxed mb-5"
      >
        {description}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="flex flex-col sm:flex-row gap-2"
      >
        {actionLabel && actionHref && (
          <Link href={actionHref}>
            <Button variant={actionVariant} size="md">
              {actionLabel}
            </Button>
          </Link>
        )}
        {actionLabel && onAction && !actionHref && (
          <Button variant={actionVariant} size="md" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <Button variant="secondary" size="md" onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
}
