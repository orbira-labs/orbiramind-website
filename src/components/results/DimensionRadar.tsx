"use client";

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

function getScoreColor(score: number): string {
  if (score >= 7) return "bg-green-500";
  if (score >= 4) return "bg-yellow-500";
  return "bg-red-500";
}

function getScoreLabel(score: number): string {
  if (score >= 8) return "Çok İyi";
  if (score >= 6) return "İyi";
  if (score >= 4) return "Orta";
  if (score >= 2) return "Düşük";
  return "Çok Düşük";
}

export function DimensionRadar({ scores }: DimensionRadarProps) {
  const data = DIMENSION_ORDER.map((dim) => ({
    key: dim,
    label: DIMENSION_LABELS[dim] || dim,
    value: scores[dim] ?? 0,
  }));

  return (
    <div className="w-full space-y-3">
      {data.map((item) => (
        <div key={item.key} className="flex items-center gap-3">
          <div className="w-24 text-sm text-gray-700 font-medium truncate">
            {item.label}
          </div>
          <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden relative">
            <div
              className={`h-full ${getScoreColor(item.value)} rounded-full transition-all duration-500`}
              style={{ width: `${(item.value / 10) * 100}%` }}
            />
            <div className="absolute inset-0 flex items-center px-2">
              <div className="flex-1 flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-600 ml-1">
                  {item.value.toFixed(1)}
                </span>
                <span className="text-xs text-gray-500 mr-1">
                  {getScoreLabel(item.value)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
