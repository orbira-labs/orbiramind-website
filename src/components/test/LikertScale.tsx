"use client";

import { clsx } from "clsx";

interface LikertScaleProps {
  value?: number;
  onChange: (value: number) => void;
  labels?: string[];
  accentColor?: string;
}

const DEFAULT_LABELS = ["Çok kötü", "Kötü", "Orta", "İyi", "Çok iyi"];

const SCALE_COLORS = [
  { bg: "bg-red-50", border: "border-red-200", active: "bg-red-500", text: "text-red-600", ring: "ring-red-200" },
  { bg: "bg-orange-50", border: "border-orange-200", active: "bg-orange-500", text: "text-orange-600", ring: "ring-orange-200" },
  { bg: "bg-yellow-50", border: "border-yellow-200", active: "bg-yellow-500", text: "text-yellow-600", ring: "ring-yellow-200" },
  { bg: "bg-lime-50", border: "border-lime-200", active: "bg-lime-500", text: "text-lime-600", ring: "ring-lime-200" },
  { bg: "bg-green-50", border: "border-green-200", active: "bg-green-500", text: "text-green-600", ring: "ring-green-200" },
];

export function LikertScale({ value, onChange, labels = DEFAULT_LABELS, accentColor }: LikertScaleProps) {
  return (
    <>
      {/* ========== MOBILE VIEW ========== */}
      <div className="md:hidden space-y-3">
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((num) => {
            const isSelected = value === num;
            const colors = SCALE_COLORS[num - 1];
            const label = labels[num - 1];

            return (
              <button
                key={num}
                onClick={() => onChange(num)}
                className={clsx(
                  "flex-1 min-h-[52px] py-2.5 rounded-xl font-bold transition-all duration-150",
                  "border-2 focus:outline-none",
                  "flex flex-col items-center justify-center gap-0.5 leading-tight",
                  "touch-manipulation select-none",
                  "active:scale-95",
                  isSelected
                    ? `${colors.active} text-white border-transparent shadow-md`
                    : `${colors.bg} ${colors.border} ${colors.text}`
                )}
                style={isSelected && accentColor ? { boxShadow: `0 6px 18px ${accentColor}25` } : undefined}
              >
                <span className="text-xs font-black opacity-80">{num}</span>
                {label && (
                  <span className="text-[9px] font-semibold text-center px-0.5 leading-tight line-clamp-2">
                    {label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========== DESKTOP VIEW ========== */}
      <div className="hidden md:block space-y-4">
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map((num) => {
            const isSelected = value === num;
            const colors = SCALE_COLORS[num - 1];
            const label = labels[num - 1];

            return (
              <button
                key={num}
                onClick={() => onChange(num)}
                className={clsx(
                  "flex-1 min-h-[64px] py-4 rounded-2xl font-bold transition-all duration-200",
                  "border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus-visible:ring-2",
                  "flex flex-col items-center justify-center gap-1 leading-tight",
                  "touch-manipulation select-none",
                  isSelected
                    ? `${colors.active} text-white border-transparent shadow-xl scale-[1.02] ${colors.ring}`
                    : `${colors.bg} ${colors.border} ${colors.text} hover:scale-[1.02] hover:shadow-md`
                )}
                style={isSelected && accentColor ? { boxShadow: `0 8px 25px ${accentColor}30` } : undefined}
              >
                <span className="text-sm font-black opacity-70">{num}</span>
                {label && (
                  <span className="text-xs font-semibold text-center px-1 leading-tight line-clamp-2">
                    {label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
