"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { ClientCard } from "@/components/clients";
import { Users, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { createClient as createSupabase } from "@/lib/supabase/client";
import { clientSchema, type ClientInput } from "@/lib/validations";
import { useClientsList } from "@/lib/hooks/useClientsList";
import type { Client } from "@/lib/types";

const PAGE_SIZE = 10;

function getVisiblePages(current: number, total: number): (number | "dots")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "dots", total];
  if (current >= total - 3) return [1, "dots", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "dots", current - 1, current, current + 1, "dots", total];
}

export default function ClientsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "passive">("all");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { clients, counts, totalMatching, loading, listLoading, refresh, debouncedSearch } =
    useClientsList({ page, pageSize: PAGE_SIZE, statusFilter, search });

  const totalPages = Math.max(1, Math.ceil(totalMatching / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [statusFilter, debouncedSearch]);

  useEffect(() => {
    if (page > 1 && clients.length === 0 && !loading && !listLoading) {
      setPage((p) => Math.max(1, p - 1));
    }
  }, [clients.length, page, loading, listLoading]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientInput>({
    resolver: zodResolver(clientSchema),
  });

  async function onSubmit(data: ClientInput) {
    setSaving(true);
    try {
      const supabase = createSupabase();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase.from("clients").insert({
        professional_id: user!.id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email || null,
        phone: data.phone || null,
        birth_date: data.birth_date || null,
        gender: data.gender || null,
      });

      if (error) {
        toast.error("Danışan eklenemedi");
        return;
      }

      setShowModal(false);
      reset();
      toast.success("Danışan eklendi");
      await refresh();
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  }

  const handleSetStatus = useCallback(
    async (client: Client, status: "active" | "passive") => {
      try {
        const supabase = createSupabase();
        const { error } = await supabase.from("clients").update({ status }).eq("id", client.id);
        if (error) {
          toast.error("Durum güncellenemedi");
          return;
        }
        toast.success(`Danışan ${status === "active" ? "aktife" : "pasife"} alındı`);
        await refresh();
      } catch {
        toast.error("Bir hata oluştu");
      }
    },
    [refresh]
  );

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const supabase = createSupabase();
      const { error } = await supabase.from("clients").delete().eq("id", deleteTarget.id);
      if (error) {
        toast.error("Silme işlemi başarısız");
        return;
      }
      toast.success("Danışan silindi");
      setDeleteTarget(null);
      await refresh();
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget, refresh]);

  const visiblePages = getVisiblePages(page, totalPages);

  return (
    <>
      <TopBar title="Danışanlar" />
      <main className="flex-1 p-3 sm:p-5 lg:p-6">
        <div className="mx-auto max-w-6xl">
          {/* Main Container */}
          <div className="bg-gradient-to-br from-[#5B7B6A]/20 to-[#5B7B6A]/8 rounded-2xl p-4 sm:p-5 space-y-4">
            {/* Count Cards */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/70 border border-pro-border">
                <span className="text-2xl font-bold text-pro-text">{counts.total}</span>
                <span className="text-xs text-pro-text-secondary mt-1">Toplam</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-pro-success-light/50 border border-pro-success/20">
                <span className="text-2xl font-bold text-pro-success">{counts.active}</span>
                <span className="text-xs text-pro-text-secondary mt-1">Aktif</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-pro-warning-light/50 border border-pro-warning/20">
                <span className="text-2xl font-bold text-pro-warning">{counts.passive}</span>
                <span className="text-xs text-pro-text-secondary mt-1">Pasif</span>
              </div>
            </div>

            <Card padding="lg" variant="elevated">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div className="flex items-center gap-3">
                  <h2 className="font-semibold text-pro-text flex items-center gap-2">
                    <span className="h-4 w-0.5 rounded-full bg-[var(--pro-client)]" />
                    Danışanlar
                  </h2>
                  <div className="flex gap-1 bg-pro-surface-alt rounded-lg p-1">
                    {(["all", "active", "passive"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setStatusFilter(f)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          statusFilter === f
                            ? "bg-pro-surface text-pro-text shadow-sm"
                            : "text-pro-text-secondary hover:text-pro-text"
                        }`}
                      >
                        {f === "all" ? "Tümü" : f === "active" ? "Aktif" : "Pasif"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pro-text-tertiary" />
                    <input
                      type="text"
                      placeholder="Danışan ara..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-lg border border-pro-border bg-pro-surface text-sm text-pro-text placeholder:text-pro-text-tertiary focus:outline-none focus:ring-2 focus:ring-pro-primary/30 focus:border-pro-primary transition-shadow"
                    />
                  </div>
                  <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pro-primary hover:bg-pro-primary-hover text-white text-sm font-medium transition-all shadow-sm hover:shadow-md"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Danışan Ekle</span>
                  </button>
                </div>
              </div>

              {/* Content */}
              {loading ? (
                <div className="space-y-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-pro-surface-alt">
                      <div className="h-10 w-10 rounded-full bg-pro-border animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-32 bg-pro-border rounded animate-pulse" />
                        <div className="h-3 w-24 bg-pro-border rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : totalMatching === 0 ? (
                <EmptyState
                  icon={Users}
                  title={counts.total === 0 ? "Henüz danışan yok" : "Sonuç bulunamadı"}
                  description={
                    counts.total === 0
                      ? "İlk danışanınızı ekleyerek başlayın"
                      : "Farklı bir arama veya filtre deneyin"
                  }
                  actionLabel={counts.total === 0 ? "Danışan Ekle" : undefined}
                  onAction={counts.total === 0 ? () => setShowModal(true) : undefined}
                />
              ) : (
                <div className="space-y-2 animate-in fade-in duration-200">
                  {clients.map((client) => (
                    <ClientCard
                      key={client.id}
                      client={client}
                      viewMode="row"
                      lastContactAt={client.updated_at}
                      rowActions={{
                        onSetStatus: (status) => handleSetStatus(client, status),
                        onDelete: () => setDeleteTarget(client),
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalMatching > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-5 pt-4 border-t border-pro-border">
                  <p className="text-xs text-pro-text-tertiary">
                    Toplam {totalMatching} kayıt · Sayfa {page} / {totalPages}
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-pro-text-secondary hover:bg-pro-surface-alt disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="hidden sm:inline">Önceki</span>
                    </button>

                    {visiblePages.map((p, idx) =>
                      p === "dots" ? (
                        <span key={`dots-${idx}`} className="px-2 text-pro-text-tertiary text-xs">
                          ...
                        </span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`min-w-[28px] h-7 rounded-lg text-xs font-medium transition-colors ${
                            p === page
                              ? "bg-pro-primary text-white"
                              : "text-pro-text-secondary hover:bg-pro-surface-alt"
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}

                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-pro-text-secondary hover:bg-pro-surface-alt disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <span className="hidden sm:inline">Sonraki</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* New Client Modal */}
        <Modal
          open={showModal}
          onClose={() => {
            setShowModal(false);
            reset();
          }}
          title="Yeni Danışan"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Ad"
                placeholder="Adı"
                error={errors.first_name?.message}
                {...register("first_name")}
              />
              <Input
                label="Soyad"
                placeholder="Soyadı"
                error={errors.last_name?.message}
                {...register("last_name")}
              />
            </div>
            <Input
              label="Email"
              type="email"
              placeholder="ornek@email.com"
              hint="Analiz linki göndermek için"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Telefon"
              type="tel"
              placeholder="0532 XXX XX XX"
              hint="WhatsApp ile göndermek için"
              {...register("phone")}
            />
            <Input
              label="Doğum Tarihi"
              type="date"
              hint="Opsiyonel"
              {...register("birth_date")}
            />

            <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-800 leading-relaxed">
              <strong>KVKK Hatırlatması:</strong> Danışanınızın kişisel verilerini
              bu sisteme girerken, danışanınızı KVKK kapsamında aydınlatmış ve
              gerekli rızayı almış olduğunuzu teyit etmiş sayılırsınız.
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowModal(false);
                  reset();
                }}
                className="flex-1"
              >
                İptal
              </Button>
              <Button type="submit" loading={saving} className="flex-1">
                Kaydet
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          title="Danışanı Sil"
        >
          <p className="text-sm text-pro-text-secondary mb-6">
            <span className="font-medium text-pro-text">
              {deleteTarget?.first_name} {deleteTarget?.last_name}
            </span>{" "}
            kaydını kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
          </p>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDeleteTarget(null)}
              className="flex-1"
            >
              Vazgeç
            </Button>
            <Button
              type="button"
              variant="danger"
              loading={deleting}
              onClick={handleDelete}
              className="flex-1"
            >
              Sil
            </Button>
          </div>
        </Modal>
      </main>
    </>
  );
}
