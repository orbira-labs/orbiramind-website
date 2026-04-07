"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface MidwayMotivationProps {
  completedCount: number;
  totalCount: number;
  onContinue: () => void;
}

export function MidwayMotivation({ completedCount, totalCount, onContinue }: MidwayMotivationProps) {
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 50;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F9F7] via-white to-[#E8F0EC] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full text-center"
      >
        {/* Progress Circle */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="relative w-28 h-28 mx-auto mb-8"
        >
          {/* Background Circle */}
          <svg className="w-28 h-28 transform -rotate-90">
            <circle
              cx="56"
              cy="56"
              r="48"
              fill="none"
              stroke="#7C3AED20"
              strokeWidth="8"
            />
            <motion.circle
              cx="56"
              cy="56"
              r="48"
              fill="none"
              stroke="#7C3AED"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 48}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 48 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 48 * (1 - progress / 100) }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </svg>
          
          {/* Inner Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-[#7C3AED]/10 rounded-full flex items-center justify-center">
              <Flame className="w-8 h-8 text-[#7C3AED]" />
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl font-bold text-gray-900 mb-4"
        >
          Harika Gidiyorsun!
        </motion.h1>

        {/* Progress Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="inline-flex items-center px-4 py-2 bg-[#7C3AED]/10 rounded-xl mb-5"
        >
          <span className="text-sm font-bold text-[#7C3AED]">
            {completedCount}/{totalCount} soru tamamlandı
          </span>
        </motion.div>

        {/* Motivation Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-500 text-sm mb-10 px-4"
        >
          Yorulduğunu biliyoruz, biraz daha sabret. Bu aşamayı yarıladın, az kaldı!
        </motion.p>

        {/* Continue Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          onClick={onContinue}
          className="w-full py-4 bg-[#7C3AED] text-white rounded-2xl font-semibold text-base shadow-xl shadow-[#7C3AED]/25 hover:shadow-2xl transition-all active:scale-[0.98]"
        >
          Devam Et
        </motion.button>
      </motion.div>
    </div>
  );
}
