"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Zap, Clock, CalendarDays, ArrowUpRight, ArrowRight, ArrowDownRight } from "lucide-react";
import type { CoachingRoadmap, TherapeuticTask } from "@/lib/types";

interface CoachingTimelineProps {
  /** Legacy coaching roadmap. Optional — newer reports use `tasks` instead. */
  roadmap?: CoachingRoadmap;
  tasks?: TherapeuticTask[];
}

const PRIORITY_CONFIG = {
  high: {
    label: "Yüksek",
    icon: ArrowUpRight,
    dot: "bg-rose-400",
    badge: "bg-rose-50 text-rose-600 border-rose-200",
  },
  medium: {
    label: "Orta",
    icon: ArrowRight,
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-600 border-amber-200",
  },
  low: {
    label: "Düşük",
    icon: ArrowDownRight,
    dot: "bg-emerald-400",
    badge: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
};

const TIMING_CONFIG = {
  this_week: { label: "Bu Hafta", icon: Zap, color: "text-rose-500" },
  weeks_2_4: { label: "2-4 Hafta", icon: Clock, color: "text-amber-500" },
  months_1_3: { label: "1-3 Ay", icon: CalendarDays, color: "text-emerald-500" },
};

function TaskCard({ task, index }: { task: TherapeuticTask; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const priority = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG.medium;
  const timing = TIMING_CONFIG[task.timing] ?? TIMING_CONFIG.weeks_2_4;
  const TimingIcon = timing.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className="group rounded-xl border border-gray-100 bg-white transition-shadow hover:shadow-sm"
    >
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full text-left p-3.5 sm:p-4 touch-manipulation cursor-pointer"
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${priority.badge} border`}>
              <span className="text-[11px] font-bold">{index + 1}</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5">
              <h4 className="text-sm sm:text-[15px] font-semibold text-gray-900 leading-snug">{task.title}</h4>
              <span className={`inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium ${timing.color}`}>
                <TimingIcon className="w-3 h-3" />
                {timing.label}
              </span>
              <span className="inline-flex items-center gap-1">
                <span className={`h-1.5 w-1.5 rounded-full ${priority.dot}`} />
                <span className="text-[10px] sm:text-[11px] text-gray-400 font-medium">{priority.label}</span>
              </span>
            </div>
            <p className="text-xs sm:text-[13px] leading-relaxed text-gray-600">{task.description}</p>
          </div>
          <ChevronDown
            className={`h-4 w-4 mt-1 flex-shrink-0 text-gray-300 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3.5 pb-3.5 pl-[52px] sm:px-4 sm:pb-4">
              <div className="rounded-lg bg-gray-50 px-3 py-2.5 sm:px-4 sm:py-3">
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Neden bu ödev?
                </p>
                <p className="text-xs sm:text-[13px] leading-relaxed text-gray-600">{task.rationale}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TasksView({ tasks }: { tasks: TherapeuticTask[] }) {
  const sorted = [...tasks].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const timingOrder = { this_week: 0, weeks_2_4: 1, months_1_3: 2 };
    const pDiff = (priorityOrder[a.priority] ?? 1) - (priorityOrder[b.priority] ?? 1);
    if (pDiff !== 0) return pDiff;
    return (timingOrder[a.timing] ?? 1) - (timingOrder[b.timing] ?? 1);
  });

  return (
    <div className="space-y-2.5">
      {sorted.map((task, idx) => (
        <TaskCard key={`task-${idx}`} task={task} index={idx} />
      ))}
    </div>
  );
}

function LegacyRoadmapView({ roadmap }: { roadmap: CoachingRoadmap }) {
  const PHASES = [
    { key: "immediate" as const, title: "Acil", subtitle: "1-2 hafta", gradient: "from-rose-400 to-red-400", bgLight: "bg-rose-50/60", textColor: "text-rose-600", borderColor: "border-rose-200", dotColor: "bg-rose-400", shadowColor: "rgba(251,113,133,0.15)" },
    { key: "short_term" as const, title: "Kısa Vade", subtitle: "2-4 hafta", gradient: "from-amber-400 to-orange-400", bgLight: "bg-amber-50/60", textColor: "text-amber-600", borderColor: "border-amber-200", dotColor: "bg-amber-400", shadowColor: "rgba(251,191,36,0.15)" },
    { key: "medium_term" as const, title: "Orta Vade", subtitle: "1-3 ay", gradient: "from-emerald-400 to-teal-500", bgLight: "bg-emerald-50/60", textColor: "text-emerald-600", borderColor: "border-emerald-200", dotColor: "bg-emerald-400", shadowColor: "rgba(52,211,153,0.15)" },
  ];

  return (
    <>
      <div className="hidden md:block relative mb-8">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-rose-300 via-amber-300 to-emerald-300 -translate-y-1/2" />
        <div className="flex justify-between px-[16.66%]">
          {PHASES.map((phase) => (
            <div key={phase.key} className="relative">
              <div className={`w-4 h-4 rounded-full ${phase.dotColor} ring-4 ring-white shadow-md`} />
            </div>
          ))}
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4 sm:gap-5">
        {PHASES.map((phase) => {
          const items = roadmap[phase.key] || [];
          return (
            <div
              key={phase.key}
              className={`relative rounded-xl sm:rounded-2xl ${phase.bgLight} border ${phase.borderColor} overflow-hidden`}
            >
              <div className={`relative bg-gradient-to-r ${phase.gradient} px-4 py-3 sm:px-5 sm:py-4 overflow-hidden`}>
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">{phase.title}</h4>
                  <p className="text-white/70 text-[11px] sm:text-xs font-medium">{phase.subtitle}</p>
                </div>
              </div>
              <div className="p-4 sm:p-5 space-y-2.5 sm:space-y-3">
                {items.length === 0 ? (
                  <p className="text-xs sm:text-sm text-gray-400 italic text-center py-3">Öneri yok</p>
                ) : (
                  items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 sm:gap-3">
                      <div className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br ${phase.gradient} flex items-center justify-center mt-0.5 shadow-sm`}>
                        <span className="text-[9px] sm:text-[10px] font-bold text-white">{idx + 1}</span>
                      </div>
                      <p className={`text-xs sm:text-sm ${phase.textColor} leading-relaxed font-medium`}>{item}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export function CoachingTimeline({ roadmap, tasks }: CoachingTimelineProps) {
  const hasTasks = Boolean(tasks && tasks.length > 0);
  const hasRoadmap = Boolean(roadmap);

  return (
    <div className="relative p-3 sm:p-5 -m-3 sm:-m-5">
      <div className="flex items-center gap-2.5 sm:gap-3 mb-5 sm:mb-8">
        <div className="relative">
          <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl bg-gradient-to-br from-[#5B7B6A] to-[#3D5A4A] flex items-center justify-center shadow-md flex-shrink-0">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
            </svg>
          </div>
          <div className="absolute -inset-1 bg-[#5B7B6A]/15 rounded-xl blur-md -z-10" />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
            {hasTasks ? "Terapötik Ödevler" : "Danışanın Yol Haritası"}
          </h3>
          <p className="text-xs text-gray-500">
            {hasTasks ? "Danışana verilebilecek somut adımlar" : "Önerilen aksiyon planı"}
          </p>
        </div>
      </div>

      {hasTasks ? (
        <TasksView tasks={tasks!} />
      ) : hasRoadmap ? (
        <LegacyRoadmapView roadmap={roadmap!} />
      ) : (
        <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-6 text-center">
          <p className="text-sm text-gray-500">Bu rapor için henüz yol haritası hazırlanmadı.</p>
        </div>
      )}
    </div>
  );
}
