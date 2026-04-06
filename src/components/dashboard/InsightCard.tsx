"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Sparkles, TrendingUp, TrendingDown, Users, Brain } from "lucide-react";
import { cardReveal } from "@/lib/animations";

interface Insight {
  id: string;
  type: "pattern" | "trend" | "alert" | "achievement";
  message: string;
  icon?: "sparkles" | "trending_up" | "trending_down" | "users" | "brain";
}

interface InsightCardProps {
  insights: Insight[];
  completionRateChange?: number;
  activeClients?: number;
  weeklyAnalyses?: number;
}

const iconMap = {
  sparkles: Sparkles,
  trending_up: TrendingUp,
  trending_down: TrendingDown,
  users: Users,
  brain: Brain,
};

function generateDefaultInsights(
  completionRateChange?: number,
  activeClients?: number,
  weeklyAnalyses?: number
): Insight[] {
  const insights: Insight[] = [];

  if (completionRateChange !== undefined && completionRateChange !== 0) {
    insights.push({
      id: "completion_rate",
      type: completionRateChange > 0 ? "trend" : "alert",
      message: completionRateChange > 0
        ? `Son 7 günde tamamlama oranı %${Math.abs(completionRateChange)} arttı`
        : `Tamamlama oranı %${Math.abs(completionRateChange)} düştü`,
      icon: completionRateChange > 0 ? "trending_up" : "trending_down",
    });
  }

  if (activeClients !== undefined && activeClients > 0) {
    insights.push({
      id: "active_clients",
      type: "achievement",
      message: `${activeClients} aktif danışanla çalışıyorsunuz`,
      icon: "users",
    });
  }

  if (weeklyAnalyses !== undefined && weeklyAnalyses > 0) {
    insights.push({
      id: "weekly_analyses",
      type: "pattern",
      message: `Bu hafta ${weeklyAnalyses} analiz tamamlandı`,
      icon: "brain",
    });
  }

  return insights;
}

export function InsightCard({
  insights: customInsights,
  completionRateChange,
  activeClients,
  weeklyAnalyses,
}: InsightCardProps) {
  const defaultInsights = generateDefaultInsights(
    completionRateChange,
    activeClients,
    weeklyAnalyses
  );
  
  const insights = customInsights.length > 0 ? customInsights : defaultInsights;
  const primaryInsight = insights[0];

  if (!primaryInsight) {
    return null;
  }

  const Icon = iconMap[primaryInsight.icon || "sparkles"];

  return (
    <motion.div variants={cardReveal}>
      <Card 
        variant="elevated" 
        padding="lg"
        className="bg-gradient-to-br from-pro-primary-light/50 to-pro-surface border-pro-primary/10"
      >
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-pro-primary/10 flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5 text-pro-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-pro-primary uppercase tracking-wide">
                AI İçgörüsü
              </span>
            </div>
            <p className="text-sm text-pro-text leading-relaxed">
              {primaryInsight.message}
            </p>
            
            {insights.length > 1 && (
              <div className="mt-3 pt-3 border-t border-pro-border/50 space-y-2">
                {insights.slice(1, 3).map((insight) => {
                  const InsightIcon = iconMap[insight.icon || "sparkles"];
                  return (
                    <div key={insight.id} className="flex items-center gap-2 text-xs text-pro-text-secondary">
                      <InsightIcon className="h-3.5 w-3.5 text-pro-primary/70" />
                      <span>{insight.message}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
