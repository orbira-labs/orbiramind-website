"use client";

import { motion } from "framer-motion";
import { Eye, Lightbulb, ShieldAlert, EyeOff, AlertTriangle } from "lucide-react";
import type { BlindSpotItem } from "@/lib/types";

interface BlindSpotCardProps {
  blindSpots: BlindSpotItem[];
  title?: string;
}

const TYPE_CONFIG: Record<string, { icon: typeof Eye; gradient: string; dotColor: string }> = {
  hidden_strength: { icon: Eye, gradient: "from-emerald-500 to-teal-600", dotColor: "border-emerald-400" },
  absence_signal: { icon: EyeOff, gradient: "from-violet-500 to-indigo-600", dotColor: "border-violet-400" },
  inconsistency: { icon: AlertTriangle, gradient: "from-amber-500 to-orange-500", dotColor: "border-amber-400" },
};

const TYPE_LABELS: Record<string, string> = {
  hidden_strength: "Gizli Güç",
  absence_signal: "Eksiklik",
  inconsistency: "Tutarsızlık",
};

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

export function BlindSpotCard({ blindSpots, title = "Daha Az Görünür Dinamikler" }: BlindSpotCardProps) {
  if (!blindSpots || blindSpots.length === 0) return null;

  return (
    <div className="relative mt-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="relative">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div className="absolute -inset-1 bg-violet-400/20 rounded-xl blur-md -z-10" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500">Seansta dikkatle ele alınabilecek {blindSpots.length} dinamik</p>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-violet-300 via-violet-200 to-transparent" />

        <div className="space-y-5">
          {blindSpots.map((spot, idx) => {
            const config = TYPE_CONFIG[spot.type] ?? TYPE_CONFIG.absence_signal;
            const Icon = config.icon;

            return (
              <motion.div
                key={idx}
                custom={idx}
                variants={spotVariant}
                initial="initial"
                animate="animate"
                className="relative group"
              >
                <div className={`absolute left-[12px] top-7 w-[15px] h-[15px] rounded-full bg-white border-2 ${config.dotColor} z-10 group-hover:scale-110 transition-all shadow-sm`}>
                  <div className="absolute inset-1 rounded-full bg-violet-400 group-hover:bg-violet-500 transition-colors" />
                </div>

                <div className="ml-12 rounded-2xl border border-gray-100 bg-white overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_-6px_rgba(139,92,246,0.12)] hover:border-violet-100">
                  <div className="relative px-5 py-4 bg-gradient-to-r from-violet-50/80 via-violet-50/40 to-transparent border-b border-gray-50">
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br ${config.gradient} text-white shadow-sm`}>
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <h4 className="font-bold text-gray-900 text-[15px] flex-1">{spot.title}</h4>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-100 text-gray-500 uppercase tracking-wider">
                        {TYPE_LABELS[spot.type] ?? spot.type}
                      </span>
                    </div>
                  </div>

                  <div className="px-5 py-4 space-y-4">
                    <p className="text-gray-700 leading-relaxed text-[15px]">{spot.insight}</p>

                    {spot.suggestion && (
                      <div className="relative rounded-xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-orange-50/50" />
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 to-orange-400" />
                        <div className="relative flex gap-3 p-4">
                          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
                            <Lightbulb className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-[0.1em]">
                              Seansta Nasıl Ele Alınabilir?
                            </span>
                            <p className="text-sm text-amber-900/80 mt-1 leading-relaxed">{spot.suggestion}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
