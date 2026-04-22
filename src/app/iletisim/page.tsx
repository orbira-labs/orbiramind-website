import type { Metadata } from "next";
import Link from "next/link";
import { Mail, ArrowLeft, Phone, MapPin, Globe, Clock } from "lucide-react";
import { LEGAL_LAST_UPDATED, SELLER, SELLER_DISPLAY } from "@/lib/legal";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "OrbiraMind iletişim bilgileri — destek, yasal başvurular ve iş birliği için e-posta, telefon ve posta adresi.",
  robots: { index: true, follow: true },
};

const channels = [
  {
    icon: Mail,
    label: "E-posta",
    value: SELLER_DISPLAY.emailDisplay,
    href: SELLER_DISPLAY.emailHref,
    note: "Genel destek, yasal başvurular ve işbirliği için ana kanal.",
  },
  {
    icon: Phone,
    label: "Telefon",
    value: SELLER_DISPLAY.phoneDisplay,
    href: SELLER_DISPLAY.phoneHref,
    note: "Hafta içi 10:00 – 18:00 (Türkiye saati).",
  },
  {
    icon: MapPin,
    label: "Posta adresi",
    value: SELLER_DISPLAY.addressSingle,
    href: null,
    note: "KVKK ve yasal bildirimler için posta ile ulaşabilirsiniz.",
  },
  {
    icon: Globe,
    label: "Web",
    value: SELLER.domain,
    href: SELLER.website,
    note: "Platform ve yardım sayfalarına buradan ulaşın.",
  },
] as const;

export default function IletisimPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-pro-text-secondary hover:text-pro-text transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Ana sayfa
        </Link>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-pro-primary/10 flex items-center justify-center">
              <Mail className="h-5 w-5 text-pro-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-pro-text">İletişim</h1>
              <p className="text-sm text-pro-text-tertiary">
                Son güncelleme: {LEGAL_LAST_UPDATED}
              </p>
            </div>
          </div>
          <p className="text-[15px] text-pro-text-secondary leading-relaxed">
            OrbiraMind ekibine aşağıdaki kanallar üzerinden ulaşabilirsiniz. Destek
            talepleri, yasal başvurular, iş birliği veya basın soruları için
            e-posta en hızlı kanalımızdır.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {channels.map((c) => (
            <div
              key={c.label}
              className="bg-pro-surface border border-pro-border rounded-2xl p-5 flex items-start gap-4"
            >
              <div className="h-10 w-10 rounded-lg bg-pro-primary/10 flex items-center justify-center shrink-0">
                <c.icon className="h-5 w-5 text-pro-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-wide font-semibold text-pro-text-tertiary mb-0.5">
                  {c.label}
                </p>
                {c.href ? (
                  <a
                    href={c.href}
                    className="text-pro-text font-medium hover:text-pro-primary transition-colors break-all"
                  >
                    {c.value}
                  </a>
                ) : (
                  <p className="text-pro-text font-medium break-words">{c.value}</p>
                )}
                <p className="text-[13px] text-pro-text-secondary mt-1">
                  {c.note}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-pro-surface border border-pro-border rounded-2xl p-6 mb-6">
          <h2 className="text-base font-semibold text-pro-text mb-3">
            Hangi konuda bize yazmalı?
          </h2>
          <div className="space-y-2 text-[14px] text-pro-text-secondary">
            <p>
              <strong className="text-pro-text">Destek ve teknik sorunlar:</strong>{" "}
              <a
                href={SELLER_DISPLAY.emailHref}
                className="text-pro-primary underline"
              >
                {SELLER_DISPLAY.emailDisplay}
              </a>
            </p>
            <p>
              <strong className="text-pro-text">İade, iptal ve cayma hakkı:</strong>{" "}
              <Link
                href="/iade-iptal"
                className="text-pro-primary underline"
              >
                İade prosedürü
              </Link>
            </p>
            <p>
              <strong className="text-pro-text">KVKK başvuruları:</strong>{" "}
              <Link href="/kvkk" className="text-pro-primary underline">
                KVKK Aydınlatma Metni
              </Link>{" "}
              &middot; başvurularınızı e-posta veya posta ile iletebilirsiniz.
            </p>
            <p>
              <strong className="text-pro-text">Sözleşmeye ilişkin sorular:</strong>{" "}
              <Link
                href="/mesafeli-satis-sozlesmesi"
                className="text-pro-primary underline"
              >
                Mesafeli Satış Sözleşmesi
              </Link>
            </p>
          </div>
        </div>

        <div className="bg-pro-surface border border-pro-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="h-4 w-4 text-pro-text-tertiary" />
            <h2 className="text-sm font-semibold text-pro-text">Yanıt Süresi</h2>
          </div>
          <p className="text-[13px] text-pro-text-secondary leading-relaxed">
            Destek taleplerine{" "}
            <strong className="text-pro-text">en geç 24 saat içinde</strong> ilk
            dönüş yapmaya çalışıyoruz (hafta sonu ve resmi tatillerde 48 saate
            kadar uzayabilir). KVKK başvuruları, mevzuat gereği en geç 30 gün
            içinde sonuçlandırılır.
          </p>
        </div>

        <div className="mt-10 pt-8 border-t border-pro-border flex items-center justify-center flex-wrap gap-x-4 gap-y-2 text-xs text-pro-text-tertiary">
          <Link href="/hakkimizda" className="hover:text-pro-text transition-colors">
            Hakkımızda
          </Link>
          <span>·</span>
          <Link href="/privacy" className="hover:text-pro-text transition-colors">
            Gizlilik
          </Link>
          <span>·</span>
          <Link href="/kvkk" className="hover:text-pro-text transition-colors">
            KVKK
          </Link>
          <span>·</span>
          <Link href="/terms" className="hover:text-pro-text transition-colors">
            Kullanım Koşulları
          </Link>
        </div>
      </div>
    </div>
  );
}
