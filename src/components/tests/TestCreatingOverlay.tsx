"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PHASES = [
  { message: "Analiz motoru başlatılıyor", icon: "⚡" },
  { message: "Sorular kalibre ediliyor", icon: "🎯" },
  { message: "Kişiselleştirme uygulanıyor", icon: "✨" },
  { message: "Güvenli bağlantı kuruluyor", icon: "🔐" },
  { message: "Test hazır, son kontroller", icon: "🚀" },
];

const PHASE_TIMING = [0, 1000, 2200, 3400, 4400];

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface TestCreatingOverlayProps {
  visible: boolean;
}

export function TestCreatingOverlay({ visible }: TestCreatingOverlayProps) {
  const [messageIdx, setMessageIdx] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);

  const particles = useMemo<Particle[]>(() => 
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 3 + 4,
      delay: Math.random() * 2,
    })), []
  );

  useEffect(() => {
    if (!visible) {
      setMessageIdx(0);
      setPhaseProgress(0);
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];

    PHASE_TIMING.forEach((time, i) => {
      timers.push(setTimeout(() => setMessageIdx(i), time));
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
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          transition={{ duration: 0.4 }}
        >
          {/* Light gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#f8faf9] via-[#f0f7f4] to-[#e8f5ec]" />
          
          {/* Animated organic waves */}
          <svg 
            className="absolute inset-0 w-full h-full" 
            preserveAspectRatio="none"
            viewBox="0 0 1440 900"
          >
            <defs>
              <linearGradient id="wave1Gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(91,123,106,0.08)" />
                <stop offset="50%" stopColor="rgba(91,123,106,0.15)" />
                <stop offset="100%" stopColor="rgba(91,123,106,0.08)" />
              </linearGradient>
              <linearGradient id="wave2Gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(91,123,106,0.05)" />
                <stop offset="50%" stopColor="rgba(91,123,106,0.12)" />
                <stop offset="100%" stopColor="rgba(91,123,106,0.05)" />
              </linearGradient>
              <linearGradient id="wave3Gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(91,123,106,0.03)" />
                <stop offset="50%" stopColor="rgba(91,123,106,0.08)" />
                <stop offset="100%" stopColor="rgba(91,123,106,0.03)" />
              </linearGradient>
            </defs>
            
            {/* Wave 1 - slowest, biggest */}
            <motion.path
              fill="url(#wave1Gradient)"
              initial={{ d: "M0,450 C360,350 720,550 1080,450 C1260,400 1440,500 1440,500 L1440,900 L0,900 Z" }}
              animate={{ 
                d: [
                  "M0,450 C360,350 720,550 1080,450 C1260,400 1440,500 1440,500 L1440,900 L0,900 Z",
                  "M0,500 C360,550 720,350 1080,500 C1260,550 1440,400 1440,400 L1440,900 L0,900 Z",
                  "M0,450 C360,350 720,550 1080,450 C1260,400 1440,500 1440,500 L1440,900 L0,900 Z",
                ]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Wave 2 - medium */}
            <motion.path
              fill="url(#wave2Gradient)"
              initial={{ d: "M0,550 C240,450 480,650 720,550 C960,450 1200,650 1440,550 L1440,900 L0,900 Z" }}
              animate={{ 
                d: [
                  "M0,550 C240,450 480,650 720,550 C960,450 1200,650 1440,550 L1440,900 L0,900 Z",
                  "M0,600 C240,650 480,450 720,600 C960,650 1200,450 1440,600 L1440,900 L0,900 Z",
                  "M0,550 C240,450 480,650 720,550 C960,450 1200,650 1440,550 L1440,900 L0,900 Z",
                ]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Wave 3 - fastest, smallest */}
            <motion.path
              fill="url(#wave3Gradient)"
              initial={{ d: "M0,650 C180,600 360,700 540,650 C720,600 900,700 1080,650 C1260,600 1440,700 1440,700 L1440,900 L0,900 Z" }}
              animate={{ 
                d: [
                  "M0,650 C180,600 360,700 540,650 C720,600 900,700 1080,650 C1260,600 1440,700 1440,700 L1440,900 L0,900 Z",
                  "M0,680 C180,720 360,640 540,680 C720,720 900,640 1080,680 C1260,720 1440,640 1440,640 L1440,900 L0,900 Z",
                  "M0,650 C180,600 360,700 540,650 C720,600 900,700 1080,650 C1260,600 1440,700 1440,700 L1440,900 L0,900 Z",
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>

          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full bg-[#5B7B6A]"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.size,
                  height: p.size,
                  opacity: 0.15,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.1, 0.25, 0.1],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Radial glow behind center */}
          <div 
            className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(91,123,106,0.12) 0%, rgba(91,123,106,0.05) 40%, transparent 70%)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-10 px-8">
            
            {/* Central animated icon/logo */}
            <div className="relative">
              {/* Orbiting rings */}
              <motion.div
                className="absolute inset-0 w-40 h-40 -m-8"
                style={{ 
                  border: "1px solid rgba(91,123,106,0.2)",
                  borderRadius: "50%",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              >
                <motion.div 
                  className="absolute w-3 h-3 bg-[#5B7B6A] rounded-full shadow-lg"
                  style={{ top: -6, left: "50%", marginLeft: -6 }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              
              <motion.div
                className="absolute inset-0 w-52 h-52 -m-14"
                style={{ 
                  border: "1px solid rgba(91,123,106,0.12)",
                  borderRadius: "50%",
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              >
                <motion.div 
                  className="absolute w-2 h-2 bg-[#5B7B6A]/60 rounded-full"
                  style={{ top: -4, left: "50%", marginLeft: -4 }}
                />
              </motion.div>

              {/* Center nucleus with pulse */}
              <motion.div
                className="relative w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #5B7B6A 0%, #4a6a59 50%, #3d5a4b 100%)",
                  boxShadow: "0 8px 32px rgba(91,123,106,0.3), 0 0 0 1px rgba(255,255,255,0.1) inset",
                }}
                animate={{
                  boxShadow: [
                    "0 8px 32px rgba(91,123,106,0.3), 0 0 0 1px rgba(255,255,255,0.1) inset",
                    "0 12px 48px rgba(91,123,106,0.5), 0 0 0 1px rgba(255,255,255,0.2) inset",
                    "0 8px 32px rgba(91,123,106,0.3), 0 0 0 1px rgba(255,255,255,0.1) inset",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Inner glow */}
                <div 
                  className="absolute inset-2 rounded-full"
                  style={{
                    background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 60%)",
                  }}
                />
                
                {/* DNA Helix SVG */}
                <svg 
                  width="40" 
                  height="40" 
                  viewBox="0 0 40 40" 
                  className="relative z-10"
                >
                  <motion.g
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: "20px 20px" }}
                  >
                    {/* Helix strand 1 */}
                    <motion.path
                      d="M10,5 Q20,12 10,20 Q0,28 10,35"
                      fill="none"
                      stroke="rgba(255,255,255,0.9)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    {/* Helix strand 2 */}
                    <motion.path
                      d="M30,5 Q20,12 30,20 Q40,28 30,35"
                      fill="none"
                      stroke="rgba(255,255,255,0.6)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    {/* Connecting bars */}
                    {[8, 14, 20, 26, 32].map((y, i) => (
                      <motion.line
                        key={i}
                        x1={i % 2 === 0 ? 12 : 10}
                        y1={y}
                        x2={i % 2 === 0 ? 28 : 30}
                        y2={y}
                        stroke="rgba(255,255,255,0.4)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
                      />
                    ))}
                  </motion.g>
                </svg>
              </motion.div>
            </div>

            {/* Phase message with icon */}
            <div className="flex flex-col items-center gap-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={messageIdx}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4 }}
                >
                  <span className="text-2xl">{PHASES[messageIdx].icon}</span>
                  <p className="text-lg font-medium tracking-wide text-[#3d5a4b]">
                    {PHASES[messageIdx].message}
                  </p>
                </motion.div>
              </AnimatePresence>
              
              {/* Animated dots */}
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[#5B7B6A]"
                    animate={{ 
                      opacity: [0.3, 1, 0.3],
                      scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{ 
                      duration: 1.2, 
                      delay: i * 0.2, 
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-72 sm:w-80">
              <div className="h-1.5 bg-[#5B7B6A]/10 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div
                  className="h-full rounded-full relative overflow-hidden"
                  style={{
                    background: "linear-gradient(90deg, #5B7B6A 0%, #6d8f7c 50%, #5B7B6A 100%)",
                  }}
                  animate={{ width: `${phaseProgress}%` }}
                  transition={{ duration: 0.1, ease: "linear" }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                    }}
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
              </div>
              
              {/* Progress percentage */}
              <div className="flex justify-between mt-2">
                <span className="text-xs text-[#5B7B6A]/60 font-medium">Hazırlanıyor</span>
                <span className="text-xs text-[#5B7B6A] font-semibold">{phaseProgress}%</span>
              </div>
            </div>

            {/* Step indicators */}
            <div className="flex gap-2 mt-2">
              {PHASES.map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: i <= messageIdx ? "#5B7B6A" : "rgba(91,123,106,0.2)",
                  }}
                  animate={i === messageIdx ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.6, repeat: i === messageIdx ? Infinity : 0 }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
