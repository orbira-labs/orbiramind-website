"use client";

import { clsx } from "clsx";
import type { ProfileField as ProfileFieldType } from "@/lib/engine-api";

interface ProfileFieldProps {
  field: ProfileFieldType;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function ProfileField({ field, value, onChange }: ProfileFieldProps) {
  if (field.answer_type === "multi_select" && field.options) {
    const selectedValues = (value as string[]) || [];

    function toggleOption(optValue: string) {
      const updated = selectedValues.includes(optValue)
        ? selectedValues.filter((v) => v !== optValue)
        : [...selectedValues, optValue];
      onChange(updated);
    }

    return (
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          {field.text}
          {field.required !== false && <span className="text-red-400 ml-1">*</span>}
        </label>
        <p className="text-xs text-gray-400">Birden fazla seçenek seçebilirsiniz</p>
        <div className="flex flex-wrap gap-2">
          {field.options.map((option) => {
            const isSelected = selectedValues.includes(String(option.value));
            return (
              <button
                key={String(option.value)}
                type="button"
                onClick={() => toggleOption(String(option.value))}
                className={clsx(
                  "px-4 py-2.5 rounded-full border-2 text-sm font-medium transition-all duration-200",
                  isSelected
                    ? "bg-[#5B7B6A] border-[#5B7B6A] text-white shadow-md shadow-[#5B7B6A]/20"
                    : "bg-white border-gray-200 text-gray-700 hover:border-[#5B7B6A]/40 hover:bg-[#5B7B6A]/5 active:scale-[0.98]"
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (field.answer_type === "single_choice" && field.options) {
    return (
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          {field.text}
          {field.required !== false && <span className="text-red-400 ml-1">*</span>}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {field.options.map((option) => (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => onChange(option.value)}
              className={clsx(
                "relative px-4 py-3 rounded-2xl border-2 text-sm font-medium transition-all duration-200",
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

  if (field.answer_type === "boolean" && field.options) {
    return (
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          {field.text}
          {field.required !== false && <span className="text-red-400 ml-1">*</span>}
        </label>
        <div className="flex gap-3">
          {field.options.map((option) => (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => onChange(option.value)}
              className={clsx(
                "flex-1 px-4 py-3.5 rounded-2xl border-2 text-sm font-medium transition-all duration-200",
                value === option.value
                  ? "bg-[#5B7B6A] border-[#5B7B6A] text-white shadow-lg shadow-[#5B7B6A]/25 scale-[1.02]"
                  : "bg-white border-gray-200 text-gray-700 hover:border-[#5B7B6A]/40 hover:shadow-sm active:scale-[0.98]"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (field.answer_type === "text") {
    return (
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          {field.text}
          {field.required !== false && <span className="text-red-400 ml-1">*</span>}
        </label>
        <input
          type="text"
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#5B7B6A] focus:outline-none focus:ring-2 focus:ring-[#5B7B6A]/20 transition-all"
          placeholder={`${field.text}...`}
        />
      </div>
    );
  }

  return null;
}
