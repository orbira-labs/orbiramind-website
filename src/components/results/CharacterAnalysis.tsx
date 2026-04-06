"use client";

import { motion } from "framer-motion";
import { staggerContainer, paragraphReveal } from "@/lib/animations";

interface CharacterAnalysisProps {
  text: string;
}

export function CharacterAnalysis({ text }: CharacterAnalysisProps) {
  const paragraphs = text.split("\n\n").filter(Boolean);

  return (
    <div className="prose prose-gray max-w-none">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#5B7B6A] to-[#4A6A59] flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 m-0">Karakter Analizi</h3>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 sm:p-8 border border-gray-100"
      >
        {paragraphs.map((paragraph, idx) => (
          <motion.p
            key={idx}
            variants={paragraphReveal}
            className="text-gray-700 leading-relaxed text-[15px] mb-4 last:mb-0"
          >
            {paragraph}
          </motion.p>
        ))}
      </motion.div>
    </div>
  );
}
