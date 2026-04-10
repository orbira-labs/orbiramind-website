"use client";

import { motion } from "framer-motion";
import { Eye, Lightbulb } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/animations";
import type { BlindSpot } from "@/lib/types";

interface BlindSpotCardProps {
  blindSpots: BlindSpot[];
}

const spotVariant = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

export function BlindSpotCard({ blindSpots }: BlindSpotCardProps) {
  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="relative">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <div className="absolute -inset-1 bg-violet-400/20 rounded-xl blur-md -z-10 animate-pulse-glow" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Kör Noktalar</h3>
          <p className="text-xs text-gray-500">Danışanın farkında olmadığı {blindSpots.length} dinamik</p>
        </div>
      </div>

      {/* Connected spots */}
      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-violet-300 via-violet-200 to-transparent" />

        <div className="space-y-5">
          {blindSpots.map((spot, idx) => (
            <motion.div
              key={idx}
              custom={idx}
              variants={spotVariant}
              initial="initial"
              animate="animate"
              className="relative group"
            >
              {/* Connector dot */}
              <div className="absolute left-[12px] top-7 w-[15px] h-[15px] rounded-full bg-white border-2 border-violet-400 z-10 group-hover:border-violet-500 group-hover:scale-110 transition-all shadow-sm">
                <div className="absolute inset-1 rounded-full bg-violet-400 group-hover:bg-violet-500 transition-colors" />
              </div>

              <div className="ml-12 rounded-2xl border border-gray-100 bg-white overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_-6px_rgba(139,92,246,0.12)] hover:border-violet-100">
                {/* Card header */}
                <div className="relative px-5 py-4 bg-gradient-to-r from-violet-50/80 via-violet-50/40 to-transparent border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-xs font-bold shadow-sm">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-gray-900 text-[15px]">{spot.title}</h4>
                  </div>
                </div>

                {/* Card body */}
                <div className="px-5 py-4 space-y-4">
                  <p className="text-gray-700 leading-relaxed text-[15px]">{spot.insight}</p>

                  {/* Coach tip - premium callout */}
                  <div className="relative rounded-xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-orange-50/50" />
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 to-orange-400" />
                    <div className="relative flex gap-3 p-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
                        <Lightbulb className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] font-bold text-amber-700 uppercase tracking-[0.1em]">
                          Koç İçin İpucu
                        </span>
                        <p className="text-sm text-amber-900/80 mt-1 leading-relaxed">{spot.coach_tip}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
