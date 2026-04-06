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
    try {
      const supabase = createClient();
      const { data: signUpData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/pro/auth/callback`,
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

      router.push(`/auth/verify?email=${encodeURIComponent(data.email)}`);
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
          <h1 className="text-2xl sm:text-[28px] font-semibold text-pro-text">
            Yolculuğunuz burada başlıyor
          </h1>
          <p className="mt-1.5 text-[15px] text-pro-text-secondary leading-relaxed">
            Danışanlarınızın karakterini analiz edin,<br className="hidden sm:block" />
            daha derin bir anlayışla yönlendirin.
          </p>
        </div>

        <div className="bg-pro-surface rounded-2xl border border-pro-border p-5 sm:p-7 shadow-[var(--pro-shadow-md)]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="ornek@email.com"
              autoComplete="email"
              error={errors.email?.message}
              {...reg("email")}
            />
            <Input
              label="Şifre"
              type="password"
              placeholder="En az 8 karakter"
              autoComplete="new-password"
              error={errors.password?.message}
              {...reg("password")}
            />
            <Input
              label="Şifre Tekrar"
              type="password"
              placeholder="Şifrenizi tekrar girin"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...reg("confirmPassword")}
            />

            <Button type="submit" fullWidth loading={loading} size="lg">
              <Sparkles className="h-4 w-4" />
              Ücretsiz Başla
            </Button>
          </form>
        </div>

        <div className="space-y-2 text-center">
          <p className="text-sm text-pro-text-secondary">
            Zaten üye misiniz?{" "}
            <Link
              href="/auth/login"
              className="text-pro-primary font-medium hover:underline"
            >
              Giriş yapın
            </Link>
          </p>
          <p className="text-xs text-pro-text-tertiary leading-relaxed">
            Kayıt olarak{" "}
            <Link href="/privacy" className="underline hover:text-pro-text-secondary transition-colors">
              KVKK Aydınlatma Metni
            </Link>
            &apos;ni kabul etmiş olursunuz.
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
