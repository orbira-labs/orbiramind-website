"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { SPECIALIZATIONS, WORK_TYPES } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { formatTurkeyPhoneInput } from "@/lib/utils";
import { clsx } from "clsx";

const CITIES = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Aksaray", "Amasya", "Ankara", "Antalya",
  "Ardahan", "Artvin", "Aydın", "Balıkesir", "Bartın", "Batman", "Bayburt", "Bilecik",
  "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum",
  "Denizli", "Diyarbakır", "Düzce", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir",
  "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Iğdır", "Isparta", "İstanbul",
  "İzmir", "Kahramanmaraş", "Karabük", "Karaman", "Kars", "Kastamonu", "Kayseri", "Kırıkkale",
  "Kırklareli", "Kırşehir", "Kilis", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa",
  "Mardin", "Mersin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Osmaniye",
  "Rize", "Sakarya", "Samsun", "Şanlıurfa", "Siirt", "Sinop", "Sivas", "Şırnak",
  "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Uşak", "Van", "Yalova", "Yozgat", "Zonguldak",
];

interface FormErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  city?: string;
  district?: string;
  companyName?: string;
  specializations?: string;
  kvkk?: string;
  terms?: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [workType, setWorkType] = useState<"individual" | "company">("individual");
  const [companyName, setCompanyName] = useState("");
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  function toggleSpec(specId: string) {
    setSpecializations((prev) =>
      prev.includes(specId)
        ? prev.filter((s) => s !== specId)
        : [...prev, specId]
    );
    clearError("specializations");
  }

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

    const trimmedFirstName = firstName.trim();
    if (!trimmedFirstName) {
      newErrors.firstName = "Ad gerekli";
    } else if (trimmedFirstName.length < 2) {
      newErrors.firstName = "Ad en az 2 karakter olmalı";
    }

    const trimmedLastName = lastName.trim();
    if (!trimmedLastName) {
      newErrors.lastName = "Soyad gerekli";
    } else if (trimmedLastName.length < 2) {
      newErrors.lastName = "Soyad en az 2 karakter olmalı";
    }

    const trimmedPhone = phone.trim();
    if (trimmedPhone && !/^0\d{3} \d{3} \d{2} \d{2}$/.test(trimmedPhone)) {
      newErrors.phone = "Telefon numarasını 05XX XXX XX XX formatında girin";
    }

    if (!city.trim()) {
      newErrors.city = "İl seçin";
    }

    const trimmedDistrict = district.trim();
    if (!trimmedDistrict) {
      newErrors.district = "İlçe gerekli";
    } else if (trimmedDistrict.length < 2) {
      newErrors.district = "İlçe en az 2 karakter olmalı";
    }

    if (workType === "company") {
      const trimmedCompanyName = companyName.trim();
      if (!trimmedCompanyName) {
        newErrors.companyName = "İşyeri / Klinik Adı zorunludur";
      }
    }

    if (specializations.length === 0) {
      newErrors.specializations = "En az bir uzmanlık alanı seçin";
    }

    if (!kvkkAccepted) {
      newErrors.kvkk = "KVKK Aydınlatma Metni'ni kabul etmelisiniz";
    }

    if (!termsAccepted) {
      newErrors.terms = "Kullanım Koşulları'nı kabul etmelisiniz";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { error } = await supabase.from("professionals").upsert({
        id: user.id,
        email: user.email!,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim() || null,
        city: city.trim(),
        district: district.trim(),
        work_type: workType,
        company_name: workType === "company" ? companyName.trim() : null,
        specializations,
        onboarding_completed: true,
        kvkk_accepted: true,
        kvkk_accepted_at: new Date().toISOString(),
        terms_accepted: true,
        terms_accepted_at: new Date().toISOString(),
      });

      if (error) {
        toast.error("Profil kaydedilemedi");
        return;
      }

      const { data: existingBonus } = await supabase
        .from("credit_transactions")
        .select("id")
        .eq("professional_id", user.id)
        .eq("type", "bonus")
        .limit(1)
        .single();

      if (!existingBonus) {
        await supabase.from("credit_transactions").insert({
          professional_id: user.id,
          amount: 1,
          balance_after: 1,
          type: "bonus",
          description: "Hoş geldin hediyesi – 1 ücretsiz test",
        });
      }

      toast.success("Hoş geldiniz!");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-pro-text">
            Sizi tanıyalım
          </h1>
          <p className="mt-2 text-[15px] text-pro-text-secondary leading-relaxed">
            Birkaç bilgi ile kişisel deneyiminizi oluşturalım.
          </p>
        </div>

        <div className="bg-pro-surface rounded-2xl border border-pro-border p-6 sm:p-8 shadow-[var(--pro-shadow-md)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Ad"
                placeholder="Adınız"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  clearError("firstName");
                }}
                error={errors.firstName}
              />
              <Input
                label="Soyad"
                placeholder="Soyadınız"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  clearError("lastName");
                }}
                error={errors.lastName}
              />
            </div>

            <Input
              label="Telefon"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              maxLength={14}
              placeholder="0511 111 11 11"
              hint="Opsiyonel"
              value={phone}
              onChange={(e) => {
                setPhone(formatTurkeyPhoneInput(e.target.value));
                clearError("phone");
              }}
              error={errors.phone}
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="İl"
                placeholder="İl seçin"
                options={CITIES.map((c) => ({ value: c, label: c }))}
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  clearError("city");
                }}
                error={errors.city}
              />
              <Input
                label="İlçe"
                placeholder="İlçe adı"
                maxLength={60}
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  clearError("district");
                }}
                error={errors.district}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-pro-text">
                Çalışma Şekli
              </label>
              <div className="flex gap-3">
                {WORK_TYPES.map((wt) => (
                  <label
                    key={wt.id}
                    className={clsx(
                      "flex-1 flex items-center justify-center gap-2 rounded-lg border px-4 py-3 cursor-pointer transition-colors text-sm",
                      workType === wt.id
                        ? "border-pro-primary bg-pro-primary-light text-pro-primary font-medium"
                        : "border-pro-border bg-pro-surface text-pro-text-secondary hover:border-pro-border-strong"
                    )}
                  >
                    <input
                      type="radio"
                      name="workType"
                      value={wt.id}
                      checked={workType === wt.id}
                      onChange={() => setWorkType(wt.id as "individual" | "company")}
                      className="sr-only"
                    />
                    {wt.label}
                  </label>
                ))}
              </div>
            </div>

            {workType === "company" && (
              <Input
                label="İşyeri / Klinik Adı"
                placeholder="İşyeri adı"
                maxLength={100}
                value={companyName}
                onChange={(e) => {
                  setCompanyName(e.target.value);
                  clearError("companyName");
                }}
                error={errors.companyName}
              />
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-pro-text">
                Uzmanlık Alanı
              </label>
              <div className="flex flex-wrap gap-2">
                {SPECIALIZATIONS.map((spec) => (
                  <button
                    key={spec.id}
                    type="button"
                    onClick={() => toggleSpec(spec.id)}
                    className={clsx(
                      "rounded-full px-4 py-2 text-sm transition-colors",
                      specializations.includes(spec.id)
                        ? "bg-pro-primary text-white"
                        : "bg-pro-surface-alt text-pro-text-secondary hover:bg-pro-border"
                    )}
                  >
                    {spec.label}
                  </button>
                ))}
              </div>
              {errors.specializations && (
                <p className="text-xs text-pro-danger">
                  {errors.specializations}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={kvkkAccepted}
                  onChange={(e) => {
                    setKvkkAccepted(e.target.checked);
                    clearError("kvkk");
                  }}
                  className="mt-0.5 h-4 w-4 rounded border-pro-border text-pro-primary focus:ring-pro-primary shrink-0"
                />
                <span className="text-sm text-pro-text-secondary">
                  <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-pro-primary underline">
                    KVKK Aydınlatma Metni
                  </a>
                  &apos;ni okudum, kişisel verilerimin işlenmesini kabul ediyorum.
                </span>
              </label>
              {errors.kvkk && (
                <p className="text-xs text-pro-danger pl-7">
                  {errors.kvkk}
                </p>
              )}

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                    clearError("terms");
                  }}
                  className="mt-0.5 h-4 w-4 rounded border-pro-border text-pro-primary focus:ring-pro-primary shrink-0"
                />
                <span className="text-sm text-pro-text-secondary">
                  <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-pro-primary underline">
                    Kullanım Koşulları
                  </a>
                  &apos;nı okudum ve kabul ediyorum.
                </span>
              </label>
              {errors.terms && (
                <p className="text-xs text-pro-danger pl-7">
                  {errors.terms}
                </p>
              )}
            </div>

            <Button type="submit" fullWidth size="lg" loading={loading}>
              Tamamla ve Başla
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
