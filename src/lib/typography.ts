/**
 * Typography sistemi - Pro panel genelinde tutarlı tipografi
 * Tailwind utility class'larını merkezi yönetim
 */

export const typography = {
  // Sayfa başlıkları
  pageTitle: "text-2xl font-bold text-pro-text tracking-tight",
  pageSubtitle: "text-base text-pro-text-secondary",

  // Bölüm başlıkları
  sectionTitle: "text-lg font-semibold text-pro-text",
  sectionSubtitle: "text-sm text-pro-text-secondary",

  // Kart içi tipografi
  cardTitle: "text-base font-semibold text-pro-text",
  cardSubtitle: "text-sm text-pro-text-secondary",
  cardDescription: "text-sm text-pro-text-tertiary leading-relaxed",

  // Body metinleri
  bodyLarge: "text-sm font-medium text-pro-text",
  body: "text-sm text-pro-text-secondary",
  bodySmall: "text-xs text-pro-text-secondary",

  // Caption ve etiketler
  caption: "text-xs text-pro-text-tertiary",
  label: "text-xs font-medium text-pro-text-secondary uppercase tracking-wide",

  // Sayılar ve istatistikler
  statLarge: "text-4xl font-bold tabular-nums text-pro-text",
  stat: "text-3xl font-bold tabular-nums text-pro-text",
  statMedium: "text-2xl font-bold tabular-nums text-pro-text",
  statSmall: "text-xl font-semibold tabular-nums text-pro-text",

  // Özel durumlar
  highlight: "font-semibold text-pro-primary",
  success: "text-pro-success font-medium",
  warning: "text-pro-warning font-medium",
  danger: "text-pro-danger font-medium",

  // Link stilleri
  link: "text-pro-primary hover:text-pro-primary-hover transition-colors underline-offset-2",
  linkSubtle: "text-pro-text-secondary hover:text-pro-text transition-colors",
} as const;

export type TypographyKey = keyof typeof typography;
