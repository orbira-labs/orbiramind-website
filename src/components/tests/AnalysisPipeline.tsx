"use client";

import { clsx } from "clsx";

interface PipelineStatus {
  id: string;
  label: string;
  color: "warning" | "info" | "success" | "danger" | "muted";
  count: number;
}

interface AnalysisPipelineProps {
  statuses: PipelineStatus[];
  activeStatus: string | null;
  onStatusClick: (status: string | null) => void;
}

const colorClasses = {
  warning: {
    bg: "bg-pro-warning-light",
    text: "text-pro-warning",
    border: "border-pro-warning",
    dot: "bg-pro-warning",
  },
  info: {
    bg: "bg-pro-info-light",
    text: "text-pro-info",
    border: "border-pro-info",
    dot: "bg-pro-info",
  },
  success: {
    bg: "bg-pro-success-light",
    text: "text-pro-success",
    border: "border-pro-success",
    dot: "bg-pro-success",
  },
  danger: {
    bg: "bg-pro-danger-light",
    text: "text-pro-danger",
    border: "border-pro-danger",
    dot: "bg-pro-danger",
  },
  muted: {
    bg: "bg-pro-surface-alt",
    text: "text-pro-text-secondary",
    border: "border-pro-border",
    dot: "bg-pro-text-tertiary",
  },
};

export function AnalysisPipeline({ statuses, activeStatus, onStatusClick }: AnalysisPipelineProps) {
  const total = statuses.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-pro-text">Analiz Durumları</h3>
        {activeStatus && (
          <button
            onClick={() => onStatusClick(null)}
            className="text-xs text-pro-primary hover:underline"
          >
            Filtreyi Temizle
          </button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
        <button
          onClick={() => onStatusClick(null)}
          className={clsx(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all shrink-0",
            activeStatus === null
              ? "bg-pro-primary-light border-pro-primary"
              : "bg-pro-surface border-pro-border hover:border-pro-border-strong"
          )}
        >
          <span className={clsx(
            "text-sm font-semibold",
            activeStatus === null ? "text-pro-primary" : "text-pro-text"
          )}>
            {total}
          </span>
          <span className={clsx(
            "text-xs",
            activeStatus === null ? "text-pro-primary" : "text-pro-text-secondary"
          )}>
            Toplam
          </span>
        </button>

        {statuses.map((status) => {
          const colors = colorClasses[status.color];
          const isActive = activeStatus === status.id;

          return (
            <button
              key={status.id}
              onClick={() => onStatusClick(status.id)}
              className={clsx(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all shrink-0",
                isActive
                  ? `${colors.bg} ${colors.border}`
                  : "bg-pro-surface border-pro-border hover:border-pro-border-strong"
              )}
            >
              <div className={clsx(
                "h-2 w-2 rounded-full",
                isActive ? colors.dot : "bg-pro-text-tertiary"
              )} />
              <span className={clsx(
                "text-sm font-semibold",
                isActive ? colors.text : "text-pro-text"
              )}>
                {status.count}
              </span>
              <span className={clsx(
                "text-xs",
                isActive ? colors.text : "text-pro-text-secondary"
              )}>
                {status.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
