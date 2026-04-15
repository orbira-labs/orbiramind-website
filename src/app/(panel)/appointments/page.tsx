"use client";

import { useState } from "react";
import { useAppointments } from "@/lib/hooks/useAppointments";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { CreateAppointmentModal } from "@/components/appointments";
import { AppointmentDetailModal, type AppointmentSlim } from "@/components/appointments/AppointmentDetailModal";
import { EditAppointmentModal } from "@/components/appointments/EditAppointmentModal";
import { AppointmentCalendar } from "@/components/appointments/AppointmentCalendar";
import { Calendar, Plus, Clock, CalendarDays, List, Loader2, ChevronRight } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { clsx } from "clsx";

type ViewMode = "calendar" | "list";
type Filter = "upcoming" | "past" | "all";

export default function AppointmentsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [filter, setFilter] = useState<Filter>("upcoming");
  const { appointments, counts, loading, loadingMore, hasMore, refresh, loadMore } = useAppointments(filter);
  const [showModal, setShowModal] = useState(false);
  const [selectedApt, setSelectedApt] = useState<AppointmentSlim | null>(null);
  const [editApt, setEditApt] = useState<AppointmentSlim | null>(null);
  const [preselectedDate, setPreselectedDate] = useState<Date | undefined>(undefined);

  const handleCreateAppointment = (date?: Date) => {
    setPreselectedDate(date);
    setShowModal(true);
  };

  return (
    <>
      <TopBar title="Randevular" />
      <CreateAppointmentModal
        open={showModal}
        onClose={() => { setShowModal(false); setPreselectedDate(undefined); }}
        onCreated={refresh}
        preselectedDate={preselectedDate}
      />
      <AppointmentDetailModal
        appointment={selectedApt}
        onClose={() => setSelectedApt(null)}
        onUpdated={() => { setSelectedApt(null); refresh(); }}
        onEditRequest={(apt) => { setSelectedApt(null); setEditApt(apt); }}
      />
      <EditAppointmentModal
        appointment={editApt}
        onClose={() => setEditApt(null)}
        onUpdated={() => { setEditApt(null); refresh(); }}
      />

      {/* ══════════════════════════════════════════════════════════
          DESKTOP VIEW - Takvim grid görünümü
          ══════════════════════════════════════════════════════════ */}
      <main className="desktop-only flex-1 min-h-0 flex flex-col p-3 sm:p-5 lg:p-6 bg-[#FAFAF7]">
        <div className="w-full mx-auto max-w-6xl flex-1 min-h-0 flex flex-col">
          <div className="flex-1 min-h-0 flex flex-col">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold text-pro-text flex items-center gap-2">
                  <span className="h-5 w-1 rounded-full bg-[var(--pro-appointment)]" />
                  Randevular
                </h1>
                
                {/* View Mode Toggle */}
                <div className="flex gap-1 bg-pro-surface rounded-xl p-1 shadow-[0_1px_2px_rgba(0,0,0,0.03)] border border-pro-border/50">
                    <button
                      onClick={() => setViewMode("calendar")}
                      className={clsx(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                        viewMode === "calendar"
                          ? "bg-pro-primary text-white shadow-sm"
                          : "text-pro-text-secondary hover:text-pro-text hover:bg-pro-surface-alt"
                      )}
                    >
                      <CalendarDays className="h-4 w-4" />
                      Takvim
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={clsx(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                        viewMode === "list"
                          ? "bg-pro-primary text-white shadow-sm"
                          : "text-pro-text-secondary hover:text-pro-text hover:bg-pro-surface-alt"
                      )}
                    >
                      <List className="h-4 w-4" />
                      Liste
                    </button>
                </div>
              </div>

              <button
                onClick={() => handleCreateAppointment()}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-pro-primary hover:bg-pro-primary-hover text-white text-sm font-medium transition-all shadow-sm hover:shadow-md"
              >
                <Plus className="h-4 w-4" />
                Randevu Ekle
              </button>
            </div>

            {/* Calendar View */}
            {viewMode === "calendar" && (
              <div className="flex-1 min-h-0">
                <AppointmentCalendar
                  onSelectAppointment={setSelectedApt}
                  onCreateAppointment={handleCreateAppointment}
                  onRefreshNeeded={refresh}
                />
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <Card padding="lg" variant="elevated">
                {/* List Filter */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex gap-1 bg-pro-surface-alt rounded-lg p-1">
                    {(["upcoming", "past", "all"] as Filter[]).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={clsx(
                          "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                          filter === f
                            ? "bg-pro-surface text-pro-text shadow-sm"
                            : "text-pro-text-secondary hover:text-pro-text"
                        )}
                      >
                        {f === "upcoming" ? `Yaklaşan (${counts.upcoming})` : f === "past" ? `Geçmiş (${counts.past})` : `Tümü (${counts.total})`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* List Content */}
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-pro-surface-alt">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-6 w-20" />
                      </div>
                    ))}
                  </div>
                ) : appointments.length === 0 ? (
                  <EmptyState
                    icon={Calendar}
                    title="Randevu yok"
                    description={
                      filter === "upcoming"
                        ? "Yaklaşan randevunuz bulunmuyor"
                        : "Randevu kaydınız bulunmuyor"
                    }
                    actionLabel="Randevu Ekle"
                    onAction={() => handleCreateAppointment()}
                  />
                ) : (
                  <div className="space-y-2">
                    {appointments.map((apt) => (
                      <button
                        key={apt.id}
                        type="button"
                        onClick={() => setSelectedApt(apt as AppointmentSlim)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg bg-pro-surface-alt hover:bg-pro-primary-light transition-colors text-left group"
                      >
                        <Avatar
                          firstName={apt.client?.first_name || "?"}
                          lastName={apt.client?.last_name || ""}
                          size="sm"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-pro-text">
                            {apt.client?.first_name} {apt.client?.last_name}
                          </p>
                          <p className="text-xs text-pro-text-tertiary">{apt.duration_minutes} dk</p>
                        </div>
                        <div className="text-right shrink-0 flex items-center gap-3">
                          <div>
                            <p className="text-sm font-medium text-pro-text group-hover:text-pro-primary transition-colors flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {formatDateTime(apt.starts_at)}
                            </p>
                          </div>
                          <Badge
                            variant={
                              apt.status === "completed"
                                ? "success"
                                : apt.status === "cancelled"
                                  ? "danger"
                                  : "info"
                            }
                            size="sm"
                          >
                            {apt.status === "scheduled"
                              ? "Planlandı"
                              : apt.status === "completed"
                                ? "Tamamlandı"
                                : "İptal"}
                          </Badge>
                        </div>
                      </button>
                    ))}
                    
                    {/* Load More Button */}
                    {hasMore && (
                      <button
                        onClick={loadMore}
                        disabled={loadingMore}
                        className="w-full py-3 mt-2 text-sm font-medium text-pro-text-secondary hover:text-pro-text hover:bg-pro-surface-alt rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {loadingMore ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Yükleniyor...
                          </>
                        ) : (
                          "Daha Fazla Yükle"
                        )}
                      </button>
                    )}
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* ══════════════════════════════════════════════════════════
          MOBILE VIEW - Liste görünümü ve kompakt takvim
          ══════════════════════════════════════════════════════════ */}
      <main className="mobile-only flex-1 min-h-0 flex flex-col bg-[#FAFAF7]">
        {/* Mobile Header */}
        <div className="mobile-section-header bg-[#FAFAF7]">
          <h1 className="text-lg font-bold text-pro-text flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-[var(--pro-appointment)]" />
            Randevular
          </h1>
        </div>

        {/* Mobile Filter Chips */}
        <div className="px-4 pb-3">
          <div className="mobile-scroll-snap gap-2 pb-1">
            {(["upcoming", "past", "all"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={clsx(
                  "mobile-chip touch-manipulation min-h-[36px] px-4",
                  filter === f && "mobile-chip-active"
                )}
              >
                {f === "upcoming" ? `Yaklaşan (${counts.upcoming})` : f === "past" ? `Geçmiş (${counts.past})` : `Tümü (${counts.total})`}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-24">
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="mobile-card flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-5 w-5" />
                </div>
              ))}
            </div>
          ) : appointments.length === 0 ? (
            <div className="mobile-empty-state">
              <div className="h-16 w-16 rounded-full bg-pro-appointment-light flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-pro-appointment" />
              </div>
              <h3 className="text-base font-semibold text-pro-text mb-1">Randevu yok</h3>
              <p className="text-sm text-pro-text-secondary mb-4">
                {filter === "upcoming"
                  ? "Yaklaşan randevunuz bulunmuyor"
                  : "Randevu kaydınız bulunmuyor"}
              </p>
              <button
                onClick={() => handleCreateAppointment()}
                className="mobile-btn min-h-[48px] bg-pro-primary text-white"
              >
                <Plus className="h-5 w-5" />
                Randevu Ekle
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {appointments.map((apt) => {
                const dateObj = new Date(apt.starts_at);
                const dayNumber = format(dateObj, "d", { locale: tr });
                const monthShort = format(dateObj, "MMM", { locale: tr });
                const timeLabel = format(dateObj, "HH:mm", { locale: tr });
                
                return (
                  <button
                    key={apt.id}
                    type="button"
                    onClick={() => setSelectedApt(apt as AppointmentSlim)}
                    className="mobile-card w-full flex items-center gap-3 touch-manipulation active:scale-[0.98] transition-transform"
                  >
                    {/* Date Badge */}
                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-pro-appointment-light">
                      <span className="text-sm font-bold text-pro-appointment leading-none">{dayNumber}</span>
                      <span className="text-[11px] font-semibold text-pro-appointment/70 uppercase">{monthShort}</span>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-semibold text-pro-text truncate">
                        {apt.client?.first_name} {apt.client?.last_name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-pro-text-secondary flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {timeLabel}
                        </span>
                        <span className="text-xs text-pro-text-tertiary">·</span>
                        <span className="text-xs text-pro-text-tertiary">{apt.duration_minutes} dk</span>
                      </div>
                    </div>
                    
                    {/* Status & Arrow */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant={
                          apt.status === "completed"
                            ? "success"
                            : apt.status === "cancelled"
                              ? "danger"
                              : "info"
                        }
                        size="sm"
                      >
                        {apt.status === "scheduled"
                          ? "Planlandı"
                          : apt.status === "completed"
                            ? "Tamamlandı"
                            : "İptal"}
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-pro-text-tertiary" />
                    </div>
                  </button>
                );
              })}
              
              {/* Load More Button */}
              {hasMore && (
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="w-full py-4 text-sm font-medium text-pro-text-secondary flex items-center justify-center gap-2 disabled:opacity-50 touch-manipulation"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Yükleniyor...
                    </>
                  ) : (
                    "Daha Fazla Yükle"
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Mobile FAB */}
        <button
          onClick={() => handleCreateAppointment()}
          className="mobile-fab bg-pro-primary text-white touch-manipulation active:scale-95 transition-transform"
        >
          <Plus className="h-6 w-6" />
        </button>
      </main>
    </>
  );
}
