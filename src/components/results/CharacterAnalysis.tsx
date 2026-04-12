"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { staggerContainer, paragraphReveal } from "@/lib/animations";

interface CharacterAnalysisProps {
  text: string;
  scoreWidget?: ReactNode;
}

export function CharacterAnalysis({ text, scoreWidget }: CharacterAnalysisProps) {
  const paragraphs = text.split("\n\n").filter(Boolean);

  return (
    <div className="relative">
      {/* Score badge - centered, compact hero moment */}
      {scoreWidget && (
        <div className="flex justify-center mb-5">
          {scoreWidget}
        </div>
      )}

      {/* Divider */}
      {scoreWidget && (
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          <div className="flex items-center gap-2 px-3">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#5B7B6A] to-[#3D5A4A] flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-700">Karakter Analizi</span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        </div>
      )}

      {/* No score widget - show standalone header */}
      {!scoreWidget && (
        <div className="flex items-center gap-3 mb-6">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#5B7B6A] to-[#3D5A4A] flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900">Karakter Analizi</h3>
        </div>
      )}

      {/* Paragraphs */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-4"
      >
        {paragraphs.map((paragraph, idx) => (
          <motion.p
            key={idx}
            variants={paragraphReveal}
            className="text-[14px] text-gray-600 leading-[1.8]"
          >
            {paragraph}
          </motion.p>
        ))}
      </motion.div>
    </div>
  );
}
