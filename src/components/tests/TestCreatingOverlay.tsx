"use client";

import { useEffect, useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PHASES = [
  { message: "Analiz motoru başlatılıyor...", at: 0 },
  { message: "Sorular kalibre ediliyor...", at: 1000 },
  { message: "Kişiselleştirme uygulanıyor...", at: 2200 },
  { message: "Güvenli bağlantı kuruluyor...", at: 3400 },
  { message: "Test hazır, son kontroller...", at: 4400 },
];

/* ------------------------------------------------------------------ */
/*  DNA Helix – continuous double-strand flowing across screen        */
/* ------------------------------------------------------------------ */

function DnaStrand({ y, delay, reverse }: { y: number; delay: number; reverse?: boolean }) {
  const points = 24;
  const width = 2400;
  const amplitude = 18;
  const wavelength = 200;

  const strand1: string[] = [];
  const strand2: string[] = [];
  const rungs: { x: number; y1: number; y2: number }[] = [];

  for (let i = 0; i <= points; i++) {
    const x = (i / points) * width;
    const phase = (x / wavelength) * Math.PI * 2;
    const y1 = y + Math.sin(phase) * amplitude;
    const y2 = y + Math.sin(phase + Math.PI) * amplitude;
    strand1.push(`${i === 0 ? "M" : "L"}${x},${y1}`);
    strand2.push(`${i === 0 ? "M" : "L"}${x},${y2}`);
    if (i % 3 === 0 && i > 0 && i < points) {
      rungs.push({ x, y1, y2 });
    }
  }

  return (
    <motion.g
      initial={{ x: reverse ? -1200 : 0 }}
      animate={{ x: reverse ? 0 : -1200 }}
      transition={{ duration: 30 + delay * 5, repeat: Infinity, ease: "linear" }}
    >
      <path d={strand1.join(" ")} fill="none" stroke="rgba(91,123,106,0.12)" strokeWidth="1.5" />
      <path d={strand2.join(" ")} fill="none" stroke="rgba(212,133,106,0.10)" strokeWidth="1.5" />
      {rungs.map((r, i) => (
        <line
          key={i}
          x1={r.x}
          y1={r.y1}
          x2={r.x}
          y2={r.y2}
          stroke="rgba(91,123,106,0.07)"
          strokeWidth="1"
        />
      ))}
    </motion.g>
  );
}

/* ------------------------------------------------------------------ */
/*  Breathing Cosmos Atom – green ↔ coral color shift                 */
/* ------------------------------------------------------------------ */

function CosmosAtom() {
  const uid = useId();

  const orbits = [
    { rotateZ: 0, dur: 4, stroke1: "rgba(91,123,106,0.5)", stroke2: "rgba(212,133,106,0.3)", electron: "#5B7B6A", electronAlt: "#7d9e8c" },
    { rotateZ: 60, dur: 5, stroke1: "rgba(91,123,106,0.4)", stroke2: "rgba(212,133,106,0.35)", electron: "#D4856A", electronAlt: "#e0a08c" },
    { rotateZ: -60, dur: 6, stroke1: "rgba(91,123,106,0.35)", stroke2: "rgba(212,133,106,0.4)", electron: "#8aab99", electronAlt: "#c9907c" },
  ];

  return (
    <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center" style={{ perspective: "500px" }}>
      {orbits.map((o, idx) => (
        <svg
          key={idx}
          className="absolute inset-0 w-full h-full overflow-visible"
          viewBox="-100 -100 200 200"
          style={{ transform: `rotateZ(${o.rotateZ}deg) rotateX(78deg)` }}
        >
          <defs>
            <filter id={`${uid}-g${idx}`} x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Orbit ring with animated stroke color */}
          <ellipse cx="0" cy="0" rx="85" ry="85" fill="none" strokeWidth="1.2">
            <animate attributeName="stroke" values={`${o.stroke1};${o.stroke2};${o.stroke1}`} dur="4s" repeatCount="indefinite" />
          </ellipse>

          {/* Primary electron */}
          <circle r="5.5" filter={`url(#${uid}-g${idx})`}>
            <animate attributeName="fill" values={`${o.electron};${o.electronAlt};${o.electron}`} dur="4s" repeatCount="indefinite" />
            <animateMotion dur={`${o.dur}s`} repeatCount="indefinite">
              <mpath href={`#${uid}-p${idx}`} />
            </animateMotion>
          </circle>

          {/* Secondary electron (offset) */}
          <circle r="3.5" opacity="0.7" filter={`url(#${uid}-g${idx})`}>
            <animate attributeName="fill" values={`${o.electronAlt};${o.electron};${o.electronAlt}`} dur="4s" repeatCount="indefinite" />
            <animateMotion dur={`${o.dur}s`} repeatCount="indefinite" begin={`-${o.dur / 2}s`}>
              <mpath href={`#${uid}-p${idx}`} />
            </animateMotion>
          </circle>

          <path id={`${uid}-p${idx}`} d="M 85,0 A 85,85 0 1,1 -85,0 A 85,85 0 1,1 85,0" fill="none" />
        </svg>
      ))}

      {/* Glow behind nucleus */}
      <motion.div
        className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full blur-2xl"
        animate={{
          backgroundColor: [
            "rgba(91,123,106,0.2)",
            "rgba(212,133,106,0.18)",
            "rgba(91,123,106,0.2)",
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Nucleus */}
      <motion.div
        className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full z-10"
        animate={{
          background: [
            "radial-gradient(circle at 35% 30%, #b4d4c4 0%, #5B7B6A 50%, #3d5a4b 100%)",
            "radial-gradient(circle at 35% 30%, #f0c4b4 0%, #D4856A 50%, #b36a50 100%)",
            "radial-gradient(circle at 35% 30%, #b4d4c4 0%, #5B7B6A 50%, #3d5a4b 100%)",
          ],
          boxShadow: [
            "0 0 25px 8px rgba(91,123,106,0.5), 0 0 60px 20px rgba(91,123,106,0.2), inset 0 0 10px rgba(255,255,255,0.3)",
            "0 0 30px 10px rgba(212,133,106,0.55), 0 0 70px 25px rgba(212,133,106,0.2), inset 0 0 12px rgba(255,255,255,0.35)",
            "0 0 25px 8px rgba(91,123,106,0.5), 0 0 60px 20px rgba(91,123,106,0.2), inset 0 0 10px rgba(255,255,255,0.3)",
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Overlay                                                            */
/* ------------------------------------------------------------------ */

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
          transition={{ duration: 0.4 }}
        >
          {/* Clean light background */}
          <div className="absolute inset-0 bg-[#f6f9f7]" />

          {/* Breathing center glow */}
          <motion.div
            className="absolute pointer-events-none"
            style={{ width: "120vmax", height: "120vmax", borderRadius: "50%" }}
            animate={{
              background: [
                "radial-gradient(circle, rgba(91,123,106,0.09) 0%, rgba(91,123,106,0.03) 35%, transparent 60%)",
                "radial-gradient(circle, rgba(212,133,106,0.08) 0%, rgba(212,133,106,0.025) 35%, transparent 60%)",
                "radial-gradient(circle, rgba(91,123,106,0.09) 0%, rgba(91,123,106,0.03) 35%, transparent 60%)",
              ],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* DNA helix strands flowing across */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid slice">
            <DnaStrand y={120} delay={0} />
            <DnaStrand y={280} delay={1} reverse />
            <DnaStrand y={440} delay={2} />
            <DnaStrand y={600} delay={0.5} reverse />
            <DnaStrand y={760} delay={1.5} />
          </svg>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-10 px-8">
            {/* Cosmos Atom */}
            <CosmosAtom />

            {/* Phase message */}
            <div className="h-6 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={messageIdx}
                  className="text-[13px] sm:text-sm font-medium tracking-[0.2em] text-[#5B7B6A]/80 text-center uppercase"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                >
                  {PHASES[messageIdx].message}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Progress bar */}
            <div className="w-56 sm:w-64">
              <div className="h-[2px] bg-[#5B7B6A]/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  animate={{
                    width: `${phaseProgress}%`,
                    background: [
                      "linear-gradient(90deg, #5B7B6A, #7d9e8c)",
                      "linear-gradient(90deg, #D4856A, #e0a08c)",
                      "linear-gradient(90deg, #5B7B6A, #7d9e8c)",
                    ],
                  }}
                  transition={{
                    width: { duration: 0.1, ease: "linear" },
                    background: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
