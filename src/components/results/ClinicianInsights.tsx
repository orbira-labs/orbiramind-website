"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Eye, RefreshCw, ChevronDown, Compass } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/animations";
import type { BlindSpot, BlindSpotItem, Insight, TherapeuticGuidance } from "@/lib/types";

interface ClinicianInsightsProps {
  reportBlindSpots?: BlindSpot[];
  analysisBlindSpots?: BlindSpotItem[];
  inferences?: Insight[];
  therapeuticGuidance?: TherapeuticGuidance[];
}

const SEVERITY_CONFIG: Record<string, { label: string; dot: string }> = {
  critical: { label: "Öncelikli", dot: "bg-red-400" },
  warning: { label: "İzlenmeli", dot: "bg-amber-400" },
  info: { label: "Bilgilendirme", dot: "bg-blue-400" },
};

const TIMING_CONFIG: Record<string, { label: string; color: string }> = {
  first_session: { label: "İlk Seans", color: "text-rose-500" },
  early_phase: { label: "Erken Dönem", color: "text-amber-500" },
  mid_therapy: { label: "Orta Dönem", color: "text-blue-500" },
  throughout: { label: "Sürekli", color: "text-emerald-500" },
};

function ExpandableCard({
  title,
  description,
  actionLabel,
  actionContent,
  severity,
  index,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionContent?: string;
  severity?: { label: string; dot: string };
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasAction = actionLabel && actionContent;

  return (
    <motion.div
      variants={staggerItem}
      className="group rounded-lg sm:rounded-xl border border-gray-100 bg-white transition-shadow hover:shadow-sm"
    >
      <button
        type="button"
        onClick={() => hasAction && setExpanded((prev) => !prev)}
        className={`w-full text-left p-3 sm:p-4 touch-manipulation ${hasAction ? "cursor-pointer" : "cursor-default"}`}
      >
        <div className="flex items-start gap-2.5 sm:gap-3">
          <span className="mt-1 sm:mt-1.5 flex-shrink-0 text-xs sm:text-sm font-medium text-gray-300 tabular-nums w-4 sm:w-5 text-right">
            {index}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
              <h4 className="text-sm sm:text-[14px] font-semibold text-gray-900 leading-snug">{title}</h4>
              {severity && (
                <span className="inline-flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
                  <span className={`h-1.5 w-1.5 rounded-full ${severity.dot}`} />
                  <span className="text-[10px] sm:text-[11px] text-gray-400 font-medium">{severity.label}</span>
                </span>
              )}
            </div>
            <p className="text-xs sm:text-[13px] leading-relaxed text-gray-500">{description}</p>
          </div>
          {hasAction && (
            <ChevronDown
              className={`h-4 w-4 mt-0.5 sm:mt-1 flex-shrink-0 text-gray-300 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            />
          )}
        </div>
      </button>

      {hasAction && (
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-3 pb-3 pl-9 sm:px-4 sm:pb-4 sm:pl-12">
                <div className="rounded-lg bg-gray-50 px-3 py-2.5 sm:px-4 sm:py-3">
                  <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                    {actionLabel}
                  </p>
                  <p className="text-xs sm:text-[13px] leading-relaxed text-gray-600">{actionContent}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}

function GuidanceCard({
  title,
  guidance,
  rationale,
  timing,
  caution,
  index,
}: {
  title: string;
  guidance: string;
  rationale: string;
  timing: string;
  caution: string | null;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const timingInfo = TIMING_CONFIG[timing] ?? TIMING_CONFIG.early_phase;

  return (
    <motion.div
      variants={staggerItem}
      className="group rounded-lg sm:rounded-xl border border-gray-100 bg-white transition-shadow hover:shadow-sm"
    >
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full text-left p-3 sm:p-4 touch-manipulation cursor-pointer"
      >
        <div className="flex items-start gap-2.5 sm:gap-3">
          <span className="mt-1 sm:mt-1.5 flex-shrink-0 text-xs sm:text-sm font-medium text-gray-300 tabular-nums w-4 sm:w-5 text-right">
            {index}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
              <h4 className="text-sm sm:text-[14px] font-semibold text-gray-900 leading-snug">{title}</h4>
              <span className={`text-[10px] sm:text-[11px] font-medium ${timingInfo.color}`}>
                {timingInfo.label}
              </span>
            </div>
            <p className="text-xs sm:text-[13px] leading-relaxed text-gray-500">{guidance}</p>
          </div>
          <ChevronDown
            className={`h-4 w-4 mt-0.5 sm:mt-1 flex-shrink-0 text-gray-300 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
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
            <div className="px-3 pb-3 pl-9 sm:px-4 sm:pb-4 sm:pl-12 space-y-2">
              <div className="rounded-lg bg-gray-50 px-3 py-2.5 sm:px-4 sm:py-3">
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Neden önemli?
                </p>
                <p className="text-xs sm:text-[13px] leading-relaxed text-gray-600">{rationale}</p>
              </div>
              {caution && (
                <div className="rounded-lg bg-amber-50 border border-amber-100 px-3 py-2.5 sm:px-4 sm:py-3">
                  <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-amber-600 mb-1">
                    Dikkat
                  </p>
                  <p className="text-xs sm:text-[13px] leading-relaxed text-amber-700">{caution}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SectionBlock({
  number,
  title,
  subtitle,
  icon,
  accentColor,
  children,
}: {
  number: number;
  title: string;
  subtitle: string;
  icon: ReactNode;
  accentColor: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
        <div className={`h-7 w-7 sm:h-8 sm:w-8 rounded-lg ${accentColor} flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        <div>
          <h3 className="text-sm sm:text-[15px] font-semibold text-gray-900">{title}</h3>
          <p className="text-[11px] sm:text-[12px] text-gray-400 leading-snug">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export function ClinicianInsights({
  reportBlindSpots = [],
  analysisBlindSpots = [],
  inferences = [],
  therapeuticGuidance = [],
}: ClinicianInsightsProps) {
  const filteredInferences = inferences.filter(
    (item) => item.type !== "hidden_strength" && item.type !== "absence_signal",
  );

  if (
    reportBlindSpots.length === 0 &&
    analysisBlindSpots.length === 0 &&
    filteredInferences.length === 0 &&
    therapeuticGuidance.length === 0
  ) {
    return null;
  }

  const sortedInferences = [...filteredInferences].sort((left, right) => {
    const order = { critical: 0, warning: 1, info: 2 };
    return (order[left.severity as keyof typeof order] ?? 2) -
      (order[right.severity as keyof typeof order] ?? 2);
  });

  const timingOrder = { first_session: 0, early_phase: 1, mid_therapy: 2, throughout: 3 };
  const sortedGuidance = [...therapeuticGuidance].sort((left, right) => {
    return (timingOrder[left.timing as keyof typeof timingOrder] ?? 1) -
      (timingOrder[right.timing as keyof typeof timingOrder] ?? 1);
  });

  const totalItems = reportBlindSpots.length + analysisBlindSpots.length + sortedInferences.length + therapeuticGuidance.length;
  let sectionNumber = 0;

  return (
    <div className="space-y-6 sm:space-y-8 p-3 sm:p-5 -m-3 sm:-m-5">
      <div className="pb-3 sm:pb-4 border-b border-gray-100">
        <p className="text-xs sm:text-[13px] text-gray-400 leading-relaxed">
          Bu bölüm, testin sayısal verileri ve yapay zeka analizleri birleştirilerek oluşturulmuştur.
          Seanslarda araştırılabilecek <span className="font-medium text-gray-600">{totalItems} klinik bulgu</span> içerir.
        </p>
      </div>

      {reportBlindSpots.length > 0 && (
        <SectionBlock
          number={++sectionNumber}
          title="Klinik Hipotezler"
          subtitle="Seansta test edilebilecek formülasyonlar"
          icon={<Lightbulb className="h-4 w-4 text-[#5B7B6A]" />}
          accentColor="bg-[#EEF4F0]"
        >
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-2"
          >
            {reportBlindSpots.map((spot, index) => (
              <ExpandableCard
                key={`hyp-${index}`}
                index={index + 1}
                title={spot.title}
                description={spot.insight}
                actionLabel="Seansta nasıl ele alınabilir?"
                actionContent={spot.coach_tip}
              />
            ))}
          </motion.div>
        </SectionBlock>
      )}

      {sortedGuidance.length > 0 && (
        <SectionBlock
          number={++sectionNumber}
          title="Terapötik Yönelimler"
          subtitle="Seans sürecinde dikkat edilmesi gereken yönelimler"
          icon={<Compass className="h-4 w-4 text-indigo-500" />}
          accentColor="bg-indigo-50"
        >
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-2"
          >
            {sortedGuidance.map((item, index) => (
              <GuidanceCard
                key={`guide-${index}`}
                index={index + 1}
                title={item.title}
                guidance={item.guidance}
                rationale={item.rationale}
                timing={item.timing}
                caution={item.caution}
              />
            ))}
          </motion.div>
        </SectionBlock>
      )}

      {analysisBlindSpots.length > 0 && (
        <SectionBlock
          number={++sectionNumber}
          title="Gizli Kalan Dinamikler"
          subtitle="Danışanın farkında olmayabileceği ama verinin işaret ettiği alanlar"
          icon={<Eye className="h-4 w-4 text-gray-500" />}
          accentColor="bg-gray-100"
        >
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-2"
          >
            {analysisBlindSpots.map((spot, index) => (
              <ExpandableCard
                key={`bs-${index}`}
                index={index + 1}
                title={spot.title}
                description={spot.insight}
                actionLabel="Seans ipucu"
                actionContent={spot.suggestion ?? undefined}
              />
            ))}
          </motion.div>
        </SectionBlock>
      )}

      {sortedInferences.length > 0 && (
        <SectionBlock
          number={++sectionNumber}
          title="Sürdürücü Örüntüler"
          subtitle="Zorlanmayı devam ettirebilecek ilişkili mekanizmalar"
          icon={<RefreshCw className="h-4 w-4 text-amber-600" />}
          accentColor="bg-amber-50"
        >
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-2"
          >
            {sortedInferences.map((item, index) => (
              <ExpandableCard
                key={`inf-${index}`}
                index={index + 1}
                title={item.title}
                description={item.insight}
                severity={SEVERITY_CONFIG[item.severity] ?? SEVERITY_CONFIG.warning}
                actionLabel="Terapötik yönelim"
                actionContent={item.suggestion}
              />
            ))}
          </motion.div>
        </SectionBlock>
      )}
    </div>
  );
}
