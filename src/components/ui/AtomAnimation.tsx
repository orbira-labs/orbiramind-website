"use client";

import { motion } from "framer-motion";
import { useId } from "react";

type AtomSize = "xs" | "sm" | "md" | "lg";

interface AtomAnimationProps {
  size?: AtomSize;
  className?: string;
  animate?: boolean;
  slow?: boolean;
}

const sizeConfig: Record<AtomSize, { container: string; nucleus: string; glow: string }> = {
  xs: {
    container: "w-10 h-10 sm:w-12 sm:h-12",
    nucleus: "w-2 h-2 sm:w-2.5 sm:h-2.5",
    glow: "w-6 h-6 sm:w-8 sm:h-8",
  },
  sm: {
    container: "w-16 h-16 sm:w-20 sm:h-20",
    nucleus: "w-3 h-3 sm:w-4 sm:h-4",
    glow: "w-8 h-8 sm:w-10 sm:h-10",
  },
  md: {
    container: "w-24 h-24 sm:w-28 sm:h-28",
    nucleus: "w-4 h-4 sm:w-5 sm:h-5",
    glow: "w-10 h-10 sm:w-12 sm:h-12",
  },
  lg: {
    container: "w-32 h-32 sm:w-40 sm:h-40",
    nucleus: "w-5 h-5 sm:w-6 sm:h-6",
    glow: "w-14 h-14 sm:w-16 sm:h-16",
  },
};

export function AtomAnimation({ size = "lg", className = "", animate = true, slow = false }: AtomAnimationProps) {
  const id = useId();
  const config = sizeConfig[size];
  const s = slow ? 2 : 1;

  return (
    <div 
      className={`relative ${config.container} flex items-center justify-center ${className}`} 
      style={{ perspective: "500px" }}
    >
      {animate && (
        <>
          {/* Orbit 1 — yatay elips */}
          <svg
            className="absolute inset-0 w-full h-full overflow-visible"
            viewBox="-100 -100 200 200"
            style={{ transform: "rotateX(82deg) rotateY(0deg)" }}
          >
            <defs>
              <filter id={`${id}-glow1`} x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <ellipse cx="0" cy="0" rx="85" ry="85" fill="none" stroke="rgba(34,211,238,0.5)" strokeWidth="1.2" />
            <circle r="6" fill="#22d3ee" filter={`url(#${id}-glow1)`}>
              <animateMotion dur={`${4 * s}s`} repeatCount="indefinite">
                <mpath href={`#${id}-orbitPath1`} />
              </animateMotion>
            </circle>
            <circle r="4" fill="#67e8f9" opacity="0.8" filter={`url(#${id}-glow1)`}>
              <animateMotion dur={`${4 * s}s`} repeatCount="indefinite" begin={`-${2 * s}s`}>
                <mpath href={`#${id}-orbitPath1`} />
              </animateMotion>
            </circle>
            <path id={`${id}-orbitPath1`} d="M 85,0 A 85,85 0 1,1 -85,0 A 85,85 0 1,1 85,0" fill="none" />
          </svg>

          {/* Orbit 2 — sol üst-sağ alt köşegen */}
          <svg
            className="absolute inset-0 w-full h-full overflow-visible"
            viewBox="-100 -100 200 200"
            style={{ transform: "rotateZ(60deg) rotateX(82deg)" }}
          >
            <defs>
              <filter id={`${id}-glow2`} x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <ellipse cx="0" cy="0" rx="85" ry="85" fill="none" stroke="rgba(56,189,248,0.45)" strokeWidth="1.2" />
            <circle r="5.5" fill="#38bdf8" filter={`url(#${id}-glow2)`}>
              <animateMotion dur={`${5 * s}s`} repeatCount="indefinite">
                <mpath href={`#${id}-orbitPath2`} />
              </animateMotion>
            </circle>
            <circle r="3.5" fill="#7dd3fc" opacity="0.75" filter={`url(#${id}-glow2)`}>
              <animateMotion dur={`${5 * s}s`} repeatCount="indefinite" begin={`-${2.5 * s}s`}>
                <mpath href={`#${id}-orbitPath2`} />
              </animateMotion>
            </circle>
            <path id={`${id}-orbitPath2`} d="M 85,0 A 85,85 0 1,1 -85,0 A 85,85 0 1,1 85,0" fill="none" />
          </svg>

          {/* Orbit 3 — sağ üst-sol alt köşegen */}
          <svg
            className="absolute inset-0 w-full h-full overflow-visible"
            viewBox="-100 -100 200 200"
            style={{ transform: "rotateZ(-60deg) rotateX(82deg)" }}
          >
            <defs>
              <filter id={`${id}-glow3`} x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <ellipse cx="0" cy="0" rx="85" ry="85" fill="none" stroke="rgba(94,234,212,0.4)" strokeWidth="1.2" />
            <circle r="5" fill="#2dd4bf" filter={`url(#${id}-glow3)`}>
              <animateMotion dur={`${6 * s}s`} repeatCount="indefinite">
                <mpath href={`#${id}-orbitPath3`} />
              </animateMotion>
            </circle>
            <circle r="3.5" fill="#5eead4" opacity="0.7" filter={`url(#${id}-glow3)`}>
              <animateMotion dur={`${6 * s}s`} repeatCount="indefinite" begin={`-${3 * s}s`}>
                <mpath href={`#${id}-orbitPath3`} />
              </animateMotion>
            </circle>
            <path id={`${id}-orbitPath3`} d="M 85,0 A 85,85 0 1,1 -85,0 A 85,85 0 1,1 85,0" fill="none" />
          </svg>

          {/* Glow behind nucleus */}
          <div className={`absolute ${config.glow} rounded-full bg-cyan-400/[0.15] blur-2xl`} />
        </>
      )}

      {/* Nucleus */}
      <motion.div
        className={`relative ${config.nucleus} rounded-full z-10`}
        style={{
          background: "radial-gradient(circle at 35% 30%, #a5f3fc 0%, #22d3ee 40%, #0891b2 100%)",
          boxShadow: "0 0 25px 8px rgba(34,211,238,0.5), 0 0 50px 15px rgba(34,211,238,0.25), inset 0 0 10px rgba(255,255,255,0.3)",
        }}
        animate={animate ? {
          boxShadow: [
            "0 0 25px 8px rgba(34,211,238,0.5), 0 0 50px 15px rgba(34,211,238,0.25), inset 0 0 10px rgba(255,255,255,0.3)",
            "0 0 40px 12px rgba(34,211,238,0.7), 0 0 70px 25px rgba(34,211,238,0.35), inset 0 0 15px rgba(255,255,255,0.4)",
            "0 0 25px 8px rgba(34,211,238,0.5), 0 0 50px 15px rgba(34,211,238,0.25), inset 0 0 10px rgba(255,255,255,0.3)",
          ],
        } : {}}
        transition={{ duration: 2 * s, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
