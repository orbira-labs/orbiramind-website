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
    <div className="space-y-3">
      <div className="flex gap-1.5 sm:gap-2">
        {[1, 2, 3, 4, 5].map((num) => {
          const isSelected = value === num;
          const colors = SCALE_COLORS[num - 1];
          const label = labels[num - 1];

          return (
            <button
              key={num}
              onClick={() => onChange(num)}
              className={clsx(
                "flex-1 py-3 sm:py-4 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200",
                "border-2 focus:outline-none focus:ring-2 focus:ring-offset-2",
                "flex flex-col items-center justify-center gap-0.5 leading-tight",
                isSelected
                  ? `${colors.active} text-white border-transparent shadow-xl scale-105 ${colors.ring}`
                  : `${colors.bg} ${colors.border} ${colors.text} hover:scale-102 hover:shadow-md active:scale-100`
              )}
              style={isSelected && accentColor ? { boxShadow: `0 8px 25px ${accentColor}30` } : undefined}
            >
              <span className="text-[10px] sm:text-xs font-black opacity-60">{num}</span>
              {label && (
                <span className="text-[9px] sm:text-[11px] font-semibold text-center px-0.5 leading-tight">
                  {label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
