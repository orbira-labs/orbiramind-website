"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { AuthLayout } from "@/components/auth/AuthLayout";

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      router.replace("/auth/register");
    }
  }, [email, router]);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const next = [...code];
    next[index] = value.slice(-1);
    setCode(next);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = [...code];
    pasted.split("").forEach((char, i) => {
      next[i] = char;
    });
    setCode(next);
    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();
  }

  async function handleVerify() {
    const otp = code.join("");
    if (otp.length !== 6) return;

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "signup",
      });

      if (error) {
        if (error.message.includes("expired")) {
          toast.error("Kodun süresi dolmuş. Yeni kod gönderin.");
        } else if (error.message.includes("invalid")) {
          toast.error("Hatalı kod. Tekrar deneyin.");
        } else {
          toast.error("Kod hatalı veya süresi dolmuş");
        }
        return;
      }

      toast.success("Harika! Email doğrulandı.");
      router.push("/onboarding");
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    const supabase = createClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });
    if (error) {
      if (error.message.includes("already confirmed")) {
        toast.success("Email zaten doğrulanmış. Giriş yapabilirsiniz.");
        router.push("/auth/login");
        return;
      }
      toast.error("Kod gönderilemedi. Lütfen tekrar deneyin.");
    } else {
      toast.success("Yeni doğrulama kodu gönderildi");
      setResendTimer(60);
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  }

  if (!email) return null;

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="text-center md:text-left">
          <div className="mx-auto md:mx-0 h-12 w-12 rounded-2xl bg-pro-primary-light flex items-center justify-center mb-4">
            <ShieldCheck className="h-6 w-6 text-pro-primary" />
          </div>
          <h1 className="text-2xl md:text-[28px] font-semibold text-pro-text">
            Neredeyse tamam
          </h1>
          <p className="mt-1.5 text-[15px] text-pro-text-secondary leading-relaxed">
            <span className="font-medium text-pro-text">{email}</span> adresine
            gönderdiğimiz 6 haneli kodu girin.
          </p>
        </div>

        <div className="bg-pro-surface rounded-2xl border border-pro-border p-5 md:p-7 shadow-[var(--pro-shadow-md)]">
          <div className="flex justify-center gap-2 md:gap-3" onPaste={handlePaste}>
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-14 md:w-13 md:h-16 text-center text-2xl font-bold rounded-xl border-2 border-pro-border bg-[var(--pro-surface-alt)] text-pro-text focus:outline-none focus:ring-2 focus:ring-pro-primary/30 focus:border-pro-primary transition-all touch-manipulation"
              />
            ))}
          </div>

          <div className="mt-5 text-center">
            {resendTimer > 0 ? (
              <p className="text-sm text-pro-text-tertiary">
                Kod gelmedi mi?{" "}
                <span className="text-pro-text-secondary font-medium">{resendTimer}s</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="text-sm text-pro-primary font-medium hover:underline touch-manipulation min-h-[44px] flex items-center justify-center mx-auto"
              >
                Kodu tekrar gönder
              </button>
            )}
          </div>

          <Button
            fullWidth
            size="lg"
            className="mt-6 mobile-btn md:w-full"
            loading={loading}
            disabled={code.some((d) => !d)}
            onClick={handleVerify}
          >
            <ShieldCheck className="h-4 w-4" />
            Doğrula ve Devam Et
          </Button>
        </div>

        <p className="text-center text-sm text-pro-text-tertiary">
          Yanlış email mi girdiniz?{" "}
          <Link
            href="/auth/register"
            className="text-pro-primary font-medium hover:underline"
          >
            Tekrar kayıt olun
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <VerifyForm />
    </Suspense>
  );
}
