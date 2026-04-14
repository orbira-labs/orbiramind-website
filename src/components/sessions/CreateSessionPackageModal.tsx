"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useSessionTemplates } from "@/lib/hooks/useSessionTemplates";
import { useProContext } from "@/lib/context";
import { formatCurrency } from "@/lib/utils";
import {
  Tag,
  Percent,
  Check,
  Banknote,
} from "lucide-react";
import { clsx } from "clsx";
import type { SessionPriceTemplate } from "@/lib/types";

interface CreateSessionPackageModalProps {
  open: boolean;
  onClose: () => void;
  clientId: string;
  clientName: string;
  onCreated: () => void;
  assignPackage: (
    clientId: string,
    input: {
      template_id?: string;
      name: string;
      total_sessions: number;
      total_price_cents: number;
      initial_payment_cents?: number;
      payment_method?: "cash" | "card" | "transfer" | "other";
    }
  ) => Promise<{ data?: unknown; error?: string }>;
}

export function CreateSessionPackageModal({
  open,
  onClose,
  clientId,
  clientName,
  onCreated,
  assignPackage,
}: CreateSessionPackageModalProps) {
  const { professional } = useProContext();
  const { templates, loading: templatesLoading } = useSessionTemplates();

  const [step, setStep] = useState<"select" | "custom" | "payment">("select");
  const [selectedTemplate, setSelectedTemplate] = useState<SessionPriceTemplate | null>(null);

  // Custom package
  const [customName, setCustomName] = useState("");
  const [customSessions, setCustomSessions] = useState<number | "">("");
  const [customTotalPrice, setCustomTotalPrice] = useState<number | "">("");

  // Payment
  const [paymentAmount, setPaymentAmount] = useState<number | "">("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "transfer" | "other" | "">("");
  const [fullPayment, setFullPayment] = useState(true);
  const [saving, setSaving] = useState(false);

  const basePriceCents = professional?.session_price_cents ?? 0;

  useEffect(() => {
    if (open) {
      setStep("select");
      setSelectedTemplate(null);
      setCustomName("");
      setCustomSessions("");
      setCustomTotalPrice("");
      setPaymentAmount("");
      setPaymentMethod("");
      setFullPayment(true);
    }
  }, [open]);

  // Effective values based on selected template or custom
  const effectiveName = selectedTemplate ? selectedTemplate.name : customName;
  const effectiveSessions = selectedTemplate
    ? selectedTemplate.session_count
    : typeof customSessions === "number" ? customSessions : 0;
  const effectivePriceCents = selectedTemplate
    ? selectedTemplate.total_price_cents
    : typeof customTotalPrice === "number" ? Math.round(customTotalPrice * 100) : 0;

  function handleSelectTemplate(tpl: SessionPriceTemplate) {
    setSelectedTemplate(tpl);
    setPaymentAmount(tpl.total_price_cents / 100);
    setFullPayment(true);
    setStep("payment");
  }

  function handleCustomNext() {
    if (!customName || !customSessions) {
      toast.error("Tüm alanları doldurun");
      return;
    }
    setSelectedTemplate(null);
    const totalCents = typeof customTotalPrice === "number" ? customTotalPrice : 0;
    setPaymentAmount(totalCents);
    setFullPayment(true);
    setStep("payment");
  }

  async function handleSubmit() {
    setSaving(true);

    const initialPaymentCents =
      fullPayment
        ? effectivePriceCents
        : typeof paymentAmount === "number"
          ? Math.round(paymentAmount * 100)
          : 0;

    const res = await assignPackage(clientId, {
      template_id: selectedTemplate?.id,
      name: effectiveName,
      total_sessions: effectiveSessions,
      total_price_cents: effectivePriceCents,
      initial_payment_cents: initialPaymentCents > 0 ? initialPaymentCents : undefined,
      payment_method: paymentMethod || undefined,
    });

    setSaving(false);

    if (res.error) {
      toast.error(res.error);
      return;
    }

    toast.success(`${effectiveName} tanımlandı`);
    onCreated();
    onClose();
  }

  // For custom step: auto-calculate total based on base price
  const customSessionsNum = typeof customSessions === "number" ? customSessions : 0;
  const autoTotal = customSessionsNum > 0 && basePriceCents > 0
    ? (basePriceCents * customSessionsNum) / 100
    : 0;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Seans Tanımla"
      subtitle={clientName}
      size="md"
    >
      {step === "select" && (
        <div className="space-y-4">
          {templatesLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 rounded-xl bg-pro-surface-alt animate-pulse" />
              ))}
            </div>
          ) : templates.length > 0 ? (
            <>
              <p className="text-sm text-pro-text-secondary">
                Bir paket seçin veya özel tanımlama yapın
              </p>
              <div className="space-y-2">
                {templates.map((tpl) => {
                  const hasDiscount = tpl.discount_percent > 0;
                  const indirimsiz = tpl.price_per_session_cents * tpl.session_count;
                  return (
                    <button
                      key={tpl.id}
                      onClick={() => handleSelectTemplate(tpl)}
                      className="w-full text-left rounded-xl border border-pro-border p-4 hover:border-pro-primary hover:bg-pro-primary-light/30 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={clsx(
                            "h-10 w-10 rounded-lg flex items-center justify-center",
                            tpl.session_count === 1 ? "bg-pro-primary-light" : "bg-pro-accent-light"
                          )}>
                            {tpl.session_count === 1
                              ? <Banknote className="h-4.5 w-4.5 text-pro-primary" />
                              : <Tag className="h-4.5 w-4.5 text-pro-accent" />}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-pro-text group-hover:text-pro-primary transition-colors">
                              {tpl.name}
                            </p>
                            <p className="text-xs text-pro-text-tertiary">
                              {tpl.session_count} seans
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {hasDiscount && (
                            <p className="text-xs text-pro-text-tertiary line-through">
                              {formatCurrency(indirimsiz)}
                            </p>
                          )}
                          <p className="text-base font-bold text-pro-text">
                            {formatCurrency(tpl.total_price_cents)}
                          </p>
                          {hasDiscount && (
                            <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-pro-success">
                              <Percent className="h-2.5 w-2.5" />
                              {tpl.discount_percent}%
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <p className="text-sm text-pro-text-tertiary text-center py-4">
              Henüz paket şablonu tanımlanmamış.
            </p>
          )}

          <div className="border-t border-pro-border pt-4">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                if (basePriceCents > 0 && customSessionsNum === 0) {
                  setCustomTotalPrice("");
                }
                setStep("custom");
              }}
            >
              Özel Tanımlama
            </Button>
          </div>
        </div>
      )}

      {step === "custom" && (
        <div className="space-y-4">
          <Input
            label="Paket Adı"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Ör: 8 Seans Paketi"
          />

          <Input
            label="Seans Sayısı"
            type="number"
            value={customSessions === "" ? "" : customSessions}
            onChange={(e) => {
              const v = e.target.value === "" ? "" : Number(e.target.value);
              setCustomSessions(v);
              if (typeof v === "number" && v > 0 && basePriceCents > 0) {
                setCustomTotalPrice((basePriceCents * v) / 100);
                if (!customName) setCustomName(v === 1 ? "Tek Seans" : `${v} Seans Paketi`);
              }
            }}
            min={1}
            max={200}
            placeholder="1"
          />

          <Input
            label="Toplam Tutar (TL)"
            type="number"
            value={customTotalPrice === "" ? "" : customTotalPrice}
            onChange={(e) =>
              setCustomTotalPrice(e.target.value === "" ? "" : Number(e.target.value))
            }
            min={0}
            step={1}
            placeholder={autoTotal > 0 ? String(autoTotal) : "0"}
            hint={
              basePriceCents > 0 && customSessionsNum > 0
                ? `Baz fiyatla: ${formatCurrency(basePriceCents * customSessionsNum)}. İndirim uygulamak için düzenleyin.`
                : undefined
            }
          />

          {customSessionsNum > 0 && typeof customTotalPrice === "number" && customTotalPrice > 0 && (
            <div className="rounded-lg bg-pro-surface-alt border border-pro-border p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-pro-text-secondary">Seans başı</span>
                <span className="font-medium text-pro-text">
                  {formatCurrency(Math.round((customTotalPrice / customSessionsNum) * 100))}
                </span>
              </div>
              {basePriceCents > 0 && customTotalPrice < autoTotal && (
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-pro-success flex items-center gap-1">
                    <Percent className="h-3 w-3" />
                    İndirim
                  </span>
                  <span className="text-pro-success font-medium">
                    {Math.round(((autoTotal - customTotalPrice) / autoTotal) * 100)}%
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setStep("select")} className="flex-1">
              Geri
            </Button>
            <Button
              onClick={handleCustomNext}
              disabled={!customName || !customSessions || !customTotalPrice}
              className="flex-1"
            >
              Devam
            </Button>
          </div>
        </div>
      )}

      {step === "payment" && (
        <div className="space-y-4">
          <Card padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-pro-text">{effectiveName}</p>
                <p className="text-xs text-pro-text-tertiary">{effectiveSessions} seans</p>
              </div>
              <p className="text-lg font-bold text-pro-text">
                {formatCurrency(effectivePriceCents)}
              </p>
            </div>
          </Card>

          <div>
            <label className="block text-sm font-medium text-pro-text mb-2">
              Ödeme Durumu
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setFullPayment(true);
                  setPaymentAmount(effectivePriceCents / 100);
                }}
                className={clsx(
                  "flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all",
                  fullPayment
                    ? "bg-pro-primary text-white border-pro-primary shadow-sm"
                    : "bg-pro-surface text-pro-text-secondary border-pro-border hover:border-pro-primary"
                )}
              >
                <Check className={clsx("h-4 w-4 inline mr-1.5", !fullPayment && "opacity-0")} />
                Tamamı ödendi
              </button>
              <button
                type="button"
                onClick={() => {
                  setFullPayment(false);
                  setPaymentAmount("");
                }}
                className={clsx(
                  "flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all",
                  !fullPayment
                    ? "bg-pro-primary text-white border-pro-primary shadow-sm"
                    : "bg-pro-surface text-pro-text-secondary border-pro-border hover:border-pro-primary"
                )}
              >
                Kısmi ödeme
              </button>
            </div>
          </div>

          {!fullPayment && (
            <Input
              label="Ödenen Tutar (TL)"
              type="number"
              value={paymentAmount === "" ? "" : paymentAmount}
              onChange={(e) =>
                setPaymentAmount(e.target.value === "" ? "" : Number(e.target.value))
              }
              min={0}
              max={effectivePriceCents / 100}
              step={1}
              placeholder="0"
              hint={
                typeof paymentAmount === "number" && paymentAmount > 0
                  ? `Kalan: ${formatCurrency(effectivePriceCents - Math.round(paymentAmount * 100))}`
                  : "Peşinat veya kısmi ödeme tutarı. 0 bırakabilirsiniz."
              }
            />
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setStep(selectedTemplate ? "select" : "custom")}
              className="flex-1"
            >
              Geri
            </Button>
            <Button onClick={handleSubmit} loading={saving} className="flex-1">
              Tanımla
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
