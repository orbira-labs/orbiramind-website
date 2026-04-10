"use client";

import { useState, useEffect, useRef } from "react";

interface WellnessGaugeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: { outer: 130, strokeWidth: 7, innerStroke: 3, fontSize: "text-2xl", labelSize: "text-xs", gap: 12 },
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

function getScoreInsight(score: number): string {
  if (score >= 8) return "Danışan hayat kalitesi oldukça yüksek seviyede";
  if (score >= 6) return "Genel iyilik hali iyi, belirli alanlarda gelişim potansiyeli var";
  if (score >= 4) return "Ortalama seviyede, gelişim alanlarına odaklanılmalı";
  if (score >= 2) return "Dikkat gerektiren birçok alan mevcut";
  return "Acil müdahale ve destek gerektiren durum";
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function WellnessGauge({ score, size = "md" }: WellnessGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [showInsight, setShowInsight] = useState(false);
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
        setTimeout(() => setShowInsight(true), 300);
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
  const insight = getScoreInsight(score);
  const gradientId = `gauge-grad-${size}`;
  const glowId = `gauge-glow-${size}`;

  const canvasSize = outer + 24;
  const canvasCenter = canvasSize / 2;

  return (
    <div className="flex flex-col items-center py-2">
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

          {/* Subtle tick marks */}
          {Array.from({ length: 40 }).map((_, i) => {
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

          {/* Leading dot on outer arc */}
          {displayScore > 0.3 && (() => {
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
          <span className="text-[11px] text-gray-400 mt-0.5">/ 10</span>
        </div>
      </div>

      <p className="mt-1 text-sm font-semibold text-gray-700 tracking-wide">Genel Skor</p>

      <div
        className={`mt-2 max-w-sm text-center transition-all duration-700 ${
          showInsight ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <p className="text-[13px] text-gray-500 leading-relaxed">{insight}</p>
      </div>
    </div>
  );
}
