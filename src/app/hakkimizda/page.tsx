import type { Metadata } from "next";
import Link from "next/link";
import { Info, ArrowLeft, Brain, ShieldCheck, Sparkles, Users } from "lucide-react";
import { LEGAL_LAST_UPDATED, SELLER, SELLER_DISPLAY } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "OrbiraMind — psikologlar, koçlar ve danışmanlar için tasarlanmış danışan yönetim ve kişilik analizi platformu.",
  robots: { index: true, follow: true },
};

const values = [
  {
    icon: Brain,
    title: "Bilimsel temelli analiz",
    desc: "Kural tabanlı HAE ve AQE motorlarıyla şeffaf, açıklanabilir kişilik analizi.",
  },
  {
    icon: ShieldCheck,
    title: "Gizlilik ve güvenlik",
    desc: "KVKK uyumlu altyapı, rol tabanlı erişim ve veri minimizasyonu prensipleri.",
  },
  {
    icon: Users,
    title: "Profesyonel odaklı",
    desc: "Psikolog, koç ve danışmanların gerçek iş akışına göre tasarlanmış arayüz.",
  },
  {
    icon: Sparkles,
    title: "Sürekli gelişim",
    desc: "Geri bildirim ile büyüyen, düzenli güncellenen yalın bir ürün felsefesi.",
  },
];

export default function HakkimizdaPage() {
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
              <Info className="h-5 w-5 text-pro-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-pro-text">Hakkımızda</h1>
              <p className="text-sm text-pro-text-tertiary">
                OrbiraMind · Son güncelleme: {LEGAL_LAST_UPDATED}
              </p>
            </div>
          </div>
          <p className="text-[15px] text-pro-text-secondary leading-relaxed">
            <strong className="text-pro-text">OrbiraMind</strong>; psikologlar,
            yaşam koçları ve danışmanların danışan süreçlerini uçtan uca yönetmesi
            için tasarlanmış bir dijital çalışma platformudur. Randevu takibinden
            kişilik analizine, seans asistanından ilerleme raporlarına kadar
            profesyonelin gün içinde ihtiyaç duyduğu araçları tek yerde toplar.
          </p>
        </div>

        <div className="bg-pro-surface border border-pro-border rounded-2xl p-6 mb-6">
          <h2 className="text-base font-semibold text-pro-text mb-3">
            Hikayemiz
          </h2>
          <div className="space-y-3 text-[14px] text-pro-text-secondary leading-relaxed">
            <p>
              OrbiraMind, Türkiye&apos;de ruh sağlığı ve gelişim alanında çalışan
              profesyonellerin dağınık araçlar ve manuel notlar yerine tek bir
              güvenli dijital merkezde çalışabilmesi fikrinden doğdu. Amacımız;
              danışan bilgilerini korurken profesyonellerin zamandan kazanmasını,
              gözlemlerini somut veriye dönüştürmesini ve danışana daha iyi
              hizmet vermesini sağlamaktır.
            </p>
            <p>
              Platform, <strong className="text-pro-text">HAE (Human Analysis Engine)</strong>{" "}
              ve <strong className="text-pro-text">AQE (Adaptive Question Engine)</strong>{" "}
              adlı Orbira&apos;nın proprietary hibrit motorlarını temel alır. Bu
              motorlar; algoritmik bir omurga üzerine isteğe bağlı AI katmanı
              ekleyerek şeffaf ve açıklanabilir kişilik analizi üretir.
            </p>
          </div>
        </div>

        <div className="bg-pro-surface border border-pro-border rounded-2xl p-6 mb-6">
          <h2 className="text-base font-semibold text-pro-text mb-4">Değerlerimiz</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {values.map((v) => (
              <div key={v.title} className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-pro-primary/10 flex items-center justify-center shrink-0">
                  <v.icon className="h-4.5 w-4.5 text-pro-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-pro-text mb-0.5">
                    {v.title}
                  </h3>
                  <p className="text-[13px] text-pro-text-secondary leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-pro-surface border border-pro-border rounded-2xl p-6 mb-6">
          <h2 className="text-base font-semibold text-pro-text mb-3">
            Satıcı ve Yasal Bilgiler
          </h2>
          <div className="text-[14px] text-pro-text-secondary space-y-1.5">
            <p>
              <strong className="text-pro-text">İşletici:</strong> {SELLER.legalName}{" "}
              (gerçek kişi / bireysel satıcı)
            </p>
            <p>
              <strong className="text-pro-text">Marka:</strong> {SELLER.brandName} —{" "}
              <a
                href={SELLER.website}
                className="text-pro-primary underline"
              >
                {SELLER.domain}
              </a>
            </p>
            <p>
              <strong className="text-pro-text">Adres:</strong>{" "}
              {SELLER_DISPLAY.addressSingle}
            </p>
            <p>
              <strong className="text-pro-text">Telefon:</strong>{" "}
              <a
                href={SELLER_DISPLAY.phoneHref}
                className="text-pro-primary underline"
              >
                {SELLER_DISPLAY.phoneDisplay}
              </a>
            </p>
            <p>
              <strong className="text-pro-text">E-posta:</strong>{" "}
              <a
                href={SELLER_DISPLAY.emailHref}
                className="text-pro-primary underline"
              >
                {SELLER_DISPLAY.emailDisplay}
              </a>
            </p>
            <p className="text-xs text-pro-text-tertiary pt-2">
              KDV durumu: {SELLER.vatStatus}
            </p>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-pro-border text-center space-y-3">
          <p className="text-sm text-pro-text-secondary">
            Geri bildirim ve iletişim için{" "}
            <Link href="/iletisim" className="text-pro-primary underline">
              iletişim sayfamıza
            </Link>{" "}
            bakabilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
}
