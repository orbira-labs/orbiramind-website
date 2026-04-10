"use client";

import { motion } from "framer-motion";
import { staggerContainer, paragraphReveal } from "@/lib/animations";

interface CharacterAnalysisProps {
  text: string;
}

export function CharacterAnalysis({ text }: CharacterAnalysisProps) {
  const paragraphs = text.split("\n\n").filter(Boolean);

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="relative">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#5B7B6A] to-[#3D5A4A] flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <div className="absolute -inset-1 bg-[#5B7B6A]/15 rounded-xl blur-md -z-10" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Karakter Analizi</h3>
          <p className="text-xs text-gray-500">AI destekli kişilik profili</p>
        </div>
      </div>

      {/* Content area with decorative elements */}
      <div className="relative">
        {/* Large decorative quote mark */}
        <div className="absolute -top-2 -left-1 text-7xl font-serif text-[#5B7B6A]/[0.07] leading-none select-none pointer-events-none">
          &ldquo;
        </div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="relative rounded-2xl overflow-hidden"
        >
          {/* Gradient border effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#5B7B6A]/10 via-transparent to-[#5B7B6A]/5 rounded-2xl" />
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#5B7B6A] via-[#5B7B6A]/50 to-transparent rounded-l-2xl" />

          <div className="relative bg-gradient-to-br from-[#FAFAF7] to-white p-6 sm:p-8 ml-0">
            {paragraphs.map((paragraph, idx) => (
              <motion.div
                key={idx}
                variants={paragraphReveal}
                className="mb-5 last:mb-0"
              >
                {idx === 0 && (
                  <div className="float-left mr-3 mt-1 w-8 h-8 rounded-lg bg-gradient-to-br from-[#5B7B6A]/10 to-[#5B7B6A]/5 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-[#5B7B6A]">{idx + 1}</span>
                  </div>
                )}
                {idx !== 0 && (
                  <div className="float-left mr-3 mt-1 w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-gray-400">{idx + 1}</span>
                  </div>
                )}
                <p className="text-[15px] text-gray-700 leading-[1.8] tracking-[0.01em]">
                  {paragraph}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom decorative quote */}
        <div className="absolute -bottom-4 -right-1 text-7xl font-serif text-[#5B7B6A]/[0.07] leading-none select-none pointer-events-none rotate-180">
          &ldquo;
        </div>
      </div>
    </div>
  );
}
