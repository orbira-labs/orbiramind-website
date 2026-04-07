"use client";

import { motion } from "framer-motion";
import { User, Brain, Compass, Clock, Bookmark } from "lucide-react";

interface JourneyMapProps {
  profileGroupCount: number;
  coreQuestionCount: number;
  onStart: () => void;
}

const STAGES = [
  {
    number: 1,
    title: "Temel Bilgiler",
    subtitle: "Demografik ve yaşam tarzı bilgileri (boy, kilo dahil)",
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
    title: "Derinlemesine Keşif",
    subtitle: "Sana özel detaylı sorular",
    icon: Compass,
    color: "#059669",
  },
];

export function JourneyMap({
  profileGroupCount,
  coreQuestionCount,
  onStart,
}: JourneyMapProps) {
  const totalQuestions = profileGroupCount + coreQuestionCount + 15; // ~15 deep dive estimate
  const estimatedMinutes = Math.ceil(totalQuestions / 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F9F7] via-white to-[#E8F0EC] flex items-center justify-center p-4">
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

        {/* Stages */}
        <div className="space-y-3 mb-6">
          {STAGES.map((stage, index) => {
            const Icon = stage.icon;
            const questionCount =
              stage.number === 1 ? `~${profileGroupCount}` :
              stage.number === 2 ? `~${coreQuestionCount}` :
              "~15";

            return (
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
                    <p className="text-xs text-gray-500 truncate">{stage.subtitle}</p>
                  </div>

                  {/* Question Count */}
                  <div
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold flex-shrink-0"
                    style={{ backgroundColor: `${stage.color}10`, color: stage.color }}
                  >
                    {questionCount}
                  </div>
                </div>

                {/* Connector Line */}
                {index < STAGES.length - 1 && (
                  <div className="h-3 ml-9 border-l-2 border-dashed border-gray-200" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Time Estimate */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center gap-2 bg-[#5B7B6A]/5 rounded-xl px-4 py-3 mb-4"
        >
          <Clock className="w-4 h-4 text-[#5B7B6A]" />
          <span className="text-sm font-medium text-[#5B7B6A]">
            ~{totalQuestions} soru · ~{estimatedMinutes} dakika
          </span>
        </motion.div>

        {/* Resume Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 mb-6"
        >
          <Bookmark className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <p className="text-xs text-gray-500">
            Yarıda kalırsan kaldığın yerden devam edebilirsin, cevapların kaybolmaz.
          </p>
        </motion.div>

        {/* Start Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          onClick={onStart}
          className="w-full py-4 bg-gradient-to-r from-[#5B7B6A] to-[#4A6A59] text-white rounded-2xl font-semibold text-base shadow-xl shadow-[#5B7B6A]/20 hover:shadow-2xl hover:shadow-[#5B7B6A]/30 transition-all active:scale-[0.98]"
        >
          Başlayalım!
        </motion.button>
      </motion.div>
    </div>
  );
}
