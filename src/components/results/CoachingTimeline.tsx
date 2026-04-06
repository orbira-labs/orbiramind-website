"use client";

import type { CoachingRoadmap } from "@/lib/types";

interface CoachingTimelineProps {
  roadmap: CoachingRoadmap;
}

const PHASES = [
  {
    key: "immediate" as const,
    title: "Acil",
    subtitle: "1-2 hafta",
    gradient: "from-red-400 to-rose-500",
    bgLight: "bg-red-50",
    textColor: "text-red-700",
    borderColor: "border-red-200",
  },
  {
    key: "short_term" as const,
    title: "Kısa Vade",
    subtitle: "2-4 hafta",
    gradient: "from-amber-400 to-orange-500",
    bgLight: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
  },
  {
    key: "medium_term" as const,
    title: "Orta Vade",
    subtitle: "1-3 ay",
    gradient: "from-green-400 to-emerald-500",
    bgLight: "bg-green-50",
    textColor: "text-green-700",
    borderColor: "border-green-200",
  },
];

export function CoachingTimeline({ roadmap }: CoachingTimelineProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#5B7B6A] to-[#4A6A59] flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Koçluk Yol Haritası</h3>
          <p className="text-sm text-gray-500">Önerilen aksiyon planı</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {PHASES.map((phase) => {
          const items = roadmap[phase.key] || [];
          return (
            <div
              key={phase.key}
              className={`rounded-2xl ${phase.bgLight} border ${phase.borderColor} overflow-hidden`}
            >
              <div className={`bg-gradient-to-r ${phase.gradient} px-4 py-3`}>
                <h4 className="font-semibold text-white">{phase.title}</h4>
                <p className="text-white/80 text-xs">{phase.subtitle}</p>
              </div>
              <div className="p-4 space-y-2">
                {items.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">Öneri yok</p>
                ) : (
                  items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className={`h-5 w-5 rounded-full ${phase.bgLight} border ${phase.borderColor} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <span className={`text-xs font-semibold ${phase.textColor}`}>{idx + 1}</span>
                      </div>
                      <p className={`text-sm ${phase.textColor} leading-relaxed`}>{item}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
