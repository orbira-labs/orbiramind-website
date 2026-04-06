"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { createClient as createSupabase } from "@/lib/supabase/client";
import { APPOINTMENT_DURATIONS } from "@/lib/constants";
import { clsx } from "clsx";
import type { AppointmentSlim } from "./AppointmentDetailModal";

interface EditFormInput {
  date: string;
  time: string;
  duration_minutes: number;
  note: string;
}

interface EditAppointmentModalProps {
  appointment: AppointmentSlim | null;
  onClose: () => void;
  onUpdated?: () => void;
}

export function EditAppointmentModal({ appointment, onClose, onUpdated }: EditAppointmentModalProps) {
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditFormInput>();

  useEffect(() => {
    if (appointment) {
      const d = new Date(appointment.starts_at);
      const dateStr = d.toISOString().slice(0, 10);
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      reset({
        date: dateStr,
        time: `${hh}:${mm}`,
        duration_minutes: appointment.duration_minutes,
        note: appointment.note ?? "",
      });
    }
  }, [appointment, reset]);

  async function onSubmit(data: EditFormInput) {
    if (!appointment) return;
    setSaving(true);
    try {
      const supabase = createSupabase();
      const startsAt = new Date(`${data.date}T${data.time}:00`).toISOString();
      const { error } = await supabase
        .from("appointments")
        .update({
          starts_at: startsAt,
          duration_minutes: data.duration_minutes,
          note: data.note?.trim() || null,
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

  return (
    <Modal open={!!appointment} onClose={onClose} title="Randevuyu Düzenle" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Date + Time */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-pro-text">Tarih ve Saat</label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <p className="text-xs text-pro-text-tertiary">Tarih</p>
              <input
                type="date"
                className={clsx(
                  "w-full rounded-lg border px-3.5 py-2.5 text-sm text-pro-text",
                  "bg-pro-surface transition-colors duration-150",
                  "focus:outline-none focus:ring-2 focus:ring-pro-primary/30 focus:border-pro-primary",
                  errors.date ? "border-pro-danger" : "border-pro-border hover:border-pro-border-strong"
                )}
                {...register("date", { required: true })}
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-pro-text-tertiary">Saat</p>
              <input
                type="time"
                className={clsx(
                  "w-full rounded-lg border px-3.5 py-2.5 text-sm text-pro-text",
                  "bg-pro-surface transition-colors duration-150",
                  "focus:outline-none focus:ring-2 focus:ring-pro-primary/30 focus:border-pro-primary",
                  errors.time ? "border-pro-danger" : "border-pro-border hover:border-pro-border-strong"
                )}
                {...register("time", { required: true })}
              />
            </div>
          </div>
          {(errors.date || errors.time) && (
            <p className="text-xs text-pro-danger">Tarih ve saat gerekli</p>
          )}
        </div>

        {/* Duration */}
        <Select
          label="Süre"
          options={APPOINTMENT_DURATIONS.map((d) => ({
            value: d.value.toString(),
            label: d.label,
          }))}
          {...register("duration_minutes", { valueAsNumber: true })}
        />

        {/* Note */}
        <div className="space-y-1.5">
          <label htmlFor="edit-apt-note" className="block text-sm font-medium text-pro-text">
            Not
          </label>
          <textarea
            id="edit-apt-note"
            rows={4}
            placeholder="Randevuya dair not..."
            className={clsx(
              "w-full rounded-lg border px-3.5 py-2.5 text-sm text-pro-text",
              "bg-pro-surface placeholder:text-pro-text-tertiary",
              "transition-colors duration-150 resize-none",
              "focus:outline-none focus:ring-2 focus:ring-pro-primary/30 focus:border-pro-primary",
              "border-pro-border hover:border-pro-border-strong"
            )}
            {...register("note")}
          />
          <p className="text-xs text-pro-text-tertiary">Opsiyonel</p>
        </div>

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            İptal
          </Button>
          <Button type="submit" loading={saving} className="flex-1">
            Kaydet
          </Button>
        </div>
      </form>
    </Modal>
  );
}
