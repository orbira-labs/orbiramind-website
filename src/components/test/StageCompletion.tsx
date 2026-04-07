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
    <div className="min-h-[100dvh] bg-gradient-to-br from-[#F5F9F7] via-white to-[#E8F0EC] flex items-center justify-center p-4 pt-safe pb-safe">
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
          className="w-20 sm:w-24 h-20 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8"
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
            <Check className="w-10 sm:w-12 h-10 sm:h-12" style={{ color }} strokeWidth={3} />
          </motion.div>
        </motion.div>

        {/* Stage Badge */}
        {!isLastStage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold mb-3 sm:mb-4"
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
          className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3"
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-500 text-sm mb-6 sm:mb-8 px-4"
        >
          {subtitle}
        </motion.p>

        {/* Progress Indicator */}
        {!isLastStage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-8"
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-2 sm:h-2.5 rounded-full transition-all ${
                  i === stageNumber ? "w-6 sm:w-7" : "w-2 sm:w-2.5"
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
          className="w-full min-h-[52px] py-3.5 sm:py-4 rounded-2xl font-semibold text-base shadow-xl transition-all active:scale-95 touch-manipulation"
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
  );
}
