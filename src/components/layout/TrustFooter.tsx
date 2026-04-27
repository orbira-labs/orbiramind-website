"use client";

import { Smartphone } from "lucide-react";

function formatDateTurkish(): string {
  const now = new Date();
  const day = now.getDate();
  const month = now.toLocaleDateString("tr-TR", { month: "long" });
  const weekday = now.toLocaleDateString("tr-TR", { weekday: "long" });
  const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  return `${day} ${month}, ${capitalizedWeekday}`;
}

interface TrustFooterProps {
  showBadges?: boolean;
  showDate?: boolean;
}

export function TrustFooter({ showBadges = true, showDate = true }: TrustFooterProps) {
  return (
    <footer className="mt-auto border-t border-pro-border bg-pro-surface-alt/50">
      <div className="px-3 sm:px-4 py-3">
        <div className="grid grid-cols-3 items-center gap-2">
          <div className="justify-self-start">
            {showDate && (
              <span className="text-xs text-pro-text-tertiary">
                {formatDateTurkish()}
              </span>
            )}
          </div>

          <div className="justify-self-center">
            {showBadges && (
              <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-pro-accent/10 text-pro-accent rounded">
                <Smartphone className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">
                  Mobil uygulamamız çok yakında!
                </span>
              </div>
            )}
          </div>

          <div />
        </div>
      </div>
    </footer>
  );
}
