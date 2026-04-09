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
import { Calendar, Plus, Clock, CalendarDays, List, Loader2 } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
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
      <main className="flex-1 min-h-0 flex flex-col p-3 sm:p-5 lg:p-6 bg-[#FAFAF7]">
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
    </>
  );
}
