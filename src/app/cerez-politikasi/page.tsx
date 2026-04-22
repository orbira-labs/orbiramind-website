import type { Metadata } from "next";
import { Cookie } from "lucide-react";
import { LegalPageLayout, type LegalSection } from "@/components/legal/LegalPageLayout";
import { SELLER_DISPLAY } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Çerez Politikası",
  description:
    "OrbiraMind çerez politikası — kullanılan çerezler, amaçları ve tarayıcıdan nasıl yönetebileceğinize dair bilgiler.",
  robots: { index: true, follow: true },
};

const sections: LegalSection[] = [
  {
    id: "01",
    title: "Çerez Nedir?",
    content: (
      <p className="text-pro-text-secondary">
        Çerezler (cookies), bir web sitesini ziyaret ettiğinizde tarayıcınız
        aracılığıyla cihazınızda saklanan küçük metin dosyalarıdır. Çerezler, web
        sitesinin sizi tanımasını, oturumunuzu açık tutmasını ve tercihlerinizi
        hatırlamasını sağlar.
      </p>
    ),
  },
  {
    id: "02",
    title: "OrbiraMind&apos;da Hangi Çerezler Kullanılır?",
    content: (
      <div className="space-y-3 text-pro-text-secondary">
        <div>
          <h4 className="font-semibold text-pro-text mb-1">
            a) Zorunlu / Fonksiyonel Çerezler
          </h4>
          <p>
            Platformun çalışması için olmazsa olmaz çerezlerdir. Oturum yönetimi,
            kimlik doğrulama ve güvenlik (CSRF) amacıyla kullanılırlar.
          </p>
          <ul className="list-disc list-inside space-y-0.5 mt-2">
            <li>
              <strong className="text-pro-text">sb-access-token / sb-refresh-token:</strong>{" "}
              Supabase oturum tokenları — kullanıcıyı tanımak için zorunludur.
            </li>
            <li>
              <strong className="text-pro-text">orbira-theme:</strong> tema tercihiniz
              (açık / koyu).
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-pro-text mb-1">
            b) Analitik Çerezler
          </h4>
          <p>
            Platform performansının iyileştirilmesi amacıyla ileride Google
            Analytics, Plausible veya eşdeğeri gizliliğe saygılı analitik araçlar
            entegre edilirse, bu bölüm güncellenecek ve kullanıcı onayı alınacaktır.
            <strong className="text-pro-text">
              {" "}Şu an platformda üçüncü taraf analitik çerezi kullanılmamaktadır.
            </strong>
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-pro-text mb-1">
            c) Reklam / Pazarlama Çerezleri
          </h4>
          <p>
            OrbiraMind&apos;da reklam veya takip (tracking) çerezleri{" "}
            <strong className="text-pro-text">kullanılmamaktadır</strong>.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "03",
    title: "Çerezlerin Süresi",
    content: (
      <ul className="list-disc list-inside space-y-1.5 text-pro-text-secondary">
        <li>
          <strong className="text-pro-text">Oturum çerezleri:</strong> tarayıcınızı
          kapattığınızda otomatik silinir.
        </li>
        <li>
          <strong className="text-pro-text">Kalıcı çerezler:</strong> tarayıcınızda
          belirli bir süre saklanır (örn. oturum yenileme için 30 gün).
        </li>
      </ul>
    ),
  },
  {
    id: "04",
    title: "Çerezleri Nasıl Yönetirim?",
    content: (
      <div className="space-y-2 text-pro-text-secondary">
        <p>
          Tarayıcınız üzerinden çerezleri her zaman yönetebilir, silebilir veya
          reddedebilirsiniz. Ancak zorunlu çerezlerin devre dışı bırakılması
          platformun temel işlevlerini (oturum açma, güvenlik vb.) kullanmanızı
          engeller.
        </p>
        <p>Popüler tarayıcılarda çerez ayarları:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong className="text-pro-text">Chrome:</strong> Ayarlar → Gizlilik ve
            güvenlik → Çerezler ve diğer site verileri
          </li>
          <li>
            <strong className="text-pro-text">Safari:</strong> Tercihler → Gizlilik →
            Çerezleri ve web sitesi verilerini yönet
          </li>
          <li>
            <strong className="text-pro-text">Firefox:</strong> Ayarlar → Gizlilik ve
            Güvenlik → Çerezler ve Site Verileri
          </li>
          <li>
            <strong className="text-pro-text">Edge:</strong> Ayarlar → Çerezler ve site
            izinleri
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "05",
    title: "Değişiklikler",
    content: (
      <p className="text-pro-text-secondary">
        Bu çerez politikası zaman zaman güncellenebilir. Yeni analitik veya
        pazarlama araçları eklendiğinde burada duyurulur ve gerekli olduğu
        durumlarda ek onay talep edilir.
      </p>
    ),
  },
];

export default function CerezPolitikasiPage() {
  return (
    <LegalPageLayout
      icon={Cookie}
      title="Çerez Politikası"
      intro={
        <p>
          OrbiraMind olarak kullandığımız çerezler konusunda şeffaf olmayı önemsiyoruz.
          Bu sayfa hangi çerezleri, hangi amaçla ve ne kadar süreyle kullandığımızı
          açıklar.
        </p>
      }
      sections={sections}
      footerNote={
        <p className="text-sm text-pro-text-secondary">
          Çerez yönetimi ile ilgili sorular için:{" "}
          <a href={SELLER_DISPLAY.emailHref} className="text-pro-primary underline">
            {SELLER_DISPLAY.emailDisplay}
          </a>
        </p>
      }
    />
  );
}
