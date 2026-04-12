"use client";

import { motion } from "framer-motion";
import { Sparkles, Lightbulb } from "lucide-react";

interface PreparationScreenProps {
  clientName?: string;
  onContinue: () => void;
}

export function PreparationScreen({ clientName, onContinue }: PreparationScreenProps) {
  return (
    <>
      {/* ========== MOBILE VIEW ========== */}
      <div className="md:hidden min-h-[100dvh] bg-gradient-to-br from-[#F5F9F7] via-white to-[#E8F0EC] flex flex-col pt-safe pb-safe">
        <div className="flex-1 flex flex-col justify-center px-5 py-6">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-16 h-16 bg-gradient-to-br from-[#5B7B6A] to-[#4A6A59] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[#5B7B6A]/30"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl font-bold text-gray-900 text-center mb-2"
          >
            Keşif Yolculuğuna{clientName ? ` ${clientName.split(" ")[0]}` : ""} Hoş Geldin
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-gray-500 text-center mb-6 leading-relaxed"
          >
            Bu analiz, sana özel bir değerlendirme oluşturmak için alışkanlıklarını, değerlerini ve hedeflerini anlamamıza yardımcı olacak.
          </motion.p>

          {/* Tip Box - More compact for mobile */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#5B7B6A]/5 border border-[#5B7B6A]/15 rounded-xl p-3.5"
          >
            <div className="flex gap-3">
              <div className="w-9 h-9 bg-[#5B7B6A]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-4.5 h-4.5 text-[#5B7B6A]" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-[#5B7B6A] mb-0.5 text-sm">Önemli İpucu</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  En doğru sonuçlar için içinden geldiği gibi, dürüstçe cevapla. Doğru ya da yanlış cevap yok!
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mobile CTA - Fixed bottom with safe area */}
        <div className="px-5 pb-5">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={onContinue}
            className="w-full min-h-[56px] py-4 bg-gradient-to-r from-[#5B7B6A] to-[#4A6A59] text-white rounded-2xl font-semibold text-base shadow-xl shadow-[#5B7B6A]/25 active:scale-[0.98] touch-manipulation"
          >
            Anladım, Devam Et
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
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-br from-[#5B7B6A] to-[#4A6A59] rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-[#5B7B6A]/30"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-900 text-center mb-2 px-2"
          >
            Keşif Yolculuğuna{clientName ? ` ${clientName.split(" ")[0]}` : ""} Hoş Geldin
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base text-gray-500 text-center mb-8 px-2"
          >
            Bu analiz, sana özel bir değerlendirme oluşturmak için alışkanlıklarını, değerlerini ve hedeflerini anlamamıza yardımcı olacak.
          </motion.p>

          {/* Tip Box */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#5B7B6A]/5 border border-[#5B7B6A]/15 rounded-2xl p-5 mb-8"
          >
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-[#5B7B6A]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-[#5B7B6A]" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-[#5B7B6A] mb-1 text-base">Önemli İpucu</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  En doğru sonuçlar için içinden geldiği gibi, dürüstçe cevapla. Doğru ya da yanlış cevap yok!
                </p>
              </div>
            </div>
          </motion.div>

          {/* Continue Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={onContinue}
            className="w-full min-h-[52px] py-4 bg-gradient-to-r from-[#5B7B6A] to-[#4A6A59] text-white rounded-2xl font-semibold text-base shadow-xl shadow-[#5B7B6A]/20 hover:shadow-2xl hover:shadow-[#5B7B6A]/30 transition-all active:scale-95 touch-manipulation"
          >
            Anladım, Devam Et
          </motion.button>
        </motion.div>
      </div>
    </>
  );
}
