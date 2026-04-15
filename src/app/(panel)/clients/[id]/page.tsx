"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useProContext } from "@/lib/context";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton, StatCardSkeleton, ListItemSkeleton } from "@/components/ui/Skeleton";
import {
  ArrowLeft,
  FileText,
  FlaskConical,
  Calendar,
  Plus,
  Eye,
  Pencil,
  Mail,
  Phone,
  Cake,
  User,
  Banknote,
  ChevronDown,
  ChevronUp,
  Wallet,
} from "lucide-react";
import { createClient as createSupabase } from "@/lib/supabase/client";
import { formatDate, formatDateTime, formatRelative, formatCurrency } from "@/lib/utils";
import { TEST_STATUSES, CLIENT_STATUSES, PAYMENT_METHODS } from "@/lib/constants";
import type {
  Client,
  ClientNote,
  TestInvitation,
  Appointment,
} from "@/lib/types";
import Link from "next/link";
import { clsx } from "clsx";
import { EditClientModal } from "@/components/clients/EditClientModal";
import { CreateSessionPackageModal } from "@/components/sessions/CreateSessionPackageModal";
import { AddPaymentModal } from "@/components/sessions/AddPaymentModal";
import { useSessionPackages } from "@/lib/hooks/useSessionPackages";

const GENDERS: Record<string, string> = {
  female: "Kadın",
  male: "Erkek",
  other: "Diğer",
  prefer_not_to_say: "Belirtilmemiş",
};

type Tab = "notes" | "appointments" | "sessions" | "tests";

const TABS: { id: Tab; label: string; icon: typeof FileText }[] = [
  { id: "notes", label: "Notlar", icon: FileText },
  { id: "appointments", label: "Randevular", icon: Calendar },
  { id: "sessions", label: "Seanslar", icon: Banknote },
  { id: "tests", label: "Analizler", icon: FlaskConical },
];

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { professional } = useProContext();

  const [client, setClient] = useState<Client | null>(null);
  const [notes, setNotes] = useState<ClientNote[]>([]);
  const [tests, setTests] = useState<TestInvitation[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [activeTab, setActiveTab] = useState<Tab>("notes");
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [paymentModalPkgId, setPaymentModalPkgId] = useState<string | null>(null);
  const [expandedPkg, setExpandedPkg] = useState<string | null>(null);
  
  const INITIAL_ITEMS_COUNT = 5;
  const [showAllTests, setShowAllTests] = useState(false);
  const [showAllAppointments, setShowAllAppointments] = useState(false);

  const {
    packages: sessionPackages,
    loading: sessionsLoading,
    fetchPackages: fetchSessionPackages,
    assignPackage,
    addPayment,
    getClientSummary,
    getPackagePayments,
    getPackageTransactions,
  } = useSessionPackages();

  useEffect(() => {
    async function fetchData() {
      const supabase = createSupabase();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const [
        { data: clientData },
        { data: notesData },
        { data: testsData },
        { data: appointmentsData },
      ] = await Promise.all([
        supabase
          .from("clients")
          .select("*")
          .eq("id", id)
          .eq("professional_id", user.id)
          .single(),
        supabase
          .from("client_notes")
          .select("*")
          .eq("client_id", id)
          .order("created_at", { ascending: false }),
        supabase
          .from("test_invitations")
          .select("*")
          .eq("client_id", id)
          .order("created_at", { ascending: false }),
        supabase
          .from("appointments")
          .select("*")
          .eq("client_id", id)
          .order("starts_at", { ascending: false }),
      ]);

      if (!clientData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setClient(clientData);
      setNotes(notesData || []);
      setTests(testsData || []);
      setAppointments(appointmentsData || []);
      setLoading(false);
    }

    fetchData();
  }, [id]);

  useEffect(() => {
    if (activeTab === "sessions" && id) {
      fetchSessionPackages(id);
    }
  }, [activeTab, id, fetchSessionPackages]);

  async function addNote() {
    if (!noteText.trim()) return;
    setSavingNote(true);
    try {
      const supabase = createSupabase();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("client_notes")
        .insert({
          client_id: id,
          professional_id: user!.id,
          content: noteText.trim(),
        })
        .select()
        .single();

      if (error) {
        toast.error("Not eklenemedi");
        return;
      }

      setNotes((prev) => [data, ...prev]);
      setNoteText("");
      toast.success("Not eklendi");
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setSavingNote(false);
    }
  }

  if (loading) {
    return (
      <>
        <TopBar title="Yükleniyor..." />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-5xl space-y-6">
            <Skeleton className="h-4 w-32" />
            <div className="bg-pro-surface rounded-xl border border-pro-border p-6 space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
            </div>
            <Skeleton className="h-10 w-full rounded-lg" />
            <div className="grid sm:grid-cols-3 gap-4">
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </div>
          </div>
        </main>
      </>
    );
  }

  if (notFound || !client) {
    return (
      <>
        <TopBar title="Danışan Bulunamadı" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-5xl">
            <EmptyState
              icon={FileText}
              title="Danışan bulunamadı"
              description="Bu danışan mevcut değil veya erişim yetkiniz yok"
              actionLabel="Danışanlara Dön"
              onAction={() => router.push("/clients")}
            />
          </div>
        </main>
      </>
    );
  }

  const statusInfo = CLIENT_STATUSES.find((s) => s.id === client.status);

  return (
    <>
      <TopBar title={`${client.first_name} ${client.last_name}`} showBackButton />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Desktop: Simple text link */}
          <Link
            href="/clients"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-pro-text-secondary hover:text-pro-text transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Danışanlara Dön
          </Link>
          
          {/* Mobile: Prominent back button */}
          <Link
            href="/clients"
            className="sm:hidden inline-flex items-center gap-2 px-3 py-2 -ml-1 rounded-lg text-sm font-medium text-pro-text-secondary active:bg-pro-surface-alt transition-colors touch-manipulation min-h-[44px]"
          >
            <ArrowLeft className="h-5 w-5" />
            Danışanlara Dön
          </Link>

          <div 
            className="rounded-2xl border border-pro-border-strong p-6"
            style={{ background: "linear-gradient(135deg, #EFEAE4 0%, #E5E0DB 50%, #DDD8D2 100%)" }}
          >
            {/* Başlık satırı */}
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-2xl font-bold text-pro-text tracking-tight">
                {client.first_name} {client.last_name}
              </h2>
              <span className={clsx(
                "text-xs font-medium px-2 py-0.5 rounded-full",
                client.status === "active" 
                  ? "bg-pro-success/10 text-pro-success" 
                  : "bg-pro-warning/10 text-pro-warning"
              )}>
                {statusInfo?.label}
              </span>
              <button
                onClick={() => setEditModalOpen(true)}
                className="flex items-center gap-1 text-pro-text-tertiary hover:text-pro-text text-xs transition-colors ml-auto"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Bilgiler ve Aksiyonlar yan yana */}
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Sol taraf - Kişi Bilgileri */}
              <div className="space-y-2 text-sm flex-1">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-pro-text-tertiary shrink-0" />
                  <span className="text-pro-text">{client.gender ? GENDERS[client.gender] : "—"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cake className="h-4 w-4 text-pro-text-tertiary shrink-0" />
                  <span className="text-pro-text">{client.birth_date ? formatDate(client.birth_date) : "—"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-pro-text-tertiary shrink-0" />
                  {client.phone ? (
                    <a 
                      href={`tel:${client.phone.replace(/\s/g, "")}`}
                      className="text-pro-text hover:text-pro-primary underline-offset-2 hover:underline transition-colors touch-manipulation"
                    >
                      {client.phone}
                    </a>
                  ) : (
                    <span className="text-pro-text">—</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-pro-text-tertiary shrink-0" />
                  {client.email ? (
                    <a 
                      href={`mailto:${client.email}`}
                      className="text-pro-text hover:text-pro-primary underline-offset-2 hover:underline transition-colors touch-manipulation"
                    >
                      {client.email}
                    </a>
                  ) : (
                    <span className="text-pro-text">—</span>
                  )}
                </div>
              </div>

              {/* Sağ taraf - Aksiyonlar 2x2 Grid */}
              <div className="grid grid-cols-2 gap-2.5 shrink-0 sm:w-[280px]">
                <button
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all bg-white/70 hover:bg-white/90 text-purple-600 border border-white/50 hover:border-purple-200/50 shadow-sm"
                >
                  <FlaskConical className="h-4 w-4" />
                  Test Gönder
                </button>
                <button
                  onClick={() => setActiveTab("notes")}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all bg-white/70 hover:bg-white/90 text-blue-600 border border-white/50 hover:border-blue-200/50 shadow-sm"
                >
                  <FileText className="h-4 w-4" />
                  Not Ekle
                </button>
                <button
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all bg-white/70 hover:bg-white/90 text-amber-600 border border-white/50 hover:border-amber-200/50 shadow-sm"
                >
                  <Calendar className="h-4 w-4" />
                  Randevu Ekle
                </button>
                <button
                  onClick={() => setSessionModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all bg-white/70 hover:bg-white/90 text-emerald-600 border border-white/50 hover:border-emerald-200/50 shadow-sm"
                >
                  <Banknote className="h-4 w-4" />
                  Seans Tanımla
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-1 bg-pro-surface-alt rounded-lg p-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors flex-1 justify-center",
                  activeTab === tab.id
                    ? "bg-pro-surface text-pro-text shadow-[var(--pro-shadow-sm)]"
                    : "text-pro-text-secondary hover:text-pro-text"
                )}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {activeTab === "tests" && (
            <div className="space-y-3">
              {tests.length === 0 ? (
                <EmptyState
                  icon={FlaskConical}
                  title="Analiz gönderilmemiş"
                  description="Bu danışana henüz analiz gönderilmemiş"
                  actionLabel="Analiz Gönder"
                  onAction={() => {}}
                />
              ) : (
                <>
                  {(showAllTests ? tests : tests.slice(0, INITIAL_ITEMS_COUNT)).map((test) => {
                    const s = TEST_STATUSES.find((ts) => ts.id === test.status);
                    const isCompleted = test.status === "completed";
                    return (
                      <Card key={test.id} padding="sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-pro-text">
                              Karakter Analizi
                            </p>
                            <p className="text-xs text-pro-text-tertiary">
                              {formatDate(test.created_at)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={s?.color as "success" | "warning" | "info" | "danger" || "muted"} dot>
                              {s?.label || test.status}
                            </Badge>
                            {isCompleted && (
                              <Link
                                href={`/tests/${test.id}`}
                                className="flex items-center gap-1.5 min-h-[44px] px-3 bg-[var(--pro-analysis)] text-white text-xs font-medium rounded-lg hover:bg-[var(--pro-analysis-hover)] active:bg-[var(--pro-analysis-hover)] transition-colors touch-manipulation"
                              >
                                <Eye className="h-4 w-4" />
                                <span className="hidden sm:inline">Sonucu Gör</span>
                              </Link>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                  {tests.length > INITIAL_ITEMS_COUNT && (
                    <button
                      onClick={() => setShowAllTests(!showAllTests)}
                      className="w-full py-3 text-sm font-medium text-pro-text-secondary hover:text-pro-text active:text-pro-text transition-colors touch-manipulation"
                    >
                      {showAllTests 
                        ? "Daha Az Göster" 
                        : `Tümünü Göster (${tests.length - INITIAL_ITEMS_COUNT} daha)`}
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === "appointments" && (
            <div className="space-y-3">
              {appointments.length === 0 ? (
                <EmptyState
                  icon={Calendar}
                  title="Randevu yok"
                  description="Bu danışanla henüz randevu oluşturulmamış"
                  actionLabel="Randevu Ekle"
                  onAction={() => router.push("/appointments")}
                />
              ) : (
                <>
                  {(showAllAppointments ? appointments : appointments.slice(0, INITIAL_ITEMS_COUNT)).map((apt) => (
                    <Card key={apt.id} padding="sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-pro-text">
                            Randevu
                          </p>
                          <p className="text-xs text-pro-text-tertiary">
                            {formatDateTime(apt.starts_at)} · {apt.duration_minutes} dk
                          </p>
                        </div>
                        <Badge
                          variant={
                            apt.status === "completed" ? "success" :
                            apt.status === "cancelled" ? "danger" : "info"
                          }
                          dot
                        >
                          {apt.status === "scheduled" ? "Planlandı" :
                           apt.status === "completed" ? "Tamamlandı" : "İptal"}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                  {appointments.length > INITIAL_ITEMS_COUNT && (
                    <button
                      onClick={() => setShowAllAppointments(!showAllAppointments)}
                      className="w-full py-3 text-sm font-medium text-pro-text-secondary hover:text-pro-text active:text-pro-text transition-colors touch-manipulation"
                    >
                      {showAllAppointments 
                        ? "Daha Az Göster" 
                        : `Tümünü Göster (${appointments.length - INITIAL_ITEMS_COUNT} daha)`}
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === "sessions" && (
            <SessionsTabContent
              clientId={id}
              packages={sessionPackages}
              loading={sessionsLoading}
              summary={getClientSummary()}
              getPackagePayments={getPackagePayments}
              getPackageTransactions={getPackageTransactions}
              expandedPkg={expandedPkg}
              setExpandedPkg={setExpandedPkg}
              onAddPackage={() => setSessionModalOpen(true)}
              onAddPayment={(pkgId) => setPaymentModalPkgId(pkgId)}
            />
          )}

          {activeTab === "notes" && (
            <div className="space-y-4">
              <Card padding="md">
                <label htmlFor="client-note" className="sr-only">
                  Danışan notu
                </label>
                <textarea
                  id="client-note"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Not ekle..."
                  rows={3}
                  maxLength={1000}
                  className="w-full bg-transparent text-sm text-pro-text placeholder:text-pro-text-tertiary resize-none focus:outline-none"
                />
                <div className="flex justify-end mt-2">
                  <Button
                    size="sm"
                    onClick={addNote}
                    loading={savingNote}
                    disabled={!noteText.trim()}
                  >
                    <Plus className="h-3.5 w-3.5" /> Not Ekle
                  </Button>
                </div>
              </Card>

              {notes.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="Not yok"
                  description="Bu danışan için henüz not eklenmemiş"
                />
              ) : (
                notes.map((note) => (
                  <Card key={note.id} padding="sm">
                    <p className="text-sm text-pro-text whitespace-pre-wrap">
                      {note.content}
                    </p>
                    <p className="text-xs text-pro-text-tertiary mt-2">
                      {formatRelative(note.created_at)}
                    </p>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      <EditClientModal
        client={client}
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onUpdated={(updated) => setClient(updated)}
      />

      <CreateSessionPackageModal
        open={sessionModalOpen}
        onClose={() => setSessionModalOpen(false)}
        clientId={id}
        clientName={`${client.first_name} ${client.last_name}`}
        onCreated={() => fetchSessionPackages(id)}
        assignPackage={assignPackage}
      />

      {paymentModalPkgId && (() => {
        const pkg = sessionPackages.find((p) => p.id === paymentModalPkgId);
        if (!pkg) return null;
        const pkgPayments = getPackagePayments(pkg.id);
        const paidCents = pkgPayments.reduce((s, p) => s + p.amount_cents, 0);
        const remainingCents = pkg.total_price_cents - paidCents;
        return (
          <AddPaymentModal
            open
            onClose={() => setPaymentModalPkgId(null)}
            packageName={pkg.name}
            remainingCents={remainingCents}
            onSubmit={async (input) => {
              const res = await addPayment(pkg.id, input);
              if ("error" in res && res.error) return { error: res.error };
              await fetchSessionPackages(id);
              return {};
            }}
          />
        );
      })()}
    </>
  );
}

function SessionsTabContent({
  clientId,
  packages,
  loading,
  summary,
  getPackagePayments,
  getPackageTransactions,
  expandedPkg,
  setExpandedPkg,
  onAddPackage,
  onAddPayment,
}: {
  clientId: string;
  packages: import("@/lib/types").SessionPackage[];
  loading: boolean;
  summary: {
    totalSessions: number;
    remainingSessions: number;
    totalPriceCents: number;
    paidAmountCents: number;
    balanceCents: number;
  };
  getPackagePayments: (id: string) => import("@/lib/types").SessionPayment[];
  getPackageTransactions: (id: string) => import("@/lib/types").SessionTransaction[];
  expandedPkg: string | null;
  setExpandedPkg: (id: string | null) => void;
  onAddPackage: () => void;
  onAddPayment: (pkgId: string) => void;
}) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-24 rounded-xl" />
      </div>
    );
  }

  const usedSessions = summary.totalSessions - summary.remainingSessions;
  const progressPercent = summary.totalSessions > 0
    ? Math.round((usedSessions / summary.totalSessions) * 100)
    : 0;

  const paymentStatus = summary.balanceCents <= 0
    ? summary.paidAmountCents > summary.totalPriceCents ? "overpaid" : "paid"
    : summary.paidAmountCents > 0
      ? "partial"
      : "unpaid";

  return (
    <div className="space-y-4">
      {packages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-pro-border bg-pro-surface p-3">
            <p className="text-xs text-pro-text-tertiary">Toplam Seans</p>
            <p className="text-xl font-bold text-pro-text mt-1">{summary.totalSessions}</p>
          </div>
          <div className="rounded-xl border border-pro-border bg-pro-surface p-3">
            <p className="text-xs text-pro-text-tertiary">Kalan</p>
            <p className="text-xl font-bold text-pro-primary mt-1">{summary.remainingSessions}</p>
            {summary.totalSessions > 0 && (
              <div className="mt-2 h-1.5 rounded-full bg-pro-surface-alt overflow-hidden">
                <div
                  className="h-full rounded-full bg-pro-primary transition-all"
                  style={{ width: `${100 - progressPercent}%` }}
                />
              </div>
            )}
          </div>
          <div className="rounded-xl border border-pro-border bg-pro-surface p-3">
            <p className="text-xs text-pro-text-tertiary">Ödenen</p>
            <p className="text-xl font-bold text-pro-success mt-1">
              {formatCurrency(summary.paidAmountCents)}
            </p>
          </div>
          <div className="rounded-xl border border-pro-border bg-pro-surface p-3">
            <p className="text-xs text-pro-text-tertiary">
              {paymentStatus === "overpaid" ? "Fazla Ödeme" : "Kalan Borç"}
            </p>
            <p className={clsx(
              "text-xl font-bold mt-1",
              paymentStatus === "paid" ? "text-pro-success" :
              paymentStatus === "overpaid" ? "text-pro-warning" :
              "text-pro-text"
            )}>
              {paymentStatus === "paid"
                ? "Ödendi"
                : paymentStatus === "overpaid"
                  ? `+${formatCurrency(Math.abs(summary.balanceCents))}`
                  : formatCurrency(summary.balanceCents)}
            </p>
          </div>
        </div>
      )}

      {packages.length === 0 ? (
        <EmptyState
          icon={Banknote}
          title="Seans tanımlanmamış"
          description="Bu danışana henüz seans paketi tanımlanmamış"
          actionLabel="Seans Tanımla"
          onAction={onAddPackage}
        />
      ) : (
        <>
          <div className="space-y-3">
            {packages.map((pkg) => {
              const pkgPayments = getPackagePayments(pkg.id);
              const pkgTransactions = getPackageTransactions(pkg.id);
              const paidCents = pkgPayments.reduce((s, p) => s + p.amount_cents, 0);
              const remainingDebt = pkg.total_price_cents - paidCents;
              const isExpanded = expandedPkg === pkg.id;
              const usedCount = pkg.total_sessions - pkg.remaining_sessions;
              const pkgProgress = pkg.total_sessions > 0
                ? Math.round((usedCount / pkg.total_sessions) * 100)
                : 0;

              return (
                <Card key={pkg.id} padding="none">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-pro-text">{pkg.name}</p>
                          <Badge
                            variant={
                              pkg.status === "active" ? "success" :
                              pkg.status === "completed" ? "muted" : "danger"
                            }
                            size="sm"
                          >
                            {pkg.status === "active" ? "Aktif" :
                             pkg.status === "completed" ? "Tamamlandı" : "İptal"}
                          </Badge>
                        </div>
                        <p className="text-xs text-pro-text-tertiary mt-0.5">
                          {formatDate(pkg.created_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-pro-text">
                          {formatCurrency(pkg.total_price_cents)}
                        </p>
                        <Badge
                          variant={
                            remainingDebt <= 0 ? "success" :
                            paidCents > 0 ? "warning" : "danger"
                          }
                          size="sm"
                        >
                          {remainingDebt <= 0
                            ? "Ödendi"
                            : paidCents > 0
                              ? `Kalan: ${formatCurrency(remainingDebt)}`
                              : "Ödenmedi"}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-pro-text-tertiary">
                            {usedCount} / {pkg.total_sessions} seans kullanıldı
                          </span>
                          <span className="font-medium text-pro-text">
                            {pkg.remaining_sessions} kalan
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-pro-surface-alt overflow-hidden">
                          <div
                            className={clsx(
                              "h-full rounded-full transition-all",
                              pkg.status === "completed" ? "bg-pro-text-tertiary" : "bg-pro-primary"
                            )}
                            style={{ width: `${pkgProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {pkg.status === "active" && remainingDebt > 0 && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => onAddPayment(pkg.id)}
                          className="min-h-[44px] min-w-[44px] touch-manipulation"
                        >
                          <Wallet className="h-4 w-4" />
                          <span className="hidden sm:inline">Ödeme Ekle</span>
                        </Button>
                      )}
                      <button
                        onClick={() => setExpandedPkg(isExpanded ? null : pkg.id)}
                        className="flex items-center justify-center gap-1 min-h-[44px] min-w-[44px] px-3 text-xs text-pro-text-tertiary hover:text-pro-text active:text-pro-text transition-colors ml-auto touch-manipulation rounded-lg hover:bg-pro-surface-alt"
                      >
                        {isExpanded ? "Gizle" : "Detay"}
                        {isExpanded
                          ? <ChevronUp className="h-4 w-4" />
                          : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-pro-border px-4 py-3 bg-pro-surface-alt/30 space-y-3">
                      {pkgPayments.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-pro-text-secondary mb-1.5">Ödemeler</p>
                          <div className="space-y-1">
                            {pkgPayments.map((pay) => {
                              const methodLabel = PAYMENT_METHODS.find((m) => m.id === pay.method)?.label;
                              return (
                                <div key={pay.id} className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2">
                                    <span className="text-pro-text-tertiary">{formatDate(pay.created_at)}</span>
                                    {methodLabel && (
                                      <span className="text-pro-text-tertiary">· {methodLabel}</span>
                                    )}
                                    {pay.note && (
                                      <span className="text-pro-text-tertiary">· {pay.note}</span>
                                    )}
                                  </div>
                                  <span className="font-medium text-pro-success">
                                    +{formatCurrency(pay.amount_cents)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      {pkgTransactions.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-pro-text-secondary mb-1.5">Seans İşlemleri</p>
                          <div className="space-y-1">
                            {pkgTransactions.map((txn) => (
                              <div key={txn.id} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="text-pro-text-tertiary">{formatDate(txn.created_at)}</span>
                                  <span className={clsx(
                                    "font-medium",
                                    txn.type === "usage" ? "text-pro-text" :
                                    txn.type === "refund" ? "text-pro-success" : "text-pro-warning"
                                  )}>
                                    {txn.type === "usage" ? "Kullanım" :
                                     txn.type === "refund" ? "İade" : "Manuel Düşüm"}
                                  </span>
                                  {txn.note && <span className="text-pro-text-tertiary">· {txn.note}</span>}
                                </div>
                                <span className={clsx(
                                  "font-medium",
                                  txn.amount > 0 ? "text-pro-success" : "text-pro-text"
                                )}>
                                  {txn.amount > 0 ? "+" : ""}{txn.amount} → {txn.remaining_after} kalan
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {pkgPayments.length === 0 && pkgTransactions.length === 0 && (
                        <p className="text-xs text-pro-text-tertiary text-center py-2">
                          Henüz işlem yok
                        </p>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          <div className="flex justify-center">
            <Button size="sm" variant="secondary" onClick={onAddPackage} className="min-h-[44px] touch-manipulation">
              <Plus className="h-4 w-4" />
              Yeni Seans Tanımla
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
