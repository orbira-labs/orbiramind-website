"use client";

import { motion } from "framer-motion";
import { User, Brain, Ruler, Compass, type LucideIcon } from "lucide-react";

interface StageIntroProps {
  stageNumber: number;
  title: string;
  subtitle: string;
  onStart: () => void;
}

const STAGE_CONFIG: Record<number, { icon: LucideIcon; color: string }> = {
  1: { icon: User, color: "#E8915A" },
  2: { icon: Brain, color: "#7C3AED" },
  3: { icon: Ruler, color: "#5B7B6A" },
  4: { icon: Compass, color: "#059669" },
};

export function StageIntro({ stageNumber, title, subtitle, onStart }: StageIntroProps) {
  const config = STAGE_CONFIG[stageNumber] ?? STAGE_CONFIG[1];
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F9F7] via-white to-[#E8F0EC] flex items-center justify-center p-4">
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
          Aşama {stageNumber}/4
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
          className="w-full py-4 rounded-2xl font-semibold text-base shadow-xl transition-all active:scale-[0.98]"
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
  );
}
