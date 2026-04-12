"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Clock, FileText, Calendar, Send, ChevronRight, AlertCircle } from "lucide-react";
import { CLIENT_STATUSES } from "@/lib/constants";
import { formatRelative } from "@/lib/utils";
import Link from "next/link";
import type { Client } from "@/lib/types";
import { ClientRowActions } from "./ClientRowActions";

interface ClientAnalysisInfo {
  status: "pending" | "completed" | "none";
  lastCompletedAt?: string;
  pendingCount?: number;
}

interface ClientAppointmentInfo {
  hasUpcoming: boolean;
  nextDate?: string;
}

interface RowActionsCallbacks {
  onSetStatus: (status: "active" | "passive") => void;
  onDelete: () => void;
}

interface ClientCardProps {
  client: Client;
  analysisInfo?: ClientAnalysisInfo;
  appointmentInfo?: ClientAppointmentInfo;
  lastContactAt?: string;
  onSendAnalysis?: () => void;
  onScheduleAppointment?: () => void;
  viewMode?: "card" | "row" | "mobile";
  rowActions?: RowActionsCallbacks;
}

export function ClientCard({
  client,
  analysisInfo,
  appointmentInfo,
  lastContactAt,
  onSendAnalysis,
  onScheduleAppointment,
  viewMode = "card",
  rowActions,
}: ClientCardProps) {
  const statusInfo = CLIENT_STATUSES.find((s) => s.id === client.status);

  const daysSinceContact = lastContactAt
    ? Math.floor((Date.now() - new Date(lastContactAt).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const needsAttention = daysSinceContact !== null && daysSinceContact > 14;

  /* ============================================================
     MOBILE VIEW - Kompakt liste item görünümü
     ============================================================ */
  if (viewMode === "mobile") {
    return (
      <Link href={`/clients/${client.id}`} className="mobile-list-item touch-manipulation">
        <Avatar firstName={client.first_name} lastName={client.last_name} size="md" />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-pro-text truncate">
              {client.first_name} {client.last_name}
            </p>
            {needsAttention && (
              <div className="h-4 w-4 rounded-full bg-pro-warning-light flex items-center justify-center shrink-0">
                <AlertCircle className="h-2.5 w-2.5 text-pro-warning" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge 
              variant={(statusInfo?.color as "success" | "warning" | "muted") || "muted"} 
              size="sm"
              dot
            >
              {statusInfo?.label || client.status}
            </Badge>
            {analysisInfo?.status === "completed" && (
              <Badge variant="success" size="sm">Rapor</Badge>
            )}
            {analysisInfo?.status === "pending" && (
              <Badge variant="warning" size="sm">Bekliyor</Badge>
            )}
          </div>
        </div>
        
        <ChevronRight className="h-5 w-5 text-pro-text-tertiary shrink-0" />
      </Link>
    );
  }

  /* ============================================================
     DESKTOP ROW VIEW - Mevcut row görünümü (değiştirilmedi)
     ============================================================ */
  if (viewMode === "row") {
    if (rowActions) {
      return (
        <Card hover={false} padding="sm" className="group">
          <div className="flex items-center gap-4">
            <Link href={`/clients/${client.id}`} className="flex-1 min-w-0 flex items-center gap-4">
              <Avatar firstName={client.first_name} lastName={client.last_name} size="md" />

              <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 items-center">
                <div className="sm:col-span-1">
                  <p className="text-sm font-semibold text-pro-text truncate">
                    {client.first_name} {client.last_name}
                  </p>
                  <p className="text-xs text-pro-text-tertiary truncate">
                    {client.email || client.phone || "İletişim bilgisi yok"}
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 text-xs text-pro-text-secondary">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{lastContactAt ? formatRelative(lastContactAt) : "—"}</span>
                </div>

                <div className="hidden sm:flex items-center gap-1.5">
                  {analysisInfo?.status === "completed" && (
                    <Badge variant="success" size="sm">
                      Rapor Hazır
                    </Badge>
                  )}
                  {analysisInfo?.status === "pending" && (
                    <Badge variant="warning" size="sm">
                      Bekliyor
                    </Badge>
                  )}
                  {(!analysisInfo || analysisInfo.status === "none") && (
                    <span className="text-xs text-pro-text-tertiary">Analiz yok</span>
                  )}
                </div>

                <div className="hidden sm:flex items-center justify-end gap-2">
                  <Badge variant={(statusInfo?.color as "success" | "warning" | "muted") || "muted"} dot>
                    {statusInfo?.label || client.status}
                  </Badge>
                  {needsAttention && (
                    <div
                      className="h-5 w-5 rounded-full bg-pro-warning-light flex items-center justify-center"
                      title="14+ gün temas yok"
                    >
                      <AlertCircle className="h-3 w-3 text-pro-warning" />
                    </div>
                  )}
                </div>
              </div>
            </Link>

            <div className="shrink-0 pl-2 border-l border-pro-border">
              <ClientRowActions
                client={client}
                onSetStatus={rowActions.onSetStatus}
                onDelete={rowActions.onDelete}
              />
            </div>
          </div>
        </Card>
      );
    }

    return (
      <Link href={`/clients/${client.id}`}>
        <Card hover padding="sm" className="group">
          <div className="flex items-center gap-4">
            <Avatar firstName={client.first_name} lastName={client.last_name} size="md" />

            <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 items-center">
              <div className="sm:col-span-1">
                <p className="text-sm font-semibold text-pro-text truncate">
                  {client.first_name} {client.last_name}
                </p>
                <p className="text-xs text-pro-text-tertiary truncate">
                  {client.email || client.phone || "İletişim bilgisi yok"}
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-xs text-pro-text-secondary">
                <Clock className="h-3.5 w-3.5" />
                <span>{lastContactAt ? formatRelative(lastContactAt) : "—"}</span>
              </div>

              <div className="hidden sm:flex items-center gap-1.5">
                {analysisInfo?.status === "completed" && (
                  <Badge variant="success" size="sm">
                    Rapor Hazır
                  </Badge>
                )}
                {analysisInfo?.status === "pending" && (
                  <Badge variant="warning" size="sm">
                    Bekliyor
                  </Badge>
                )}
                {(!analysisInfo || analysisInfo.status === "none") && (
                  <span className="text-xs text-pro-text-tertiary">Analiz yok</span>
                )}
              </div>

              <div className="hidden sm:flex items-center justify-end gap-2">
                <Badge variant={(statusInfo?.color as "success" | "warning" | "muted") || "muted"} dot>
                  {statusInfo?.label || client.status}
                </Badge>
                {needsAttention && (
                  <div
                    className="h-5 w-5 rounded-full bg-pro-warning-light flex items-center justify-center"
                    title="14+ gün temas yok"
                  >
                    <AlertCircle className="h-3 w-3 text-pro-warning" />
                  </div>
                )}
              </div>
            </div>

            <ChevronRight className="h-4 w-4 text-pro-text-tertiary group-hover:text-pro-primary transition-colors shrink-0" />
          </div>
        </Card>
      </Link>
    );
  }

  /* ============================================================
     DESKTOP CARD VIEW - Mevcut kart görünümü (değiştirilmedi)
     ============================================================ */
  return (
    <Link href={`/clients/${client.id}`}>
      <Card hover padding="md" className="group h-full">
        <div className="flex flex-col h-full">
          <div className="flex items-start gap-3 mb-3">
            <Avatar firstName={client.first_name} lastName={client.last_name} size="lg" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-pro-text truncate">
                  {client.first_name} {client.last_name}
                </p>
                {needsAttention && (
                  <div
                    className="h-4 w-4 rounded-full bg-pro-warning-light flex items-center justify-center shrink-0"
                    title="14+ gün temas yok"
                  >
                    <AlertCircle className="h-2.5 w-2.5 text-pro-warning" />
                  </div>
                )}
              </div>
              <p className="text-xs text-pro-text-tertiary truncate mt-0.5">
                {client.email || client.phone || "İletişim bilgisi yok"}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant={(statusInfo?.color as "success" | "warning" | "muted") || "muted"}
                  size="sm"
                  dot
                >
                  {statusInfo?.label || client.status}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-pro-text-secondary">
              <Clock className="h-3.5 w-3.5 text-pro-text-tertiary" />
              <span>Son temas: {lastContactAt ? formatRelative(lastContactAt) : "—"}</span>
            </div>

            {analysisInfo && analysisInfo.status !== "none" && (
              <div className="flex items-center gap-2 text-pro-text-secondary">
                <FileText className="h-3.5 w-3.5 text-pro-text-tertiary" />
                <span>
                  {analysisInfo.status === "completed"
                    ? `Rapor hazır${analysisInfo.lastCompletedAt ? ` · ${formatRelative(analysisInfo.lastCompletedAt)}` : ""}`
                    : `${analysisInfo.pendingCount || 1} analiz bekliyor`}
                </span>
              </div>
            )}

            {appointmentInfo?.hasUpcoming && (
              <div className="flex items-center gap-2 text-pro-text-secondary">
                <Calendar className="h-3.5 w-3.5 text-pro-text-tertiary" />
                <span>Randevu: {appointmentInfo.nextDate}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-pro-border">
            {onSendAnalysis && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSendAnalysis();
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--pro-analysis)] hover:bg-[var(--pro-analysis-light)] transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
                Analiz Gönder
              </button>
            )}
            {onScheduleAppointment && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onScheduleAppointment();
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--pro-appointment)] hover:bg-[var(--pro-appointment-light)] transition-colors"
              >
                <Calendar className="h-3.5 w-3.5" />
                Randevu Ekle
              </button>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
