"use client";

import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

interface DimensionRadarProps {
  scores: Record<string, number>;
}

const DIMENSION_LABELS: Record<string, string> = {
  stress: "Stres",
  sleep: "Uyku",
  emotional: "Duygusal",
  energy: "Enerji",
  social: "Sosyal",
  self_care: "Öz-Bakım",
  nutrition: "Beslenme",
  work_life: "İş-Yaşam",
  financial: "Finansal",
  satisfaction: "Memnuniyet",
};

const DIMENSION_ORDER = [
  "stress",
  "sleep",
  "emotional",
  "energy",
  "social",
  "self_care",
  "nutrition",
  "work_life",
  "financial",
  "satisfaction",
];

export function DimensionRadar({ scores }: DimensionRadarProps) {
  const data = DIMENSION_ORDER.map((dim) => ({
    dimension: DIMENSION_LABELS[dim] || dim,
    value: scores[dim] ?? 0,
    fullMark: 10,
  }));

  return (
    <div className="w-full h-[350px] sm:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#E5E7EB" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: "#6B7280", fontSize: 11 }}
            tickLine={false}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 10]}
            tick={{ fill: "#9CA3AF", fontSize: 10 }}
            tickCount={6}
            axisLine={false}
          />
          <Radar
            name="Skor"
            dataKey="value"
            stroke="#5B7B6A"
            fill="#5B7B6A"
            fillOpacity={0.3}
            strokeWidth={2}
            isAnimationActive={true}
            animationDuration={1200}
            animationEasing="ease-out"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
