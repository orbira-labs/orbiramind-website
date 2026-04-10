"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import type { StrengthWeakness } from "@/lib/types";

interface StrengthWeaknessGridProps {
  strengths: StrengthWeakness[];
  weaknesses: StrengthWeakness[];
}

function StrengthCard({ item, index }: { item: StrengthWeakness; index: number }) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="group relative p-5 rounded-2xl bg-white border border-green-100 overflow-hidden transition-shadow duration-300 hover:shadow-[0_8px_30px_-6px_rgba(34,197,94,0.15)]"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-green-400 to-emerald-500 rounded-l-2xl" />
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-green-50 to-transparent rounded-bl-full opacity-60 group-hover:opacity-100 transition-opacity" />

      <div className="relative flex gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-sm">
          <span className="text-white text-xs font-bold">{index + 1}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-900 text-[15px] mb-1.5 group-hover:text-green-800 transition-colors">
            {item.name}
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed">{item.insight}</p>
        </div>
      </div>
    </motion.div>
  );
}

function WeaknessCard({ item, index }: { item: StrengthWeakness; index: number }) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="group relative p-5 rounded-2xl bg-white border border-amber-100 overflow-hidden transition-shadow duration-300 hover:shadow-[0_8px_30px_-6px_rgba(245,158,11,0.15)]"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 to-orange-500 rounded-l-2xl" />
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-50 to-transparent rounded-bl-full opacity-60 group-hover:opacity-100 transition-opacity" />

      <div className="relative flex gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
          <span className="text-white text-xs font-bold">{index + 1}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-900 text-[15px] mb-1.5 group-hover:text-amber-800 transition-colors">
            {item.name}
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed">{item.insight}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function StrengthWeaknessGrid({ strengths, weaknesses }: StrengthWeaknessGridProps) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-3"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="relative">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <div className="absolute -inset-1 bg-green-400/20 rounded-xl blur-md -z-10 animate-pulse-glow" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Güçlü Yönler</h3>
            <p className="text-xs text-gray-500">{strengths.length} alan tespit edildi</p>
          </div>
        </div>
        {strengths.map((item, idx) => (
          <StrengthCard key={idx} item={item} index={idx} />
        ))}
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-3"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="relative">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
              </svg>
            </div>
            <div className="absolute -inset-1 bg-amber-400/20 rounded-xl blur-md -z-10 animate-pulse-glow" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Gelişim Alanları</h3>
            <p className="text-xs text-gray-500">{weaknesses.length} alan tespit edildi</p>
          </div>
        </div>
        {weaknesses.map((item, idx) => (
          <WeaknessCard key={idx} item={item} index={idx} />
        ))}
      </motion.div>
    </div>
  );
}
