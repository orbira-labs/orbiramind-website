import { format, formatDistanceToNow, isToday, isTomorrow } from "date-fns";
import { tr } from "date-fns/locale";

export function formatDate(date: string | Date): string {
  return format(new Date(date), "dd MMM yyyy", { locale: tr });
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), "dd MMM yyyy HH:mm", { locale: tr });
}

export function formatTime(date: string | Date): string {
  return format(new Date(date), "HH:mm", { locale: tr });
}

export function formatRelative(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: tr });
}

export function formatDayLabel(date: string | Date): string {
  const d = new Date(date);
  if (isToday(d)) return "Bugün";
  if (isTomorrow(d)) return "Yarın";
  return format(d, "dd MMMM", { locale: tr });
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function formatCurrency(cents: number, currency = "TRY"): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

export function generateWhatsAppLink(phone: string, message: string): string {
  const cleaned = phone.replace(/\D/g, "");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleaned}?text=${encoded}`;
}

export function buildTestMessage(
  clientName: string,
  professionalName: string,
  testLink: string
): string {
  return `Merhaba ${clientName},

Size bir wellness değerlendirme testi gönderdim.
Bu kısa test, birlikte daha iyi çalışmamıza yardımcı olacak.

▸ Testi başlatın: ${testLink}
▸ Süre: ~10-15 dakika
▸ Geçerlilik: 7 gün

İyi günler,
${professionalName}`;
}
