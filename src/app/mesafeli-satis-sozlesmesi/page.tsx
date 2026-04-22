import type { Metadata } from "next";
import { ScrollText } from "lucide-react";
import { LegalPageLayout, type LegalSection } from "@/components/legal/LegalPageLayout";
import { SELLER, SELLER_DISPLAY, CREDIT_PACKAGES, formatTRY } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi",
  description:
    "OrbiraMind kredi paketi ve dijital hizmet satışlarına ilişkin 6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamında hazırlanmış mesafeli satış sözleşmesi.",
  robots: { index: true, follow: true },
};

const sections: LegalSection[] = [
  {
    id: "01",
    title: "Taraflar",
    content: (
      <div className="space-y-4 text-pro-text-secondary">
        <div>
          <h4 className="font-semibold text-pro-text mb-1">SATICI</h4>
          <ul className="space-y-0.5">
            <li><strong className="text-pro-text">Ad / Unvan:</strong> {SELLER.legalName}</li>
            <li><strong className="text-pro-text">Statü:</strong> Gerçek kişi (bireysel satıcı)</li>
            <li><strong className="text-pro-text">Adres:</strong> {SELLER_DISPLAY.addressSingle}</li>
            <li>
              <strong className="text-pro-text">Telefon:</strong>{" "}
              <a href={SELLER_DISPLAY.phoneHref} className="text-pro-primary underline">
                {SELLER_DISPLAY.phoneDisplay}
              </a>
            </li>
            <li>
              <strong className="text-pro-text">E-posta:</strong>{" "}
              <a href={SELLER_DISPLAY.emailHref} className="text-pro-primary underline">
                {SELLER_DISPLAY.emailDisplay}
              </a>
            </li>
            <li><strong className="text-pro-text">Web:</strong> {SELLER.website}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-pro-text mb-1">ALICI</h4>
          <p>
            Satıcı tarafından işletilen {SELLER.website} adresindeki platform üzerinden
            hesap oluşturup kredi paketi veya dijital hizmet satın alan gerçek veya
            tüzel kişi (bundan sonra &ldquo;ALICI&rdquo; olarak anılacaktır). Alıcının
            kayıt sırasında beyan ettiği ad, e-posta, adres ve iletişim bilgileri bu
            sözleşmenin ayrılmaz parçasıdır.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "02",
    title: "Sözleşmenin Konusu",
    content: (
      <div className="space-y-2 text-pro-text-secondary">
        <p>
          İşbu sözleşme, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli
          Sözleşmeler Yönetmeliği hükümleri uyarınca, ALICI&apos;nın{" "}
          <strong className="text-pro-text">{SELLER.website}</strong> alan adlı web
          sitesinden elektronik ortamda sipariş verdiği dijital ürün ve hizmetlerin
          satışı ile teslimine ilişkin tarafların hak ve yükümlülüklerini düzenler.
        </p>
        <p>
          Satışa konu ürün ve hizmetler; OrbiraMind platformu üzerinden sunulan{" "}
          <strong className="text-pro-text">MindTest kredi paketleri</strong> ile bu
          kredilerin kullanımı sonucu oluşturulan kişilik analizi test akışları ve
          bağlı dijital hizmetleri kapsar.
        </p>
      </div>
    ),
  },
  {
    id: "03",
    title: "Sözleşmeye Konu Ürün / Hizmet Bilgileri",
    content: (
      <div className="space-y-3 text-pro-text-secondary">
        <p>
          Platform üzerinden satışa sunulan dijital kredi paketlerinin türü, miktarı,
          fiyatı ve diğer özellikleri aşağıdaki gibidir. Fiyatlar Türk Lirası (TL)
          cinsinden olup {SELLER.vatStatus}
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-pro-border rounded-lg overflow-hidden">
            <thead className="bg-pro-surface-alt">
              <tr>
                <th className="text-left px-3 py-2 font-semibold text-pro-text">Paket</th>
                <th className="text-left px-3 py-2 font-semibold text-pro-text">Kredi</th>
                <th className="text-left px-3 py-2 font-semibold text-pro-text">Birim Fiyat</th>
                <th className="text-left px-3 py-2 font-semibold text-pro-text">Toplam</th>
              </tr>
            </thead>
            <tbody>
              {CREDIT_PACKAGES.map((pkg) => (
                <tr key={pkg.id} className="border-t border-pro-border">
                  <td className="px-3 py-2">{pkg.name}</td>
                  <td className="px-3 py-2">{pkg.credits} kredi</td>
                  <td className="px-3 py-2">{formatTRY(pkg.pricePerCredit)}</td>
                  <td className="px-3 py-2 font-semibold text-pro-text">{formatTRY(pkg.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-pro-text-tertiary">
          Satın alma sayfasında (checkout) görüntülenen anlık fiyat, sipariş özeti
          ve ödeme tutarı bu sözleşmenin bir parçası sayılır ve işbu listenin
          yerine geçer.
        </p>
      </div>
    ),
  },
  {
    id: "04",
    title: "Genel Hükümler",
    content: (
      <ul className="list-disc list-inside space-y-1.5 text-pro-text-secondary">
        <li>
          ALICI, {SELLER.website} adresinde sözleşme konusu ürünün temel nitelikleri,
          satış fiyatı ve ödeme şekline ilişkin ön bilgileri okuyup bilgi sahibi
          olduğunu ve elektronik ortamda gerekli teyidi verdiğini beyan eder.
        </li>
        <li>
          ALICI&apos;nın ön bilgilendirmeyi elektronik ortamda teyit etmesi, mesafeli
          satış sözleşmesinin kurulmasından evvel, SATICI tarafından ALICI&apos;ya
          verilmesi gereken adres, siparişi verilen ürünlere ait temel özellikler,
          ürünün vergiler dahil fiyatı, ödeme bilgilerinin de doğru ve eksiksiz
          olarak edinildiğini kabul eder.
        </li>
        <li>
          Sözleşme konusu ürün; sipariş onayı ve başarılı ödeme tamamlandıktan
          sonra ALICI&apos;nın platform hesabına anında elektronik olarak
          tanımlanır. (Detaylar için bkz.{" "}
          <a href="/teslimat" className="text-pro-primary underline">Teslimat Koşulları</a>)
        </li>
        <li>
          SATICI, sipariş konusu ürün veya hizmetin yerine getirilmesinin imkânsızlaşması
          halinde sözleşme konusu yükümlülüklerini yerine getiremeyeceğini, sözleşmeden
          doğan ifa yükümlülüğünün süresi dolmadan tüketiciye bildirir ve 14 gün
          içinde toplam bedeli ALICI&apos;ya iade eder.
        </li>
        <li>
          ALICI, sözleşmenin kurulması sırasında beyan ettiği bilgilerin doğruluğundan
          sorumludur. Yanlış beyan nedeniyle oluşacak her türlü zarar ALICI&apos;ya
          aittir.
        </li>
      </ul>
    ),
  },
  {
    id: "05",
    title: "Ödeme Şekli ve Planı",
    content: (
      <div className="space-y-2 text-pro-text-secondary">
        <p>
          Ödemeler, SATICI&apos;nın anlaşmalı olduğu ödeme altyapısı sağlayıcıları
          (örneğin iyzico, Shopier veya benzeri BDDK lisanslı kuruluşlar) üzerinden
          kredi kartı, banka kartı veya havale/EFT ile peşin olarak tahsil edilir.
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Tüm ödemeler Türk Lirası cinsindendir.</li>
          <li>
            Ödeme bilgileri (kart numarası, CVV vb.) hiçbir şekilde SATICI tarafından
            saklanmaz; doğrudan ödeme altyapısı sağlayıcısına iletilir ve PCI-DSS
            standartlarında işlenir.
          </li>
          <li>
            Ödemenin bankaca onaylanmaması veya daha sonra iptal edilmesi halinde
            SATICI sözleşmeyi ifa yükümlülüğünden kurtulur.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "06",
    title: "Teslim Yeri, Şekli ve Süresi",
    content: (
      <div className="space-y-2 text-pro-text-secondary">
        <p>
          Sözleşme konusu ürün dijital içerik / dijital hizmet niteliğinde olup
          fiziksel teslim gerektirmez. Teslim, ödeme başarıyla tamamlandıktan sonra
          satın alınan kredilerin ALICI&apos;nın platform hesabına otomatik olarak
          tanımlanması suretiyle elektronik ortamda gerçekleşir.
        </p>
        <p>
          Teslim süresi en geç <strong className="text-pro-text">24 saat</strong>{" "}
          olup uygulamada ödemenin onaylanmasının ardından birkaç saniye ile birkaç
          dakika içinde tamamlanır. Gecikme yaşanması durumunda ALICI{" "}
          <a href={SELLER_DISPLAY.emailHref} className="text-pro-primary underline">
            {SELLER_DISPLAY.emailDisplay}
          </a>{" "}
          adresinden SATICI ile iletişime geçebilir.
        </p>
      </div>
    ),
  },
  {
    id: "07",
    title: "Cayma Hakkı ve İstisnası",
    content: (
      <div className="space-y-3 text-pro-text-secondary">
        <p>
          ALICI, mesafeli sözleşmelerde 14 (on dört) gün içinde herhangi bir
          gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma
          hakkına sahiptir. Cayma hakkı süresi, hizmet ifasına ilişkin sözleşmelerde
          sözleşmenin kurulduğu gün başlar.
        </p>
        <p>
          Ancak{" "}
          <strong className="text-pro-text">
            Mesafeli Sözleşmeler Yönetmeliği&apos;nin 15. maddesi
          </strong>{" "}
          uyarınca aşağıdaki durumlarda cayma hakkı kullanılamaz:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong className="text-pro-text">Elektronik ortamda anında ifa edilen</strong>{" "}
            hizmetler ve <strong className="text-pro-text">tüketiciye anında teslim edilen
            gayri maddi (dijital) mallara</strong> ilişkin sözleşmeler (Madde 15/1-ğ).
          </li>
          <li>
            Cayma hakkı süresi sona ermeden önce, ALICI&apos;nın onayı ile ifasına
            başlanan hizmetlere ilişkin sözleşmeler (Madde 15/1-h).
          </li>
        </ul>
        <p>
          MindTest kredileri satın alındığı anda ALICI&apos;nın hesabına tanımlandığı
          ve ALICI tarafından istenildiği anda kullanılabildiği için{" "}
          <strong className="text-pro-text">
            kullanılmış (tüketilmiş) krediler için cayma hakkı bulunmamaktadır
          </strong>
          .
        </p>
        <p>
          <strong className="text-pro-text">Kullanılmamış krediler</strong> için ise
          ALICI, satın alma tarihinden itibaren 14 gün içinde {SELLER_DISPLAY.emailDisplay}{" "}
          adresine yazılı başvuru yaparak cayma hakkını kullanabilir. Bu durumda
          kullanılmamış kredilere denk düşen bedel, 14 gün içinde ödemenin yapıldığı
          yönteme aynı tutarda iade edilir. Ayrıntılı prosedür için{" "}
          <a href="/iade-iptal" className="text-pro-primary underline">
            İade ve İptal Politikası
          </a>
          &apos;na bakınız.
        </p>
      </div>
    ),
  },
  {
    id: "08",
    title: "Temerrüt Hali",
    content: (
      <p className="text-pro-text-secondary">
        ALICI, kredi kartı ile yapmış olduğu işlemlerinde temerrüde düşmesi halinde
        kart sahibi bankanın kendisi ile yapmış olduğu kredi kartı sözleşmesi
        çerçevesinde faiz ödeyecek ve bankaya karşı sorumlu olacaktır. Bu durumda
        ilgili banka hukuki yollara başvurabilir; doğacak masrafları ve vekalet
        ücretini ALICI&apos;dan talep edebilir.
      </p>
    ),
  },
  {
    id: "09",
    title: "Yetkili Mahkeme ve Şikayet Yolları",
    content: (
      <div className="space-y-2 text-pro-text-secondary">
        <p>
          İşbu sözleşmeden doğan uyuşmazlıklarda, Ticaret Bakanlığı&apos;nca yasa
          gereği her yıl ilan edilen değere kadar Tüketici Hakem Heyetleri,
          belirtilen değerin üzerindeki uyuşmazlıklarda ise Tüketici Mahkemeleri
          yetkilidir.
        </p>
        <p>
          ALICI, şikayet ve itirazlarını ikametgâhının bulunduğu yerdeki veya
          tüketici işleminin yapıldığı yerdeki Tüketici Hakem Heyeti ya da Tüketici
          Mahkemesi&apos;ne yapabilir.
        </p>
      </div>
    ),
  },
  {
    id: "10",
    title: "Yürürlük",
    content: (
      <p className="text-pro-text-secondary">
        ALICI, sitede yer alan ön bilgilendirme formunu ve işbu sözleşmeyi
        elektronik ortamda teyit etmekle, mesafeli sözleşmelerin akdinden önce
        SATICI tarafından ALICI&apos;ya verilmesi gereken bilgileri doğru ve
        eksiksiz olarak edindiğini, bu sözleşmenin bütün maddelerini okuyup kabul
        ettiğini ve elektronik ortamda gerekli teyidi verdiğini beyan ve taahhüt
        eder. Sözleşme, ALICI&apos;nın siparişi tamamlaması anında kurulmuş olur
        ve aynı anda yürürlüğe girer.
      </p>
    ),
  },
];

export default function MesafeliSatisPage() {
  return (
    <LegalPageLayout
      icon={ScrollText}
      title="Mesafeli Satış Sözleşmesi"
      subtitle="6502 sayılı Kanun kapsamında"
      intro={
        <p>
          Bu sözleşme, <strong className="text-pro-text">{SELLER.website}</strong>{" "}
          üzerinden satışa sunulan dijital kredi paketleri ve hizmetlerin alım-satımına
          ilişkin tarafların hak ve yükümlülüklerini düzenler. Platformdan herhangi
          bir ödeme yapmadan önce bu metni dikkatle okumanız önemlidir.
        </p>
      }
      sections={sections}
      footerNote={
        <p className="text-sm text-pro-text-secondary">
          Sözleşme veya siparişlerinize ilişkin sorular için:{" "}
          <a href={SELLER_DISPLAY.emailHref} className="text-pro-primary underline">
            {SELLER_DISPLAY.emailDisplay}
          </a>
        </p>
      }
    />
  );
}
