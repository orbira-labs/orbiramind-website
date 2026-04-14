"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { LogIn, Loader2, ClipboardList, ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { normalizeTestCodeInput } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AuthLayout } from "@/components/auth/AuthLayout";

type Mode = "choice" | "login" | "test_code";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("choice");
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [testCode, setTestCode] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setLoading(true);
    const email = data.email.trim().toLowerCase();
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: data.password,
      });

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          toast.error("Email adresiniz henüz doğrulanmamış");
          router.push(`/auth/verify?email=${encodeURIComponent(data.email)}`);
          return;
        }
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Email veya şifre hatalı");
          return;
        }
        toast.error(error.message);
        return;
      }

      setRedirecting(true);
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  function handleTestCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = normalizeTestCodeInput(testCode);
    if (!code) {
      toast.error("Lütfen test kodunuzu girin");
      return;
    }
    if (code.length !== 8) {
      toast.error("Test kodu 8 karakter olmalıdır");
      return;
    }
    router.push(`/t/${code}`);
  }

  return (
    <>
      {redirecting && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--background)]">
          <div className="flex flex-col items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#5B7B6A] to-[#4A6A59] flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">O</span>
            </div>
            <Loader2 className="h-5 w-5 animate-spin text-pro-primary" />
          </div>
        </div>
      )}

      <AuthLayout>
        {mode === "choice" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-[28px] font-semibold text-pro-text">
                Hoş geldiniz
              </h1>
              <p className="mt-1.5 text-[15px] text-pro-text-secondary leading-relaxed">
                Nasıl devam etmek istersiniz?
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setMode("login")}
                className="w-full flex items-center gap-4 p-4 md:p-5 bg-gradient-to-r from-[#5B7B6A] to-[#4A6A59] rounded-2xl shadow-lg shadow-[#5B7B6A]/20 hover:shadow-xl hover:shadow-[#5B7B6A]/30 transition-all text-left group touch-manipulation"
              >
                <div className="h-11 w-11 md:h-12 md:w-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0 group-hover:bg-white/25 transition-colors">
                  <LogIn className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-white">Uzman Girişi</p>
                  <p className="text-sm text-white/70 mt-0.5">
                    Profesyonel hesabınızla giriş yapın
                  </p>
                </div>
              </button>

              <button
                onClick={() => setMode("test_code")}
                className="w-full flex items-center gap-4 p-4 md:p-5 bg-pro-surface rounded-2xl border border-pro-border shadow-[var(--pro-shadow-md)] hover:border-[#C8745E]/40 hover:shadow-[var(--pro-shadow-lg)] transition-all text-left group touch-manipulation"
              >
                <div className="h-11 w-11 md:h-12 md:w-12 rounded-xl bg-[#C8745E]/10 flex items-center justify-center shrink-0 group-hover:bg-[#C8745E]/20 transition-colors">
                  <ClipboardList className="h-5 w-5 md:h-6 md:w-6 text-[#C8745E]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[15px] font-semibold text-pro-text">Test Kodumu Gir</p>
                    <span className="px-1.5 py-0.5 rounded-md bg-[#C8745E]/10 text-[#C8745E] text-[10px] font-bold uppercase tracking-wider">
                      Yeni
                    </span>
                  </div>
                  <p className="text-sm text-pro-text-tertiary mt-0.5">
                    Uzmanınızdan aldığınız kodu girin
                  </p>
                </div>
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-pro-text-secondary">
                Henüz üye değil misiniz?{" "}
                <Link
                  href="/auth/register"
                  className="text-[#C8745E] font-medium hover:underline"
                >
                  Hemen başlayın
                </Link>
              </p>
            </div>
          </div>
        )}

        {mode === "test_code" && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMode("choice")}
                className="h-10 w-10 md:h-8 md:w-8 rounded-lg flex items-center justify-center text-pro-text-secondary hover:bg-pro-surface-alt transition-colors touch-manipulation"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl md:text-[28px] font-semibold text-pro-text">
                  Test Kodunu Gir
                </h1>
                <p className="mt-0.5 text-[15px] text-pro-text-secondary leading-relaxed">
                  Uzmanınızın size verdiği kodu girin.
                </p>
              </div>
            </div>

            <div className="bg-pro-surface rounded-2xl border border-pro-border p-5 md:p-7 shadow-[var(--pro-shadow-md)]">
              <form onSubmit={handleTestCodeSubmit} className="space-y-4">
                <div className="mobile-form-group md:block">
                  <label className="block text-sm font-medium text-pro-text mb-1.5">
                    Test Kodu
                  </label>
                  <input
                    type="text"
                    value={testCode}
                    onChange={(e) => setTestCode(normalizeTestCodeInput(e.target.value))}
                    placeholder="Örn: abc123def456"
                    autoComplete="off"
                    autoCapitalize="characters"
                    spellCheck={false}
                    maxLength={8}
                    aria-label="Test Kodu"
                    autoFocus
                    className="mobile-input md:w-full md:min-h-0 md:px-4 md:py-2.5 md:rounded-lg border border-pro-border bg-pro-surface text-sm text-pro-text placeholder:text-pro-text-tertiary focus:outline-none focus:ring-2 focus:ring-pro-primary/30 focus:border-pro-primary font-mono tracking-wide"
                  />
                </div>
                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  disabled={normalizeTestCodeInput(testCode).length !== 8}
                  className="mobile-btn md:w-full"
                >
                  <ClipboardList className="h-4 w-4" />
                  Teste Başla
                </Button>
              </form>
            </div>
          </div>
        )}

        {mode === "login" && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMode("choice")}
                className="h-10 w-10 md:h-8 md:w-8 rounded-lg flex items-center justify-center text-pro-text-secondary hover:bg-pro-surface-alt transition-colors touch-manipulation"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl md:text-[28px] font-semibold text-pro-text">
                  Tekrar hoş geldiniz
                </h1>
                <p className="mt-0.5 text-[15px] text-pro-text-secondary leading-relaxed">
                  Danışanlarınız sizi bekliyor.
                </p>
              </div>
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
                    {...register("email")}
                  />
                </div>
                <div className="mobile-form-group md:block">
                  <Input
                    label="Şifre"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    maxLength={72}
                    error={errors.password?.message}
                    className="mobile-input md:w-full md:min-h-0"
                    {...register("password")}
                  />
                </div>

                <Button type="submit" fullWidth loading={loading} size="lg" className="mobile-btn md:w-full">
                  <LogIn className="h-4 w-4" />
                  Giriş Yap
                </Button>
              </form>
            </div>

            <div className="text-center">
              <p className="text-sm text-pro-text-secondary">
                Henüz üye değil misiniz?{" "}
                <Link
                  href="/auth/register"
                  className="text-[#C8745E] font-medium hover:underline"
                >
                  Hemen başlayın
                </Link>
              </p>
            </div>
          </div>
        )}
      </AuthLayout>
    </>
  );
}
