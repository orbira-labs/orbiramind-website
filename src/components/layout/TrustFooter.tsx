"use client";

import { Smartphone } from "lucide-react";
import Link from "next/link";

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
      <div className="px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            <Link 
              href="https://orbiralabs.com" 
              target="_blank"
              className="text-xs text-pro-text-tertiary hover:text-pro-text transition-colors"
            >
              Powered by <span className="font-medium text-pro-accent">Orbira Labs</span>
            </Link>
            
            <div className="flex items-center gap-4">
              {showBadges && (
                <div className="flex items-center gap-1.5 text-xs text-pro-text-tertiary">
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>Mobil Uygulama</span>
                  <span className="text-pro-accent font-medium">Çok Yakında</span>
                </div>
              )}
              
              {showDate && (
                <span className="text-xs text-pro-text-tertiary">
                  {formatDateTurkish()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
