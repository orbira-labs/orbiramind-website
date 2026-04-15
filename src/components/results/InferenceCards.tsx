"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import type { Insight } from "@/lib/types";

interface InferenceCardsProps {
  inferences: Insight[];
}

const SEVERITY_CONFIG: Record<string, {
  gradient: string;
  bg: string;
  text: string;
  border: string;
  badge: string;
  badgeText: string;
  label: string;
}> = {
  critical: {
    gradient: "from-red-500 to-rose-600",
    bg: "bg-red-50/60",
    text: "text-red-700",
    border: "border-red-200",
    badge: "bg-red-100",
    badgeText: "text-red-700",
    label: "Kritik",
  },
  warning: {
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-50/60",
    text: "text-amber-700",
    border: "border-amber-200",
    badge: "bg-amber-100",
    badgeText: "text-amber-700",
    label: "Dikkat",
  },
  info: {
    gradient: "from-blue-500 to-indigo-500",
    bg: "bg-blue-50/60",
    text: "text-blue-700",
    border: "border-blue-200",
    badge: "bg-blue-100",
    badgeText: "text-blue-700",
    label: "Bilgi",
  },
};

const TYPE_LABELS: Record<string, string> = {
  cross_domain: "Çapraz Analiz",
  profile_signal: "Profil Sinyali",
  absence_signal: "Eksiklik Sinyali",
  cascade: "Zincirleme Etki",
  hidden_strength: "Gizli Güç",
};

export function InferenceCards({ inferences }: InferenceCardsProps) {
  if (!inferences || inferences.length === 0) return null;

  const filtered = inferences.filter(
    (inf) => inf.type !== "hidden_strength" && inf.type !== "absence_signal"
  );

  if (filtered.length === 0) return null;

  const sorted = [...filtered].sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2 };
    return (order[a.severity as keyof typeof order] ?? 2) - (order[b.severity as keyof typeof order] ?? 2);
  });

  return (
    <div className="relative">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#5B7B6A] to-[#3D5A4A] flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Sürdürücü Örüntüler</h3>
          <p className="text-xs text-gray-500">{filtered.length} klinik çıkarım</p>
        </div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-4"
      >
        {sorted.map((inf, idx) => {
          const sev = SEVERITY_CONFIG[inf.severity] ?? SEVERITY_CONFIG.info;
          const typeLabel = TYPE_LABELS[(inf as any).type] ?? "";

          return (
            <motion.div
              key={idx}
              variants={staggerItem}
              className={`rounded-2xl border ${sev.border} ${sev.bg} overflow-hidden transition-all duration-200 hover:shadow-md`}
            >
              <div className="px-5 py-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br ${sev.gradient} flex items-center justify-center shadow-sm`}>
                    <span className="text-white text-xs font-bold">{idx + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="font-semibold text-gray-900 text-[15px]">{inf.title}</h4>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${sev.badge} ${sev.badgeText}`}>
                        {sev.label}
                      </span>
                      {typeLabel && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-100 text-gray-500 uppercase tracking-wider">
                          {typeLabel}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-[14px] text-gray-600 leading-relaxed mb-3 ml-11">
                  {inf.insight}
                </p>

                {inf.suggestion && (
                  <div className="ml-11 rounded-xl bg-white/80 border border-gray-100 px-4 py-3">
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-[#5B7B6A] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                      </svg>
                      <p className="text-[13px] text-gray-600 leading-relaxed">{inf.suggestion}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
