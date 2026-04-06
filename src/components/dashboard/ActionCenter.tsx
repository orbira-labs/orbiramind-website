"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { 
  FileText, 
  Calendar, 
  AlertCircle, 
  CheckCircle2,
  ChevronRight,
  Zap
} from "lucide-react";
import Link from "next/link";
import { cardReveal } from "@/lib/animations";

interface ActionItem {
  id: string;
  type: "pending_report" | "upcoming_appointment" | "waiting_response" | "completed_analysis";
  title: string;
  subtitle: string;
  href: string;
  priority: "high" | "medium" | "low";
}

interface ActionCenterProps {
  pendingReports: number;
  upcomingAppointments: number;
  waitingAnalyses: number;
  completedToday: number;
}

const actionIcons = {
  pending_report: FileText,
  upcoming_appointment: Calendar,
  waiting_response: AlertCircle,
  completed_analysis: CheckCircle2,
};

const actionColors = {
  pending_report: "text-pro-warning bg-pro-warning-light",
  upcoming_appointment: "text-pro-accent bg-pro-accent-light",
  waiting_response: "text-pro-info bg-pro-info-light",
  completed_analysis: "text-pro-success bg-pro-success-light",
};

export function ActionCenter({ 
  pendingReports, 
  upcomingAppointments, 
  waitingAnalyses,
  completedToday 
}: ActionCenterProps) {
  const actions: ActionItem[] = [];

  if (pendingReports > 0) {
    actions.push({
      id: "pending",
      type: "pending_report",
      title: `${pendingReports} rapor incelenmedi`,
      subtitle: "Tamamlanan analizlerin raporlarını inceleyin",
      href: "/tests?filter=completed",
      priority: "high",
    });
  }

  if (upcomingAppointments > 0) {
    actions.push({
      id: "appointments",
      type: "upcoming_appointment",
      title: `${upcomingAppointments} randevu hazırlığı`,
      subtitle: "Bugün için seans öncesi özetler hazır",
      href: "/appointments",
      priority: "high",
    });
  }

  if (waitingAnalyses > 0) {
    actions.push({
      id: "waiting",
      type: "waiting_response",
      title: `${waitingAnalyses} analiz bekliyor`,
      subtitle: "Danışanlarınız henüz tamamlamadı",
      href: "/tests?filter=sent",
      priority: "medium",
    });
  }

  if (completedToday > 0) {
    actions.push({
      id: "completed",
      type: "completed_analysis",
      title: `${completedToday} analiz tamamlandı`,
      subtitle: "Bugün tamamlanan analizler",
      href: "/tests?filter=completed",
      priority: "low",
    });
  }

  const hasActions = actions.length > 0;

  return (
    <motion.div variants={cardReveal}>
      <Card variant="elevated" padding="lg" className="h-full">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-lg bg-pro-primary-light flex items-center justify-center">
            <Zap className="h-4 w-4 text-pro-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-pro-text">Bugün İçin</h3>
            <p className="text-xs text-pro-text-tertiary">Öncelikli aksiyonlar</p>
          </div>
        </div>

        {!hasActions ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="h-12 w-12 rounded-full bg-pro-success-light flex items-center justify-center mb-3">
              <CheckCircle2 className="h-6 w-6 text-pro-success" />
            </div>
            <p className="text-sm font-medium text-pro-text">Her şey yolunda!</p>
            <p className="text-xs text-pro-text-tertiary mt-1">
              Bekleyen aksiyon bulunmuyor
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {actions.map((action) => {
              const Icon = actionIcons[action.type];
              const colorClass = actionColors[action.type];

              return (
                <Link key={action.id} href={action.href}>
                  <div className="group flex items-center gap-3 p-3 rounded-xl hover:bg-pro-surface-alt transition-colors">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-pro-text truncate">
                          {action.title}
                        </p>
                        {action.priority === "high" && (
                          <Badge variant="warning" size="sm">Öncelikli</Badge>
                        )}
                      </div>
                      <p className="text-xs text-pro-text-tertiary truncate">
                        {action.subtitle}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-pro-text-tertiary group-hover:text-pro-primary transition-colors shrink-0" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Card>
    </motion.div>
  );
}
