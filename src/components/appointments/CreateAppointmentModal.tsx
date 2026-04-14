"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useClients } from "@/lib/hooks/useClients";
import { createClient as createSupabase } from "@/lib/supabase/client";
import { APPOINTMENT_DURATIONS } from "@/lib/constants";
import { formatDateForInput, getTodayDateString, toTurkeyTime, parseDateTimeToISO } from "@/lib/utils";
import { UserPlus, Users, X, Calendar } from "lucide-react";
import { clsx } from "clsx";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

interface CreateAppointmentModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
  preselectedDate?: Date;
}

interface FormErrors {
  clientId?: string;
  newFirstName?: string;
  newLastName?: string;
  date?: string;
  time?: string;
  note?: string;
}

function getDefaultTime(): string {
  const nowTurkey = toTurkeyTime(new Date());
  nowTurkey.setMinutes(0, 0, 0);
  nowTurkey.setHours(nowTurkey.getHours() + 1);
  const hours = String(nowTurkey.getHours()).padStart(2, "0");
  const minutes = String(nowTurkey.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function CreateAppointmentModal({ open, onClose, onCreated, preselectedDate }: CreateAppointmentModalProps) {
  const { clients, refresh: refreshClients } = useClients();
  const [saving, setSaving] = useState(false);
  const [clientMode, setClientMode] = useState<"existing" | "new">("existing");
  const isMobile = useMediaQuery("(max-width: 767px)");

  const [clientId, setClientId] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [date, setDate] = useState(getTodayDateString());
  const [time, setTime] = useState(getDefaultTime());
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const preselectedDateStr = preselectedDate ? formatDateForInput(preselectedDate) : null;

  useEffect(() => {
    if (open) {
      setClientId("");
      setNewFirstName("");
      setNewLastName("");
      setDate(preselectedDateStr ?? getTodayDateString());
      setTime(getDefaultTime());
      setDurationMinutes(60);
      setNote("");
      setClientMode("existing");
      setErrors({});
    }
  }, [open, preselectedDateStr]);

  function clearError(field: keyof FormErrors) {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function validateForm(): boolean {
    const newErrors: FormErrors = {};

    if (clientMode === "existing" && !clientId) {
      newErrors.clientId = "Danışan seçin";
    }

    if (clientMode === "new") {
      const trimmedFirstName = newFirstName.trim();
      if (!trimmedFirstName) {
        newErrors.newFirstName = "Ad gerekli";
      } else if (trimmedFirstName.length < 2) {
        newErrors.newFirstName = "Ad en az 2 karakter olmalı";
      }

      const trimmedLastName = newLastName.trim();
      if (!trimmedLastName) {
        newErrors.newLastName = "Soyad gerekli";
      } else if (trimmedLastName.length < 2) {
        newErrors.newLastName = "Soyad en az 2 karakter olmalı";
      }
    }

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      newErrors.date = "Geçerli bir tarih seçin";
    }

    if (!time || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(time)) {
      newErrors.time = "Geçerli bir saat seçin";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const supabase = createSupabase();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Oturum hatası");
        return;
      }

      let finalClientId = clientId;

      if (clientMode === "new") {
        const { data: newClient, error: clientError } = await supabase
          .from("clients")
          .insert({
            professional_id: user.id,
            first_name: newFirstName.trim(),
            last_name: newLastName.trim(),
          })
          .select()
          .single();

        if (clientError) {
          toast.error("Danışan oluşturulamadı");
          setSaving(false);
          return;
        }

        finalClientId = newClient.id;
        refreshClients();
      }

      const startsAt = parseDateTimeToISO(date, time);

      const { error } = await supabase.from("appointments").insert({
        professional_id: user.id,
        client_id: finalClientId,
        starts_at: startsAt,
        duration_minutes: durationMinutes,
        note: note.trim() || null,
      });

      if (error) {
        toast.error("Randevu oluşturulamadı");
        return;
      }

      toast.success("Randevu oluşturuldu");
      onClose();
      onCreated?.();
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  const formContent = (
    <form onSubmit={handleSubmit} className={clsx(isMobile ? "space-y-4" : "space-y-5")}>
      {/* Client Mode Toggle */}
      <div className={clsx("flex gap-1.5 p-1 bg-pro-surface-alt rounded-xl", isMobile && "p-1.5")}>
        <button
          type="button"
          onClick={() => {
            setClientMode("existing");
            setErrors((prev) => {
              const next = { ...prev };
              delete next.newFirstName;
              delete next.newLastName;
              return next;
            });
          }}
          className={clsx(
            "flex-1 flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all touch-manipulation",
            isMobile ? "px-3 py-2.5" : "px-3 py-2",
            clientMode === "existing"
              ? "bg-white text-pro-text shadow-sm"
              : "text-pro-text-secondary hover:text-pro-text"
          )}
        >
          <Users className="h-4 w-4" />
          Mevcut Danışan
        </button>
        <button
          type="button"
          onClick={() => {
            setClientMode("new");
            setClientId("");
            clearError("clientId");
          }}
          className={clsx(
            "flex-1 flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all touch-manipulation",
            isMobile ? "px-3 py-2.5" : "px-3 py-2",
            clientMode === "new"
              ? "bg-white text-pro-text shadow-sm"
              : "text-pro-text-secondary hover:text-pro-text"
          )}
        >
          <UserPlus className="h-4 w-4" />
          Yeni Danışan
        </button>
      </div>

      {/* Client Selection or New Client Form */}
      {clientMode === "existing" ? (
        <Select
          label="Danışan"
          placeholder="Danışan seçin"
          options={clients.map((c) => ({
            value: c.id,
            label: `${c.first_name} ${c.last_name}`,
          }))}
          value={clientId}
          onChange={(e) => {
            setClientId(e.target.value);
            clearError("clientId");
          }}
          error={errors.clientId}
        />
      ) : (
        <div className={clsx(isMobile ? "space-y-3" : "grid grid-cols-2 gap-3")}>
          <Input
            label="Ad"
            placeholder="Danışan adı"
            maxLength={50}
            value={newFirstName}
            onChange={(e) => {
              setNewFirstName(e.target.value);
              clearError("newFirstName");
            }}
            error={errors.newFirstName}
          />
          <Input
            label="Soyad"
            placeholder="Danışan soyadı"
            maxLength={50}
            value={newLastName}
            onChange={(e) => {
              setNewLastName(e.target.value);
              clearError("newLastName");
            }}
            error={errors.newLastName}
          />
        </div>
      )}

      {/* Date + Time */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-pro-text">Tarih ve Saat</label>
        <div className={clsx(isMobile ? "space-y-3" : "grid grid-cols-2 gap-3")}>
          <div className="space-y-1">
            <p className="text-xs text-pro-text-tertiary">Tarih</p>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                clearError("date");
              }}
              className={clsx(
                "w-full rounded-lg border text-sm text-pro-text",
                "bg-pro-surface",
                "transition-colors duration-150",
                "focus:outline-none focus:ring-2 focus:ring-pro-primary/30 focus:border-pro-primary",
                isMobile ? "px-4 py-3 min-h-[48px]" : "px-3.5 py-2.5",
                errors.date
                  ? "border-pro-danger"
                  : "border-pro-border hover:border-pro-border-strong"
              )}
            />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-pro-text-tertiary">Saat</p>
            <input
              type="time"
              value={time}
              onChange={(e) => {
                setTime(e.target.value);
                clearError("time");
              }}
              className={clsx(
                "w-full rounded-lg border text-sm text-pro-text",
                "bg-pro-surface",
                "transition-colors duration-150",
                "focus:outline-none focus:ring-2 focus:ring-pro-primary/30 focus:border-pro-primary",
                isMobile ? "px-4 py-3 min-h-[48px]" : "px-3.5 py-2.5",
                errors.time
                  ? "border-pro-danger"
                  : "border-pro-border hover:border-pro-border-strong"
              )}
            />
          </div>
        </div>
        {(errors.date || errors.time) && (
          <p className="text-xs text-pro-danger">
            {errors.date || errors.time}
          </p>
        )}
      </div>

      {/* Duration */}
      <Select
        label="Süre"
        options={APPOINTMENT_DURATIONS.map((d) => ({
          value: d.value.toString(),
          label: d.label,
        }))}
        value={durationMinutes.toString()}
        onChange={(e) => setDurationMinutes(Number(e.target.value))}
      />

      {/* Note */}
      <div className="space-y-1.5">
        <label htmlFor="apt-note" className="block text-sm font-medium text-pro-text">
          Not
        </label>
        <textarea
          id="apt-note"
          rows={isMobile ? 3 : 4}
          maxLength={1000}
          placeholder="Randevuya dair eklemek istediğiniz not..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className={clsx(
            "w-full rounded-lg border text-sm text-pro-text",
            "bg-pro-surface placeholder:text-pro-text-tertiary",
            "transition-colors duration-150 resize-none",
            "focus:outline-none focus:ring-2 focus:ring-pro-primary/30 focus:border-pro-primary",
            "border-pro-border hover:border-pro-border-strong",
            isMobile ? "px-4 py-3" : "px-3.5 py-2.5"
          )}
        />
        <p className="text-xs text-pro-text-tertiary">Opsiyonel</p>
      </div>

      {/* Actions - Mobile: fixed at bottom */}
      {isMobile ? (
        <div className="pt-2">
          <Button type="submit" loading={saving} className="w-full min-h-[48px]">
            Oluştur
          </Button>
        </div>
      ) : (
        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            İptal
          </Button>
          <Button type="submit" loading={saving} className="flex-1">
            Oluştur
          </Button>
        </div>
      )}
    </form>
  );

  if (isMobile) {
    return (
      <div className="mobile-modal pt-safe">
        {/* Mobile Modal Header */}
        <div className="mobile-modal-header">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-pro-appointment-light flex items-center justify-center">
              <Calendar className="h-4 w-4 text-pro-appointment" />
            </div>
            <h2 className="text-base font-semibold text-pro-text">Yeni Randevu</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-lg text-pro-text-secondary active:bg-pro-surface-alt transition-colors touch-manipulation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Mobile Modal Content */}
        <div className="p-4 pb-safe">
          {formContent}
        </div>
      </div>
    );
  }

  return (
    <Modal open={open} onClose={onClose} title="Yeni Randevu" size="md">
      {formContent}
    </Modal>
  );
}
