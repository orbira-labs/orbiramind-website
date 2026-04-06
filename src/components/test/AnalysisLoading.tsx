"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const LOADING_STEPS = [
  { label: "Analiziniz hazırlanıyor...", duration: 3000 },
  { label: "Kişilik özellikleri hesaplanıyor...", duration: 4000 },
  { label: "Davranış örüntüleri tespit ediliyor...", duration: 5000 },
  { label: "AI doğrulama yapılıyor...", duration: 6000 },
  { label: "Raporunuz yazılıyor...", duration: 0 },
];

export function AnalysisLoading() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (stepIndex < LOADING_STEPS.length - 1) {
      const timer = setTimeout(() => {
        setStepIndex((i) => i + 1);
      }, LOADING_STEPS[stepIndex].duration);
      return () => clearTimeout(timer);
    }
  }, [stepIndex]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F9F7] to-[#E8F0EC] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#5B7B6A]/20 to-[#7A9A8A]/10 blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-8 sm:p-12 max-w-md w-full text-center relative z-10"
      >
        <div className="relative w-28 h-28 mx-auto mb-8">
          {/* Outer pulsing ring */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-[#5B7B6A]/20"
          />
          
          <svg className="w-28 h-28 relative z-10" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="6"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="url(#analysisGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="251.2"
              strokeDashoffset="62.8"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "center" }}
            />
            <defs>
              <linearGradient id="analysisGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#5B7B6A" />
                <stop offset="50%" stopColor="#7A9A8A" />
                <stop offset="100%" stopColor="#5B7B6A" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg className="w-10 h-10 text-[#5B7B6A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </motion.div>
          </div>
        </div>

        <motion.h2
          key={stepIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-xl font-semibold text-gray-900 mb-2"
        >
          {LOADING_STEPS[stepIndex].label}
        </motion.h2>
        <p className="text-gray-500 text-sm mb-8">
          Bu işlem 20-30 saniye sürebilir
        </p>

        <div className="space-y-2.5">
          {LOADING_STEPS.map((step, idx) => (
            <motion.div
              key={idx}
              initial={false}
              animate={{
                backgroundColor:
                  idx < stepIndex
                    ? "rgb(240 253 244)"
                    : idx === stepIndex
                    ? "rgba(91, 123, 106, 0.1)"
                    : "rgb(249 250 251)",
              }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
            >
              <motion.div
                initial={false}
                animate={{
                  backgroundColor:
                    idx < stepIndex
                      ? "#22C55E"
                      : idx === stepIndex
                      ? "#5B7B6A"
                      : "#E5E7EB",
                  scale: idx === stepIndex ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  backgroundColor: { duration: 0.3 },
                  scale: { duration: 1, repeat: idx === stepIndex ? Infinity : 0 },
                }}
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
              >
                {idx < stepIndex ? (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-3.5 h-3.5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </motion.svg>
                ) : idx === stepIndex ? (
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-2 h-2 bg-white rounded-full"
                  />
                ) : (
                  <div className="w-2 h-2 bg-gray-400 rounded-full" />
                )}
              </motion.div>
              <span
                className={`text-sm font-medium transition-colors duration-300 ${
                  idx < stepIndex
                    ? "text-green-700"
                    : idx === stepIndex
                    ? "text-[#5B7B6A]"
                    : "text-gray-400"
                }`}
              >
                {step.label.replace("...", "")}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 pt-6 border-t border-gray-100"
        >
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Lütfen sayfayı kapatmayın
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
