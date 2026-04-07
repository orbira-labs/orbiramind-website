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
} from "lucide-react";
import { createClient as createSupabase } from "@/lib/supabase/client";
import { formatDate, formatDateTime, formatRelative } from "@/lib/utils";
import { TEST_STATUSES, CLIENT_STATUSES } from "@/lib/constants";
import type {
  Client,
  ClientNote,
  TestInvitation,
  Appointment,
} from "@/lib/types";
import Link from "next/link";
import { clsx } from "clsx";
import { EditClientModal } from "@/components/clients/EditClientModal";

const GENDERS: Record<string, string> = {
  female: "Kadın",
  male: "Erkek",
  other: "Diğer",
  prefer_not_to_say: "Belirtilmemiş",
};

type Tab = "notes" | "appointments" | "tests";

const TABS: { id: Tab; label: string; icon: typeof FileText }[] = [
  { id: "notes", label: "Notlar", icon: FileText },
  { id: "appointments", label: "Randevular", icon: Calendar },
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
      <TopBar title={`${client.first_name} ${client.last_name}`} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <Link
            href="/clients"
            className="inline-flex items-center gap-1.5 text-sm text-pro-text-secondary hover:text-pro-text transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Danışanlara Dön
          </Link>

          <div className="rounded-2xl border border-pro-border-strong bg-pro-surface-alt p-6">
            <div className="flex flex-col sm:flex-row justify-between gap-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl font-bold text-pro-text tracking-tight">
                      {client.first_name} {client.last_name}
                    </h2>
                    <span className={clsx(
                      "text-xs font-medium",
                      client.status === "active" ? "text-pro-success" : "text-pro-warning"
                    )}>
                      {statusInfo?.label}
                    </span>
                  </div>
                  <button
                    onClick={() => setEditModalOpen(true)}
                    className="flex items-center gap-1 text-pro-primary hover:text-pro-primary-hover text-xs font-medium transition-colors"
                  >
                    <Pencil className="h-3 w-3" />
                    Bilgileri düzenle
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
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
                    <span className="text-pro-text">{client.phone || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-pro-text-tertiary shrink-0" />
                    <span className="text-pro-text truncate">{client.email || "—"}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 shrink-0">
                <Button variant="secondary" size="sm">
                  <FlaskConical className="h-4 w-4" />
                  Test Gönder
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setActiveTab("notes")}>
                  <FileText className="h-4 w-4" />
                  Not Ekle
                </Button>
                <Button variant="secondary" size="sm">
                  <Calendar className="h-4 w-4" />
                  Randevu Ekle
                </Button>
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
                tests.map((test) => {
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
                            {formatDate(test.created_at)} · {test.sent_via === "email" ? "Email" : "WhatsApp"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={s?.color as "success" | "warning" | "info" | "danger" || "muted"} dot>
                            {s?.label || test.status}
                          </Badge>
                          {isCompleted && (
                            <Link
                              href={`/tests/${test.id}`}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--pro-analysis)] text-white text-xs font-medium rounded-lg hover:bg-[var(--pro-analysis-hover)] transition-colors"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              Sonucu Gör
                            </Link>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })
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
                appointments.map((apt) => (
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
                ))
              )}
            </div>
          )}

          {activeTab === "notes" && (
            <div className="space-y-4">
              <Card padding="md">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Not ekle..."
                  rows={3}
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
    </>
  );
}
