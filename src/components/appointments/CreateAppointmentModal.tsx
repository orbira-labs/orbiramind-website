"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useClients } from "@/lib/hooks/useClients";
import { createClient as createSupabase } from "@/lib/supabase/client";
import { APPOINTMENT_DURATIONS } from "@/lib/constants";
import { formatDateForInput, getTodayDateString, toTurkeyTime, parseDateTimeToISO } from "@/lib/utils";
import { UserPlus, Users } from "lucide-react";
import { clsx } from "clsx";

interface AppointmentInput {
  client_id?: string;
  new_first_name?: string;
  new_last_name?: string;
  date: string;
  time: string;
  duration_minutes: number;
  note?: string;
}

interface CreateAppointmentModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
  preselectedDate?: Date;
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AppointmentInput>({
    defaultValues: {
      duration_minutes: 60,
      date: getTodayDateString(),
      time: getDefaultTime(),
    },
  });

  const preselectedDateStr = preselectedDate ? formatDateForInput(preselectedDate) : null;

  useEffect(() => {
    if (open) {
      reset({
        duration_minutes: 60,
        date: preselectedDateStr ?? getTodayDateString(),
        time: getDefaultTime(),
      });
      setClientMode("existing");
    }
  }, [open, reset, preselectedDateStr]);

  async function onSubmit(data: AppointmentInput) {
    if (!data.date || !data.time) {
      toast.error("Tarih ve saat gerekli");
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

      let clientId = data.client_id;

      if (clientMode === "new") {
        if (!data.new_first_name?.trim() || !data.new_last_name?.trim()) {
          toast.error("Ad ve soyad gerekli");
          setSaving(false);
          return;
        }

        const { data: newClient, error: clientError } = await supabase
          .from("clients")
          .insert({
            professional_id: user.id,
            first_name: data.new_first_name.trim(),
            last_name: data.new_last_name.trim(),
          })
          .select()
          .single();

        if (clientError) {
          toast.error("Danışan oluşturulamadı");
          setSaving(false);
          return;
        }

        clientId = newClient.id;
        refreshClients();
      }

      if (!clientId) {
        toast.error("Danışan seçin");
        setSaving(false);
        return;
      }

      const startsAt = parseDateTimeToISO(data.date, data.time);

      const { error } = await supabase.from("appointments").insert({
        professional_id: user.id,
        client_id: clientId,
        starts_at: startsAt,
        duration_minutes: data.duration_minutes,
        note: data.note?.trim() || null,
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

  return (
    <Modal open={open} onClose={onClose} title="Yeni Randevu" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Client Mode Toggle */}
        <div className="flex gap-1.5 p-1 bg-pro-surface-alt rounded-xl">
          <button
            type="button"
            onClick={() => setClientMode("existing")}
            className={clsx(
              "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
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
            onClick={() => setClientMode("new")}
            className={clsx(
              "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
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
            error={errors.client_id?.message}
            {...register("client_id")}
          />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Input label="Ad" placeholder="Danışan adı" {...register("new_first_name")} />
            <Input label="Soyad" placeholder="Danışan soyadı" {...register("new_last_name")} />
          </div>
        )}

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
                  "bg-pro-surface",
                  "transition-colors duration-150",
                  "focus:outline-none focus:ring-2 focus:ring-pro-primary/30 focus:border-pro-primary",
                  errors.date
                    ? "border-pro-danger"
                    : "border-pro-border hover:border-pro-border-strong"
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
                  "bg-pro-surface",
                  "transition-colors duration-150",
                  "focus:outline-none focus:ring-2 focus:ring-pro-primary/30 focus:border-pro-primary",
                  errors.time
                    ? "border-pro-danger"
                    : "border-pro-border hover:border-pro-border-strong"
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
          <label htmlFor="apt-note" className="block text-sm font-medium text-pro-text">
            Not
          </label>
          <textarea
            id="apt-note"
            rows={4}
            placeholder="Randevuya dair eklemek istediğiniz not..."
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
            Oluştur
          </Button>
        </div>
      </form>
    </Modal>
  );
}
