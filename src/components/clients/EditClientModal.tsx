"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { User, Mail, Phone, Calendar, Users, X } from "lucide-react";
import { createClient as createSupabase } from "@/lib/supabase/client";
import { CLIENT_STATUSES } from "@/lib/constants";
import type { Client } from "@/lib/types";
import { clsx } from "clsx";

const GENDERS = [
  { id: "female", label: "Kadın" },
  { id: "male", label: "Erkek" },
  { id: "other", label: "Diğer" },
  { id: "prefer_not_to_say", label: "Belirtmek İstemiyorum" },
] as const;

interface EditClientModalProps {
  client: Client;
  open: boolean;
  onClose: () => void;
  onUpdated: (client: Client) => void;
}

export function EditClientModal({
  client,
  open,
  onClose,
  onUpdated,
}: EditClientModalProps) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    birth_date: "",
    gender: "" as Client["gender"] | "",
    status: "active" as Client["status"],
  });

  useEffect(() => {
    if (open && client) {
      setForm({
        first_name: client.first_name || "",
        last_name: client.last_name || "",
        email: client.email || "",
        phone: client.phone || "",
        birth_date: client.birth_date || "",
        gender: client.gender || "",
        status: client.status,
      });
    }
  }, [open, client]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.first_name.trim() || !form.last_name.trim()) {
      toast.error("Ad ve soyad zorunludur");
      return;
    }

    setSaving(true);
    try {
      const supabase = createSupabase();

      const updateData: Partial<Client> = {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        birth_date: form.birth_date || null,
        gender: form.gender || null,
        status: form.status,
      };

      const { data, error } = await supabase
        .from("clients")
        .update(updateData)
        .eq("id", client.id)
        .select()
        .single();

      if (error) throw error;

      toast.success("Danışan bilgileri güncellendi");
      onUpdated(data);
      onClose();
    } catch {
      toast.error("Güncelleme başarısız oldu");
    } finally {
      setSaving(false);
    }
  }

  const inputClasses =
    "w-full px-3 py-2.5 bg-pro-surface-alt border border-pro-border rounded-lg text-sm text-pro-text placeholder:text-pro-text-tertiary focus:outline-none focus:ring-2 focus:ring-pro-primary/20 focus:border-pro-primary transition-colors";

  const mobileInputClasses =
    "mobile-input text-pro-text placeholder:text-pro-text-tertiary";

  const formContent = (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-pro-text mb-1.5">
            Ad *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pro-text-tertiary" />
            <input
              type="text"
              value={form.first_name}
              onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
              placeholder="Ad"
              className={clsx(inputClasses, "pl-9")}
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-pro-text mb-1.5">
            Soyad *
          </label>
          <input
            type="text"
            value={form.last_name}
            onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
            placeholder="Soyad"
            className={inputClasses}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-pro-text mb-1.5">
          E-posta
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pro-text-tertiary" />
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="ornek@email.com"
            className={clsx(inputClasses, "pl-9")}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-pro-text mb-1.5">
          Telefon
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pro-text-tertiary" />
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="+90 555 123 4567"
            className={clsx(inputClasses, "pl-9")}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-pro-text mb-1.5">
            Doğum Tarihi
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pro-text-tertiary" />
            <input
              type="date"
              value={form.birth_date}
              onChange={(e) => setForm((f) => ({ ...f, birth_date: e.target.value }))}
              className={clsx(inputClasses, "pl-9")}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-pro-text mb-1.5">
            Cinsiyet
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pro-text-tertiary" />
            <select
              value={form.gender || ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  gender: (e.target.value || null) as Client["gender"],
                }))
              }
              className={clsx(inputClasses, "pl-9 appearance-none cursor-pointer")}
            >
              <option value="">Seçiniz</option>
              {GENDERS.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-pro-text mb-1.5">
          Durum
        </label>
        <div className="flex gap-2">
          {CLIENT_STATUSES.filter((s) => s.id !== "archived").map((status) => (
            <button
              key={status.id}
              type="button"
              onClick={() => setForm((f) => ({ ...f, status: status.id as Client["status"] }))}
              className={clsx(
                "flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border",
                form.status === status.id
                  ? status.id === "active"
                    ? "bg-pro-success-light border-pro-success text-pro-success"
                    : "bg-pro-warning-light border-pro-warning text-pro-warning"
                  : "bg-pro-surface-alt border-pro-border text-pro-text-secondary hover:border-pro-text-tertiary"
              )}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onClose}>
          İptal
        </Button>
        <Button type="submit" loading={saving}>
          Kaydet
        </Button>
      </div>
    </>
  );

  const mobileFormContent = (
    <>
      <div className="mobile-form-group">
        <label className="text-sm font-medium text-pro-text">Ad *</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-pro-text-tertiary" />
          <input
            type="text"
            value={form.first_name}
            onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
            placeholder="Ad"
            className={clsx(mobileInputClasses, "pl-11")}
            required
          />
        </div>
      </div>

      <div className="mobile-form-group">
        <label className="text-sm font-medium text-pro-text">Soyad *</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-pro-text-tertiary" />
          <input
            type="text"
            value={form.last_name}
            onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
            placeholder="Soyad"
            className={clsx(mobileInputClasses, "pl-11")}
            required
          />
        </div>
      </div>

      <div className="mobile-form-group">
        <label className="text-sm font-medium text-pro-text">E-posta</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-pro-text-tertiary" />
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="ornek@email.com"
            className={clsx(mobileInputClasses, "pl-11")}
          />
        </div>
      </div>

      <div className="mobile-form-group">
        <label className="text-sm font-medium text-pro-text">Telefon</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-pro-text-tertiary" />
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="+90 555 123 4567"
            className={clsx(mobileInputClasses, "pl-11")}
          />
        </div>
      </div>

      <div className="mobile-form-group">
        <label className="text-sm font-medium text-pro-text">Doğum Tarihi</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-pro-text-tertiary" />
          <input
            type="date"
            value={form.birth_date}
            onChange={(e) => setForm((f) => ({ ...f, birth_date: e.target.value }))}
            className={clsx(mobileInputClasses, "pl-11")}
          />
        </div>
      </div>

      <div className="mobile-form-group">
        <label className="text-sm font-medium text-pro-text">Cinsiyet</label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-pro-text-tertiary" />
          <select
            value={form.gender || ""}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                gender: (e.target.value || null) as Client["gender"],
              }))
            }
            className={clsx(mobileInputClasses, "pl-11 appearance-none")}
          >
            <option value="">Seçiniz</option>
            {GENDERS.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mobile-form-group">
        <label className="text-sm font-medium text-pro-text">Durum</label>
        <div className="flex gap-2">
          {CLIENT_STATUSES.filter((s) => s.id !== "archived").map((status) => (
            <button
              key={status.id}
              type="button"
              onClick={() => setForm((f) => ({ ...f, status: status.id as Client["status"] }))}
              className={clsx(
                "flex-1 min-h-[48px] rounded-xl text-sm font-medium transition-colors border touch-manipulation",
                form.status === status.id
                  ? status.id === "active"
                    ? "bg-pro-success-light border-pro-success text-pro-success"
                    : "bg-pro-warning-light border-pro-warning text-pro-warning"
                  : "bg-pro-surface-alt border-pro-border text-pro-text-secondary"
              )}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );

  if (!open) return null;

  return (
    <>
      {/* ============================================================
          DESKTOP VIEW - Centered modal (mevcut tasarım korundu)
          ============================================================ */}
      <div className="desktop-only">
        <Modal open={open} onClose={onClose} title="Danışan Bilgilerini Düzenle" size="md">
          <form onSubmit={handleSubmit} className="space-y-5">
            {formContent}
          </form>
        </Modal>
      </div>

      {/* ============================================================
          MOBILE VIEW - Full screen modal
          ============================================================ */}
      <div className="mobile-only">
        <div className="mobile-modal">
          <div className="mobile-modal-header">
            <h2 className="text-lg font-semibold text-pro-text">Danışan Bilgilerini Düzenle</h2>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-pro-text-secondary touch-manipulation"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-4 pb-24">
            {mobileFormContent}
          </form>

          {/* Mobile: Fixed bottom action bar */}
          <div className="mobile-action-bar">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onClose}
              className="flex-1 mobile-btn"
            >
              İptal
            </Button>
            <Button 
              type="submit" 
              loading={saving}
              onClick={handleSubmit}
              className="flex-1 mobile-btn"
            >
              Kaydet
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
