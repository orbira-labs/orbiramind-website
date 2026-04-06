"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  ChevronRight,
  FileText
} from "lucide-react";
import { cardReveal } from "@/lib/animations";
import Link from "next/link";

interface SessionPreviewData {
  appointmentId: string;
  clientName: string;
  clientFirstName: string;
  clientLastName: string;
  startsAt: string;
  hasRecentAnalysis: boolean;
  analysisId?: string;
  analysisHighlights?: string[];
}

interface SessionPreviewCardProps {
  session: SessionPreviewData;
  onViewSummary?: () => void;
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getTimeUntil(dateString: string): string {
  const now = new Date();
  const target = new Date(dateString);
  const diffMs = target.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  
  if (diffMins < 0) return "Geçmiş";
  if (diffMins < 60) return `${diffMins} dk`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)} saat`;
  return `${Math.floor(diffMins / 1440)} gün`;
}

export function SessionPreviewCard({ session, onViewSummary }: SessionPreviewCardProps) {
  const timeUntil = getTimeUntil(session.startsAt);
  const isToday = new Date(session.startsAt).toDateString() === new Date().toDateString();
  const isSoon = isToday && parseInt(timeUntil) < 60;

  return (
    <motion.div variants={cardReveal}>
      <Card 
        variant="elevated" 
        padding="lg"
        className={isSoon ? "border-pro-warning/30 bg-gradient-to-br from-pro-warning-light/20 to-pro-surface" : ""}
      >
        <div className="flex items-start gap-4">
          <Avatar
            firstName={session.clientFirstName}
            lastName={session.clientLastName}
            size="lg"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-pro-text">
                  {session.clientName}
                </p>
                <p className="text-xs text-pro-text-tertiary mt-0.5">
                  Randevu
                </p>
              </div>
              {isSoon && (
                <Badge variant="warning" size="sm">Yaklaşıyor</Badge>
              )}
            </div>

            <div className="flex items-center gap-4 mt-3 text-xs text-pro-text-secondary">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-pro-text-tertiary" />
                <span>{isToday ? "Bugün" : new Date(session.startsAt).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-pro-text-tertiary" />
                <span>{formatTime(session.startsAt)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-pro-warning font-medium">
                <span>{timeUntil} sonra</span>
              </div>
            </div>

            {session.hasRecentAnalysis && session.analysisHighlights && (
              <div className="mt-3 p-3 bg-pro-surface-alt rounded-xl">
                <div className="flex items-center gap-1.5 text-xs font-medium text-pro-text mb-2">
                  <FileText className="h-3.5 w-3.5 text-[var(--pro-analysis)]" />
                  Son Analiz Özeti
                </div>
                <div className="space-y-1">
                  {session.analysisHighlights.slice(0, 2).map((highlight, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-pro-text-secondary">
                      <div className="h-1.5 w-1.5 rounded-full bg-[var(--pro-analysis)] mt-1.5 shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!session.hasRecentAnalysis && (
              <div className="mt-3 p-3 bg-pro-warning-light/50 rounded-xl border border-pro-warning/10">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-pro-warning shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-pro-warning">Analiz önerisi</p>
                    <p className="text-[11px] text-pro-text-tertiary mt-0.5">
                      Bu danışan için henüz tamamlanmış analiz yok.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 mt-4">
              {session.hasRecentAnalysis && session.analysisId && (
                <Link href={`/tests/${session.analysisId}`}>
                  <Button variant="secondary" size="sm">
                    Raporu Gör
                  </Button>
                </Link>
              )}
              <Link href={`/appointments`}>
                <Button variant="secondary" size="sm">
                  Randevuya Git
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
