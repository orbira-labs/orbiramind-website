"use client";

import { Shield, Lock, Server, CheckCircle2 } from "lucide-react";
import { clsx } from "clsx";

interface TrustBadge {
  icon: typeof Shield;
  label: string;
  description?: string;
}

const DEFAULT_BADGES: TrustBadge[] = [
  {
    icon: Lock,
    label: "Uçtan uca şifreli",
    description: "Tüm veriler şifrelenerek iletilir",
  },
  {
    icon: Server,
    label: "Türkiye'de saklanır",
    description: "Veriler yurt içi sunucularda tutulur",
  },
  {
    icon: Shield,
    label: "KVKK uyumlu",
    description: "Kişisel verilerin korunması",
  },
];

interface TrustBadgesProps {
  badges?: TrustBadge[];
  variant?: "inline" | "stacked" | "compact";
  className?: string;
}

export function TrustBadges({ 
  badges = DEFAULT_BADGES, 
  variant = "inline",
  className 
}: TrustBadgesProps) {
  if (variant === "compact") {
    return (
      <div className={clsx("flex items-center gap-3 flex-wrap", className)}>
        {badges.map((badge, i) => (
          <div 
            key={i} 
            className="flex items-center gap-1.5 text-xs text-pro-text-tertiary"
          >
            <badge.icon className="h-3.5 w-3.5" />
            <span>{badge.label}</span>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "stacked") {
    return (
      <div className={clsx("space-y-2", className)}>
        {badges.map((badge, i) => (
          <div 
            key={i} 
            className="flex items-start gap-3 p-3 rounded-lg bg-pro-surface-alt"
          >
            <div className="h-8 w-8 rounded-lg bg-pro-success-light flex items-center justify-center shrink-0">
              <badge.icon className="h-4 w-4 text-pro-success" />
            </div>
            <div>
              <p className="text-sm font-medium text-pro-text">{badge.label}</p>
              {badge.description && (
                <p className="text-xs text-pro-text-tertiary mt-0.5">
                  {badge.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={clsx(
      "flex items-center justify-center gap-4 p-4 bg-pro-surface-alt rounded-xl border border-pro-border/50",
      className
    )}>
      {badges.map((badge, i) => (
        <div 
          key={i} 
          className="flex items-center gap-2 text-xs text-pro-text-secondary"
        >
          <div className="h-6 w-6 rounded-md bg-pro-success-light flex items-center justify-center">
            <badge.icon className="h-3.5 w-3.5 text-pro-success" />
          </div>
          <span>{badge.label}</span>
        </div>
      ))}
    </div>
  );
}

interface SecurityNoticeProps {
  className?: string;
}

export function SecurityNotice({ className }: SecurityNoticeProps) {
  return (
    <div className={clsx(
      "flex items-start gap-3 p-4 rounded-xl bg-pro-info-light/50 border border-pro-info/10",
      className
    )}>
      <CheckCircle2 className="h-5 w-5 text-pro-info shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-medium text-pro-text">
          Güvenli ve gizli
        </p>
        <p className="text-xs text-pro-text-secondary mt-1">
          Danışan verileri KVKK kapsamında şifrelenerek saklanır. 
          Üçüncü taraflarla paylaşılmaz.
        </p>
      </div>
    </div>
  );
}
