import { format, formatDistanceToNow, isToday, isTomorrow } from "date-fns";
import { tr } from "date-fns/locale";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { TIMEZONE } from "./constants";

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

export function toTurkeyTime(date: Date | string): Date {
  return toZonedTime(new Date(date), TIMEZONE);
}

export function fromTurkeyTime(date: Date): Date {
  return fromZonedTime(date, TIMEZONE);
}

export function formatDateForInput(date: Date): string {
  const turkeyDate = toTurkeyTime(date);
  const year = turkeyDate.getFullYear();
  const month = String(turkeyDate.getMonth() + 1).padStart(2, "0");
  const day = String(turkeyDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatTimeForInput(date: Date): string {
  const turkeyDate = toTurkeyTime(date);
  const hours = String(turkeyDate.getHours()).padStart(2, "0");
  const minutes = String(turkeyDate.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function getTodayDateString(): string {
  return formatDateForInput(new Date());
}

export function parseDateTimeToISO(dateStr: string, timeStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hours, minutes] = timeStr.split(":").map(Number);
  const turkeyDate = new Date(year, month - 1, day, hours, minutes, 0);
  return fromTurkeyTime(turkeyDate).toISOString();
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
