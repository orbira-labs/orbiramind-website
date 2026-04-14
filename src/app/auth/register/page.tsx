"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AuthLayout } from "@/components/auth/AuthLayout";

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  kvkk?: string;
  terms?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  function validateForm(): boolean {
    const newErrors: FormErrors = {};

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      newErrors.email = "Email adresi gerekli";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = "Geçerli bir email adresi girin";
    }

    if (!password) {
      newErrors.password = "Şifre gerekli";
    } else if (password.length < 8) {
      newErrors.password = "Şifre en az 8 karakter olmalı";
    } else if (password.length > 72) {
      newErrors.password = "Şifre en fazla 72 karakter olabilir";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Şifre tekrarı gerekli";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Şifreler eşleşmiyor";
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

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const trimmedEmail = email.trim().toLowerCase();

    try {
      const supabase = createClient();
      const { data: signUpData, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
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

      router.push(`/auth/verify?email=${encodeURIComponent(trimmedEmail)}`);
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
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
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="mobile-form-group md:block">
              <Input
                label="Email"
                type="email"
                placeholder="ornek@email.com"
                autoComplete="email"
                maxLength={254}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError("email");
                }}
                error={errors.email}
                className="mobile-input md:w-full md:min-h-0"
              />
            </div>
            <div className="mobile-form-group md:block">
              <Input
                label="Şifre"
                type="password"
                placeholder="En az 8 karakter"
                autoComplete="new-password"
                maxLength={72}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError("password");
                }}
                error={errors.password}
                className="mobile-input md:w-full md:min-h-0"
              />
            </div>
            <div className="mobile-form-group md:block">
              <Input
                label="Şifre Tekrar"
                type="password"
                placeholder="Şifrenizi tekrar girin"
                autoComplete="new-password"
                maxLength={72}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  clearError("confirmPassword");
                }}
                error={errors.confirmPassword}
                className="mobile-input md:w-full md:min-h-0"
              />
            </div>

            <div className="space-y-3 pt-1">
              <label className="flex items-start gap-3 cursor-pointer touch-manipulation">
                <input
                  type="checkbox"
                  checked={kvkkAccepted}
                  onChange={(e) => {
                    setKvkkAccepted(e.target.checked);
                    clearError("kvkk");
                  }}
                  className="mt-0.5 h-5 w-5 md:h-4 md:w-4 rounded border-pro-border text-pro-primary focus:ring-pro-primary shrink-0"
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
              {errors.kvkk && (
                <p className="text-xs text-pro-danger pl-8 md:pl-7">
                  {errors.kvkk}
                </p>
              )}

              <label className="flex items-start gap-3 cursor-pointer touch-manipulation">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                    clearError("terms");
                  }}
                  className="mt-0.5 h-5 w-5 md:h-4 md:w-4 rounded border-pro-border text-pro-primary focus:ring-pro-primary shrink-0"
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
              {errors.terms && (
                <p className="text-xs text-pro-danger pl-8 md:pl-7">
                  {errors.terms}
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
