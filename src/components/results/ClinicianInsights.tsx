"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Lightbulb, Search, AlertTriangle, ShieldCheck } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/animations";
import type { BlindSpot, BlindSpotItem, Insight } from "@/lib/types";

interface ClinicianInsightsProps {
  reportBlindSpots?: BlindSpot[];
  analysisBlindSpots?: BlindSpotItem[];
  inferences?: Insight[];
}

const SEVERITY_LABELS: Record<string, string> = {
  critical: "Öncelikli",
  warning: "İzlenmeli",
  info: "Destekleyici",
};

const BLIND_SPOT_TYPE_LABELS: Record<string, string> = {
  hidden_strength: "Koruyucu Dinamik",
  absence_signal: "Daha Az Görünür Alan",
  inconsistency: "Tutarsızlık",
};

function ClinicianSection({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#5B7B6A] to-[#3D5A4A] flex items-center justify-center shadow-sm text-white">
          {icon}
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500">{subtitle}</p>
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
}: ClinicianInsightsProps) {
  const filteredInferences = inferences.filter(
    (item) => (item as Insight & { type?: string }).type !== "hidden_strength" &&
      (item as Insight & { type?: string }).type !== "absence_signal",
  );

  if (
    reportBlindSpots.length === 0 &&
    analysisBlindSpots.length === 0 &&
    filteredInferences.length === 0
  ) {
    return null;
  }

  const sortedInferences = [...filteredInferences].sort((left, right) => {
    const order = { critical: 0, warning: 1, info: 2 };
    return (order[left.severity as keyof typeof order] ?? 2) -
      (order[right.severity as keyof typeof order] ?? 2);
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#5B7B6A] to-[#3D5A4A] flex items-center justify-center shadow-md">
          <Search className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Terapist Görünümü</h2>
          <p className="text-sm text-gray-500">
            Klinik hipotezler, sürdürücü örüntüler ve seansta ele alınabilecek odaklar.
          </p>
        </div>
      </div>

      {reportBlindSpots.length > 0 && (
        <ClinicianSection
          title="Klinik Hipotezler"
          subtitle="Seans içinde test edilmeye değer formülasyon başlıkları"
          icon={<Lightbulb className="h-5 w-5" />}
        >
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-4"
          >
            {reportBlindSpots.map((spot, index) => (
              <motion.div
                key={`${spot.title}-${index}`}
                variants={staggerItem}
                className="rounded-2xl border border-[#E8ECE9] bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h4 className="text-[15px] font-semibold text-gray-900">{spot.title}</h4>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#EEF4F0] text-[#456454]">
                    Hipotez
                  </span>
                </div>
                <p className="text-[14px] leading-relaxed text-gray-700">{spot.insight}</p>
                {spot.coach_tip && (
                  <div className="mt-4 rounded-xl bg-[#F7FAF8] border border-[#E7EFEA] p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5B7B6A]">
                      Seansta nasıl ele alınabilir?
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed text-gray-700">{spot.coach_tip}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </ClinicianSection>
      )}

      {analysisBlindSpots.length > 0 && (
        <ClinicianSection
          title="Daha Az Görünür Dinamikler"
          subtitle="Sistemin dikkat çektiği ama danışanın anlatımında geri planda kalabilecek alanlar"
          icon={<ShieldCheck className="h-5 w-5" />}
        >
          <div className="space-y-4">
            {analysisBlindSpots.map((spot, index) => (
              <div
                key={`${spot.title}-${index}`}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h4 className="text-[15px] font-semibold text-gray-900">{spot.title}</h4>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600">
                    {BLIND_SPOT_TYPE_LABELS[spot.type] ?? "Klinik işaret"}
                  </span>
                </div>
                <p className="text-[14px] leading-relaxed text-gray-700">{spot.insight}</p>
                {spot.suggestion && (
                  <p className="mt-3 text-[13px] leading-relaxed text-[#5B7B6A]">
                    Seans İpucu: {spot.suggestion}
                  </p>
                )}
              </div>
            ))}
          </div>
        </ClinicianSection>
      )}

      {sortedInferences.length > 0 && (
        <ClinicianSection
          title="Sürdürücü Örüntüler"
          subtitle="Danışanın zorlanmasını devam ettiriyor olabilecek ilişkili mekanizmalar"
          icon={<AlertTriangle className="h-5 w-5" />}
        >
          <div className="space-y-4">
            {sortedInferences.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h4 className="text-[15px] font-semibold text-gray-900">{item.title}</h4>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700">
                    {SEVERITY_LABELS[item.severity] ?? "İzlenmeli"}
                  </span>
                </div>
                <p className="text-[14px] leading-relaxed text-gray-700">{item.insight}</p>
                {item.suggestion && (
                  <div className="mt-4 rounded-xl bg-[#FFF9ED] border border-[#F4E6BC] p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-amber-700">
                      Terapötik Yönelim
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed text-gray-700">{item.suggestion}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ClinicianSection>
      )}
    </div>
  );
}
