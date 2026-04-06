"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { onboardingSchema, type OnboardingInput } from "@/lib/validations";
import { SPECIALIZATIONS, WORK_TYPES } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
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

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      work_type: "individual",
      specializations: [],
      kvkk_accepted: false as unknown as true,
      terms_accepted: false as unknown as true,
    },
  });

  const workType = watch("work_type");
  const selectedSpecs = watch("specializations");

  function toggleSpec(specId: string) {
    const current = selectedSpecs || [];
    const next = current.includes(specId)
      ? current.filter((s) => s !== specId)
      : [...current, specId];
    setValue("specializations", next, { shouldValidate: true });
  }

  async function onSubmit(data: OnboardingInput) {
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
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone || null,
        city: data.city,
        district: data.district,
        work_type: data.work_type,
        company_name: data.work_type === "company" ? data.company_name : null,
        specializations: data.specializations,
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Ad"
                placeholder="Adınız"
                error={errors.first_name?.message}
                {...register("first_name")}
              />
              <Input
                label="Soyad"
                placeholder="Soyadınız"
                error={errors.last_name?.message}
                {...register("last_name")}
              />
            </div>

            <Input
              label="Telefon"
              type="tel"
              placeholder="0532 XXX XX XX"
              hint="Opsiyonel"
              {...register("phone")}
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="İl"
                placeholder="İl seçin"
                options={CITIES.map((c) => ({ value: c, label: c }))}
                error={errors.city?.message}
                {...register("city")}
              />
              <Input
                label="İlçe"
                placeholder="İlçe adı"
                error={errors.district?.message}
                {...register("district")}
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
                      value={wt.id}
                      className="sr-only"
                      {...register("work_type")}
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
                hint="Opsiyonel"
                {...register("company_name")}
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
                      selectedSpecs?.includes(spec.id)
                        ? "bg-pro-primary text-white"
                        : "bg-pro-surface-alt text-pro-text-secondary hover:bg-pro-border"
                    )}
                  >
                    {spec.label}
                  </button>
                ))}
              </div>
              {errors.specializations?.message && (
                <p className="text-xs text-pro-danger">
                  {errors.specializations.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-pro-border text-pro-primary focus:ring-pro-primary shrink-0"
                  {...register("kvkk_accepted")}
                />
                <span className="text-sm text-pro-text-secondary">
                  <a href="/privacy" target="_blank" className="text-pro-primary underline">
                    KVKK Aydınlatma Metni
                  </a>
                  &apos;ni okudum, kişisel verilerimin işlenmesini kabul ediyorum.
                </span>
              </label>
              {errors.kvkk_accepted?.message && (
                <p className="text-xs text-pro-danger pl-7">
                  {errors.kvkk_accepted.message}
                </p>
              )}

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-pro-border text-pro-primary focus:ring-pro-primary shrink-0"
                  {...register("terms_accepted")}
                />
                <span className="text-sm text-pro-text-secondary">
                  <a href="/terms" target="_blank" className="text-pro-primary underline">
                    Kullanım Koşulları
                  </a>
                  &apos;nı okudum ve kabul ediyorum.
                </span>
              </label>
              {errors.terms_accepted?.message && (
                <p className="text-xs text-pro-danger pl-7">
                  {errors.terms_accepted.message}
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
