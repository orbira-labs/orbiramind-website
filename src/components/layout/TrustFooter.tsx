"use client";

import { Shield, Lock, FileText } from "lucide-react";
import Link from "next/link";

interface TrustFooterProps {
  showBadges?: boolean;
}

export function TrustFooter({ showBadges = true }: TrustFooterProps) {
  return (
    <footer className="mt-auto border-t border-pro-border bg-pro-surface-alt/50">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-5xl mx-auto">
          {showBadges && (
            <div className="flex items-center justify-center gap-4 mb-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-pro-text-tertiary">
                <Lock className="h-3.5 w-3.5" />
                <span>Uçtan uca şifreli</span>
              </div>
              <div className="h-3 w-px bg-pro-border hidden sm:block" />
              <div className="flex items-center gap-1.5 text-xs text-pro-text-tertiary">
                <Shield className="h-3.5 w-3.5" />
                <span>KVKK uyumlu</span>
              </div>
              <div className="h-3 w-px bg-pro-border hidden sm:block" />
              <div className="flex items-center gap-1.5 text-xs text-pro-text-tertiary">
                <FileText className="h-3.5 w-3.5" />
                <span>Türkiye'de veri saklama</span>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-center gap-4 text-xs text-pro-text-tertiary">
            <Link href="/privacy" className="hover:text-pro-text transition-colors">
              Gizlilik Politikası
            </Link>
            <span className="text-pro-border">·</span>
            <Link href="/terms" className="hover:text-pro-text transition-colors">
              Kullanım Koşulları
            </Link>
            <span className="text-pro-border">·</span>
            <Link href="/support" className="hover:text-pro-text transition-colors">
              Destek
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
