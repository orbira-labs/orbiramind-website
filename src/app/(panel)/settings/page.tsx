"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useProContext } from "@/lib/context";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { Modal } from "@/components/ui/Modal";
import { createClient as createSupabase } from "@/lib/supabase/client";
import { SPECIALIZATIONS } from "@/lib/constants";
import { profileSettingsSchema } from "@/lib/validations";
import { formatTurkeyPhoneInput } from "@/lib/utils";
import {
  User,
  Shield,
  ExternalLink,
  ChevronDown,
  Check,
  AlertTriangle,
} from "lucide-react";
import { clsx } from "clsx";
import Link from "next/link";

export default function SettingsPage() {
  const { professional, loading, refreshProfile } = useProContext();

  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [specs, setSpecs] = useState<string[]>([]);

  // Uzmanlık dropdown
  const [specsOpen, setSpecsOpen] = useState(false);
  const specsRef = useRef<HTMLDivElement>(null);

  // Hesap silme
  const [deleteStep, setDeleteStep] = useState<0 | 1 | 2>(0);
  const [deleteEmail, setDeleteEmail] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<"first_name" | "last_name" | "phone" | "city" | "district" | "specializations", string>>>({});

  useEffect(() => {
    if (professional) {
      setFirstName(professional.first_name || "");
      setLastName(professional.last_name || "");
      setPhone(professional.phone || "");
      setCity(professional.city || "");
      setDistrict(professional.district || "");
      setSpecs(professional.specializations || []);
      setErrors({});
    }
  }, [professional]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (specsRef.current && !specsRef.current.contains(e.target as Node)) {
        setSpecsOpen(false);
      }
    }
    if (specsOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [specsOpen]);

  async function handleSave() {
    if (!professional) return;

    const parsed = profileSettingsSchema.safeParse({
      first_name: firstName,
      last_name: lastName,
      phone,
      city,
      district,
      specializations: specs,
    });

    if (!parsed.success) {
      const nextErrors: typeof errors = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path[0];
        if (
          path === "first_name" ||
          path === "last_name" ||
          path === "phone" ||
          path === "city" ||
          path === "district" ||
          path === "specializations"
        ) {
          nextErrors[path] = issue.message;
        }
      }
      setErrors(nextErrors);
      toast.error("Lütfen formdaki hataları düzeltin");
      return;
    }

    setErrors({});
    setSaving(true);
    try {
      const supabase = createSupabase();
      const { error } = await supabase
        .from("professionals")
        .update({
          first_name: parsed.data.first_name,
          last_name: parsed.data.last_name,
          phone: parsed.data.phone || null,
          city: parsed.data.city,
          district: parsed.data.district,
          specializations: parsed.data.specializations,
        })
        .eq("id", professional.id);

      if (error) {
        toast.error("Profil güncellenemedi");
        return;
      }

      toast.success("Profil güncellendi");
      refreshProfile();
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAccount() {
    if (deleteEmail.trim().toLowerCase() !== professional?.email?.toLowerCase()) {
      toast.error("E-posta adresi eşleşmiyor");
      return;
    }
    setDeleting(true);
    try {
      toast.info("Hesap silme işlemi için destek ile iletişime geçin: info@orbiralabs.com");
      setDeleteStep(0);
      setDeleteEmail("");
    } finally {
      setDeleting(false);
    }
  }

  const specsLabel = specs.length === 0
    ? "Seçiniz"
    : specs.length === 1
      ? SPECIALIZATIONS.find((s) => s.id === specs[0])?.label ?? "1 seçili"
      : `${specs.length} alan seçili`;

  return (
    <>
      <TopBar title="Ayarlar" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-2xl space-y-6">
          {loading ? (
            <>
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-40 w-full" />
            </>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Profil Bilgileri */}
              <Card padding="lg" variant="elevated">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-9 w-9 rounded-lg bg-pro-primary-light flex items-center justify-center">
                    <User className="h-4 w-4 text-pro-primary" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-pro-text">
                      Profil Bilgileri
                    </h2>
                    <p className="text-xs text-pro-text-tertiary">Kişisel ve profesyonel bilgileriniz</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Ad"
                      value={firstName}
                      maxLength={50}
                      error={errors.first_name}
                      touchFriendly
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        setErrors((current) => ({ ...current, first_name: undefined }));
                      }}
                    />
                    <Input
                      label="Soyad"
                      value={lastName}
                      maxLength={50}
                      error={errors.last_name}
                      touchFriendly
                      onChange={(e) => {
                        setLastName(e.target.value);
                        setErrors((current) => ({ ...current, last_name: undefined }));
                      }}
                    />
                  </div>

                  {/* Telefon ve E-posta yan yana */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Telefon"
                      type="tel"
                      value={phone}
                      inputMode="numeric"
                      maxLength={14}
                      error={errors.phone}
                      touchFriendly
                      onChange={(e) => {
                        setPhone(formatTurkeyPhoneInput(e.target.value));
                        setErrors((current) => ({ ...current, phone: undefined }));
                      }}
                      hint="WhatsApp için"
                    />
                    <Input
                      label="E-posta"
                      type="email"
                      value={professional?.email ?? ""}
                      disabled
                      readOnly
                      touchFriendly
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="İl"
                      value={city}
                      maxLength={50}
                      error={errors.city}
                      touchFriendly
                      onChange={(e) => {
                        setCity(e.target.value);
                        setErrors((current) => ({ ...current, city: undefined }));
                      }}
                    />
                    <Input
                      label="İlçe"
                      value={district}
                      maxLength={60}
                      error={errors.district}
                      touchFriendly
                      onChange={(e) => {
                        setDistrict(e.target.value);
                        setErrors((current) => ({ ...current, district: undefined }));
                      }}
                    />
                  </div>

                  {/* Uzmanlık Alanları dropdown */}
                  <div className="space-y-1.5" ref={specsRef}>
                    <label className="block text-sm font-medium text-pro-text">
                      Uzmanlık Alanı
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setSpecsOpen((v) => !v)}
                        className={clsx(
                          "w-full flex items-center justify-between rounded-lg border px-4 py-3 sm:px-3.5 sm:py-2.5 text-base sm:text-sm",
                          "min-h-[44px] sm:min-h-0",
                          "bg-pro-surface transition-colors duration-150 touch-manipulation",
                          "focus:outline-none focus:ring-2 focus:ring-pro-primary/30 focus:border-pro-primary",
                          specsOpen
                            ? "border-pro-primary ring-2 ring-pro-primary/30"
                            : "border-pro-border hover:border-pro-border-strong"
                        )}
                      >
                        <span className={clsx(specs.length === 0 ? "text-pro-text-tertiary" : "text-pro-text")}>
                          {specsLabel}
                        </span>
                        <ChevronDown className={clsx(
                          "h-4 w-4 text-pro-text-tertiary transition-transform duration-200",
                          specsOpen && "rotate-180"
                        )} />
                      </button>

                      {specsOpen && (
                        <div className="absolute z-20 mt-1 w-full rounded-xl border border-pro-border bg-pro-surface shadow-[var(--pro-shadow-md)] overflow-hidden max-h-[50vh] overflow-y-auto overscroll-contain">
                          {SPECIALIZATIONS.map((s) => {
                            const selected = specs.includes(s.id);
                            return (
                              <button
                                key={s.id}
                                type="button"
                                onClick={() => {
                                  setSpecs((prev) =>
                                    prev.includes(s.id)
                                      ? prev.filter((x) => x !== s.id)
                                      : [...prev, s.id]
                                  );
                                }}
                                className={clsx(
                                  "w-full flex items-center justify-between px-3.5 py-3 sm:py-2.5 text-sm",
                                  "transition-colors duration-150 touch-manipulation",
                                  "min-h-[44px] sm:min-h-0",
                                  selected
                                    ? "bg-pro-primary-light text-pro-primary"
                                    : "text-pro-text hover:bg-pro-surface-alt active:bg-pro-surface-alt"
                                )}
                              >
                                <span>{s.label}</span>
                                {selected && <Check className="h-4 w-4 flex-shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    {errors.specializations && (
                      <p className="text-xs text-pro-danger">{errors.specializations}</p>
                    )}
                  </div>

                  {/* Desktop'ta inline buton */}
                  <div className="hidden sm:block">
                    <Button onClick={handleSave} loading={saving} className="mt-2">
                      Değişiklikleri Kaydet
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Gizlilik & Güvenlik */}
              <Card padding="lg" variant="elevated">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-9 w-9 rounded-lg bg-pro-success-light flex items-center justify-center">
                    <Shield className="h-4 w-4 text-pro-success" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-pro-text">Gizlilik & Güvenlik</h2>
                    <p className="text-xs text-pro-text-tertiary">Veri güvenliği ve yasal bilgiler</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-pro-surface-alt transition-colors group"
                  >
                    <span className="text-sm text-pro-text-secondary group-hover:text-pro-text">Gizlilik Politikası</span>
                    <ExternalLink className="h-4 w-4 text-pro-text-tertiary" />
                  </Link>
                  <Link
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-pro-surface-alt transition-colors group"
                  >
                    <span className="text-sm text-pro-text-secondary group-hover:text-pro-text">Kullanım Koşulları</span>
                    <ExternalLink className="h-4 w-4 text-pro-text-tertiary" />
                  </Link>
                  <Link
                    href="/iletisim"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-pro-surface-alt transition-colors group"
                  >
                    <span className="text-sm text-pro-text-secondary group-hover:text-pro-text">Destek & İletişim</span>
                    <ExternalLink className="h-4 w-4 text-pro-text-tertiary" />
                  </Link>
                  <div className="p-3 rounded-xl bg-pro-info-light/50 border border-pro-info/10">
                    <p className="text-xs text-pro-info">
                      Verileriniz KVKK uyumlu şekilde şifrelenerek Türkiye'de saklanır.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Hesabı Sil */}
              <Card padding="lg">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <h2 className="text-base font-semibold text-pro-text mb-1">Hesabı Sil</h2>
                    <p className="text-xs text-pro-text-tertiary">
                      KVKK kapsamında hesabınızı ve tüm verilerinizi kalıcı olarak silebilirsiniz.
                    </p>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeleteStep(1)}
                    className="flex-shrink-0 w-full sm:w-auto min-h-[44px] sm:min-h-0"
                  >
                    Hesabı Sil
                  </Button>
                </div>
              </Card>
              
              {/* Mobile sticky save button spacer */}
              <div className="h-20 sm:hidden" />
            </div>
          )}
        </div>
      </main>

      {/* Mobile sticky save button */}
      {!loading && (
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-pro-surface/95 backdrop-blur-sm border-t border-pro-border sm:hidden z-40 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <Button 
            onClick={handleSave} 
            loading={saving} 
            className="w-full min-h-[48px]"
          >
            Değişiklikleri Kaydet
          </Button>
        </div>
      )}

      {/* Hesap Silme — 1. Adım: Onay */}
      <Modal
        open={deleteStep === 1}
        onClose={() => setDeleteStep(0)}
        title="Hesabı Sil"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex gap-3 p-3 rounded-xl bg-pro-danger-light/40 border border-pro-danger/20">
            <AlertTriangle className="h-5 w-5 text-pro-danger flex-shrink-0 mt-0.5" />
            <div className="text-sm text-pro-danger">
              <p className="font-medium mb-1">Bu işlem geri alınamaz.</p>
              <p className="text-pro-danger/80">
                Hesabınız, tüm danışan verileri, analizler ve randevular kalıcı olarak silinecektir.
              </p>
            </div>
          </div>
          <p className="text-sm text-pro-text-secondary">
            Devam etmek istediğinize emin misiniz?
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setDeleteStep(0)}>
              İptal
            </Button>
            <Button variant="danger" size="sm" onClick={() => setDeleteStep(2)}>
              Evet, devam et
            </Button>
          </div>
        </div>
      </Modal>

      {/* Hesap Silme — 2. Adım: E-posta doğrulama */}
      <Modal
        open={deleteStep === 2}
        onClose={() => { setDeleteStep(0); setDeleteEmail(""); }}
        title="Kimliğinizi Doğrulayın"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-pro-text-secondary">
            Hesabınızı silmek için aşağıya{" "}
            <span className="font-medium text-pro-text">{professional?.email}</span>{" "}
            adresini yazın.
          </p>
          <Input
            label="E-posta adresi"
            type="email"
            value={deleteEmail}
            onChange={(e) => setDeleteEmail(e.target.value)}
            placeholder={professional?.email}
          />
          <div className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setDeleteStep(0); setDeleteEmail(""); }}
            >
              İptal
            </Button>
            <Button
              variant="danger"
              size="sm"
              loading={deleting}
              disabled={deleteEmail.trim().toLowerCase() !== professional?.email?.toLowerCase()}
              onClick={handleDeleteAccount}
            >
              Hesabı Kalıcı Olarak Sil
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
