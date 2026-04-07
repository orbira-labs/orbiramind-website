"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Eye,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Link2,
  Check,
  FlaskConical,
} from "lucide-react";
import { createClient as createSupabase } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { toast } from "sonner";
import { clsx } from "clsx";

export interface AnalysisSlim {
  id: string;
  token: string;
  status: string;
  created_at: string;
  started_at?: string | null;
  completed_at?: string | null;
  client?: { first_name: string; last_name: string } | null;
}

interface AnalysisDetailModalProps {
  analysis: AnalysisSlim | null;
  onClose: () => void;
  onDeleted?: () => void;
}

const STATUS_MAP: Record<
  string,
  { label: string; variant: "success" | "warning" | "info" | "danger" }
> = {
  sent: { label: "Bekliyor", variant: "warning" },
  started: { label: "Devam Ediyor", variant: "info" },
  completed: { label: "Tamamlandı", variant: "success" },
  expired: { label: "Süresi Doldu", variant: "danger" },
};

export function AnalysisDetailModal({
  analysis,
  onClose,
  onDeleted,
}: AnalysisDetailModalProps) {
  const router = useRouter();
  const supabase = useRef(createSupabase());
  const overlayRef = useRef<HTMLDivElement>(null);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const open = !!analysis;

  useEffect(() => {
    if (open) {
      setConfirmDelete(false);
      setLinkCopied(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  const handleDelete = async () => {
    if (!analysis) return;
    setDeleting(true);
    const { error } = await supabase.current
      .from("test_invitations")
      .delete()
      .eq("id", analysis.id);
    setDeleting(false);
    if (!error) {
      toast.success("Analiz başarıyla silindi");
      onDeleted?.();
      onClose();
    } else {
      toast.error("Analiz silinirken bir hata oluştu");
    }
  };

  const handleCopyLink = async () => {
    if (!analysis) return;
    const link = `${window.location.origin}/t/${analysis.token}`;
    await navigator.clipboard.writeText(link);
    setLinkCopied(true);
    toast.success("Link kopyalandı!");
    setTimeout(() => setLinkCopied(false), 2000);
  };

  if (!analysis) return null;

  const test = analysis;
  const clientName = test.client
    ? `${test.client.first_name} ${test.client.last_name}`
    : "Danışan";

  const createdDate = new Date(test.created_at);
  const completedDate = test.completed_at ? new Date(test.completed_at) : null;

  const statusInfo = STATUS_MAP[test.status] || STATUS_MAP.sent;
  const isCompleted = test.status === "completed";
  const isPending = test.status === "sent" || test.status === "started";


  return (
    <AnimatePresence>
      {open && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === overlayRef.current) onClose();
          }}
        >
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md bg-pro-surface rounded-2xl shadow-2xl border border-pro-border overflow-hidden flex flex-col max-h-[90vh]"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-[#5B7BA0] via-[#4A6A90] to-[#3A5A80] px-6 pt-5 pb-6">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Header content */}
              <div className="flex items-center gap-4 pr-6">
                {/* Icon */}
                <div className="h-14 w-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                  <FlaskConical className="h-7 w-7 text-white" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-white truncate">
                    {clientName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span
                      className={clsx(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
                        statusInfo.variant === "success" && "bg-green-500 text-white",
                        statusInfo.variant === "warning" && "bg-amber-500 text-white",
                        statusInfo.variant === "info" && "bg-blue-500 text-white",
                        statusInfo.variant === "danger" && "bg-red-500 text-white"
                      )}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
                      {statusInfo.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1">
              <div className="p-5 space-y-4">
                {/* Tarih Bilgileri */}
                <div className="rounded-xl border border-pro-border bg-pro-surface-alt p-4">
                  <p className="text-xs font-semibold text-pro-text-secondary uppercase tracking-wide mb-3">
                    Tarih Bilgileri
                  </p>
                  <div className="space-y-3">
                    {/* Gönderilme Tarihi */}
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-pro-primary/10 flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-pro-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-pro-text-tertiary">
                          Gönderilme Tarihi
                        </p>
                        <p className="text-sm font-medium text-pro-text">
                          {format(createdDate, "d MMMM yyyy, HH:mm", {
                            locale: tr,
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Tamamlanma Tarihi - inline göster */}
                    {isCompleted && completedDate && (
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-pro-success/10 flex items-center justify-center">
                          <CheckCircle2 className="h-4 w-4 text-pro-success" />
                        </div>
                        <div>
                          <p className="text-xs text-pro-text-tertiary">
                            Tamamlanma Tarihi
                          </p>
                          <p className="text-sm font-medium text-pro-success">
                            {format(completedDate, "d MMMM yyyy, HH:mm", {
                              locale: tr,
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>


                {/* Silme onayı */}
                <AnimatePresence>
                  {confirmDelete && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="rounded-xl border border-pro-danger/30 bg-red-50 p-4">
                        <div className="flex items-start gap-2 mb-3">
                          <AlertTriangle className="h-4 w-4 text-pro-danger shrink-0 mt-0.5" />
                          <p className="text-sm text-pro-danger font-medium">
                            Bu analizi silmek istediğinize emin misiniz? Bu
                            işlem geri alınamaz.
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setConfirmDelete(false)}
                            className="flex-1 text-xs py-1.5"
                          >
                            Vazgeç
                          </Button>
                          <Button
                            type="button"
                            variant="danger"
                            loading={deleting}
                            onClick={handleDelete}
                            className="flex-1 text-xs py-1.5"
                          >
                            Evet, Sil
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Footer Actions */}
            {!confirmDelete && (
              <div className="border-t border-pro-border px-5 py-3 bg-pro-surface-alt/50">
                <div className="flex items-center gap-2">
                  {/* Link kopyala - sadece pending durumunda */}
                  {isPending && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleCopyLink}
                      className="flex items-center gap-1.5"
                    >
                      {linkCopied ? (
                        <Check className="h-4 w-4 text-pro-success" />
                      ) : (
                        <Link2 className="h-4 w-4" />
                      )}
                      {linkCopied ? "Kopyalandı" : "Linki Kopyala"}
                    </Button>
                  )}

                  {/* Detaya Git - sadece completed durumunda */}
                  {isCompleted && (
                    <Button
                      type="button"
                      variant="blue"
                      size="sm"
                      onClick={() => router.push(`/tests/${test.id}`)}
                      className="flex items-center gap-1.5"
                    >
                      <Eye className="h-4 w-4" />
                      Detayına Git
                    </Button>
                  )}

                  {/* Sil butonu */}
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="ml-auto p-2 rounded-lg text-red-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Analizi sil"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
