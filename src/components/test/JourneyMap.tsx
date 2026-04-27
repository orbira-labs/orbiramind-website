"use client";

import { motion } from "framer-motion";
import { User, Brain, Compass } from "lucide-react";

interface JourneyMapProps {
  onStart: () => void;
}

const STAGES = [
  {
    number: 1,
    title: "Temel Bilgiler",
    subtitle: "Demografik ve yaşam tarzı bilgileri",
    icon: User,
    color: "#E8915A",
  },
  {
    number: 2,
    title: "Çekirdek Analiz",
    subtitle: "Kişilik özelliklerini ve davranış kalıplarını anlama",
    icon: Brain,
    color: "#7C3AED",
  },
  {
    number: 3,
    title: "Akıllı Keşif",
    subtitle: "Sana özel detaylı sorular",
    icon: Compass,
    color: "#059669",
  },
];

export function JourneyMap({
  onStart,
}: JourneyMapProps) {
  return (
    <>
      {/* ========== MOBILE VIEW ========== */}
      <div className="md:hidden min-h-[100dvh] bg-gradient-to-br from-[#F5F9F7] via-white to-[#E8F0EC] flex flex-col pt-safe pb-safe">
        <div className="flex-1 flex flex-col justify-center px-4 py-5">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.25 }}
            className="text-lg font-bold text-gray-900 text-center mb-4"
          >
            3 Aşamada Seni Tanıyacağız
          </motion.h1>

          {/* Compact Mobile Stages - Minimal vertical design */}
          <div className="space-y-2 mb-4">
            {STAGES.map((stage, index) => (
                <motion.div
                  key={stage.number}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.07, duration: 0.2 }}
                  className="bg-white rounded-xl border shadow-sm overflow-hidden"
                  style={{ borderColor: `${stage.color}25` }}
                >
                  <div className="flex items-center p-2.5">
                    {/* Number Badge - Smaller */}
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mr-2.5"
                      style={{ backgroundColor: `${stage.color}12`, border: `1.5px solid ${stage.color}35` }}
                    >
                      <span className="text-sm font-bold" style={{ color: stage.color }}>
                        {stage.number}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-[13px]">{stage.title}</h3>
                      <p className="text-[11px] text-gray-500 line-clamp-1">{stage.subtitle}</p>
                    </div>

                  </div>
                </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile CTA - Fixed bottom */}
        <div className="px-4 pb-5">
          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.2 }}
            onClick={onStart}
            className="w-full min-h-[56px] py-4 bg-gradient-to-r from-[#5B7B6A] to-[#4A6A59] text-white rounded-2xl font-semibold text-base shadow-lg shadow-[#5B7B6A]/20 active:scale-[0.97] touch-manipulation"
          >
            Başlayalım!
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
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-bold text-gray-900 text-center mb-6"
          >
            3 Aşamada Seni Tanıyacağız
          </motion.h1>

          {/* Desktop Stages - Full vertical layout */}
          <div className="space-y-3 mb-6">
            {STAGES.map((stage, index) => (
                <motion.div
                  key={stage.number}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white rounded-2xl border shadow-sm overflow-hidden"
                  style={{ borderColor: `${stage.color}30` }}
                >
                  <div className="flex items-center p-4">
                    {/* Number Badge */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mr-4"
                      style={{ backgroundColor: `${stage.color}15`, border: `2px solid ${stage.color}40` }}
                    >
                      <span className="text-base font-bold" style={{ color: stage.color }}>
                        {stage.number}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm">{stage.title}</h3>
                      <p className="text-xs text-gray-500 line-clamp-1">{stage.subtitle}</p>
                    </div>

                  </div>

                  {/* Connector Line */}
                  {index < STAGES.length - 1 && (
                    <div className="h-3 ml-9 border-l-2 border-dashed border-gray-200" />
                  )}
                </motion.div>
            ))}
          </div>

          {/* Start Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            onClick={onStart}
            className="w-full min-h-[52px] py-4 bg-gradient-to-r from-[#5B7B6A] to-[#4A6A59] text-white rounded-2xl font-semibold text-base shadow-xl shadow-[#5B7B6A]/20 hover:shadow-2xl hover:shadow-[#5B7B6A]/30 transition-all active:scale-95 touch-manipulation"
          >
            Başlayalım!
          </motion.button>
        </motion.div>
      </div>
    </>
  );
}
