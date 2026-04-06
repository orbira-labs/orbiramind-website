"use client";

import { clsx } from "clsx";
import type { MeasurementField } from "@/lib/engine-api";

interface MeasurementInputProps {
  field: MeasurementField;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function MeasurementInput({ field, value, onChange }: MeasurementInputProps) {
  if (field.answer_type === "numeric") {
    const min = field.numeric_range?.min;
    const max = field.numeric_range?.max;

    return (
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          {field.text}
        </label>
        <input
          type="number"
          min={min}
          max={max}
          value={(value as number) || ""}
          onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
          className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#5B7B6A] focus:outline-none focus:ring-2 focus:ring-[#5B7B6A]/20 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder={min && max ? `${min} - ${max}` : undefined}
        />
      </div>
    );
  }

  if (field.answer_type === "single_choice" && field.options) {
    return (
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">{field.text}</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {field.options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={clsx(
                "px-4 py-3 rounded-2xl border-2 text-sm font-medium transition-all duration-200",
                value === option.value
                  ? "bg-[#5B7B6A] border-[#5B7B6A] text-white shadow-lg shadow-[#5B7B6A]/25 scale-[1.02]"
                  : "bg-white border-gray-200 text-gray-700 hover:border-[#5B7B6A]/40 hover:bg-[#5B7B6A]/5 hover:shadow-sm active:scale-[0.98]"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
