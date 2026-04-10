"use client";

import { useState, useEffect, useRef } from "react";

interface DimensionRadarProps {
  scores: Record<string, number>;
}

const DIMENSION_LABELS: Record<string, string> = {
  stress: "Stres Yönetimi",
  sleep: "Uyku Kalitesi",
  emotional: "Duygusal Denge",
  energy: "Enerji & Vitalite",
  social: "Sosyal İlişkiler",
  self_care: "Öz-Bakım",
  nutrition: "Beslenme",
  work_life: "İş-Yaşam Dengesi",
  financial: "Finansal Denge",
  satisfaction: "Yaşam Memnuniyeti",
};

const DIMENSION_ICONS: Record<string, string> = {
  stress: "M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5",
  sleep: "M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z",
  emotional: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z",
  energy: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
  social: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197",
  self_care: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z",
  nutrition: "M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.126-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12",
  work_life: "M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0",
  financial: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z",
  satisfaction: "M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z",
};

const DIMENSION_ORDER = [
  "stress", "sleep", "emotional", "energy", "social",
  "self_care", "nutrition", "work_life", "financial", "satisfaction",
];

function getScoreColor(score: number): string {
  if (score >= 7) return "#22C55E";
  if (score >= 4) return "#EAB308";
  return "#EF4444";
}

function getBarGradient(score: number): string {
  if (score >= 7) return "from-green-400 to-emerald-500";
  if (score >= 4) return "from-yellow-400 to-amber-500";
  return "from-red-400 to-rose-500";
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function DimensionRadar({ scores }: DimensionRadarProps) {
  const [animProgress, setAnimProgress] = useState(0);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const startTime = performance.now();
    const duration = 1200;

    function animate(now: number) {
      const elapsed = now - startTime;
      const p = Math.min(elapsed / duration, 1);
      setAnimProgress(easeOutCubic(p));
      if (p < 1) animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  const data = DIMENSION_ORDER
    .filter((dim) => scores[dim] !== undefined)
    .map((dim) => ({
      key: dim,
      label: DIMENSION_LABELS[dim] || dim,
      icon: DIMENSION_ICONS[dim],
      value: scores[dim] ?? 0,
    }));

  if (data.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 mb-5">
        <div className="relative">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#5B7B6A] to-[#3D5A4A] flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Boyut Bazlı Analiz</h3>
          <p className="text-xs text-gray-500">{data.length} boyut değerlendirildi</p>
        </div>
      </div>

      <div className="grid gap-2.5">
        {data.map((item, idx) => {
          const animatedValue = item.value * animProgress;
          const widthPercent = (animatedValue / 10) * 100;
          const color = getScoreColor(item.value);
          const gradient = getBarGradient(item.value);

          return (
            <div
              key={item.key}
              className="group flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50/80 transition-colors"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              {/* Icon */}
              <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-gray-200/80 flex items-center justify-center transition-colors">
                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
              </div>

              {/* Label */}
              <div className="w-28 sm:w-32 text-sm text-gray-700 font-medium truncate">
                {item.label}
              </div>

              {/* Bar */}
              <div className="flex-1 h-7 bg-gray-100 rounded-full overflow-hidden relative">
                <div
                  className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-75 relative overflow-hidden`}
                  style={{ width: `${widthPercent}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>
              </div>

              {/* Score */}
              <div className="flex-shrink-0 w-12 text-right">
                <span className="text-sm font-bold" style={{ color }}>
                  {animatedValue.toFixed(1)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
