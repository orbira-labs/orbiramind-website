export interface DimensionTheme {
  bg: string;
  bgGradient: string;
  badge: string;
  badgeText: string;
  accent: string;
}

const DIMENSION_THEMES: Record<string, DimensionTheme> = {
  physical: {
    bg: "bg-sky-50",
    bgGradient: "from-sky-50 to-blue-50",
    badge: "bg-sky-100",
    badgeText: "text-sky-700",
    accent: "#0284C7",
  },
  mental: {
    bg: "bg-violet-50",
    bgGradient: "from-violet-50 to-purple-50",
    badge: "bg-violet-100",
    badgeText: "text-violet-700",
    accent: "#7C3AED",
  },
  social: {
    bg: "bg-emerald-50",
    bgGradient: "from-emerald-50 to-green-50",
    badge: "bg-emerald-100",
    badgeText: "text-emerald-700",
    accent: "#059669",
  },
  functional: {
    bg: "bg-amber-50",
    bgGradient: "from-amber-50 to-yellow-50",
    badge: "bg-amber-100",
    badgeText: "text-amber-700",
    accent: "#D97706",
  },
  nutrition: {
    bg: "bg-pink-50",
    bgGradient: "from-pink-50 to-rose-50",
    badge: "bg-pink-100",
    badgeText: "text-pink-700",
    accent: "#DB2777",
  },
  self_care: {
    bg: "bg-teal-50",
    bgGradient: "from-teal-50 to-cyan-50",
    badge: "bg-teal-100",
    badgeText: "text-teal-700",
    accent: "#0D9488",
  },
  general: {
    bg: "bg-slate-50",
    bgGradient: "from-slate-50 to-gray-50",
    badge: "bg-slate-100",
    badgeText: "text-slate-700",
    accent: "#475569",
  },
};

const DEFAULT_THEME: DimensionTheme = DIMENSION_THEMES.general;

const POOL_COLOR_PALETTE: DimensionTheme[] = [
  DIMENSION_THEMES.physical,
  DIMENSION_THEMES.mental,
  DIMENSION_THEMES.social,
  DIMENSION_THEMES.functional,
  DIMENSION_THEMES.nutrition,
  DIMENSION_THEMES.self_care,
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function getDimensionTheme(dimension: string): DimensionTheme {
  return DIMENSION_THEMES[dimension] ?? DEFAULT_THEME;
}

export function getPoolTheme(pool: string): DimensionTheme {
  const idx = hashString(pool) % POOL_COLOR_PALETTE.length;
  return POOL_COLOR_PALETTE[idx];
}

const DIMENSION_LABELS: Record<string, string> = {
  physical: "Fiziksel",
  mental: "Zihinsel",
  social: "Sosyal",
  functional: "İşlevsel",
  nutrition: "Beslenme",
  self_care: "Öz Bakım",
  general: "Genel",
};

export function getDimensionLabel(dimension: string): string {
  return DIMENSION_LABELS[dimension] ?? dimension;
}

const POOL_LABELS: Record<string, string> = {
  _general: "Genel",
  sleep: "Uyku",
  stress: "Stres",
  emotional: "Duygusal",
  focus: "Odaklanma",
  routine: "Düzen",
  nutrition: "Beslenme",
  physical_activity: "Fiziksel Aktivite",
  social_life: "Sosyal Yaşam",
  self_care: "Öz Bakım",
  relationship: "İlişki",
  family: "Aile",
  communication: "İletişim",
  financial: "Finansal",
  work_life_balance: "İş-Yaşam Dengesi",
  life_satisfaction: "Yaşam Memnuniyeti",
  parenting: "Ebeveynlik",
  chronic_health: "Kronik Sağlık",
  disability: "Engel Durumu",
  hormonal: "Hormonal",
  digital_habits: "Dijital Alışkanlıklar",
  cognitive_style: "Düşünce Tarzı",
  caregiving: "Bakım Verme",
  hobbies_leisure: "Hobiler",
  support: "Destek",
};

export function getPoolLabel(pool: string): string {
  return POOL_LABELS[pool] ?? pool;
}
