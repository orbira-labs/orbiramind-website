"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface PreparationScreenProps {
  clientName?: string;
  professionalName?: string;
  onContinue: () => void;
}

export function PreparationScreen({
  clientName,
  professionalName,
  onContinue,
}: PreparationScreenProps) {
  const firstName = clientName ? clientName.split(" ")[0] : "";

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#F7FAF8] text-gray-900 flex items-center justify-center px-6 pt-safe pb-safe">
      {/* Aurora background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-32 w-[520px] h-[520px] rounded-full blur-[110px]"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, #B6D4C5 0%, rgba(91,123,106,0.0) 70%)",
          }}
          animate={{
            x: [0, 60, -20, 0],
            y: [0, 30, 60, 0],
            scale: [1, 1.08, 0.95, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -right-32 w-[560px] h-[560px] rounded-full blur-[120px]"
          style={{
            background:
              "radial-gradient(circle at 70% 70%, #D9E8E0 0%, rgba(91,123,106,0.0) 70%)",
          }}
          animate={{
            x: [0, -40, 20, 0],
            y: [0, -30, -50, 0],
            scale: [1, 1.05, 1.1, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full blur-[100px] opacity-70"
          style={{
            background:
              "radial-gradient(circle, rgba(182,212,197,0.55) 0%, rgba(247,250,248,0) 70%)",
          }}
          animate={{ scale: [1, 1.12, 0.96, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Subtle grain via radial dots */}
        <div
          className="absolute inset-0 opacity-[0.18] mix-blend-multiply"
          style={{
            backgroundImage:
              "radial-gradient(rgba(91,123,106,0.18) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[520px] flex flex-col items-center text-center">
        {/* Inviter eyebrow */}
        {professionalName && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-[#5B7B6A]/80"
          >
            <span className="h-px w-8 bg-[#5B7B6A]/30" />
            <span>{professionalName} · Davet</span>
            <span className="h-px w-8 bg-[#5B7B6A]/30" />
          </motion.div>
        )}

        {/* Greeting */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-bold tracking-[-0.02em] text-[44px] sm:text-[64px] leading-[1.02] text-gray-900"
        >
          {firstName ? (
            <>
              Merhaba,
              <br />
              <span className="bg-gradient-to-br from-[#3D5A4A] via-[#5B7B6A] to-[#7FA08C] bg-clip-text text-transparent">
                {firstName}.
              </span>
            </>
          ) : (
            "Hoş geldin."
          )}
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-6 text-[15px] sm:text-[17px] text-gray-500 leading-relaxed max-w-[420px]"
        >
          Sana özel bir analiz hazırlayabilmek için seni biraz tanımak
          istiyoruz. İçten cevap vermen yeterli.
        </motion.p>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          onClick={onContinue}
          className="group relative mt-12 inline-flex items-center justify-center gap-3 min-h-[56px] px-9 rounded-full bg-gray-900 text-white font-medium text-[15px] tracking-wide shadow-[0_20px_50px_-15px_rgba(17,24,39,0.55)] hover:shadow-[0_25px_60px_-15px_rgba(17,24,39,0.65)] transition-all active:scale-[0.98] touch-manipulation"
        >
          <span>Başlayalım</span>
          <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-white/15 group-hover:bg-white/25 transition-colors">
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </motion.button>

        {/* Microcopy under button */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.95 }}
          className="mt-6 text-[12px] text-gray-400 tracking-wide"
        >
          Yaklaşık 10 dakika · Doğru ya da yanlış cevap yok
        </motion.p>
      </div>
    </div>
  );
}
