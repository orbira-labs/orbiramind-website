"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AtomAnimation } from "@/components/ui/AtomAnimation";

const PHASES = [
  { message: "Analiz motoru başlatılıyor...", at: 0 },
  { message: "Sorular kalibre ediliyor...", at: 1000 },
  { message: "Kişiselleştirme uygulanıyor...", at: 2200 },
  { message: "Güvenli bağlantı kuruluyor...", at: 3400 },
  { message: "Test hazır, son kontroller...", at: 4400 },
];

// Renk evreleri: mor → açık mavi/cyan → yeşil
// hue-rotate(120deg) = mor, hue-rotate(0deg) = cyan, hue-rotate(-60deg) = yeşil
const COLOR_KEYFRAMES = {
  hueRotate: ["120deg", "60deg", "0deg", "-30deg", "-60deg"],
  bgFrom: [
    "rgba(88,28,235,0.18)",
    "rgba(99,102,241,0.15)",
    "rgba(14,165,233,0.18)",
    "rgba(6,182,212,0.15)",
    "rgba(5,150,105,0.18)",
  ],
  bgTo: [
    "rgba(139,92,246,0.08)",
    "rgba(59,130,246,0.10)",
    "rgba(34,211,238,0.10)",
    "rgba(16,185,129,0.12)",
    "rgba(4,120,87,0.08)",
  ],
};

interface TestCreatingOverlayProps {
  visible: boolean;
}

export function TestCreatingOverlay({ visible }: TestCreatingOverlayProps) {
  const [messageIdx, setMessageIdx] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);

  useEffect(() => {
    if (!visible) {
      setMessageIdx(0);
      setPhaseProgress(0);
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];

    PHASES.forEach((phase, i) => {
      timers.push(setTimeout(() => setMessageIdx(i), phase.at));
    });

    const interval = setInterval(() => {
      setPhaseProgress((p) => Math.min(p + 1, 100));
    }, 50);
    timers.push(interval as unknown as ReturnType<typeof setTimeout>);

    return () => {
      timers.forEach((t) => clearTimeout(t));
      clearInterval(interval);
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          transition={{ duration: 0.3 }}
        >
          {/* Solid dark backdrop to fully cover background */}
          <div className="absolute inset-0 bg-black" />
          
          {/* Animated gradient overlay */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: COLOR_KEYFRAMES.bgFrom.map(
                (from, i) =>
                  `radial-gradient(ellipse at 50% 40%, ${from}, ${COLOR_KEYFRAMES.bgTo[i]}, transparent)`
              ),
            }}
            transition={{
              duration: 5,
              times: [0, 0.2, 0.5, 0.75, 1],
              ease: "easeInOut",
            }}
          />

          {/* Floating glow orbs */}
          <motion.div
            className="absolute w-96 h-96 rounded-full blur-3xl pointer-events-none"
            animate={{
              backgroundColor: [
                "rgba(139,92,246,0.12)",
                "rgba(99,102,241,0.10)",
                "rgba(34,211,238,0.12)",
                "rgba(16,185,129,0.14)",
                "rgba(5,150,105,0.10)",
              ],
              scale: [1, 1.15, 1.05, 1.2, 1],
            }}
            transition={{ duration: 5, ease: "easeInOut" }}
            style={{ top: "20%", left: "50%", transform: "translateX(-50%)" }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-8 px-8">
            {/* Atom with animated hue-rotate */}
            <motion.div
              animate={{ filter: COLOR_KEYFRAMES.hueRotate.map((h) => `hue-rotate(${h})`) }}
              transition={{
                duration: 5,
                times: [0, 0.2, 0.5, 0.75, 1],
                ease: "easeInOut",
              }}
            >
              <AtomAnimation size="lg" animate slow={false} />
            </motion.div>

            {/* Phase message */}
            <div className="h-6 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={messageIdx}
                  className="text-sm font-mono tracking-widest text-white/70 text-center"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                >
                  {PHASES[messageIdx].message}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Progress bar */}
            <div className="w-64 h-[2px] bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                animate={{
                  width: `${phaseProgress}%`,
                  backgroundColor: [
                    "rgb(139,92,246)",
                    "rgb(99,102,241)",
                    "rgb(34,211,238)",
                    "rgb(16,185,129)",
                    "rgb(5,150,105)",
                  ],
                }}
                transition={{
                  width: { duration: 0.1, ease: "linear" },
                  backgroundColor: {
                    duration: 5,
                    times: [0, 0.2, 0.5, 0.75, 1],
                    ease: "easeInOut",
                  },
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
