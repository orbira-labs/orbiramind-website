"use client";

import { motion } from "framer-motion";
import { Sparkles, ShieldCheck } from "lucide-react";

interface PreparationScreenProps {
  clientName?: string;
  professionalName?: string;
  onContinue: () => void;
}

function getInitials(name?: string) {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

interface ContentProps {
  clientFirstName: string;
  professionalName?: string;
  onContinue: () => void;
  size: "mobile" | "desktop";
}

function PreparationContent({ clientFirstName, professionalName, onContinue, size }: ContentProps) {
  const isMobile = size === "mobile";
  const initials = getInitials(professionalName);

  return (
    <>
      {/* Invitation card — gönderen uzmanı öne çıkarır */}
      {professionalName && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`mx-auto flex items-center gap-2.5 rounded-full bg-white/70 backdrop-blur border border-[#5B7B6A]/15 shadow-sm shadow-[#5B7B6A]/5 ${
            isMobile ? "px-3 py-1.5 mb-5" : "px-3.5 py-2 mb-7"
          }`}
        >
          <div
            className={`bg-gradient-to-br from-[#5B7B6A] to-[#4A6A59] text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${
              isMobile ? "w-6 h-6 text-[10px]" : "w-7 h-7 text-[11px]"
            }`}
          >
            {initials || <Sparkles className="w-3 h-3" />}
          </div>
          <div className={`leading-tight ${isMobile ? "text-[11px]" : "text-xs"}`}>
            <span className="text-gray-500">Davet eden</span>{" "}
            <span className="font-semibold text-gray-900">{professionalName}</span>
          </div>
        </motion.div>
      )}

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className={`font-bold text-gray-900 text-center tracking-tight ${
          isMobile ? "text-[22px] mb-2" : "text-3xl mb-3"
        }`}
      >
        {clientFirstName ? `Merhaba, ${clientFirstName}` : "Hoş geldin"}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className={`text-gray-500 text-center leading-relaxed ${
          isMobile ? "text-[13.5px] mb-6 px-1" : "text-[15px] mb-8 px-2"
        }`}
      >
        Bu kısa değerlendirme, sana özel bir analiz hazırlamak için
        alışkanlıklarını ve hedeflerini anlamamıza yardımcı olur.
      </motion.p>

      {/* Tip — single line, calmer */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className={`bg-[#5B7B6A]/[0.06] border border-[#5B7B6A]/15 rounded-2xl ${
          isMobile ? "p-3.5 mb-6" : "p-4 mb-8"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`bg-[#5B7B6A]/10 rounded-lg flex items-center justify-center flex-shrink-0 ${
              isMobile ? "w-9 h-9" : "w-10 h-10"
            }`}
          >
            <ShieldCheck className={`text-[#5B7B6A] ${isMobile ? "w-4 h-4" : "w-5 h-5"}`} />
          </div>
          <p className={`text-gray-600 leading-relaxed ${isMobile ? "text-xs" : "text-sm"}`}>
            İçten ve doğal cevapla — doğru ya da yanlış cevap yok.
          </p>
        </div>
      </motion.div>
    </>
  );
}

export function PreparationScreen({ clientName, professionalName, onContinue }: PreparationScreenProps) {
  const clientFirstName = clientName ? clientName.split(" ")[0] : "";

  return (
    <>
      {/* ========== MOBILE VIEW ========== */}
      <div className="md:hidden min-h-[100dvh] bg-gradient-to-br from-[#F5F9F7] via-white to-[#E8F0EC] flex flex-col pt-safe pb-safe">
        <div className="flex-1 flex flex-col justify-center px-5 py-6">
          <PreparationContent
            clientFirstName={clientFirstName}
            professionalName={professionalName}
            onContinue={onContinue}
            size="mobile"
          />
        </div>

        <div className="px-5 pb-5">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            onClick={onContinue}
            className="w-full min-h-[56px] py-4 bg-gradient-to-r from-[#5B7B6A] to-[#4A6A59] text-white rounded-2xl font-semibold text-base shadow-xl shadow-[#5B7B6A]/25 active:scale-[0.98] touch-manipulation"
          >
            Teste Başla
          </motion.button>
        </div>
      </div>

      {/* ========== DESKTOP VIEW ========== */}
      <div className="hidden md:flex min-h-[100dvh] bg-gradient-to-br from-[#F5F9F7] via-white to-[#E8F0EC] items-center justify-center p-4 pt-safe pb-safe">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          <PreparationContent
            clientFirstName={clientFirstName}
            professionalName={professionalName}
            onContinue={onContinue}
            size="desktop"
          />

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            onClick={onContinue}
            className="w-full min-h-[52px] py-4 bg-gradient-to-r from-[#5B7B6A] to-[#4A6A59] text-white rounded-2xl font-semibold text-base shadow-xl shadow-[#5B7B6A]/20 hover:shadow-2xl hover:shadow-[#5B7B6A]/30 transition-all active:scale-95 touch-manipulation"
          >
            Teste Başla
          </motion.button>
        </motion.div>
      </div>
    </>
  );
}
