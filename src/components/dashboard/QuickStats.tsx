"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { staggerContainer, cardReveal } from "@/lib/animations";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface StatItem {
  key: string;
  label: string;
  value: number | string;
  icon: LucideIcon;
  href: string;
  trend?: number;
  iconBg: string;
  iconColor: string;
  valueColor: string;
}

interface QuickStatsProps {
  stats: StatItem[];
  loading?: boolean;
}

function DesktopQuickStats({ stats, loading }: QuickStatsProps) {
  if (loading) {
    return (
      <div className="desktop-only-grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-pro-surface rounded-xl border border-pro-border p-5">
            <div className="animate-pulse">
              <div className="h-4 w-20 bg-pro-surface-alt rounded mb-3" />
              <div className="h-8 w-14 bg-pro-surface-alt rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="desktop-only-grid grid-cols-3 gap-4"
    >
      {stats.map((stat) => (
        <motion.div key={stat.key} variants={cardReveal}>
          <Link href={stat.href}>
            <Card 
              hover 
              padding="none"
              className="bg-white border border-pro-border/60 shadow-[0_8px_24px_rgba(0,0,0,0.12),_6px_6px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.16),_8px_8px_24px_rgba(0,0,0,0.10)] transition-shadow"
            >
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-pro-text-secondary font-medium">
                      {stat.label}
                    </p>
                    <p className={`text-3xl font-bold mt-1 ${stat.valueColor}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`h-10 w-10 rounded-xl ${stat.iconBg} flex items-center justify-center shrink-0 shadow-sm`}>
                    <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}

function MobileQuickStats({ stats, loading }: QuickStatsProps) {
  if (loading) {
    return (
      <div className="mobile-only -mx-3">
        <div className="mobile-scroll-snap gap-3 px-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="mobile-stat-card min-w-[140px]">
              <div className="animate-pulse w-full">
                <div className="h-3 w-16 bg-pro-surface-alt rounded mb-2 mx-auto" />
                <div className="h-7 w-10 bg-pro-surface-alt rounded mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-only -mx-3">
      <div className="mobile-scroll-snap gap-3 px-3 pb-1">
        {stats.map((stat) => (
          <Link key={stat.key} href={stat.href} className="flex-shrink-0">
            <div className="mobile-stat-card min-w-[140px] active:scale-[0.98] transition-transform touch-manipulation">
              <div className={`h-9 w-9 rounded-lg ${stat.iconBg} flex items-center justify-center mb-2`}>
                <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
              </div>
              <p className={`text-2xl font-bold ${stat.valueColor}`}>
                {stat.value}
              </p>
              <p className="text-xs text-pro-text-secondary font-medium mt-0.5 text-center">
                {stat.label}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function QuickStats({ stats, loading = false }: QuickStatsProps) {
  return (
    <>
      <DesktopQuickStats stats={stats} loading={loading} />
      <MobileQuickStats stats={stats} loading={loading} />
    </>
  );
}
