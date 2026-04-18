"use client";

import type { ClientTier, ClientTierInfo } from "@/lib/hooks/useClientsList";

interface ClientTierDotProps {
  tierInfo?: ClientTierInfo;
  size?: "sm" | "md";
}

const STYLES: Record<ClientTier, { dot: string; title: string } | null> = {
  critical: {
    dot: "bg-red-500 ring-2 ring-red-200",
    title: "Kritik klinik sinyal — ilk seansta ele alınmalı",
  },
  high: {
    dot: "bg-orange-500",
    title: "Öncelikli — erken dönem klinik konu",
  },
  moderate: null,
  low: null,
  contextual: null,
  unknown: null,
};

/**
 * Terapistin client listesinde "kimi önce görmeliyim?" sorusuna tek bakışta
 * cevap veren minimal rozet. Sadece `critical` ve `high` tier'lar için
 * görünür kalır — moderate/low/contextual/unknown'da görsel gürültü
 * yaratmamak için render edilmez.
 */
export function ClientTierDot({ tierInfo, size = "sm" }: ClientTierDotProps) {
  if (!tierInfo) return null;
  const style = STYLES[tierInfo.maxTier];
  if (!style) return null;

  const detail =
    tierInfo.maxTier === "critical" && tierInfo.criticalPatternCount > 1
      ? ` (${tierInfo.criticalPatternCount} örüntü)`
      : "";

  const sizeClass = size === "sm" ? "h-2 w-2" : "h-2.5 w-2.5";

  return (
    <span
      className={`inline-block rounded-full ${sizeClass} ${style.dot}`}
      title={`${style.title}${detail}`}
      aria-label={style.title}
    />
  );
}
