"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PAYMENT_METHODS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import {
  CreditCard,
  Banknote,
  ArrowLeftRight,
  MoreHorizontal,
} from "lucide-react";
import { clsx } from "clsx";

const METHOD_ICONS: Record<string, typeof CreditCard> = {
  cash: Banknote,
  card: CreditCard,
  transfer: ArrowLeftRight,
  other: MoreHorizontal,
};

interface AddPaymentModalProps {
  open: boolean;
  onClose: () => void;
  packageName: string;
  remainingCents: number;
  onSubmit: (input: {
    amount_cents: number;
    method?: "cash" | "card" | "transfer" | "other";
    note?: string;
  }) => Promise<{ error?: string }>;
}

export function AddPaymentModal({
  open,
  onClose,
  packageName,
  remainingCents,
  onSubmit,
}: AddPaymentModalProps) {
  const [amount, setAmount] = useState<number | "">("");
  const [method, setMethod] = useState<"cash" | "card" | "transfer" | "other" | "">("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setAmount(remainingCents > 0 ? remainingCents / 100 : "");
      setMethod("");
      setNote("");
    }
  }, [open, remainingCents]);

  async function handleSubmit() {
    if (typeof amount !== "number" || amount <= 0) {
      toast.error("Geçerli bir tutar girin");
      return;
    }

    setSaving(true);
    const res = await onSubmit({
      amount_cents: Math.round(amount * 100),
      method: method || undefined,
      note: note.trim() || undefined,
    });
    setSaving(false);

    if (res.error) {
      toast.error(res.error);
      return;
    }

    toast.success("Ödeme kaydedildi");
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Ödeme Ekle"
      subtitle={packageName}
      size="sm"
    >
      <div className="space-y-4">
        {remainingCents > 0 && (
          <div className="rounded-lg bg-pro-surface-alt border border-pro-border p-3 text-center">
            <p className="text-xs text-pro-text-tertiary">Kalan borç</p>
            <p className="text-lg font-bold text-pro-text">
              {formatCurrency(remainingCents)}
            </p>
          </div>
        )}

        <Input
          label="Tutar (TL)"
          type="number"
          value={amount === "" ? "" : amount}
          onChange={(e) =>
            setAmount(e.target.value === "" ? "" : Number(e.target.value))
          }
          min={0.01}
          step={0.01}
          placeholder="0.00"
        />

        <div>
          <label className="block text-sm font-medium text-pro-text mb-2">
            Ödeme Yöntemi
          </label>
          <div className="grid grid-cols-4 gap-2">
            {PAYMENT_METHODS.map((m) => {
              const Icon = METHOD_ICONS[m.id] || MoreHorizontal;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id as typeof method)}
                  className={clsx(
                    "flex flex-col items-center gap-1 py-2.5 rounded-lg text-xs font-medium border transition-colors",
                    method === m.id
                      ? "bg-pro-primary-light text-pro-primary border-pro-primary"
                      : "bg-pro-surface text-pro-text-tertiary border-pro-border hover:border-pro-primary hover:text-pro-primary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        <Input
          label="Not (opsiyonel)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ör: 2. taksit, Kalan ödeme"
        />

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            İptal
          </Button>
          <Button
            onClick={handleSubmit}
            loading={saving}
            disabled={typeof amount !== "number" || amount <= 0}
            className="flex-1"
          >
            Kaydet
          </Button>
        </div>
      </div>
    </Modal>
  );
}
