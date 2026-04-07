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
import {
  Users,
  Calendar,
  FlaskConical,
  Eye,
  Share2,
  Copy,
  Mail,
  MessageCircle,
  Check,
  Plus,
} from "lucide-react";
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
import Link from "next/link";

const STAT_CARDS = [
  {
    key: "todays_appointments" as const,
    label: "Bugünkü Randevu",
    icon: Calendar,
    href: "/appointments",
    gradient: "from-[#FDF5EE] to-[#F8EBD9]",
    iconBg: "bg-[#C4956A]",
    iconColor: "text-white",
    accentBar: "bg-[#C4956A]",
    valueColor: "text-[#8B5E3C]",
  },
  {
    key: "pending_analyses" as const,
    label: "İşlenmemiş Analizler",
    icon: FlaskConical,
    href: "/tests",
    gradient: "from-[#EBF0F8] to-[#D8E3F1]",
    iconBg: "bg-[#5B7BA0]",
    iconColor: "text-white",
    accentBar: "bg-[#5B7BA0]",
    valueColor: "text-[#3A5270]",
  },
  {
    key: "active_clients" as const,
    label: "Aktif Danışan",
    icon: Users,
    href: "/clients",
    gradient: "from-[#E8F0EB] to-[#D4E5DA]",
    iconBg: "bg-[#5B7B6A]",
    iconColor: "text-white",
    accentBar: "bg-[#5B7B6A]",
    valueColor: "text-[#3D5A4C]",
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
}: {
  testToken: string;
  clientName: string;
  professionalName: string;
  onClose: () => void;
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
    {
      icon: Mail,
      label: "E-posta Gönder",
      onClick: () => {
        const subject = encodeURIComponent("Karakter Analizi Testi");
        const body = encodeURIComponent(message);
        window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
        onClose();
      },
    },
  ];

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
  const { stats, upcomingAppointments, recentTests, loading, refresh } =
    useDashboard(initialData);
  const [shareOpenId, setShareOpenId] = useState<string | null>(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedApt, setSelectedApt] = useState<AppointmentSlim | null>(null);
  const [editApt, setEditApt] = useState<AppointmentSlim | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisSlim | null>(null);

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
      <main className="flex-1 p-3 sm:p-5 lg:p-6">
        <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-gradient-to-br from-[#5B7B6A]/20 to-[#5B7B6A]/8 rounded-2xl p-4 sm:p-5 space-y-4">
            <QuickStats stats={statCards} loading={loading} />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card padding="lg" accent="primary" variant="elevated">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-pro-text flex items-center gap-2">
                    <span className="h-4 w-0.5 rounded-full bg-pro-primary" />
                    Yaklaşan Randevular
                  </h3>
                  <Link
                    href="/appointments"
                    className="text-sm text-pro-primary hover:underline"
                  >
                    Tümü
                  </Link>
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
                  <EmptyState
                    icon={Calendar}
                    title="Henüz randevu yok"
                    description="İlk randevunuzu oluşturun"
                    actionLabel="Randevu Oluştur"
                    onAction={() => setShowAppointmentModal(true)}
                  />
                ) : (
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
                    <button
                      onClick={() => setShowAppointmentModal(true)}
                      className="flex items-center justify-center gap-1.5 w-full py-2 mt-1 text-xs font-medium text-pro-primary hover:bg-pro-primary-light rounded-lg transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Randevu Oluştur
                    </button>
                  </div>
                )}
              </Card>

              <Card padding="lg" accent="accent" variant="elevated">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-pro-text flex items-center gap-2">
                    <span className="h-4 w-0.5 rounded-full bg-pro-accent" />
                    Son Analizler
                  </h3>
                  <Link
                    href="/tests"
                    className="text-sm text-pro-primary hover:underline"
                  >
                    Tümü
                  </Link>
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
                ) : recentTests.length === 0 ? (
                  <EmptyState
                    icon={FlaskConical}
                    title="Henüz analiz yok"
                    description="İlk karakter analizinizi gönderin"
                    actionLabel="Analiz Gönder"
                    actionHref="/tests"
                  />
                ) : (
                  <div className="space-y-2">
                    {recentTests.slice(0, 4).map((test) => {
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
                              sent_via: test.sent_via,
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

              <NotesCard />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
