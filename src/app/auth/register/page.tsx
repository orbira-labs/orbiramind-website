"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register: reg,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterInput) {
    setLoading(true);
    const email = data.email.trim().toLowerCase();
    try {
      const supabase = createClient();
      const { data: signUpData, error } = await supabase.auth.signUp({
        email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("Bu email adresi zaten kayıtlı. Giriş yapmayı deneyin.");
        } else {
          toast.error(error.message);
        }
        return;
      }

      if (signUpData.user && !signUpData.user.identities?.length) {
        toast.error("Bu email adresi zaten kayıtlı. Giriş yapmayı deneyin.");
        return;
      }

      router.push(`/auth/verify?email=${encodeURIComponent(email)}`);
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-[28px] font-semibold text-pro-text">
            Yolculuğunuz burada başlıyor
          </h1>
          <p className="mt-1.5 text-[15px] text-pro-text-secondary leading-relaxed">
            Danışanlarınızın karakterini analiz edin,<br className="hidden md:block" />
            daha derin bir anlayışla yönlendirin.
          </p>
        </div>

        <div className="bg-pro-surface rounded-2xl border border-pro-border p-5 md:p-7 shadow-[var(--pro-shadow-md)]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="mobile-form-group md:block">
              <Input
                label="Email"
                type="email"
                placeholder="ornek@email.com"
                autoComplete="email"
                maxLength={254}
                error={errors.email?.message}
                className="mobile-input md:w-full md:min-h-0"
                {...reg("email")}
              />
            </div>
            <div className="mobile-form-group md:block">
              <Input
                label="Şifre"
                type="password"
                placeholder="En az 8 karakter"
                autoComplete="new-password"
                maxLength={72}
                error={errors.password?.message}
                className="mobile-input md:w-full md:min-h-0"
                {...reg("password")}
              />
            </div>
            <div className="mobile-form-group md:block">
              <Input
                label="Şifre Tekrar"
                type="password"
                placeholder="Şifrenizi tekrar girin"
                autoComplete="new-password"
                maxLength={72}
                error={errors.confirmPassword?.message}
                className="mobile-input md:w-full md:min-h-0"
                {...reg("confirmPassword")}
              />
            </div>

            <div className="space-y-3 pt-1">
              <label className="flex items-start gap-3 cursor-pointer touch-manipulation">
                <input
                  type="checkbox"
                  className="mt-0.5 h-5 w-5 md:h-4 md:w-4 rounded border-pro-border text-pro-primary focus:ring-pro-primary shrink-0"
                  {...reg("kvkk_accepted")}
                />
                <span className="text-xs text-pro-text-secondary leading-relaxed">
                  <Link
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pro-primary underline hover:text-pro-primary-hover"
                  >
                    KVKK Aydınlatma Metni
                  </Link>
                  &apos;ni okudum, kişisel verilerimin işlenmesini kabul ediyorum.
                </span>
              </label>
              {errors.kvkk_accepted?.message && (
                <p className="text-xs text-pro-danger pl-8 md:pl-7">
                  {errors.kvkk_accepted.message}
                </p>
              )}

              <label className="flex items-start gap-3 cursor-pointer touch-manipulation">
                <input
                  type="checkbox"
                  className="mt-0.5 h-5 w-5 md:h-4 md:w-4 rounded border-pro-border text-pro-primary focus:ring-pro-primary shrink-0"
                  {...reg("terms_accepted")}
                />
                <span className="text-xs text-pro-text-secondary leading-relaxed">
                  <Link
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pro-primary underline hover:text-pro-primary-hover"
                  >
                    Kullanım Koşulları
                  </Link>
                  &apos;nı okudum ve kabul ediyorum.
                </span>
              </label>
              {errors.terms_accepted?.message && (
                <p className="text-xs text-pro-danger pl-8 md:pl-7">
                  {errors.terms_accepted.message}
                </p>
              )}
            </div>

            <Button type="submit" fullWidth loading={loading} size="lg" className="mobile-btn md:w-full">
              <Sparkles className="h-4 w-4" />
              Ücretsiz Başla
            </Button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-sm text-pro-text-secondary">
            Zaten üye misiniz?{" "}
            <Link
              href="/auth/login"
              className="text-pro-primary font-medium hover:underline"
            >
              Giriş yapın
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
