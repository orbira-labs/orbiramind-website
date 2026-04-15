"use client";

import { useState, useEffect, useRef } from "react";

interface WellnessGaugeProps {
  score: number;
  size?: "xs" | "sm" | "md" | "lg";
}

const SIZES = {
  xs: { outer: 90, strokeWidth: 5, innerStroke: 2, fontSize: "text-lg", labelSize: "text-[10px]", gap: 8 },
  sm: { outer: 150, strokeWidth: 7, innerStroke: 3, fontSize: "text-3xl", labelSize: "text-xs", gap: 12 },
  md: { outer: 180, strokeWidth: 9, innerStroke: 4, fontSize: "text-4xl", labelSize: "text-sm", gap: 16 },
  lg: { outer: 220, strokeWidth: 10, innerStroke: 5, fontSize: "text-5xl", labelSize: "text-base", gap: 18 },
};

function getScoreColor(score: number): string {
  if (score >= 8) return "#22C55E";
  if (score >= 6) return "#84CC16";
  if (score >= 4) return "#EAB308";
  if (score >= 2) return "#F97316";
  return "#EF4444";
}

function getScoreGradient(score: number): [string, string] {
  if (score >= 8) return ["#22C55E", "#16A34A"];
  if (score >= 6) return ["#84CC16", "#65A30D"];
  if (score >= 4) return ["#FBBF24", "#D97706"];
  if (score >= 2) return ["#FB923C", "#EA580C"];
  return ["#F87171", "#DC2626"];
}

function getScoreLabel(score: number): string {
  if (score >= 8) return "Mükemmel";
  if (score >= 6) return "İyi";
  if (score >= 4) return "Orta";
  if (score >= 2) return "Düşük";
  return "Kritik";
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function WellnessGauge({ score, size = "md" }: WellnessGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (hasAnimated) return;
    const duration = 2000;
    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      setDisplayScore(easedProgress * score);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayScore(score);
        setHasAnimated(true);
      }
    }

    animationRef.current = requestAnimationFrame(animate);
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [score, hasAnimated]);

  const { outer, strokeWidth, innerStroke, fontSize, labelSize, gap } = SIZES[size];

  const outerRadius = (outer - strokeWidth) / 2;
  const outerCircumference = 2 * Math.PI * outerRadius;
  const outerProgress = (displayScore / 10) * outerCircumference;

  const innerRadius = outerRadius - gap;
  const innerCircumference = 2 * Math.PI * innerRadius;
  const innerProgress = (displayScore / 10) * innerCircumference;

  const color = getScoreColor(displayScore);
  const [gradStart, gradEnd] = getScoreGradient(displayScore);
  const label = getScoreLabel(displayScore);
  const gradientId = `gauge-grad-${size}`;
  const glowId = `gauge-glow-${size}`;

  const canvasSize = outer + 24;
  const canvasCenter = canvasSize / 2;

  const isCompact = size === "xs";

  return (
    <div className={`flex flex-col items-center ${isCompact ? "" : "py-2"}`}>
      <div className="relative" style={{ width: canvasSize, height: canvasSize }}>
        {/* Breathing glow behind gauge */}
        <div
          className="absolute animate-breathe rounded-full blur-3xl"
          style={{
            width: outer * 0.6,
            height: outer * 0.6,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`,
          }}
        />

        <svg width={canvasSize} height={canvasSize} className="transform -rotate-90">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradStart} />
              <stop offset="100%" stopColor={gradEnd} />
            </linearGradient>
            <filter id={glowId}>
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer track */}
          <circle
            cx={canvasCenter}
            cy={canvasCenter}
            r={outerRadius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            opacity={0.35}
          />

          {/* Subtle tick marks (hidden on xs) */}
          {!isCompact && Array.from({ length: 40 }).map((_, i) => {
            const angle = (i / 40) * 360;
            const rad = (angle * Math.PI) / 180;
            const isMajor = i % 4 === 0;
            const tickLen = isMajor ? 5 : 2.5;
            const r1 = outerRadius + strokeWidth / 2 + 1;
            const r2 = r1 + tickLen;
            return (
              <line
                key={i}
                x1={canvasCenter + r1 * Math.cos(rad)}
                y1={canvasCenter + r1 * Math.sin(rad)}
                x2={canvasCenter + r2 * Math.cos(rad)}
                y2={canvasCenter + r2 * Math.sin(rad)}
                stroke={i / 4 < displayScore ? color : "#D1D5DB"}
                strokeWidth={isMajor ? 1.2 : 0.6}
                opacity={i / 4 < displayScore ? 0.5 : 0.2}
                strokeLinecap="round"
              />
            );
          })}

          {/* Outer progress arc */}
          <circle
            cx={canvasCenter}
            cy={canvasCenter}
            r={outerRadius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={outerCircumference}
            strokeDashoffset={outerCircumference - outerProgress}
            filter={`url(#${glowId})`}
            className="transition-all duration-75"
          />

          {/* Inner track */}
          <circle
            cx={canvasCenter}
            cy={canvasCenter}
            r={innerRadius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={innerStroke}
            opacity={0.15}
          />
          {/* Inner progress arc */}
          <circle
            cx={canvasCenter}
            cy={canvasCenter}
            r={innerRadius}
            fill="none"
            stroke={color}
            strokeWidth={innerStroke}
            strokeLinecap="round"
            strokeDasharray={innerCircumference}
            strokeDashoffset={innerCircumference - innerProgress}
            opacity={0.3}
            className="transition-all duration-75"
          />

          {/* Leading dot on outer arc (hidden on xs) */}
          {!isCompact && displayScore > 0.3 && (() => {
            const angle = (displayScore / 10) * 360;
            const rad = (angle * Math.PI) / 180;
            return (
              <circle
                cx={canvasCenter + outerRadius * Math.cos(rad)}
                cy={canvasCenter + outerRadius * Math.sin(rad)}
                r={strokeWidth / 2 + 1.5}
                fill="white"
                stroke={color}
                strokeWidth={2}
                filter={`url(#${glowId})`}
              />
            );
          })()}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`${fontSize} font-extrabold tracking-tight`}
            style={{ color, textShadow: `0 0 20px ${color}15` }}
          >
            {displayScore.toFixed(1)}
          </span>
          <span
            className={`${labelSize} font-semibold tracking-wide uppercase mt-0.5`}
            style={{ color }}
          >
            {label}
          </span>
          {!isCompact && <span className="text-[11px] text-gray-400 mt-0.5">/ 10</span>}
        </div>
      </div>

    </div>
  );
}
