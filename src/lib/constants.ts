export const PRO_CONFIG = {
  name: "Orbira Karakter Analiz",
  shortName: "Orbira",
  description: "Danışanlarınızın iç dünyasını anlamanın en bilimsel yolu",
  testExpiryDays: 7,
};

export const SPECIALIZATIONS = [
  { id: "wellness_coaching", label: "Wellness Koçluğu" },
  { id: "clinical_psychology", label: "Klinik Psikoloji" },
  { id: "dietitian", label: "Diyetisyen" },
  { id: "life_coaching", label: "Yaşam Koçu" },
  { id: "other", label: "Diğer" },
] as const;

export const WORK_TYPES = [
  { id: "individual", label: "Bireysel" },
  { id: "company", label: "İşyeri / Klinik" },
] as const;

export const APPOINTMENT_DURATIONS = [
  { value: 30, label: "30 dakika" },
  { value: 45, label: "45 dakika" },
  { value: 60, label: "60 dakika" },
  { value: 90, label: "90 dakika" },
] as const;

export const CLIENT_STATUSES = [
  { id: "active", label: "Aktif", color: "success" },
  { id: "passive", label: "Pasif", color: "warning" },
  { id: "archived", label: "Arşiv", color: "muted" },
] as const;

export const TEST_STATUSES = [
  { id: "sent", label: "Bekliyor", color: "warning" },
  { id: "started", label: "Devam Ediyor", color: "info" },
  { id: "completed", label: "Tamamlandı", color: "success" },
  { id: "expired", label: "Süresi Doldu", color: "danger" },
] as const;

export const ANALYSIS_STATUSES = TEST_STATUSES;
