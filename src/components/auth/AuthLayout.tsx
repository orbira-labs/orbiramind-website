"use client";

import { Users, FileText, Brain, Sparkles, Lock } from "lucide-react";

const FEATURES = [
  { icon: Users, text: "Danışan ve randevu yönetimi tek ekranda" },
  { icon: FileText, text: "Seans notları ve ilerleme takibi" },
  { icon: Brain, text: "HAE motoru ile duygusal ve davranışsal haritalama" },
  { icon: Sparkles, text: "AQE motoru ile kişilik ve uyum analizi" },
  { icon: Lock, text: "Uçtan uca güvenli, KVKK uyumlu altyapı" },
];

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#5B7B6A] via-[#4A6A59] to-[#3D5A4C]" />

        <div className="absolute inset-0 opacity-[0.07]">
          <svg width="100%" height="100%">
            <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="white" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        {/* Subtle coral glow - only accent */}
        <div className="absolute top-[20%] right-[-20%] w-[350px] h-[350px] rounded-full bg-[#D4856A]/15 blur-[120px]" />

        <div className="absolute top-[-80px] right-[-80px] w-[300px] h-[300px] rounded-full bg-white/[0.04] blur-xl" />
        <div className="absolute bottom-[-60px] left-[-60px] w-[250px] h-[250px] rounded-full bg-white/[0.03] blur-xl" />

        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-12">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-[#D4856A] text-lg font-semibold">Orbira</span>
              <span className="text-white/60 text-lg font-light">Mind</span>
            </div>
          </div>

          <div className="space-y-5">
            <h2 className="text-4xl xl:text-5xl font-bold leading-tight">
              <span className="text-white">Danışan yönetiminde</span><br />
              <span className="text-[#D4856A]">profesyonel asistanınız.</span>
            </h2>
            <p className="text-white/55 text-sm leading-relaxed max-w-[380px]">
              Danışan takibi, randevu yönetimi, seans notları ve AI destekli derinlemesine karakter analizleri — hepsi tek platformda.
            </p>
            <div className="space-y-4 pt-4">
              {FEATURES.map((f, i) => (
                <div key={i} className="group flex items-start gap-3 cursor-default">
                  <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#D4856A]/20 transition-colors duration-300">
                    <f.icon className="h-[18px] w-[18px] text-white/80 group-hover:text-[#D4856A] transition-colors duration-300" />
                  </div>
                  <span className="text-white/70 text-[13px] leading-snug pt-1.5 group-hover:text-white/90 transition-colors duration-300">{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[10px] text-white/40 tracking-wide">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4856A]/60" />
              Powered by Orbira Labs
            </span>
            <p className="text-white/25 text-xs">
              &copy; {new Date().getFullYear()} Orbira Labs
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5 py-10 sm:px-8 bg-[var(--background)]">
        <div className="w-full max-w-[420px]">
          <div className="lg:hidden text-center mb-8">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-[#5B7B6A] to-[#4A6A59] flex items-center justify-center mb-3 shadow-[var(--pro-shadow-md)]">
              <span className="text-white text-2xl font-bold">O</span>
            </div>
            <p className="text-sm font-semibold text-pro-text">Orbira <span className="font-light text-pro-text-secondary">Mind</span></p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
