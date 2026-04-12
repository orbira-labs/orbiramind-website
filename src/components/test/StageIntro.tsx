"use client";

import { motion } from "framer-motion";
import { User, Brain, Compass, type LucideIcon } from "lucide-react";

interface StageIntroProps {
  stageNumber: number;
  title: string;
  subtitle: string;
  onStart: () => void;
}

const STAGE_CONFIG: Record<number, { icon: LucideIcon; color: string }> = {
  1: { icon: User, color: "#E8915A" },
  2: { icon: Brain, color: "#7C3AED" },
  3: { icon: Compass, color: "#059669" },
};

export function StageIntro({ stageNumber, title, subtitle, onStart }: StageIntroProps) {
  const config = STAGE_CONFIG[stageNumber] ?? STAGE_CONFIG[1];
  const Icon = config.icon;

  return (
    <>
      {/* ========== MOBILE VIEW ========== */}
      <div className="md:hidden min-h-[100dvh] bg-gradient-to-br from-[#F5F9F7] via-white to-[#E8F0EC] flex flex-col pt-safe pb-safe">
        <div className="flex-1 flex flex-col justify-center px-5 py-6">
          {/* Stage Badge */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.25 }}
            className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 mx-auto"
            style={{
              backgroundColor: `${config.color}15`,
              color: config.color,
              border: `1px solid ${config.color}30`,
            }}
          >
            Aşama {stageNumber}/3
          </motion.div>

          {/* Icon - Smaller and faster animation for mobile */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 250, damping: 18, delay: 0.2 }}
            className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
            style={{
              backgroundColor: `${config.color}10`,
              border: `2px solid ${config.color}25`,
            }}
          >
            <Icon className="w-7 h-7" style={{ color: config.color }} />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.25 }}
            className="text-lg font-bold text-gray-900 mb-2 text-center"
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.25 }}
            className="text-gray-500 text-sm text-center px-2 leading-relaxed"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Mobile CTA - Fixed bottom */}
        <div className="px-5 pb-5">
          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.25 }}
            onClick={onStart}
            className="w-full min-h-[56px] py-4 rounded-2xl font-semibold text-base shadow-lg transition-all active:scale-[0.97] touch-manipulation"
            style={{
              backgroundColor: config.color,
              color: "white",
              boxShadow: `0 8px 20px ${config.color}25`,
            }}
          >
            Başla
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
          {/* Stage Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6"
            style={{
              backgroundColor: `${config.color}15`,
              color: config.color,
              border: `1px solid ${config.color}30`,
            }}
          >
            Aşama {stageNumber}/3
          </motion.div>

          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{
              backgroundColor: `${config.color}10`,
              border: `2px solid ${config.color}25`,
            }}
          >
            <Icon className="w-9 h-9" style={{ color: config.color }} />
          </motion.div>

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
            className="text-gray-500 text-sm mb-10 px-4"
          >
            {subtitle}
          </motion.p>

          {/* Start Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={onStart}
            className="w-full min-h-[52px] py-4 rounded-2xl font-semibold text-base shadow-xl transition-all active:scale-95 touch-manipulation"
            style={{
              backgroundColor: config.color,
              color: "white",
              boxShadow: `0 10px 25px ${config.color}30`,
            }}
          >
            Başla
          </motion.button>
        </motion.div>
      </div>
    </>
  );
}
