"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { useSessionTemplates } from "@/lib/hooks/useSessionTemplates";
import { useProContext } from "@/lib/context";
import { createClient as createSupabase } from "@/lib/supabase/client";
import { PRESET_SESSION_COUNTS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import {
  Plus,
  Pencil,
  Trash2,
  Banknote,
  Tag,
  Percent,
  Check,
  Loader2,
  Sparkles,
  ArrowRight,
  Heart,
} from "lucide-react";
import { clsx } from "clsx";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  fadeSlideUp,
  staggerContainer,
  staggerItem,
  celebrationPop,
} from "@/lib/animations";
import type { SessionPriceTemplate } from "@/lib/types";

type DiscountType = "percent" | "amount";

function StepIndicator({ step, completed }: { step: 1 | 2; completed: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={clsx(
          "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
          completed
            ? "bg-pro-primary text-white shadow-sm"
            : "bg-pro-surface-alt text-pro-text-tertiary border border-pro-border"
        )}
      >
        {completed ? <Check className="h-3.5 w-3.5" /> : step}
      </div>
    </div>
  );
}

export default function SessionsPage() {
  const { professional, refreshProfile } = useProContext();
  const supabase = useRef(createSupabase());

  const {
    templates,
    loading,
    fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  } = useSessionTemplates();

  const [editingBasePrice, setEditingBasePrice] = useState(false);
  const [basePriceInput, setBasePriceInput] = useState("");
  const [savingBasePrice, setSavingBasePrice] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const currentBasePriceCents = professional?.session_price_cents ?? null;
  const hasBasePrice = currentBasePriceCents !== null && currentBasePriceCents > 0;
  const [singleChecked, setSingleChecked] = useState(false);

  // Eğer seans ücreti var ama Tek Seans şablonu yoksa otomatik oluştur (sadece bir kez)
  useEffect(() => {
    async function ensureSingleSessionTemplate() {
      if (!hasBasePrice || !professional || loading || singleChecked) return;
      
      setSingleChecked(true);
      
      // Mevcut tek seans şablonlarını kontrol et
      const singleTemplates = templates.filter(t => t.session_count === 1);
      
      if (singleTemplates.length === 0) {
        // Tek Seans şablonu yok, oluştur
        await supabase.current
          .from("session_price_templates")
          .insert({
            professional_id: professional.id,
            name: "Tek Seans",
            type: "single",
            session_count: 1,
            price_per_session_cents: currentBasePriceCents,
            total_price_cents: currentBasePriceCents,
            discount_percent: 0,
            sort_order: 0,
          });
        fetchTemplates();
      } else if (singleTemplates.length > 1) {
        // Birden fazla tek seans var, fazlalıkları sil (ilkini tut)
        const [keep, ...duplicates] = singleTemplates;
        for (const dup of duplicates) {
          await supabase.current
            .from("session_price_templates")
            .update({ is_active: false })
            .eq("id", dup.id);
        }
        // İlkini "single" type olarak güncelle
        await supabase.current
          .from("session_price_templates")
          .update({ type: "single", name: "Tek Seans" })
          .eq("id", keep.id);
        fetchTemplates();
      }
    }

    ensureSingleSessionTemplate();
  }, [hasBasePrice, professional, loading, templates, currentBasePriceCents, fetchTemplates, singleChecked]);


  async function saveBasePrice() {
    const value = Number(basePriceInput);
    if (!value || value <= 0) {
      toast.error("Geçerli bir ücret girin");
      return;
    }
    if (!professional) return;

    setSavingBasePrice(true);
    const priceCents = Math.round(value * 100);
    
    const { error } = await supabase.current
      .from("professionals")
      .update({ session_price_cents: priceCents })
      .eq("id", professional.id);

    if (error) {
      setSavingBasePrice(false);
      toast.error("Kaydedilemedi");
      return;
    }

    // Tek Seans şablonu yoksa otomatik oluştur, varsa güncelle
    const { data: existingSingle } = await supabase.current
      .from("session_price_templates")
      .select("id")
      .eq("professional_id", professional.id)
      .eq("type", "single")
      .eq("is_active", true)
      .single();

    if (existingSingle) {
      // Mevcut tek seans şablonunu güncelle
      await supabase.current
        .from("session_price_templates")
        .update({
          price_per_session_cents: priceCents,
          total_price_cents: priceCents,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingSingle.id);
    } else {
      // Yeni tek seans şablonu oluştur
      await supabase.current
        .from("session_price_templates")
        .insert({
          professional_id: professional.id,
          name: "Tek Seans",
          type: "single",
          session_count: 1,
          price_per_session_cents: priceCents,
          total_price_cents: priceCents,
          discount_percent: 0,
          sort_order: 0,
        });
    }

    setSavingBasePrice(false);
    setJustSaved(true);
    toast.success("Seans ücreti güncellendi");
    await refreshProfile();
    await fetchTemplates();
    setEditingBasePrice(false);
    setTimeout(() => setJustSaved(false), 2500);
  }

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<SessionPriceTemplate | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [sessionCount, setSessionCount] = useState<number | "">("");
  const [discountType, setDiscountType] = useState<DiscountType>("percent");
  const [discountValue, setDiscountValue] = useState<number | "">("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const basePriceNum = (currentBasePriceCents ?? 0) / 100;
  const sessionCountNum = typeof sessionCount === "number" ? sessionCount : 0;
  const discountNum = typeof discountValue === "number" ? discountValue : 0;

  const fullPrice = basePriceNum * sessionCountNum;
  const discountAmount =
    discountType === "percent"
      ? fullPrice * (discountNum / 100)
      : discountNum;
  const effectiveTotal = Math.max(0, fullPrice - discountAmount);
  const effectiveDiscountPercent =
    fullPrice > 0 ? Math.round((discountAmount / fullPrice) * 100) : 0;
  const effectivePricePerSession =
    sessionCountNum > 0 ? effectiveTotal / sessionCountNum : 0;

  function openCreate() {
    if (!hasBasePrice) {
      toast.error("Önce seans ücretinizi belirleyin");
      return;
    }
    setEditingTemplate(null);
    setName("");
    setSessionCount("");
    setDiscountType("percent");
    setDiscountValue("");
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(tpl: SessionPriceTemplate) {
    setEditingTemplate(tpl);
    setName(tpl.name);
    setSessionCount(tpl.session_count);
    if (tpl.discount_percent > 0) {
      setDiscountType("percent");
      setDiscountValue(tpl.discount_percent);
    } else {
      setDiscountType("percent");
      setDiscountValue("");
    }
    setErrors({});
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingTemplate(null);
  }

  function handleSessionCountChange(value: number) {
    setSessionCount(value);
    setName(`${value} Seans Paketi`);
  }

  async function handleSubmit() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Şablon adı gerekli";
    if (sessionCountNum < 1) errs.session_count = "En az 1 seans";
    if (discountType === "percent" && discountNum > 100) errs.discount = "İndirim %100'ü geçemez";
    if (discountType === "amount" && discountAmount > fullPrice) errs.discount = "İndirim toplam tutarı geçemez";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSaving(true);
    setErrors({});

    const input = {
      name: name.trim(),
      session_count: sessionCountNum,
      price_per_session_cents: currentBasePriceCents ?? 0,
      total_price_cents: Math.round(effectiveTotal * 100),
      discount_percent: effectiveDiscountPercent,
    };

    const res = editingTemplate
      ? await updateTemplate(editingTemplate.id, input)
      : await createTemplate(input);

    setSaving(false);

    if ("error" in res && res.error) {
      toast.error(res.error);
      return;
    }

    toast.success(editingTemplate ? "Şablon güncellendi" : "Şablon oluşturuldu");
    closeModal();
  }

  async function handleDelete(id: string) {
    const res = await deleteTemplate(id);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Şablon silindi");
    }
    setDeleteConfirm(null);
  }

  return (
    <>
      <TopBar title="Seans Paketleri" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="mx-auto max-w-4xl space-y-8"
        >
          {/* ── Page intro ── */}
          <motion.div variants={fadeSlideUp} className="space-y-1">
            <p className="text-pro-text-secondary text-sm leading-relaxed max-w-lg">
              Seans ücretinizi belirleyin ve danışanlarınıza özel paketler oluşturun
            </p>
          </motion.div>

          {/* ── Step 1: Base Price ── */}
          <motion.div variants={staggerItem}>
            <div className="flex items-center gap-3 mb-3">
              <StepIndicator step={1} completed={hasBasePrice} />
              <div>
                <h3 className="text-sm font-semibold text-pro-text">
                  Seans Ücretiniz
                </h3>
                <p className="text-xs text-pro-text-tertiary">
                  Tüm paketlerinizin temelini oluşturur
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {editingBasePrice || !hasBasePrice ? (
                <motion.div
                  key="editing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-2xl border border-pro-border bg-pro-surface p-6 shadow-[var(--pro-shadow-sm)]"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-pro-primary-light flex items-center justify-center">
                        <Banknote className="h-5 w-5 text-pro-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-pro-text">
                          {hasBasePrice ? "Seans Ücretini Güncelle" : "Bir seans ücretiniz ne kadar?"}
                        </h4>
                        <p className="text-xs text-pro-text-tertiary mt-0.5">
                          Dilediğiniz zaman değiştirebilirsiniz
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="inline-flex items-center gap-2 bg-pro-surface-alt border border-pro-border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-pro-primary/30 focus-within:border-pro-primary transition-all">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9.]*"
                          value={basePriceInput ? Number(basePriceInput).toLocaleString("tr-TR") : ""}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, "");
                            setBasePriceInput(val);
                          }}
                          placeholder={hasBasePrice ? Number(currentBasePriceCents! / 100).toLocaleString("tr-TR") : "1.000"}
                          autoFocus
                          className="w-20 bg-transparent text-xl font-semibold text-pro-text focus:outline-none placeholder:text-pro-text-tertiary/50 placeholder:font-normal"
                        />
                        <span className="text-pro-text-tertiary text-base font-medium">TL</span>
                      </div>
                      <div className="flex gap-2 sm:ml-auto">
                        {hasBasePrice && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setEditingBasePrice(false)}
                          >
                            Vazgeç
                          </Button>
                        )}
                        <Button
                          size="sm"
                          loading={savingBasePrice}
                          onClick={saveBasePrice}
                          disabled={!basePriceInput || Number(basePriceInput) <= 0}
                        >
                          <Check className="h-4 w-4" />
                          Kaydet
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="display"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-2xl border border-pro-border bg-pro-surface p-6 shadow-[var(--pro-shadow-sm)]"
                  style={{
                    background: "linear-gradient(135deg, var(--pro-surface) 0%, var(--pro-surface-alt) 100%)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-pro-primary-light flex items-center justify-center relative">
                        <Banknote className="h-7 w-7 text-pro-primary" />
                        <AnimatePresence>
                          {justSaved && (
                            <motion.div
                              variants={celebrationPop}
                              initial="initial"
                              animate="animate"
                              exit={{ opacity: 0, scale: 0.5 }}
                              className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-pro-success flex items-center justify-center"
                            >
                              <Check className="h-3 w-3 text-white" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <div>
                        <p className="text-xs text-pro-text-tertiary font-medium mb-0.5">Seans Ücretiniz</p>
                        <p className="text-3xl font-bold text-pro-text tracking-tight">
                          {formatCurrency(currentBasePriceCents!)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setBasePriceInput(String(currentBasePriceCents! / 100));
                        setEditingBasePrice(true);
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Değiştir
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Soft divider with arrow ── */}
          <motion.div variants={staggerItem} className="flex items-center justify-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pro-border to-transparent" />
            <div className={clsx(
              "mx-4 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300",
              hasBasePrice
                ? "bg-pro-primary-light text-pro-primary"
                : "bg-pro-surface-alt text-pro-text-tertiary border border-pro-border"
            )}>
              <ArrowRight className="h-4 w-4 rotate-90" />
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pro-border to-transparent" />
          </motion.div>

          {/* ── Step 2: Packages ── */}
          <motion.div variants={staggerItem}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <StepIndicator step={2} completed={hasBasePrice && templates.length > 0} />
                <div>
                  <h3 className="text-sm font-semibold text-pro-text">
                    Paket Şablonlarınız
                  </h3>
                  <p className="text-xs text-pro-text-tertiary">
                    Danışanlarınıza özel indirimli paketler sunun
                  </p>
                </div>
              </div>
              {hasBasePrice && (
                <Button size="sm" onClick={openCreate}>
                  <Plus className="h-4 w-4" />
                  Yeni Paket
                </Button>
              )}
            </div>

            <AnimatePresence mode="wait">
              {!hasBasePrice ? (
                <motion.div
                  key="locked"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border border-pro-border bg-pro-surface p-8 text-center shadow-[var(--pro-shadow-sm)]"
                >
                  <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-pro-surface-alt flex items-center justify-center">
                    <Sparkles className="h-7 w-7 text-pro-text-tertiary" />
                  </div>
                  <p className="text-sm font-medium text-pro-text mb-1">
                    Bir adım kaldı
                  </p>
                  <p className="text-xs text-pro-text-tertiary max-w-xs mx-auto leading-relaxed">
                    Seans ücretinizi belirledikten sonra danışanlarınıza özel 
                    tek seans, 5&apos;li, 10&apos;lu gibi paketler oluşturabilirsiniz
                  </p>
                </motion.div>
              ) : loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-2xl border border-pro-border p-5 space-y-3 bg-pro-surface">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  ))}
                </motion.div>
              ) : templates.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="rounded-2xl border border-pro-border bg-pro-surface p-8 shadow-[var(--pro-shadow-sm)]">
                    <EmptyState
                      icon={Heart}
                      title="Paketlerinizi oluşturmaya hazırsınız"
                      description="Danışanlarınıza tek seans, 5'li veya 10'lu gibi paketler sunarak hem onlara avantaj sağlayın hem de düzenli gelir elde edin."
                      actionLabel="İlk Paketi Oluştur"
                      onAction={openCreate}
                      compact
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {templates.map((tpl) => {
                    const indirimsizToplam = tpl.price_per_session_cents * tpl.session_count;
                    const indirimliFiyat = tpl.session_count > 0 ? tpl.total_price_cents / tpl.session_count : 0;
                    const isSingleSession = tpl.type === "single" || tpl.session_count === 1;

                    return (
                      <motion.div key={tpl.id} variants={staggerItem}>
                        <Card padding="none">
                          <div className="p-5">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-2.5">
                                <div className={clsx(
                                  "h-10 w-10 rounded-xl flex items-center justify-center",
                                  isSingleSession
                                    ? "bg-pro-primary-light"
                                    : "bg-pro-accent-light"
                                )}>
                                  {isSingleSession ? (
                                    <Banknote className="h-5 w-5 text-pro-primary" />
                                  ) : (
                                    <Tag className="h-5 w-5 text-pro-accent" />
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-pro-text">{tpl.name}</p>
                                  <p className="text-xs text-pro-text-tertiary">{tpl.session_count} seans</p>
                                </div>
                              </div>
                              {!isSingleSession && (
                                <div className="flex items-center gap-0.5">
                                  <button
                                    onClick={() => openEdit(tpl)}
                                    className="p-1.5 rounded-lg text-pro-text-tertiary hover:text-pro-text hover:bg-pro-surface-alt transition-colors"
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirm(tpl.id)}
                                    className="p-1.5 rounded-lg text-pro-text-tertiary hover:text-pro-danger hover:bg-red-50 transition-colors"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>

                            {tpl.discount_percent > 0 ? (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-pro-text-tertiary line-through">
                                    {formatCurrency(indirimsizToplam)}
                                  </span>
                                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-pro-success bg-pro-success/10 px-2 py-0.5 rounded-full">
                                    <Percent className="h-3 w-3" />
                                    {tpl.discount_percent}% indirim
                                  </span>
                                </div>
                                <div className="flex items-baseline justify-between">
                                  <span className="text-2xl font-bold text-pro-text">
                                    {formatCurrency(tpl.total_price_cents)}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-pro-text-tertiary pt-1 border-t border-pro-border">
                                  <span>Seans başı</span>
                                  <span className="font-medium text-pro-success">
                                    {formatCurrency(Math.round(indirimliFiyat))}
                                    <span className="text-pro-text-tertiary font-normal ml-1">
                                      (eski: {formatCurrency(tpl.price_per_session_cents)})
                                    </span>
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div className="flex items-baseline justify-between">
                                  <span className="text-2xl font-bold text-pro-text">
                                    {formatCurrency(tpl.total_price_cents)}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-pro-text-tertiary pt-1 border-t border-pro-border">
                                  <span>Seans başı</span>
                                  <span className="font-medium">{formatCurrency(tpl.price_per_session_cents)}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {deleteConfirm === tpl.id && (
                            <div className="border-t border-pro-border px-5 py-3 bg-red-50/50">
                              <p className="text-xs text-pro-danger mb-2">
                                Bu şablonu silmek istediğinize emin misiniz?
                              </p>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => setDeleteConfirm(null)}
                                  className="flex-1 text-xs"
                                >
                                  Vazgeç
                                </Button>
                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={() => handleDelete(tpl.id)}
                                  className="flex-1 text-xs"
                                >
                                  Sil
                                </Button>
                              </div>
                            </div>
                          )}
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </main>

      {/* ── Create/Edit Template Modal ── */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingTemplate ? "Paketi Düzenle" : "Yeni Paket Şablonu"}
        subtitle={`Baz ücret: ${formatCurrency(currentBasePriceCents ?? 0)} / seans`}
        size="sm"
      >
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-pro-text mb-2">
              Paket Sayısı
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_SESSION_COUNTS.map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => handleSessionCountChange(count)}
                  className={clsx(
                    "px-3.5 py-2 rounded-lg text-sm font-medium transition-all border",
                    sessionCount === count
                      ? "bg-pro-primary text-white border-pro-primary shadow-sm"
                      : "bg-pro-surface text-pro-text-secondary border-pro-border hover:border-pro-primary hover:text-pro-primary"
                  )}
                >
                  {count}
                </button>
              ))}
            </div>
            {errors.session_count && (
              <p className="text-xs text-pro-danger mt-1.5">{errors.session_count}</p>
            )}
          </div>

          <Input
            label="Şablon Adı"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ör: 10 Seans Paketi"
            error={errors.name}
          />

          {sessionCountNum > 0 && (
            <div>
              <label className="block text-sm font-medium text-pro-text mb-2">
                İndirim (opsiyonel)
              </label>
              <div className="flex gap-2 mb-2.5">
                <button
                  type="button"
                  onClick={() => { setDiscountType("percent"); setDiscountValue(""); }}
                  className={clsx(
                    "flex-1 py-2 rounded-lg text-sm font-medium border transition-all",
                    discountType === "percent"
                      ? "bg-pro-primary text-white border-pro-primary shadow-sm"
                      : "bg-pro-surface text-pro-text-secondary border-pro-border hover:border-pro-primary"
                  )}
                >
                  % Yüzde
                </button>
                <button
                  type="button"
                  onClick={() => { setDiscountType("amount"); setDiscountValue(""); }}
                  className={clsx(
                    "flex-1 py-2 rounded-lg text-sm font-medium border transition-all",
                    discountType === "amount"
                      ? "bg-pro-primary text-white border-pro-primary shadow-sm"
                      : "bg-pro-surface text-pro-text-secondary border-pro-border hover:border-pro-primary"
                  )}
                >
                  ₺ Tutar
                </button>
              </div>
              <Input
                type="number"
                value={discountValue === "" ? "" : discountValue}
                onChange={(e) =>
                  setDiscountValue(e.target.value === "" ? "" : Number(e.target.value))
                }
                min={0}
                max={discountType === "percent" ? 100 : fullPrice}
                step={discountType === "percent" ? 1 : 10}
                placeholder={discountType === "percent" ? "Ör: 10" : "Ör: 500"}
                hint={discountType === "percent" ? "Toplam tutardan yüzde indirim" : "Toplam tutardan TL indirim"}
                error={errors.discount}
              />
            </div>
          )}

          {sessionCountNum > 0 && (
            <div className="rounded-xl bg-pro-surface-alt border border-pro-border overflow-hidden">
              <div className="p-4 space-y-2.5">
                <div className="flex items-center justify-between text-sm text-pro-text-secondary">
                  <span>{sessionCountNum} seans × {formatCurrency(Math.round(basePriceNum * 100))}</span>
                  <span>{formatCurrency(Math.round(fullPrice * 100))}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-pro-success flex items-center gap-1">
                      <Percent className="h-3.5 w-3.5" />
                      İndirim
                      <span className="text-xs opacity-75">
                        ({discountType === "percent" ? `%${discountNum}` : formatCurrency(Math.round(discountNum * 100))})
                      </span>
                    </span>
                    <span className="text-pro-success font-medium">
                      −{formatCurrency(Math.round(discountAmount * 100))}
                    </span>
                  </div>
                )}
              </div>
              <div className="px-4 py-3 bg-pro-surface border-t border-pro-border flex items-center justify-between">
                <span className="text-sm font-semibold text-pro-text">Paket fiyatı</span>
                <span className="text-xl font-bold text-pro-text">
                  {formatCurrency(Math.round(effectiveTotal * 100))}
                </span>
              </div>
              {discountAmount > 0 && sessionCountNum > 1 && (
                <div className="px-4 py-2 bg-pro-success/5 border-t border-pro-success/10 flex items-center justify-between text-xs">
                  <span className="text-pro-success">Seans başı (indirimli)</span>
                  <span className="font-semibold text-pro-success">
                    {formatCurrency(Math.round(effectivePricePerSession * 100))}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <Button variant="secondary" onClick={closeModal} className="flex-1">
              İptal
            </Button>
            <Button
              onClick={handleSubmit}
              loading={saving}
              disabled={!name || !sessionCount}
              className="flex-1"
            >
              {editingTemplate ? "Güncelle" : "Oluştur"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
