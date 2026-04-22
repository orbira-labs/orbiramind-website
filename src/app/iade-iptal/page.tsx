import type { Metadata } from "next";
import { RotateCcw } from "lucide-react";
import { LegalPageLayout, type LegalSection } from "@/components/legal/LegalPageLayout";
import { SELLER, SELLER_DISPLAY } from "@/lib/legal";

export const metadata: Metadata = {
  title: "İade, İptal ve Cayma Hakkı",
  description:
    "OrbiraMind kredi paketi ve dijital hizmet satışlarında iade, iptal ve 14 günlük cayma hakkının kullanımına ilişkin kurallar.",
  robots: { index: true, follow: true },
};

const sections: LegalSection[] = [
  {
    id: "01",
    title: "Kapsam",
    content: (
      <p className="text-pro-text-secondary">
        Bu politika, <strong className="text-pro-text">{SELLER.website}</strong>{" "}
        üzerinden satın alınan tüm dijital ürün ve hizmetler (MindTest kredi paketleri
        ve ilerleyen dönemde sunulacak Pro Üyelik aboneliği dahil) için geçerlidir.
        Politika, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli
        Sözleşmeler Yönetmeliği&apos;ne uygun olarak hazırlanmıştır.
      </p>
    ),
  },
  {
    id: "02",
    title: "Cayma Hakkı — 14 Gün",
    content: (
      <div className="space-y-2 text-pro-text-secondary">
        <p>
          ALICI, satın alma tarihinden itibaren{" "}
          <strong className="text-pro-text">14 (on dört) gün</strong> içinde herhangi
          bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma
          hakkına sahiptir.
        </p>
        <p>
          Cayma hakkını kullanmak için bu süre içinde{" "}
          <a href={SELLER_DISPLAY.emailHref} className="text-pro-primary underline">
            {SELLER_DISPLAY.emailDisplay}
          </a>{" "}
          adresine yazılı başvuruda bulunmanız yeterlidir. Başvurunuzda aşağıdaki
          bilgilerin yer alması önerilir:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Ad, soyad ve hesap e-posta adresi</li>
          <li>Sipariş numarası veya satın alma tarihi</li>
          <li>İade edilmesini istediğiniz paket ve tutar</li>
          <li>Banka hesabı (gerekli görülürse)</li>
        </ul>
      </div>
    ),
  },
  {
    id: "03",
    title: "Cayma Hakkının Kullanılamayacağı Haller",
    content: (
      <div className="space-y-2 text-pro-text-secondary">
        <p>
          Mesafeli Sözleşmeler Yönetmeliği&apos;nin{" "}
          <strong className="text-pro-text">15. maddesi</strong> uyarınca aşağıdaki
          durumlarda cayma hakkı kullanılamaz:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Elektronik ortamda anında ifa edilen hizmetler veya tüketiciye anında
            teslim edilen gayri maddi mallara ilişkin sözleşmeler (Madde 15/1-ğ).
          </li>
          <li>
            Cayma hakkı süresi sona ermeden önce, tüketicinin onayı ile ifasına
            başlanan hizmetlere ilişkin sözleşmeler (Madde 15/1-h).
          </li>
        </ul>
        <p>
          Bu çerçevede:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong className="text-pro-text">Kullanılmış (tüketilmiş) krediler</strong>{" "}
            için cayma hakkı kullanılamaz; yalnızca kullanılmamış krediler için iade
            talep edilebilir.
          </li>
          <li>
            Pro Üyelik aboneliğinde, cayma hakkı süresi içinde üyelik kapsamındaki
            ücretli bir hizmet (analiz, rapor vb.) kullanılmışsa, kullanılmış
            hizmet bedeli iade tutarından düşülür.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "04",
    title: "İade Tutarı ve Hesaplama",
    content: (
      <div className="space-y-2 text-pro-text-secondary">
        <p>
          İade tutarı aşağıdaki kurala göre hesaplanır:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong className="text-pro-text">Kredi paketi hiç kullanılmadıysa:</strong>{" "}
            ödenen tutarın tamamı iade edilir.
          </li>
          <li>
            <strong className="text-pro-text">Bir kısmı kullanıldıysa:</strong> yalnızca
            kullanılmamış kredilere karşılık gelen tutar iade edilir. Kullanılmamış
            kredi için birim fiyat, satın alınan paketteki orijinal birim fiyattır
            (ör. 15 kredilik pakette kredi başı 27,99 TL).
          </li>
          <li>
            <strong className="text-pro-text">Promosyon/hediye krediler:</strong> iade
            kapsamı dışındadır; herhangi bir ödemeye denk gelmedikleri için para
            iadesine konu edilmez.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "05",
    title: "İade Süresi ve Yöntemi",
    content: (
      <div className="space-y-2 text-pro-text-secondary">
        <p>
          Cayma bildiriminin SATICI&apos;ya ulaşmasından itibaren en geç{" "}
          <strong className="text-pro-text">14 gün içinde</strong> ödeme, ALICI&apos;nın
          ödemeyi yaparken kullandığı yönteme aynı tutarda iade edilir:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong className="text-pro-text">Kredi kartı / banka kartı:</strong>{" "}
            ilgili karta iade yapılır. Kartınıza yansıması bankanızın politikasına
            bağlı olarak 2–10 iş günü sürebilir.
          </li>
          <li>
            <strong className="text-pro-text">Havale / EFT:</strong> bildirdiğiniz
            banka hesabına iade yapılır.
          </li>
        </ul>
        <p>
          İade sonrası, satın alınan paketteki kullanılmamış krediler ALICI&apos;nın
          hesabından otomatik olarak silinir.
        </p>
      </div>
    ),
  },
  {
    id: "06",
    title: "Hatalı veya Eksik Teslim",
    content: (
      <p className="text-pro-text-secondary">
        Ödeme başarıyla tamamlandığı halde hesabınıza krediler tanımlanmadıysa
        veya tanımlanan miktar siparişle uyumsuzsa, satın alma tarihinden itibaren
        7 gün içinde{" "}
        <a href={SELLER_DISPLAY.emailHref} className="text-pro-primary underline">
          {SELLER_DISPLAY.emailDisplay}
        </a>{" "}
        adresine bildiriniz. SATICI, teknik nedeni tespit edip eksik kredileri en
        geç 2 iş günü içinde tamamlar. Çözülemeyen durumlarda ödenen bedel iade
        edilir.
      </p>
    ),
  },
  {
    id: "07",
    title: "Hesap Kapatma ve Kullanılmamış Kredi",
    content: (
      <p className="text-pro-text-secondary">
        ALICI, hesabını kalıcı olarak kapattığında hesabında bulunan kullanılmamış
        kredilerin iadesini 14 günlük cayma süresi içinde talep edebilir. 14 günlük
        süre geçtikten sonra kapatma işleminde kullanılmamış krediler iade edilmez
        ve hesap silimiyle birlikte düşer.
      </p>
    ),
  },
  {
    id: "08",
    title: "Sipariş İptali",
    content: (
      <p className="text-pro-text-secondary">
        Ödeme tamamlanmadan önce sipariş adımından çıkılması halinde herhangi bir
        tahsilat yapılmaz ve ayrıca bir iptal işlemine gerek kalmaz. Ödeme
        tamamlandıktan sonra iptal talebiniz, yukarıdaki cayma hakkı prosedürü
        kapsamında değerlendirilir.
      </p>
    ),
  },
  {
    id: "09",
    title: "İletişim",
    content: (
      <div className="space-y-1 text-pro-text-secondary">
        <p>İade, iptal ve cayma hakkı başvurularınız için:</p>
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
        <p className="text-xs text-pro-text-tertiary pt-2">
          Başvurunuza 3 iş günü içinde yanıt verilir, sonuç en geç 14 gün içinde
          ALICI&apos;ya iletilir.
        </p>
      </div>
    ),
  },
];

export default function IadeIptalPage() {
  return (
    <LegalPageLayout
      icon={RotateCcw}
      title="İade, İptal ve Cayma Hakkı"
      subtitle="6502 sayılı Kanun kapsamında"
      intro={
        <p>
          OrbiraMind olarak iade ve cayma hakkınızı korumaya önem veriyoruz. Bu sayfa,
          dijital kredi paketleri ve ileride sunulacak abonelik hizmetlerinde
          cayma, iptal ve iade süreçlerinin nasıl işleyeceğini tüm ayrıntılarıyla
          açıklar. Ödeme öncesi bu metni okumanızı öneririz.
        </p>
      }
      sections={sections}
      footerNote={
        <p className="text-sm text-pro-text-secondary">
          Bu politika{" "}
          <a href="/mesafeli-satis-sozlesmesi" className="text-pro-primary underline">
            Mesafeli Satış Sözleşmesi
          </a>{" "}
          ile birlikte geçerlidir.
        </p>
      }
    />
  );
}
