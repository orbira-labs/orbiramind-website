"use client";

import { clsx } from "clsx";
import { CLIENT_STATUSES } from "@/lib/constants";
import { 
  Filter, 
  FileText, 
  Calendar, 
  Clock, 
  AlertCircle,
  X
} from "lucide-react";

export type FilterType = "all" | "active" | "passive" | "archived" | "pending_analysis" | "report_ready" | "upcoming_appointment" | "no_contact_7d";

interface FilterOption {
  id: FilterType;
  label: string;
  icon?: typeof Filter;
  color?: string;
}

const EXTENDED_FILTERS: FilterOption[] = [
  { id: "pending_analysis", label: "Analiz Bekleyen", icon: FileText, color: "text-pro-warning" },
  { id: "report_ready", label: "Raporu Hazır", icon: FileText, color: "text-pro-success" },
  { id: "upcoming_appointment", label: "Randevusu Yaklaşan", icon: Calendar, color: "text-pro-accent" },
  { id: "no_contact_7d", label: "7+ Gün Temas Yok", icon: AlertCircle, color: "text-pro-danger" },
];

interface ClientFiltersProps {
  statusFilter: string;
  onStatusChange: (status: string) => void;
  extendedFilters: FilterType[];
  onExtendedFilterToggle: (filter: FilterType) => void;
  showExtended?: boolean;
  onToggleExtended?: () => void;
}

export function ClientFilters({
  statusFilter,
  onStatusChange,
  extendedFilters,
  onExtendedFilterToggle,
  showExtended = false,
  onToggleExtended,
}: ClientFiltersProps) {
  const hasActiveExtended = extendedFilters.length > 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex gap-1 bg-pro-surface-alt rounded-lg p-1">
          <button
            onClick={() => onStatusChange("all")}
            className={clsx(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
              statusFilter === "all" 
                ? "bg-pro-surface text-pro-text shadow-[var(--pro-shadow-sm)]" 
                : "text-pro-text-secondary hover:text-pro-text"
            )}
          >
            Tümü
          </button>
          {CLIENT_STATUSES.map((s) => (
            <button
              key={s.id}
              onClick={() => onStatusChange(s.id)}
              className={clsx(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                statusFilter === s.id 
                  ? "bg-pro-surface text-pro-text shadow-[var(--pro-shadow-sm)]" 
                  : "text-pro-text-secondary hover:text-pro-text"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        {onToggleExtended && (
          <button
            onClick={onToggleExtended}
            className={clsx(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
              showExtended || hasActiveExtended
                ? "bg-pro-primary-light text-pro-primary"
                : "bg-pro-surface-alt text-pro-text-secondary hover:text-pro-text"
            )}
          >
            <Filter className="h-3.5 w-3.5" />
            Filtreler
            {hasActiveExtended && (
              <span className="h-4 w-4 rounded-full bg-pro-primary text-white text-[10px] flex items-center justify-center">
                {extendedFilters.length}
              </span>
            )}
          </button>
        )}
      </div>

      {showExtended && (
        <div className="flex items-center gap-2 flex-wrap p-3 bg-pro-surface-alt rounded-xl">
          {EXTENDED_FILTERS.map((filter) => {
            const Icon = filter.icon || Filter;
            const isActive = extendedFilters.includes(filter.id);
            
            return (
              <button
                key={filter.id}
                onClick={() => onExtendedFilterToggle(filter.id)}
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all",
                  isActive
                    ? "bg-pro-surface shadow-[var(--pro-shadow-sm)] text-pro-text"
                    : "text-pro-text-secondary hover:text-pro-text hover:bg-pro-surface/50"
                )}
              >
                <Icon className={clsx("h-3.5 w-3.5", isActive && filter.color)} />
                {filter.label}
                {isActive && (
                  <X className="h-3 w-3 ml-1 opacity-50 hover:opacity-100" />
                )}
              </button>
            );
          })}
          
          {hasActiveExtended && (
            <button
              onClick={() => extendedFilters.forEach(f => onExtendedFilterToggle(f))}
              className="text-xs text-pro-text-tertiary hover:text-pro-danger transition-colors ml-auto"
            >
              Filtreleri Temizle
            </button>
          )}
        </div>
      )}
    </div>
  );
}
