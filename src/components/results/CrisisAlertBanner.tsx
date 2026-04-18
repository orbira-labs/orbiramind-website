"use client";

import { motion } from "framer-motion";
import { ShieldAlert, AlertTriangle, AlertCircle } from "lucide-react";
import type { CrisisAlert, CrisisAlertLevel } from "@/lib/types";

interface CrisisAlertBannerProps {
  alerts: CrisisAlert[];
}

const LEVEL_STYLES: Record<
  CrisisAlertLevel,
  {
    container: string;
    icon: typeof ShieldAlert;
    iconBg: string;
    iconColor: string;
    titleColor: string;
    label: string;
  }
> = {
  critical: {
    container: "border-red-300 bg-red-50",
    icon: ShieldAlert,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    titleColor: "text-red-900",
    label: "Acil — İlk Seansta",
  },
  high: {
    container: "border-orange-300 bg-orange-50",
    icon: AlertTriangle,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    titleColor: "text-orange-900",
    label: "Öncelikli",
  },
  elevated: {
    container: "border-amber-200 bg-amber-50",
    icon: AlertCircle,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    titleColor: "text-amber-900",
    label: "Dikkat",
  },
};

const LEVEL_ORDER: Record<CrisisAlertLevel, number> = {
  critical: 0,
  high: 1,
  elevated: 2,
};

export function CrisisAlertBanner({ alerts }: CrisisAlertBannerProps) {
  if (!alerts || alerts.length === 0) return null;

  const sorted = [...alerts].sort(
    (a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-2.5"
      role="alert"
      aria-live="polite"
    >
      {sorted.map((alert, index) => {
        const style = LEVEL_STYLES[alert.level] ?? LEVEL_STYLES.elevated;
        const Icon = style.icon;
        return (
          <div
            key={`${alert.title}-${index}`}
            className={`rounded-xl border ${style.container} px-4 py-3.5 sm:px-5 sm:py-4`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${style.iconBg}`}
              >
                <Icon className={`h-5 w-5 ${style.iconColor}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wide ${style.iconColor}`}
                  >
                    {style.label}
                  </span>
                  <h3 className={`text-sm font-semibold ${style.titleColor}`}>
                    {alert.title}
                  </h3>
                </div>
                <p className="text-[13px] leading-relaxed text-gray-700">
                  {alert.detail}
                </p>
                {alert.recommended_action && (
                  <p className="mt-2 text-[13px] leading-relaxed text-gray-900">
                    <span className="font-medium">Önerilen adım: </span>
                    {alert.recommended_action}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}
