"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import type { StrengthWeakness } from "@/lib/types";

interface StrengthWeaknessGridProps {
  strengths: StrengthWeakness[];
  weaknesses: StrengthWeakness[];
}

export function StrengthWeaknessGrid({ strengths, weaknesses }: StrengthWeaknessGridProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-3"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Güçlü Yönler</h3>
        </div>
        {strengths.map((item, idx) => (
          <motion.div
            key={idx}
            variants={staggerItem}
            className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100"
          >
            <h4 className="font-semibold text-green-800 mb-1">{item.name}</h4>
            <p className="text-sm text-green-700/80 leading-relaxed">{item.insight}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-3"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Gelişim Alanları</h3>
        </div>
        {weaknesses.map((item, idx) => (
          <motion.div
            key={idx}
            variants={staggerItem}
            className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100"
          >
            <h4 className="font-semibold text-amber-800 mb-1">{item.name}</h4>
            <p className="text-sm text-amber-700/80 leading-relaxed">{item.insight}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
