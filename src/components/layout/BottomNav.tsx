"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FlaskConical,
  CreditCard,
} from "lucide-react";
import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Ofisim", icon: LayoutDashboard },
  { href: "/clients", label: "Danışan", icon: Users },
  { href: "/appointments", label: "Randevu", icon: Calendar },
  { href: "/tests", label: "Analiz", icon: FlaskConical },
  { href: "/billing", label: "Satın Al", icon: CreditCard },
];

export function BottomNav() {
  const pathname = usePathname();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  useEffect(() => {
    setPendingHref(null);
  }, [pathname]);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-pro-surface/95 backdrop-blur-md border-t border-pro-border">
      <div className="flex items-center justify-around h-16 pb-[env(safe-area-inset-bottom)]">
        {NAV_ITEMS.map((item) => {
          const isActive = (pendingHref ?? pathname).startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setPendingHref(item.href)}
              className={clsx(
                "flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1.5 rounded-xl transition-all duration-200",
                isActive
                  ? "text-pro-primary"
                  : "text-pro-text-tertiary active:text-pro-text active:scale-95"
              )}
            >
              <div className={clsx(
                "p-1 rounded-lg transition-colors duration-200",
                isActive && "bg-pro-primary-light"
              )}>
                <item.icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
