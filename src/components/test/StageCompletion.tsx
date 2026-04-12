"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StageCompletionProps {
  stageNumber: number;
  isLastStage?: boolean;
  onContinue: () => void;
}

const STAGE_COLORS = ["#E8915A", "#7C3AED", "#059669"];

export function StageCompletion({ stageNumber, isLastStage = false, onContinue }: StageCompletionProps) {
  const color = STAGE_COLORS[stageNumber - 1] ?? STAGE_COLORS[0];

  useEffect(() => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }, []);

  const title = isLastStage
    ? "Tüm Sorular Tamamlandı!"
    : `Aşama ${stageNumber} Tamamlandı!`;

  const subtitle = isLastStage
    ? "Harika iş çıkardın! Artık analizin hazırlanıyor."
    : stageNumber === 1
    ? "Temel bilgilerini aldık. Şimdi seni daha yakından tanıyacağız."
    : stageNumber === 2
    ? "Çekirdek analizini tamamladın. Son aşama için hazırsın!"
    : "Bir adım daha tamamlandı!";

  const buttonText = isLastStage ? "Devam Et" : "Sonraki Aşamaya Geç";

  return (
    <>
      {/* ========== MOBILE VIEW ========== */}
      <div className="md:hidden min-h-[100dvh] bg-gradient-to-br from-[#F5F9F7] via-white to-[#E8F0EC] flex flex-col pt-safe pb-safe">
        <div className="flex-1 flex flex-col justify-center px-5 py-6">
          {/* Check Icon - Smaller and faster for mobile */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 250, damping: 15, delay: 0.1 }}
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{
              backgroundColor: `${color}15`,
              border: `2px solid ${color}30`,
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.25, type: "spring", stiffness: 350 }}
            >
              <Check className="w-8 h-8" style={{ color }} strokeWidth={3} />
            </motion.div>
          </motion.div>

          {/* Stage Badge */}
          {!isLastStage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.2 }}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold mb-2.5 mx-auto"
              style={{ backgroundColor: `${color}15`, color }}
            >
              {stageNumber}/3 Tamamlandı
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.2 }}
            className="text-lg font-bold text-gray-900 mb-2 text-center"
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.2 }}
            className="text-gray-500 text-sm text-center px-2 leading-relaxed"
          >
            {subtitle}
          </motion.p>

          {/* Progress Indicator - Mobile */}
          {!isLastStage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.2 }}
              className="flex justify-center gap-1.5 mt-5"
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i === stageNumber ? "w-5" : "w-2"
                  }`}
                  style={{
                    backgroundColor: i <= stageNumber ? STAGE_COLORS[i - 1] : "#E5E7EB",
                  }}
                />
              ))}
            </motion.div>
          )}
        </div>

        {/* Mobile CTA - Fixed bottom */}
        <div className="px-5 pb-5">
          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.2 }}
            onClick={onContinue}
            className="w-full min-h-[56px] py-4 rounded-2xl font-semibold text-base shadow-lg transition-all active:scale-[0.97] touch-manipulation"
            style={{
              backgroundColor: color,
              color: "white",
              boxShadow: `0 8px 20px ${color}25`,
            }}
          >
            {buttonText}
          </motion.button>
        </div>
      </div>

      {/* ========== DESKTOP VIEW ========== */}
      <div className="hidden md:flex min-h-[100dvh] bg-gradient-to-br from-[#F5F9F7] via-white to-[#E8F0EC] items-center justify-center p-4 pt-safe pb-safe">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full text-center"
        >
          {/* Check Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
            style={{
              backgroundColor: `${color}15`,
              border: `3px solid ${color}30`,
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
            >
              <Check className="w-12 h-12" style={{ color }} strokeWidth={3} />
            </motion.div>
          </motion.div>

          {/* Stage Badge */}
          {!isLastStage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-4"
              style={{ backgroundColor: `${color}15`, color }}
            >
              {stageNumber}/3 Tamamlandı
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl font-bold text-gray-900 mb-3"
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-500 text-sm mb-8 px-4"
          >
            {subtitle}
          </motion.p>

          {/* Progress Indicator */}
          {!isLastStage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex justify-center gap-2 mb-8"
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-2.5 rounded-full transition-all ${
                    i === stageNumber ? "w-7" : "w-2.5"
                  }`}
                  style={{
                    backgroundColor: i <= stageNumber ? STAGE_COLORS[i - 1] : "#E5E7EB",
                  }}
                />
              ))}
            </motion.div>
          )}

          {/* Continue Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            onClick={onContinue}
            className="w-full min-h-[52px] py-4 rounded-2xl font-semibold text-base shadow-xl transition-all active:scale-95 touch-manipulation"
            style={{
              backgroundColor: color,
              color: "white",
              boxShadow: `0 10px 25px ${color}30`,
            }}
          >
            {buttonText}
          </motion.button>
        </motion.div>
      </div>
    </>
  );
}
