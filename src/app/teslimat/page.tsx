import type { Metadata } from "next";
import { PackageCheck } from "lucide-react";
import { LegalPageLayout, type LegalSection } from "@/components/legal/LegalPageLayout";
import { SELLER, SELLER_DISPLAY } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Teslimat ve Hizmet Koşulları",
  description:
    "OrbiraMind dijital kredi paketlerinin ve hizmetlerinin teslim şekli, süresi ve koşullarına ilişkin bilgiler.",
  robots: { index: true, follow: true },
};

const sections: LegalSection[] = [
  {
    id: "01",
    title: "Dijital Ürün / Hizmet",
    content: (
      <p className="text-pro-text-secondary">
        OrbiraMind üzerinden satın alınan tüm ürünler{" "}
        <strong className="text-pro-text">dijital içerik / dijital hizmet</strong>{" "}
        niteliğindedir. Fiziksel bir ürün kargolanmaz; teslimat tamamen elektronik
        ortamda, ALICI&apos;nın platform hesabı üzerinden gerçekleşir.
      </p>
    ),
  },
  {
    id: "02",
    title: "Teslim Yöntemi",
    content: (
      <div className="space-y-2 text-pro-text-secondary">
        <p>
          Satın alma süreci ve teslim şu adımlardan oluşur:
        </p>
        <ol className="list-decimal list-inside space-y-1.5">
          <li>
            ALICI {SELLER.website} üzerinden istediği kredi paketini seçer ve
            siparişi onaylar.
          </li>
          <li>
            Ödeme, anlaşmalı ödeme altyapısı sağlayıcısı (iyzico / Shopier veya
            benzeri BDDK lisanslı kuruluş) üzerinden güvenli olarak tahsil edilir.
          </li>
          <li>
            Ödeme başarıyla tamamlandığı anda, satın alınan krediler ALICI&apos;nın
            platform hesabına otomatik olarak tanımlanır.
          </li>
          <li>
            ALICI&apos;ya sipariş onayını içeren bir e-posta gönderilir.
          </li>
          <li>
            ALICI, hesabına giriş yaparak kredilerini dilediği zaman kullanabilir.
          </li>
        </ol>
      </div>
    ),
  },
  {
    id: "03",
    title: "Teslim Süresi",
    content: (
      <div className="space-y-2 text-pro-text-secondary">
        <p>
          Teslim süresi, Mesafeli Sözleşmeler Yönetmeliği uyarınca en geç{" "}
          <strong className="text-pro-text">30 gün</strong> olmakla birlikte,
          uygulamada teslim ödeme onayından sonra{" "}
          <strong className="text-pro-text">birkaç saniye – birkaç dakika</strong>{" "}
          içinde tamamlanır.
        </p>
        <p>
          Banka onayı, 3D Secure doğrulaması veya ağ koşulları nedeniyle gecikme
          yaşanması halinde teslim en geç <strong className="text-pro-text">24 saat</strong>{" "}
          içinde gerçekleşir. 24 saati aşan gecikmelerde ALICI, aşağıdaki iletişim
          kanalları üzerinden SATICI&apos;ya başvurabilir.
        </p>
      </div>
    ),
  },
  {
    id: "04",
    title: "Hizmetin Kullanımı",
    content: (
      <div className="space-y-2 text-pro-text-secondary">
        <p>
          Teslim edilen krediler; ALICI tarafından OrbiraMind platformu üzerinde
          kişilik analizi test akışları oluşturmak ve ilgili dijital raporları
          üretmek amacıyla kullanılır. Kredilerin kullanımı:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong className="text-pro-text">Süresizdir.</strong> Satın alınan
            krediler, aksi belirtilmedikçe son kullanma tarihi olmaksızın hesapta
            saklanır.
          </li>
          <li>
            <strong className="text-pro-text">Devredilemez.</strong> Krediler yalnızca
            satın alan hesap üzerinden kullanılabilir; başka bir hesaba transfer
            edilemez.
          </li>
          <li>
            <strong className="text-pro-text">Nakde çevrilemez.</strong> Krediler para
            birimine çevrilemez; yalnızca platform hizmetleri için kullanılır.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "05",
    title: "Teknik Gereksinimler",
    content: (
      <div className="space-y-2 text-pro-text-secondary">
        <p>
          OrbiraMind web tabanlı bir platform olup aşağıdaki asgari teknik koşulları
          gerektirir:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Güncel bir web tarayıcısı (Chrome, Safari, Firefox, Edge son 2 sürüm)</li>
          <li>Kesintisiz internet bağlantısı</li>
          <li>Platformda kayıtlı ve doğrulanmış bir kullanıcı hesabı</li>
        </ul>
        <p>
          ALICI&apos;nın kendi cihazı veya internet bağlantısındaki sorunlardan
          kaynaklanan teslim problemleri SATICI&apos;nın sorumluluğunda değildir.
        </p>
      </div>
    ),
  },
  {
    id: "06",
    title: "Sipariş Teyidi ve Fatura Belgesi",
    content: (
      <p className="text-pro-text-secondary">
        Her başarılı ödeme sonrasında ALICI&apos;nın e-posta adresine sipariş
        teyidi ve işleme ait belge gönderilir. SATICI şu anda bireysel gerçek kişi
        statüsünde olduğundan 213 sayılı Vergi Usul Kanunu kapsamında e-Arşiv
        fatura düzenleme yükümlülüğü bulunmamaktadır; talep eden ALICI&apos;ya,
        ödeme altyapısı sağlayıcısı (iyzico / Shopier) tarafından üretilen işlem
        makbuzu (&ldquo;dekont&rdquo;) iletilir.
      </p>
    ),
  },
  {
    id: "07",
    title: "Teslim Edilemeyen Ürün",
    content: (
      <p className="text-pro-text-secondary">
        Herhangi bir teknik sebeple teslim gerçekleşmez ise ALICI&apos;nın ödediği
        tutar, SATICI tarafından en geç 14 gün içinde ALICI&apos;ya iade edilir.
        Ayrıntılı bilgi için{" "}
        <a href="/iade-iptal" className="text-pro-primary underline">
          İade ve İptal Politikası
        </a>
        &apos;na bakınız.
      </p>
    ),
  },
  {
    id: "08",
    title: "İletişim",
    content: (
      <div className="space-y-1 text-pro-text-secondary">
        <p>Teslim veya hizmet kullanımıyla ilgili her türlü soru ve destek için:</p>
        <ul className="space-y-0.5">
          <li>
            <strong className="text-pro-text">E-posta:</strong>{" "}
            <a href={SELLER_DISPLAY.emailHref} className="text-pro-primary underline">
              {SELLER_DISPLAY.emailDisplay}
            </a>
          </li>
          <li>
            <strong className="text-pro-text">Telefon:</strong>{" "}
            <a href={SELLER_DISPLAY.phoneHref} className="text-pro-primary underline">
              {SELLER_DISPLAY.phoneDisplay}
            </a>
          </li>
          <li>
            <strong className="text-pro-text">Adres:</strong> {SELLER_DISPLAY.addressSingle}
          </li>
        </ul>
      </div>
    ),
  },
];

export default function TeslimatPage() {
  return (
    <LegalPageLayout
      icon={PackageCheck}
      title="Teslimat ve Hizmet Koşulları"
      intro={
        <p>
          OrbiraMind üzerinden satın aldığınız dijital kredi paketlerinin ve
          hizmetlerinin nasıl, ne zaman ve hangi koşullarla teslim edildiğini bu
          sayfada bulabilirsiniz.
        </p>
      }
      sections={sections}
    />
  );
}
