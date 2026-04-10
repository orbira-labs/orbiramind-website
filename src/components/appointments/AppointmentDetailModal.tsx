"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Clock, 
  CalendarDays, 
  FileText, 
  AlertTriangle, 
  Send, 
  CalendarClock, 
  ChevronRight, 
  TrendingUp, 
  Shield,
  User,
  Trash2,
  Timer
} from "lucide-react";
import { createClient as createSupabase } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SendTestModal } from "@/components/tests/SendTestModal";
import { formatRelative } from "@/lib/utils";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import type { Client } from "@/lib/types";
import { clsx } from "clsx";

export interface AppointmentSlim {
  id: string;
  client_id: string;
  starts_at: string;
  duration_minutes: number;
  note: string | null;
  status: "scheduled" | "completed" | "cancelled";
  client?: { first_name: string; last_name: string } | null;
}

interface TraitItem {
  trait: string;
  label: string;
  score: number;
}

interface LastTest {
  id: string;
  completed_at: string | null;
  results_snapshot: {
    wellness_score?: number;
    top_strengths?: TraitItem[];
    top_risks?: TraitItem[];
  } | null;
}

interface AppointmentDetailModalProps {
  appointment: AppointmentSlim | null;
  onClose: () => void;
  onUpdated?: () => void;
  onEditRequest?: (apt: AppointmentSlim) => void;
}

export function AppointmentDetailModal({
  appointment,
  onClose,
  onUpdated,
  onEditRequest,
}: AppointmentDetailModalProps) {
  const router = useRouter();
  const supabase = useRef(createSupabase());
  const overlayRef = useRef<HTMLDivElement>(null);

  const [client, setClient] = useState<Client | null>(null);
  const [lastTest, setLastTest] = useState<LastTest | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [showSendTest, setShowSendTest] = useState(false);

  const open = !!appointment;

  const fetchData = useCallback(async () => {
    if (!appointment) return;
    setLoadingData(true);
    setClient(null);
    setLastTest(null);

    const [clientRes, testRes] = await Promise.all([
      supabase.current.from("clients").select("*").eq("id", appointment.client_id).single(),
      supabase.current
        .from("test_invitations")
        .select("id, completed_at, results_snapshot")
        .eq("client_id", appointment.client_id)
        .eq("status", "completed")
        .order("completed_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    if (clientRes.data) setClient(clientRes.data as Client);
    if (testRes.data) setLastTest(testRes.data as LastTest);
    setLoadingData(false);
  }, [appointment]);

  useEffect(() => {
    if (open) {
      setConfirmCancel(false);
      fetchData();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, fetchData]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  const handleCancel = async () => {
    if (!appointment) return;
    setCancelling(true);
    const { error } = await supabase.current
      .from("appointments")
      .update({ status: "cancelled" })
      .eq("id", appointment.id);
    setCancelling(false);
    if (!error) {
      onUpdated?.();
      onClose();
    }
  };

  if (!appointment) return null;

  const apt = appointment;
  const clientName = client
    ? `${client.first_name} ${client.last_name}`
    : apt.client
      ? `${apt.client.first_name} ${apt.client.last_name}`
      : "Danışan";

  const dateObj = new Date(apt.starts_at);
  const dayNumber = format(dateObj, "d", { locale: tr });
  const monthName = format(dateObj, "MMMM", { locale: tr });
  const dayName = format(dateObj, "EEEE", { locale: tr });
  const timeLabel = format(dateObj, "HH:mm", { locale: tr });

  const wellnessScore = lastTest?.results_snapshot?.wellness_score;
  const strengths = (lastTest?.results_snapshot?.top_strengths ?? []).slice(0, 3).map(s => s.label ?? s.trait);
  const risks = (lastTest?.results_snapshot?.top_risks ?? []).slice(0, 2).map(r => r.label ?? r.trait);

  const scoreColor =
    wellnessScore === undefined
      ? ""
      : wellnessScore >= 70
        ? "text-pro-success"
        : wellnessScore >= 45
          ? "text-pro-warning"
          : "text-pro-danger";

  return (
    <>
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

            {/* Modal - daha geniş */}
            <motion.div
              className="relative w-full max-w-xl bg-pro-surface rounded-2xl shadow-2xl border border-pro-border overflow-hidden flex flex-col max-h-[90vh]"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              {/* ── Header ── */}
              <div className="relative bg-gradient-to-br from-[#3D5A4C] via-[#4A6858] to-[#5B7B6A] px-6 pt-5 pb-6">
                {/* Close - sağ üst köşede küçük */}
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Header content: Sol = Tarih bilgileri, Sağ = İsim */}
                <div className="flex items-center justify-between gap-6 pr-6">
                  {/* Sol: Tarih ve saat yan yana, süre altta */}
                  <div className="space-y-2">
                    {/* Tarih ve Saat satırı - yan yana */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2.5 rounded-xl">
                        <CalendarDays className="h-4 w-4 text-white/70" />
                        <span className="text-lg font-bold text-white">{dayNumber} {monthName}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2.5 rounded-xl">
                        <Clock className="h-4 w-4 text-white/80" />
                        <span className="text-lg font-bold text-white tracking-wide">{timeLabel}</span>
                      </div>
                    </div>
                    
                    {/* Süre satırı */}
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl w-fit">
                      <Timer className="h-4 w-4 text-white/60" />
                      <span className="text-sm font-medium text-white/70">{apt.duration_minutes} dakika</span>
                    </div>
                  </div>

                  {/* Sağ: İsim - Büyük ve belirgin */}
                  <div className="text-right flex-shrink-0">
                    <button
                      onClick={() => client && router.push(`/clients/${client.id}`)}
                      className="group text-right"
                      disabled={!client}
                    >
                      <p className="text-2xl font-bold text-white group-hover:underline decoration-white/40 underline-offset-4 transition-all">
                        {clientName}
                      </p>
                      {client && (
                        <p className="text-xs text-white/50 mt-2 flex items-center justify-end gap-1 group-hover:text-white/70 transition-colors">
                          Danışan kartına git
                          <ChevronRight className="h-3 w-3" />
                        </p>
                      )}
                    </button>
                  </div>
                </div>

                {/* Status badge for cancelled/completed */}
                {apt.status === "cancelled" && (
                  <div className="mt-4">
                    <Badge variant="danger" className="bg-red-500/20 text-white border-red-400/30">
                      İptal Edildi
                    </Badge>
                  </div>
                )}
                {apt.status === "completed" && (
                  <div className="mt-4">
                    <Badge variant="success" className="bg-green-500/20 text-white border-green-400/30">
                      Tamamlandı
                    </Badge>
                  </div>
                )}
              </div>

              {/* ── Body ── */}
              <div className="overflow-y-auto flex-1">
                <div className="p-5">
                  {/* Randevu notu ve Analiz raporu - Yan yana */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Randevu notu */}
                    <div className="rounded-xl border border-pro-border bg-pro-surface-alt p-4 flex flex-col min-h-[160px]">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-8 w-8 rounded-lg bg-pro-primary/10 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-pro-primary" />
                        </div>
                        <p className="text-sm font-semibold text-pro-text">Randevu Notu</p>
                      </div>
                      <div className="flex-1">
                        {apt.note ? (
                          <p className="text-sm text-pro-text-secondary leading-relaxed">
                            {apt.note}
                          </p>
                        ) : (
                          <p className="text-sm text-pro-text-tertiary italic">
                            Bu randevu için not eklenmemiş
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Analiz Raporu */}
                    <div className="rounded-xl border border-pro-border bg-pro-surface-alt p-4 flex flex-col min-h-[160px]">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-8 w-8 rounded-lg bg-pro-accent/10 flex items-center justify-center">
                          <TrendingUp className="h-4 w-4 text-pro-accent" />
                        </div>
                        <p className="text-sm font-semibold text-pro-text">Analiz Raporu</p>
                      </div>

                      <div className="flex-1">
                        {loadingData ? (
                          <div className="animate-pulse">
                            <div className="h-4 w-24 bg-pro-border rounded mb-2" />
                            <div className="h-3 w-32 bg-pro-border rounded" />
                          </div>
                        ) : lastTest ? (
                          <button
                            onClick={() => router.push(`/tests/${lastTest.id}`)}
                            className="w-full text-left group h-full flex flex-col"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="success" size="sm" dot>
                                Tamamlandı
                              </Badge>
                            </div>

                            {wellnessScore !== undefined && (
                              <div className="flex items-center gap-3 mt-1">
                                <div className="text-center bg-pro-surface rounded-lg px-3 py-1.5 border border-pro-border">
                                  <p className={clsx("text-xl font-bold", scoreColor)}>{wellnessScore}</p>
                                  <p className="text-[10px] text-pro-text-tertiary">Wellness</p>
                                </div>
                                <div className="flex-1 space-y-1">
                                  {strengths.length > 0 && (
                                    <div className="flex items-center gap-1">
                                      <TrendingUp className="h-3 w-3 text-pro-success shrink-0" />
                                      <p className="text-[11px] text-pro-text-secondary truncate">
                                        {strengths[0]}
                                      </p>
                                    </div>
                                  )}
                                  {risks.length > 0 && (
                                    <div className="flex items-center gap-1">
                                      <Shield className="h-3 w-3 text-pro-warning shrink-0" />
                                      <p className="text-[11px] text-pro-text-secondary truncate">
                                        {risks[0]}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            <p className="text-xs text-pro-primary mt-auto pt-2 flex items-center gap-1 group-hover:underline">
                              Raporu görüntüle
                              <ChevronRight className="h-3 w-3" />
                            </p>
                          </button>
                        ) : (
                          <div>
                            <p className="text-sm text-pro-text-tertiary italic mb-1">
                              Henüz analiz yok
                            </p>
                            <p className="text-xs text-pro-text-tertiary">
                              Randevu öncesi analiz gönderin
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* İptal onayı (inline) */}
                  <AnimatePresence>
                    {confirmCancel && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mt-4"
                      >
                        <div className="rounded-xl border border-pro-danger/30 bg-red-50 p-4">
                          <div className="flex items-start gap-2 mb-3">
                            <AlertTriangle className="h-4 w-4 text-pro-danger shrink-0 mt-0.5" />
                            <p className="text-sm text-pro-danger font-medium">
                              Randevuyu iptal etmek istediğinize emin misiniz?
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() => setConfirmCancel(false)}
                              className="flex-1 text-xs py-1.5"
                            >
                              Vazgeç
                            </Button>
                            <Button
                              type="button"
                              variant="danger"
                              loading={cancelling}
                              onClick={handleCancel}
                              className="flex-1 text-xs py-1.5"
                            >
                              Evet, İptal Et
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* ── Footer Actions - yan yana butonlar ── */}
              {apt.status === "scheduled" && !confirmCancel && (
                <div className="border-t border-pro-border px-5 py-3 bg-pro-surface-alt/50">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="orange"
                      size="sm"
                      onClick={() => onEditRequest?.(apt)}
                      className="flex items-center gap-1.5"
                    >
                      <CalendarClock className="h-4 w-4" />
                      Ertele
                    </Button>
                    <Button
                      type="button"
                      variant="blue"
                      size="sm"
                      onClick={() => setShowSendTest(true)}
                      className="flex items-center gap-1.5"
                    >
                      <Send className="h-4 w-4" />
                      Test Gönder
                    </Button>
                    <button
                      type="button"
                      onClick={() => setConfirmCancel(true)}
                      className="ml-auto p-2 rounded-lg text-red-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Randevuyu iptal et"
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

      {/* Send Test Modal */}
      <SendTestModal
        open={showSendTest}
        onClose={() => setShowSendTest(false)}
        onSent={() => {
          setShowSendTest(false);
          fetchData();
        }}
      />
    </>
  );
}
