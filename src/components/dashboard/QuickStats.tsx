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

export function QuickStats({ stats, loading = false }: QuickStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-pro-surface rounded-xl border border-pro-border p-4 sm:p-5">
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
      className="grid grid-cols-3 gap-3 sm:gap-4"
    >
      {stats.map((stat) => (
        <motion.div key={stat.key} variants={cardReveal}>
          <Link href={stat.href}>
            <Card 
              hover 
              padding="none"
              className="bg-white border border-pro-border/60 shadow-[0_8px_24px_rgba(0,0,0,0.12),_6px_6px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.16),_8px_8px_24px_rgba(0,0,0,0.10)] transition-shadow"
            >
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-pro-text-secondary font-medium">
                      {stat.label}
                    </p>
                    <p className={`text-2xl sm:text-3xl font-bold mt-1 ${stat.valueColor}`}>
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
