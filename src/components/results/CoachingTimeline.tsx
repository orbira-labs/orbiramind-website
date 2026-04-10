"use client";

import { motion } from "framer-motion";
import type { CoachingRoadmap } from "@/lib/types";

interface CoachingTimelineProps {
  roadmap: CoachingRoadmap;
}

const PHASES = [
  {
    key: "immediate" as const,
    title: "Acil",
    subtitle: "1-2 hafta",
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    gradient: "from-red-500 to-rose-600",
    gradientBg: "from-red-500/5 to-rose-500/5",
    bgLight: "bg-red-50/50",
    textColor: "text-red-700",
    borderColor: "border-red-100",
    dotColor: "bg-red-500",
    shadowColor: "rgba(239,68,68,0.12)",
  },
  {
    key: "short_term" as const,
    title: "Kısa Vade",
    subtitle: "2-4 hafta",
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    gradient: "from-amber-500 to-orange-500",
    gradientBg: "from-amber-500/5 to-orange-500/5",
    bgLight: "bg-amber-50/50",
    textColor: "text-amber-700",
    borderColor: "border-amber-100",
    dotColor: "bg-amber-500",
    shadowColor: "rgba(245,158,11,0.12)",
  },
  {
    key: "medium_term" as const,
    title: "Orta Vade",
    subtitle: "1-3 ay",
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
    gradient: "from-green-500 to-emerald-600",
    gradientBg: "from-green-500/5 to-emerald-500/5",
    bgLight: "bg-green-50/50",
    textColor: "text-green-700",
    borderColor: "border-green-100",
    dotColor: "bg-green-500",
    shadowColor: "rgba(34,197,94,0.12)",
  },
];

const cardVariant = {
  initial: { opacity: 0, y: 30, scale: 0.96 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

const itemVariant = {
  initial: { opacity: 0, x: -10 },
  animate: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.6 + i * 0.1, duration: 0.3 },
  }),
};

export function CoachingTimeline({ roadmap }: CoachingTimelineProps) {
  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="relative">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#5B7B6A] to-[#3D5A4A] flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
            </svg>
          </div>
          <div className="absolute -inset-1 bg-[#5B7B6A]/15 rounded-xl blur-md -z-10" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Danışanın Yol Haritası</h3>
          <p className="text-xs text-gray-500">Önerilen aksiyon planı</p>
        </div>
      </div>

      {/* Desktop: Horizontal connector */}
      <div className="hidden md:block relative mb-8">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-red-300 via-amber-300 to-green-300 -translate-y-1/2" />
        <div className="flex justify-between px-[16.66%]">
          {PHASES.map((phase) => (
            <div key={phase.key} className="relative">
              <div className={`w-4 h-4 rounded-full ${phase.dotColor} ring-4 ring-white shadow-md`} />
            </div>
          ))}
        </div>
      </div>

      {/* Phase cards */}
      <div className="grid md:grid-cols-3 gap-5">
        {PHASES.map((phase, phaseIdx) => {
          const items = roadmap[phase.key] || [];
          return (
            <motion.div
              key={phase.key}
              custom={phaseIdx}
              variants={cardVariant}
              initial="initial"
              animate="animate"
              whileHover={{
                y: -4,
                boxShadow: `0 12px 40px -8px ${phase.shadowColor}`,
                transition: { duration: 0.25 },
              }}
              className={`relative rounded-2xl ${phase.bgLight} border ${phase.borderColor} overflow-hidden transition-colors`}
            >
              {/* Phase header */}
              <div className={`relative bg-gradient-to-r ${phase.gradient} px-5 py-4 overflow-hidden`}>
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
                <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/5 rounded-full translate-y-6 -translate-x-4" />
                <div className="relative flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    {phase.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">{phase.title}</h4>
                    <p className="text-white/70 text-xs font-medium">{phase.subtitle}</p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="p-5 space-y-3">
                {items.length === 0 ? (
                  <p className="text-sm text-gray-400 italic text-center py-3">Öneri yok</p>
                ) : (
                  items.map((item, idx) => (
                    <motion.div
                      key={idx}
                      custom={phaseIdx * items.length + idx}
                      variants={itemVariant}
                      initial="initial"
                      animate="animate"
                      className="flex items-start gap-3 group"
                    >
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br ${phase.gradient} flex items-center justify-center mt-0.5 shadow-sm group-hover:scale-110 transition-transform`}>
                        <span className="text-[10px] font-bold text-white">{idx + 1}</span>
                      </div>
                      <p className={`text-sm ${phase.textColor} leading-relaxed font-medium`}>{item}</p>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
