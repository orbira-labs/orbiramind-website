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

/**
 * Pool ui_category.id (8 design token) → tema eşlemesi.
 *
 * Token'lar DB'de `aqe.deep_dive_pools.ui_category.id` olarak yaşar:
 *   body, character, lifestyle, mind, movement, nutrition, sleep, social
 *
 * Yeni pool eklemek = mevcut token'lardan birini seç (DB'de SQL only).
 * Bilinmeyen token gelirse hash-based fallback kullanılır (graceful).
 */
const POOL_TOKEN_THEMES: Record<string, DimensionTheme> = {
  body: DIMENSION_THEMES.physical,
  movement: DIMENSION_THEMES.functional,
  sleep: DIMENSION_THEMES.physical,
  nutrition: DIMENSION_THEMES.nutrition,
  mind: DIMENSION_THEMES.mental,
  character: DIMENSION_THEMES.self_care,
  social: DIMENSION_THEMES.social,
  lifestyle: DIMENSION_THEMES.functional,
};

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

/**
 * @param key — tercihen DB'den gelen `ui_category.id` (8 sabit token).
 *              Eski client / eksik veri durumunda pool string'i de geçerli;
 *              hash-based fallback kullanılır.
 */
export function getPoolTheme(key: string): DimensionTheme {
  const tokenTheme = POOL_TOKEN_THEMES[key];
  if (tokenTheme) return tokenTheme;
  const idx = hashString(key) % POOL_COLOR_PALETTE.length;
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

/**
 * Pool için kullanıcıya gösterilecek başlık.
 *
 * Önce backend'den gelen `ui_category.label` (DB tek source of truth) kullanılır.
 * Eski release / eksik veri durumunda pool ID'si snake_case → Title Case'e çevrilir.
 *
 * Yeni pool eklendiğinde DB'de `ui_category` doluyorsa client değişikliği gerekmez.
 */
function formatPoolName(pool: string): string {
  return pool
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getPoolLabel(pool: string, uiCategoryLabel?: string): string {
  return uiCategoryLabel ?? formatPoolName(pool);
}
