"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { Check, ChevronRight } from "lucide-react";

// Scale renkleri - 1'den 5'e
const SCALE_COLORS = [
  { bg: "bg-red-50", border: "border-red-200", active: "bg-red-500", text: "text-red-600", activeBg: "bg-red-500" },
  { bg: "bg-orange-50", border: "border-orange-200", active: "bg-orange-500", text: "text-orange-600", activeBg: "bg-orange-500" },
  { bg: "bg-yellow-50", border: "border-yellow-200", active: "bg-yellow-500", text: "text-yellow-600", activeBg: "bg-yellow-500" },
  { bg: "bg-lime-50", border: "border-lime-200", active: "bg-lime-500", text: "text-lime-600", activeBg: "bg-lime-500" },
  { bg: "bg-green-50", border: "border-green-200", active: "bg-green-500", text: "text-green-600", activeBg: "bg-green-500" },
];

interface ScaleQuestionProps {
  question: string;
  value?: number;
  labels?: string[];
  onAnswer: (value: number) => void;
  accentColor?: string;
}

export function ScaleQuestion({ question, value, labels, onAnswer, accentColor }: ScaleQuestionProps) {
  const defaultLabels = ["Çok kötü", "Kötü", "Orta", "İyi", "Çok iyi"];
  const displayLabels = labels && labels.length === 5 ? labels : defaultLabels;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl sm:text-2xl font-bold text-gray-900 text-center leading-relaxed mb-8 sm:mb-12"
        >
          {question}
        </motion.h2>

        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((num, index) => {
            const isSelected = value === num;
            const colors = SCALE_COLORS[index];
            const label = displayLabels[index];

            return (
              <motion.button
                key={num}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onAnswer(num)}
                className={clsx(
                  "w-full relative overflow-hidden rounded-2xl border-2 transition-all duration-200",
                  "min-h-[56px] px-5 py-4",
                  "flex items-center gap-4",
                  "touch-manipulation select-none active:scale-[0.98]",
                  isSelected
                    ? `${colors.activeBg} border-transparent text-white shadow-lg`
                    : `${colors.bg} ${colors.border} ${colors.text} hover:shadow-md`
                )}
                style={isSelected && accentColor ? { boxShadow: `0 8px 25px ${accentColor}40` } : undefined}
              >
                {/* Color indicator bar */}
                <div
                  className={clsx(
                    "absolute left-0 top-0 bottom-0 w-1.5 transition-colors",
                    isSelected ? "bg-white/40" : colors.activeBg
                  )}
                />
                
                <span className="text-base sm:text-lg font-semibold pl-2">{label}</span>
                
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="ml-auto"
                    >
                      <Check className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface SingleChoiceOption {
  value: string | boolean;
  label: string;
}

interface SingleChoiceQuestionProps {
  question: string;
  options: SingleChoiceOption[];
  value?: string | boolean;
  onAnswer: (value: string | boolean) => void;
}

export function SingleChoiceQuestion({ question, options, value, onAnswer }: SingleChoiceQuestionProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl sm:text-2xl font-bold text-gray-900 text-center leading-relaxed mb-8 sm:mb-12"
        >
          {question}
        </motion.h2>

        <div className="space-y-3">
          {options.map((option, index) => {
            const isSelected = value === option.value;

            return (
              <motion.button
                key={String(option.value)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onAnswer(option.value)}
                className={clsx(
                  "w-full rounded-2xl border-2 transition-all duration-200",
                  "min-h-[56px] px-5 py-4",
                  "flex items-center justify-between",
                  "touch-manipulation select-none active:scale-[0.98]",
                  isSelected
                    ? "bg-[#5B7B6A] border-[#5B7B6A] text-white shadow-lg shadow-[#5B7B6A]/25"
                    : "bg-white border-gray-200 text-gray-700 hover:border-[#5B7B6A]/40 hover:shadow-md"
                )}
              >
                <span className="text-base sm:text-lg font-medium">{option.label}</span>
                
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Check className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface MultiSelectQuestionProps {
  question: string;
  options: { value: string; label: string }[];
  value: string[];
  onAnswer: (value: string[]) => void;
  onNext: () => void;
  maxSelect?: number;
}

export function MultiSelectQuestion({ question, options, value, onAnswer, onNext, maxSelect }: MultiSelectQuestionProps) {
  const selectedValues = value || [];

  function toggleOption(optValue: string) {
    if (selectedValues.includes(optValue)) {
      onAnswer(selectedValues.filter((v) => v !== optValue));
    } else if (!maxSelect || selectedValues.length < maxSelect) {
      onAnswer([...selectedValues, optValue]);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col px-6 py-8 overflow-y-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl sm:text-2xl font-bold text-gray-900 text-center leading-relaxed mb-3"
        >
          {question}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-gray-500 text-center mb-8"
        >
          {maxSelect ? `En fazla ${maxSelect} seçim yapabilirsiniz` : "Birden fazla seçenek seçebilirsiniz"}
        </motion.p>

        <div className="flex flex-wrap gap-2.5 justify-center">
          {options.map((option, index) => {
            const isSelected = selectedValues.includes(option.value);

            return (
              <motion.button
                key={option.value}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => toggleOption(option.value)}
                className={clsx(
                  "rounded-full border-2 transition-all duration-200",
                  "px-4 py-2.5",
                  "text-sm sm:text-base font-medium",
                  "touch-manipulation select-none active:scale-95",
                  isSelected
                    ? "bg-[#5B7B6A] border-[#5B7B6A] text-white shadow-md shadow-[#5B7B6A]/20"
                    : "bg-white border-gray-200 text-gray-700 hover:border-[#5B7B6A]/40"
                )}
              >
                {option.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Continue button for multi-select */}
      <div className="px-6 pb-6 pt-4 border-t border-gray-100 bg-white/80 backdrop-blur-sm">
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onNext}
          disabled={selectedValues.length === 0}
          className={clsx(
            "w-full min-h-[56px] rounded-2xl font-semibold text-base transition-all duration-200",
            "flex items-center justify-center gap-2",
            "touch-manipulation active:scale-[0.98]",
            selectedValues.length > 0
              ? "bg-[#5B7B6A] text-white shadow-lg shadow-[#5B7B6A]/25"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          Devam Et
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}

interface BooleanQuestionProps {
  question: string;
  value?: boolean;
  options?: { value: boolean; label: string }[];
  onAnswer: (value: boolean) => void;
}

export function BooleanQuestion({ question, value, options, onAnswer }: BooleanQuestionProps) {
  const displayOptions = options || [
    { value: true, label: "Evet" },
    { value: false, label: "Hayır" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl sm:text-2xl font-bold text-gray-900 text-center leading-relaxed mb-8 sm:mb-12"
        >
          {question}
        </motion.h2>

        <div className="flex gap-4 max-w-md mx-auto w-full">
          {displayOptions.map((option, index) => {
            const isSelected = value === option.value;

            return (
              <motion.button
                key={String(option.value)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onAnswer(option.value)}
                className={clsx(
                  "flex-1 rounded-2xl border-2 transition-all duration-200",
                  "min-h-[72px] px-6 py-5",
                  "flex items-center justify-center",
                  "text-lg font-semibold",
                  "touch-manipulation select-none active:scale-[0.98]",
                  isSelected
                    ? "bg-[#5B7B6A] border-[#5B7B6A] text-white shadow-lg shadow-[#5B7B6A]/25"
                    : "bg-white border-gray-200 text-gray-700 hover:border-[#5B7B6A]/40 hover:shadow-md"
                )}
              >
                {option.label}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface NumericQuestionProps {
  question: string;
  value?: number;
  min?: number;
  max?: number;
  onAnswer: (value: number) => void;
  onNext: () => void;
  suffix?: string;
}

export function NumericQuestion({ question, value, min, max, onAnswer, onNext, suffix }: NumericQuestionProps) {
  const [inputValue, setInputValue] = useState(value?.toString() || "");
  const hasValue = inputValue !== "" && !isNaN(Number(inputValue));

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setInputValue(val);
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      onAnswer(num);
    }
  }

  function handleSubmit() {
    if (hasValue) {
      onNext();
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl sm:text-2xl font-bold text-gray-900 text-center leading-relaxed mb-12"
        >
          {question}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center"
        >
          <div className="flex items-baseline gap-3">
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              value={inputValue}
              onChange={handleChange}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              min={min}
              max={max}
              autoFocus
              autoComplete="off"
              className={clsx(
                "w-32 text-center text-4xl font-bold text-gray-900",
                "border-b-3 border-gray-300 focus:border-[#5B7B6A]",
                "bg-transparent outline-none transition-colors",
                "py-2"
              )}
              placeholder={min?.toString() || "0"}
            />
            {suffix && (
              <span className="text-xl text-gray-500 font-medium">{suffix}</span>
            )}
          </div>
          
          {min != null && max != null && (
            <p className="text-sm text-gray-400 mt-4">
              {min} - {max} arası
            </p>
          )}
        </motion.div>
      </div>

      {/* Continue button */}
      <div className="px-6 pb-6 pt-4 border-t border-gray-100 bg-white/80 backdrop-blur-sm">
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleSubmit}
          disabled={!hasValue}
          className={clsx(
            "w-full min-h-[56px] rounded-2xl font-semibold text-base transition-all duration-200",
            "flex items-center justify-center gap-2",
            "touch-manipulation active:scale-[0.98]",
            hasValue
              ? "bg-[#5B7B6A] text-white shadow-lg shadow-[#5B7B6A]/25"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          Devam Et
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}

interface TextQuestionProps {
  question: string;
  value?: string;
  onAnswer: (value: string) => void;
  onNext: () => void;
  placeholder?: string;
}

export function TextQuestion({ question, value, onAnswer, onNext, placeholder }: TextQuestionProps) {
  const [inputValue, setInputValue] = useState(value || "");
  const hasValue = inputValue.trim() !== "";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setInputValue(val);
    onAnswer(val);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl sm:text-2xl font-bold text-gray-900 text-center leading-relaxed mb-12"
        >
          {question}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="max-w-md mx-auto w-full"
        >
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={(e) => e.key === "Enter" && hasValue && onNext()}
            autoFocus
            autoComplete="off"
            placeholder={placeholder || "Cevabınızı yazın..."}
            className={clsx(
              "w-full text-lg text-gray-900",
              "rounded-2xl border-2 border-gray-200 focus:border-[#5B7B6A]",
              "bg-white outline-none transition-all",
              "px-5 py-4",
              "placeholder:text-gray-400"
            )}
          />
        </motion.div>
      </div>

      {/* Continue button */}
      <div className="px-6 pb-6 pt-4 border-t border-gray-100 bg-white/80 backdrop-blur-sm">
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onNext}
          disabled={!hasValue}
          className={clsx(
            "w-full min-h-[56px] rounded-2xl font-semibold text-base transition-all duration-200",
            "flex items-center justify-center gap-2",
            "touch-manipulation active:scale-[0.98]",
            hasValue
              ? "bg-[#5B7B6A] text-white shadow-lg shadow-[#5B7B6A]/25"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          Devam Et
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}
