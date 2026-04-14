"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { createClient as createSupabase } from "@/lib/supabase/client";
import { APPOINTMENT_DURATIONS } from "@/lib/constants";
import { formatDateForInput, formatTimeForInput, parseDateTimeToISO } from "@/lib/utils";
import { X, CalendarClock } from "lucide-react";
import { clsx } from "clsx";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import type { AppointmentSlim } from "./AppointmentDetailModal";

interface EditAppointmentModalProps {
  appointment: AppointmentSlim | null;
  onClose: () => void;
  onUpdated?: () => void;
}

interface FormErrors {
  date?: string;
  time?: string;
  note?: string;
}

export function EditAppointmentModal({ appointment, onClose, onUpdated }: EditAppointmentModalProps) {
  const [saving, setSaving] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (appointment) {
      const d = new Date(appointment.starts_at);
      setDate(formatDateForInput(d));
      setTime(formatTimeForInput(d));
      setDurationMinutes(appointment.duration_minutes);
      setNote(appointment.note ?? "");
      setErrors({});
    }
  }, [appointment]);

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

    if (!appointment) return;

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const supabase = createSupabase();
      const startsAt = parseDateTimeToISO(date, time);
      const { error } = await supabase
        .from("appointments")
        .update({
          starts_at: startsAt,
          duration_minutes: durationMinutes,
          note: note.trim() || null,
        })
        .eq("id", appointment.id);

      if (error) {
        toast.error("Randevu güncellenemedi");
        return;
      }
      toast.success("Randevu güncellendi");
      onUpdated?.();
      onClose();
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  }

  if (!appointment) return null;

  const formContent = (
    <form onSubmit={handleSubmit} className={clsx(isMobile ? "space-y-4" : "space-y-5")}>
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
                "bg-pro-surface transition-colors duration-150",
                "focus:outline-none focus:ring-2 focus:ring-pro-primary/30 focus:border-pro-primary",
                isMobile ? "px-4 py-3 min-h-[48px]" : "px-3.5 py-2.5",
                errors.date ? "border-pro-danger" : "border-pro-border hover:border-pro-border-strong"
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
                "bg-pro-surface transition-colors duration-150",
                "focus:outline-none focus:ring-2 focus:ring-pro-primary/30 focus:border-pro-primary",
                isMobile ? "px-4 py-3 min-h-[48px]" : "px-3.5 py-2.5",
                errors.time ? "border-pro-danger" : "border-pro-border hover:border-pro-border-strong"
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
        <label htmlFor="edit-apt-note" className="block text-sm font-medium text-pro-text">
          Not
        </label>
        <textarea
          id="edit-apt-note"
          rows={isMobile ? 3 : 4}
          maxLength={1000}
          placeholder="Randevuya dair not..."
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
            Kaydet
          </Button>
        </div>
      ) : (
        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            İptal
          </Button>
          <Button type="submit" loading={saving} className="flex-1">
            Kaydet
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
              <CalendarClock className="h-4 w-4 text-pro-appointment" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-pro-text">Randevuyu Düzenle</h2>
              {appointment.client && (
                <p className="text-xs text-pro-text-secondary">
                  {appointment.client.first_name} {appointment.client.last_name}
                </p>
              )}
            </div>
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
    <Modal open={!!appointment} onClose={onClose} title="Randevuyu Düzenle" size="md">
      {formContent}
    </Modal>
  );
}
