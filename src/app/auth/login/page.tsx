"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
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

      router.push("/dashboard");
      router.refresh();
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
            Tekrar hoş geldiniz
          </h1>
          <p className="mt-1.5 text-[15px] text-pro-text-secondary leading-relaxed">
            Danışanlarınız sizi bekliyor.
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
              {...register("email")}
            />
            <Input
              label="Şifre"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register("password")}
            />

            <Button type="submit" fullWidth loading={loading} size="lg">
              <LogIn className="h-4 w-4" />
              Giriş Yap
            </Button>
          </form>
        </div>

        <div className="space-y-2 text-center">
          <p className="text-sm text-pro-text-secondary">
            Henüz üye değil misiniz?{" "}
            <Link
              href="/auth/register"
              className="text-pro-primary font-medium hover:underline"
            >
              Hemen başlayın
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
