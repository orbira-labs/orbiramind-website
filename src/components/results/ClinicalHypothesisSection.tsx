"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, ChevronDown, Scale, Target, ShieldAlert } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/animations";
import type { Insight } from "@/lib/types";

interface ClinicalHypothesisSectionProps {
  inferences: Insight[];
}

/**
 * Orbira-engines v3 ile gelen `clinical_hypothesis` alanını terapiste
 * sunan kart grubu. Her hipotez:
 *   - Ana önerme
 *   - Rakip (null) hipotez
 *   - Seansta test edilecek sorular
 *   - Hipotezi çürütecek sinyaller
 * içerir. Amaç: terapist bir inference'ı körü körüne kabul etmesin,
 * seansta sınasın.
 */
export function ClinicalHypothesisSection({ inferences }: ClinicalHypothesisSectionProps) {
  const withHypotheses = inferences.filter((inf) => inf.clinical_hypothesis);

  if (withHypotheses.length === 0) return null;

  return (
    <div className="rounded-xl border border-violet-100 bg-violet-50/40 p-4 sm:p-5">
      <div className="flex items-center gap-2.5 sm:gap-3 mb-4">
        <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
          <FlaskConical className="h-4 w-4 text-violet-600" />
        </div>
        <div>
          <h3 className="text-sm sm:text-[15px] font-semibold text-gray-900">
            Klinik Hipotezler — Seansta Test Et
          </h3>
          <p className="text-[11px] sm:text-[12px] text-gray-400 leading-snug">
            Her hipotez körü körüne kabul edilmeyecek, seansta doğrulanacak ipucu olarak okunur.
          </p>
        </div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-3"
      >
        {withHypotheses.map((inf, idx) => (
          <HypothesisCard key={`hyp-${inf.title}-${idx}`} inf={inf} index={idx + 1} />
        ))}
      </motion.div>
    </div>
  );
}

function HypothesisCard({ inf, index }: { inf: Insight; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const hypothesis = inf.clinical_hypothesis;

  if (!hypothesis) return null;

  return (
    <motion.div
      variants={staggerItem}
      className="group rounded-lg sm:rounded-xl border border-gray-100 bg-white overflow-hidden transition-shadow hover:shadow-sm"
    >
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full text-left p-3 sm:p-4 cursor-pointer touch-manipulation"
      >
        <div className="flex items-start gap-2.5 sm:gap-3">
          <span className="mt-1 sm:mt-1.5 flex-shrink-0 text-xs sm:text-sm font-medium text-gray-300 tabular-nums w-4 sm:w-5 text-right">
            {index}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
              <h4 className="text-sm sm:text-[14px] font-semibold text-gray-900 leading-snug">
                {inf.title}
              </h4>
              <span className="text-[10px] sm:text-[11px] font-medium text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded">
                Hipotez
              </span>
            </div>
            <p className="text-xs sm:text-[13px] leading-relaxed text-gray-600 italic">
              {hypothesis.statement}
            </p>
          </div>
          <ChevronDown
            className={`h-4 w-4 mt-0.5 sm:mt-1 flex-shrink-0 text-gray-300 transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
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
            <div className="px-3 pb-4 pl-9 sm:px-4 sm:pl-12 space-y-3">
              {/* Rakip hipotez — sadece dolu ise göster */}
              {hypothesis.null_alternative?.trim() && (
                <HypothesisBlock
                  icon={<Scale className="h-3.5 w-3.5 text-gray-500" />}
                  label="Rakip açıklama"
                  tone="neutral"
                >
                  {hypothesis.null_alternative}
                </HypothesisBlock>
              )}

              {/* Seansta test */}
              {hypothesis.testable_in_session.length > 0 && (
                <HypothesisBlock
                  icon={<Target className="h-3.5 w-3.5 text-emerald-600" />}
                  label="Seansta test et"
                  tone="positive"
                >
                  <ul className="space-y-1">
                    {hypothesis.testable_in_session.map((test, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-500 mt-1 flex-shrink-0">·</span>
                        <span>{test}</span>
                      </li>
                    ))}
                  </ul>
                </HypothesisBlock>
              )}

              {/* Çürütme sinyalleri */}
              {hypothesis.disconfirmation_signals.length > 0 && (
                <HypothesisBlock
                  icon={<ShieldAlert className="h-3.5 w-3.5 text-amber-600" />}
                  label="Hipotezi düşüren sinyaller"
                  tone="warning"
                >
                  <ul className="space-y-1">
                    {hypothesis.disconfirmation_signals.map((sig, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-500 mt-1 flex-shrink-0">·</span>
                        <span>{sig}</span>
                      </li>
                    ))}
                  </ul>
                </HypothesisBlock>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function HypothesisBlock({
  icon,
  label,
  tone,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  tone: "positive" | "warning" | "neutral";
  children: React.ReactNode;
}) {
  const toneBg =
    tone === "positive"
      ? "bg-emerald-50/50 border-emerald-100"
      : tone === "warning"
        ? "bg-amber-50/50 border-amber-100"
        : "bg-gray-50 border-gray-100";

  return (
    <div className={`rounded-lg border px-3 py-2.5 sm:px-4 sm:py-3 ${toneBg}`}>
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          {label}
        </span>
      </div>
      <div className="text-xs sm:text-[13px] leading-relaxed text-gray-700">{children}</div>
    </div>
  );
}
