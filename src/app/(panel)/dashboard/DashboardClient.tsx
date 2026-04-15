"use client";

import { useState, useRef, useEffect } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Avatar } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";
import { QuickStats } from "@/components/dashboard";
import { NotesCard } from "@/components/dashboard/NotesCard";
import { CreateAppointmentModal } from "@/components/appointments";
import {
  AppointmentDetailModal,
  type AppointmentSlim,
} from "@/components/appointments/AppointmentDetailModal";
import { EditAppointmentModal } from "@/components/appointments/EditAppointmentModal";
import {
  AnalysisDetailModal,
  type AnalysisSlim,
} from "@/components/tests/AnalysisDetailModal";
import { SendTestModal } from "@/components/tests/SendTestModal";
import {
  Users,
  Calendar,
  FlaskConical,
  Eye,
  Share2,
  Copy,
  MessageCircle,
  Check,
  Plus,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useProContext } from "@/lib/context";
import {
  useDashboard,
  type DashboardInitialData,
} from "@/lib/hooks/useDashboard";
import {
  formatTime,
  formatRelative,
  formatDayLabel,
  generateWhatsAppLink,
  buildTestMessage,
} from "@/lib/utils";
import { toast } from "sonner";

const STAT_CARDS = [
  {
    key: "todays_appointments" as const,
    label: "Bugünkü Randevu",
    icon: Calendar,
    href: "/appointments",
    iconBg: "bg-[#5B7B6A]",
    iconColor: "text-white",
    valueColor: "text-pro-text",
  },
  {
    key: "active_clients" as const,
    label: "Aktif Danışan",
    icon: Users,
    href: "/clients",
    iconBg: "bg-[#5B7B6A]",
    iconColor: "text-white",
    valueColor: "text-pro-text",
  },
  {
    key: "pending_analyses" as const,
    label: "Bekleyen Analizler",
    icon: FlaskConical,
    href: "/tests",
    iconBg: "bg-[#D4856A]",
    iconColor: "text-white",
    valueColor: "text-pro-text",
  },
];

const STATUS_MAP: Record<
  string,
  { label: string; variant: "success" | "warning" | "info" | "danger" | "accent" }
> = {
  sent: { label: "Danışan Bekleniyor", variant: "warning" },
  started: { label: "Devam Ediyor", variant: "info" },
  completed: { label: "Analiz Hazır", variant: "accent" },
  reviewed: { label: "Tamamlandı", variant: "success" },
  expired: { label: "Süresi Doldu", variant: "danger" },
};

function SharePopover({
  testToken,
  clientName,
  professionalName,
  onClose,
  isMobile = false,
}: {
  testToken: string;
  clientName: string;
  professionalName: string;
  onClose: () => void;
  isMobile?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  const testLink = `${window.location.origin}/t/${testToken}`;
  const message = buildTestMessage(clientName, professionalName, testLink);

  const actions = [
    {
      icon: copied ? Check : Copy,
      label: copied ? "Kopyalandı!" : "Linki Kopyala",
      onClick: async () => {
        await navigator.clipboard.writeText(testLink);
        setCopied(true);
        toast.success("Link kopyalandı!");
        setTimeout(() => onClose(), 800);
      },
      accent: copied,
    },
    {
      icon: MessageCircle,
      label: "WhatsApp ile Gönder",
      onClick: () => {
        window.open(generateWhatsAppLink("", message), "_blank");
        onClose();
      },
    },
  ];

  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/40 z-40 animate-in fade-in duration-200"
          onClick={onClose}
        />
        {/* Bottom Sheet */}
        <div
          ref={ref}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-xl pb-safe animate-in slide-in-from-bottom duration-200"
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>
          {/* Header */}
          <div className="px-4 pb-3 border-b border-pro-border">
            <h3 className="text-base font-semibold text-pro-text">Analizi Paylaş</h3>
          </div>
          {/* Actions */}
          <div className="p-2">
            {actions.map((a) => (
              <button
                key={a.label}
                onClick={a.onClick}
                className={`w-full flex items-center gap-3 px-4 py-4 text-sm rounded-xl transition-colors touch-manipulation ${
                  a.accent
                    ? "text-pro-success bg-pro-success-light/50"
                    : "text-pro-text active:bg-pro-surface-alt"
                }`}
              >
                <div className="h-10 w-10 rounded-full bg-pro-surface-alt flex items-center justify-center">
                  <a.icon className="h-5 w-5 shrink-0" />
                </div>
                <span className="font-medium">{a.label}</span>
              </button>
            ))}
          </div>
          {/* Cancel button */}
          <div className="p-4 pt-2">
            <button
              onClick={onClose}
              className="w-full py-3.5 text-sm font-semibold text-pro-text-secondary bg-pro-surface-alt rounded-xl active:bg-pro-border transition-colors touch-manipulation"
            >
              İptal
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-1 z-50 w-52 bg-white rounded-xl shadow-lg border border-pro-border py-1.5 animate-in fade-in slide-in-from-top-1 duration-150"
    >
      {actions.map((a) => (
        <button
          key={a.label}
          onClick={a.onClick}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors ${
            a.accent
              ? "text-pro-success bg-pro-success-light/50"
              : "text-pro-text-secondary hover:bg-pro-surface-alt hover:text-pro-text"
          }`}
        >
          <a.icon className="h-4 w-4 shrink-0" />
          {a.label}
        </button>
      ))}
    </div>
  );
}

interface DashboardClientProps {
  initialData: DashboardInitialData;
}

export function DashboardClient({ initialData }: DashboardClientProps) {
  const { professional } = useProContext();
  const { stats, upcomingAppointments, pendingTests, loading, refresh } =
    useDashboard(initialData);
  const [shareOpenId, setShareOpenId] = useState<string | null>(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedApt, setSelectedApt] = useState<AppointmentSlim | null>(null);
  const [editApt, setEditApt] = useState<AppointmentSlim | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisSlim | null>(null);
  const [showSendTestModal, setShowSendTestModal] = useState(false);

  const statCards = STAT_CARDS.map((card) => ({
    ...card,
    value: stats[card.key],
  }));

  return (
    <>
      <TopBar showGreeting onTestSent={refresh} />
      <CreateAppointmentModal
        open={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        onCreated={refresh}
      />
      <AppointmentDetailModal
        appointment={selectedApt}
        onClose={() => setSelectedApt(null)}
        onUpdated={() => {
          setSelectedApt(null);
          refresh();
        }}
        onEditRequest={(apt) => {
          setSelectedApt(null);
          setEditApt(apt);
        }}
      />
      <EditAppointmentModal
        appointment={editApt}
        onClose={() => setEditApt(null)}
        onUpdated={() => {
          setEditApt(null);
          refresh();
        }}
      />
      <AnalysisDetailModal
        analysis={selectedAnalysis}
        onClose={() => setSelectedAnalysis(null)}
        onDeleted={() => {
          setSelectedAnalysis(null);
          refresh();
        }}
      />
      <SendTestModal
        open={showSendTestModal}
        onClose={() => setShowSendTestModal(false)}
        onSent={refresh}
      />
      {/* Desktop Layout */}
      <main className="desktop-only flex-1 p-5 lg:p-6">
        <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="space-y-4">
            <QuickStats stats={statCards} loading={loading} />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card padding="lg" variant="elevated">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-pro-text">
                    Yaklaşan Randevular
                  </h3>
                  <button
                    onClick={() => setShowAppointmentModal(true)}
                    className="flex items-center gap-1 text-sm text-pro-primary hover:text-pro-primary-hover font-semibold"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Oluştur
                  </button>
                </div>
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-3 w-40" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : upcomingAppointments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="h-14 w-14 rounded-2xl bg-pro-primary-light flex items-center justify-center mb-4">
                      <Calendar className="h-6 w-6 text-pro-primary" />
                    </div>
                    <p className="text-sm font-medium text-pro-text mb-1">Takviminiz boş</p>
                    <p className="text-xs text-pro-text-tertiary">Kendinize zaman ayırın veya yeni randevu oluşturun</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {upcomingAppointments.slice(0, 4).map((apt) => (
                      <button
                        key={apt.id}
                        onClick={() =>
                          setSelectedApt({
                            id: apt.id,
                            client_id: apt.client_id,
                            starts_at: apt.starts_at,
                            duration_minutes: apt.duration_minutes,
                            note: apt.note ?? null,
                            status: apt.status ?? "scheduled",
                            client: apt.client,
                          })
                        }
                        className="flex items-center gap-3 p-2.5 rounded-lg bg-pro-surface-alt w-full text-left hover:bg-pro-primary-light transition-colors"
                      >
                        <Avatar
                          firstName={apt.client?.first_name || "?"}
                          lastName={apt.client?.last_name || ""}
                          size="sm"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-pro-text truncate">
                            {apt.client?.first_name} {apt.client?.last_name}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-medium text-pro-text">
                            {formatTime(apt.starts_at)}
                          </p>
                          <p className="text-xs text-pro-text-tertiary">
                            {formatDayLabel(apt.starts_at)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </Card>

              <NotesCard />

              <Card padding="lg" variant="elevated">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-pro-text">
                    Bekleyen Analizler
                  </h3>
                  <button
                    onClick={() => setShowSendTestModal(true)}
                    className="flex items-center gap-1 text-sm text-[#D4856A] hover:text-[#C97B5D] font-semibold"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    MindTest Gönder
                  </button>
                </div>
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-3 w-40" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : pendingTests.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="h-14 w-14 rounded-2xl bg-pro-success-light flex items-center justify-center mb-4">
                      <Check className="h-6 w-6 text-pro-success" />
                    </div>
                    <p className="text-sm font-medium text-pro-text mb-1">Bekleyen analiz yok</p>
                    <p className="text-xs text-pro-text-tertiary">Bekleyen test veya analiz bulunmuyor</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {pendingTests.slice(0, 4).map((test) => {
                      const s = STATUS_MAP[test.status] || STATUS_MAP.sent;
                      const canViewResults = test.status === "completed" || test.status === "reviewed";
                      const isPending =
                        test.status !== "completed" &&
                        test.status !== "reviewed" &&
                        test.status !== "expired";
                      const profName = professional
                        ? `${professional.first_name} ${professional.last_name}`
                        : "";

                      return (
                        <button
                          key={test.id}
                          onClick={() =>
                            setSelectedAnalysis({
                              id: test.id,
                              token: test.token,
                              status: test.status,
                              created_at: test.created_at,
                              started_at: test.started_at,
                              completed_at: test.completed_at,
                              client: test.client,
                            })
                          }
                          className="flex items-center gap-2 p-2.5 rounded-lg bg-pro-surface-alt w-full text-left hover:bg-pro-primary-light transition-colors"
                        >
                          <Avatar
                            firstName={test.client?.first_name || "?"}
                            lastName={test.client?.last_name || ""}
                            size="sm"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-pro-text truncate">
                              {test.client?.first_name} {test.client?.last_name}
                            </p>
                            <p className="text-xs text-pro-text-tertiary">
                              {formatRelative(test.created_at)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Badge variant={s.variant} size="sm" dot>
                              {s.label}
                            </Badge>
                            {canViewResults && (
                              <span
                                className="p-1 rounded-lg text-pro-primary"
                                title="Sonuçları Gör"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </span>
                            )}
                            {isPending && (
                              <div className="relative">
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShareOpenId(
                                      shareOpenId === test.id ? null : test.id
                                    );
                                  }}
                                  className="p-1 rounded-lg text-pro-text-tertiary hover:text-pro-primary hover:bg-pro-primary-light transition-colors cursor-pointer"
                                  title="Analizi Paylaş"
                                >
                                  <Share2 className="h-3.5 w-3.5" />
                                </span>
                                {shareOpenId === test.id && (
                                  <SharePopover
                                    testToken={test.token}
                                    clientName={test.client?.first_name || ""}
                                    professionalName={profName}
                                    onClose={() => setShareOpenId(null)}
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Layout */}
      <main className="mobile-only flex-1 p-3 pb-safe">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="space-y-4">
            <QuickStats stats={statCards} loading={loading} />

            {/* Yaklaşan Randevular - Mobile */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-pro-text text-sm">
                  Yaklaşan Randevular
                </h3>
                <button
                  onClick={() => setShowAppointmentModal(true)}
                  className="flex items-center gap-1.5 text-xs text-pro-primary font-semibold min-h-[44px] min-w-[44px] px-3 -mr-3 touch-manipulation active:bg-pro-primary-light rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Oluştur
                </button>
              </div>
              {loading ? (
                <div className="space-y-2">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="mobile-card flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : upcomingAppointments.length === 0 ? (
                <div className="mobile-empty-state py-8">
                  <div className="h-12 w-12 rounded-xl bg-pro-primary-light flex items-center justify-center mb-3">
                    <Calendar className="h-5 w-5 text-pro-primary" />
                  </div>
                  <p className="text-sm font-medium text-pro-text">Takviminiz boş</p>
                  <p className="text-xs text-pro-text-tertiary mt-0.5">Yeni randevu oluşturun</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    {upcomingAppointments.slice(0, 3).map((apt) => (
                      <button
                        key={apt.id}
                        onClick={() =>
                          setSelectedApt({
                            id: apt.id,
                            client_id: apt.client_id,
                            starts_at: apt.starts_at,
                            duration_minutes: apt.duration_minutes,
                            note: apt.note ?? null,
                            status: apt.status ?? "scheduled",
                            client: apt.client,
                          })
                        }
                        className="mobile-list-item rounded-xl border border-pro-border bg-pro-surface w-full text-left active:bg-pro-surface-alt touch-manipulation"
                      >
                        <Avatar
                          firstName={apt.client?.first_name || "?"}
                          lastName={apt.client?.last_name || ""}
                          size="sm"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-pro-text line-clamp-1">
                            {apt.client?.first_name} {apt.client?.last_name}
                          </p>
                          <p className="text-xs text-pro-text-tertiary">
                            {formatDayLabel(apt.starts_at)}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-semibold text-pro-text">
                            {formatTime(apt.starts_at)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                  {upcomingAppointments.length > 3 && (
                    <Link 
                      href="/appointments" 
                      className="flex items-center justify-center gap-1.5 mt-3 py-2 text-sm font-medium text-pro-primary active:text-pro-primary-hover touch-manipulation"
                    >
                      Tümünü Gör ({upcomingAppointments.length})
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  )}
                </>
              )}
            </section>

            {/* Bekleyen Analizler - Mobile */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-pro-text text-sm">
                  Bekleyen Analizler
                </h3>
                <button
                  onClick={() => setShowSendTestModal(true)}
                  className="flex items-center gap-1.5 text-xs text-[#D4856A] font-semibold min-h-[44px] min-w-[44px] px-3 -mr-3 touch-manipulation active:bg-[#D4856A]/10 rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Gönder
                </button>
              </div>
              {loading ? (
                <div className="space-y-2">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="mobile-card flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : pendingTests.length === 0 ? (
                <div className="mobile-empty-state py-8">
                  <div className="h-12 w-12 rounded-xl bg-pro-success-light flex items-center justify-center mb-3">
                    <Check className="h-5 w-5 text-pro-success" />
                  </div>
                  <p className="text-sm font-medium text-pro-text">Bekleyen analiz yok</p>
                  <p className="text-xs text-pro-text-tertiary mt-0.5">Tüm testler tamamlandı</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    {pendingTests.slice(0, 3).map((test) => {
                      const s = STATUS_MAP[test.status] || STATUS_MAP.sent;
                      const canViewResults = test.status === "completed" || test.status === "reviewed";
                      const isPending =
                        test.status !== "completed" &&
                        test.status !== "reviewed" &&
                        test.status !== "expired";
                      const profName = professional
                        ? `${professional.first_name} ${professional.last_name}`
                        : "";

                      return (
                        <button
                          key={test.id}
                          onClick={() =>
                            setSelectedAnalysis({
                              id: test.id,
                              token: test.token,
                              status: test.status,
                              created_at: test.created_at,
                              started_at: test.started_at,
                              completed_at: test.completed_at,
                              client: test.client,
                            })
                          }
                          className="mobile-list-item rounded-xl border border-pro-border bg-pro-surface w-full text-left active:bg-pro-surface-alt touch-manipulation"
                        >
                          <Avatar
                            firstName={test.client?.first_name || "?"}
                            lastName={test.client?.last_name || ""}
                            size="sm"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-pro-text line-clamp-1">
                              {test.client?.first_name} {test.client?.last_name}
                            </p>
                            <p className="text-xs text-pro-text-tertiary">
                              {formatRelative(test.created_at)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Badge variant={s.variant} size="sm" dot>
                              {s.label}
                            </Badge>
                            {canViewResults && (
                              <span className="p-1.5 rounded-lg text-pro-primary">
                                <Eye className="h-4 w-4" />
                              </span>
                            )}
                            {isPending && (
                              <div className="relative">
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShareOpenId(
                                      shareOpenId === test.id ? null : test.id
                                    );
                                  }}
                                  className="p-2 rounded-lg text-pro-text-tertiary active:text-pro-primary active:bg-pro-primary-light touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                                >
                                  <Share2 className="h-4 w-4" />
                                </span>
                                {shareOpenId === test.id && (
                                  <SharePopover
                                    testToken={test.token}
                                    clientName={test.client?.first_name || ""}
                                    professionalName={profName}
                                    onClose={() => setShareOpenId(null)}
                                    isMobile={true}
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {pendingTests.length > 3 && (
                    <Link 
                      href="/tests" 
                      className="flex items-center justify-center gap-1.5 mt-3 py-2 text-sm font-medium text-[#D4856A] active:text-[#C97B5D] touch-manipulation"
                    >
                      Tümünü Gör ({pendingTests.length})
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  )}
                </>
              )}
            </section>

            {/* Notes - Mobile */}
            <section>
              <NotesCard />
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
