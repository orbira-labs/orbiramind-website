"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import type { StrengthWeakness } from "@/lib/types";

interface StrengthWeaknessGridProps {
  strengths: StrengthWeakness[];
  weaknesses: StrengthWeakness[];
}

function StrengthCard({ item, index, isLast }: { item: StrengthWeakness; index: number; isLast: boolean }) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -1, transition: { duration: 0.2 } }}
      className="group relative"
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0 pt-0.5">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400/20 to-emerald-500/20 flex items-center justify-center ring-1 ring-green-200/50">
            <span className="text-green-600 text-[11px] font-semibold">{index + 1}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-800 text-[15px] leading-snug mb-1.5 group-hover:text-green-700 transition-colors duration-200">
            {item.name}
          </h4>
          <p className="text-[13px] text-gray-500 leading-relaxed">{item.insight}</p>
          {!isLast && (
            <div className="mt-5 h-px bg-gradient-to-r from-gray-100 via-gray-200/60 to-transparent" />
          )}
        </div>
      </div>
    </motion.div>
  );
}

function WeaknessCard({ item, index, isLast }: { item: StrengthWeakness; index: number; isLast: boolean }) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -1, transition: { duration: 0.2 } }}
      className="group relative"
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0 pt-0.5">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 flex items-center justify-center ring-1 ring-amber-200/50">
            <span className="text-amber-600 text-[11px] font-semibold">{index + 1}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-800 text-[15px] leading-snug mb-1.5 group-hover:text-amber-700 transition-colors duration-200">
            {item.name}
          </h4>
          <p className="text-[13px] text-gray-500 leading-relaxed">{item.insight}</p>
          {!isLast && (
            <div className="mt-5 h-px bg-gradient-to-r from-gray-100 via-gray-200/60 to-transparent" />
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function StrengthWeaknessGrid({ strengths, weaknesses }: StrengthWeaknessGridProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Güçlü Yönler Card */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
      >
        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Güçlü Yönler</h3>
            <p className="text-xs text-gray-400">{strengths.length} alan tespit edildi</p>
          </div>
        </div>

        <div className="space-y-5">
          {strengths.map((item, idx) => (
            <StrengthCard key={idx} item={item} index={idx} isLast={idx === strengths.length - 1} />
          ))}
        </div>
      </motion.div>

      {/* Gelişim Alanları Card */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
      >
        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Gelişim Alanları</h3>
            <p className="text-xs text-gray-400">{weaknesses.length} alan tespit edildi</p>
          </div>
        </div>

        <div className="space-y-5">
          {weaknesses.map((item, idx) => (
            <WeaknessCard key={idx} item={item} index={idx} isLast={idx === weaknesses.length - 1} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
