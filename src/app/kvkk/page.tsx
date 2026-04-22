import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { LegalPageLayout, type LegalSection } from "@/components/legal/LegalPageLayout";
import { SELLER, SELLER_DISPLAY } from "@/lib/legal";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description:
    "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında OrbiraMind veri sorumlusu aydınlatma metni.",
  robots: { index: true, follow: true },
};

const sections: LegalSection[] = [
  {
    id: "01",
    title: "Veri Sorumlusu",
    content: (
      <div className="space-y-2 text-pro-text-secondary">
        <p>
          6698 sayılı Kişisel Verilerin Korunması Kanunu (&ldquo;KVKK&rdquo;) uyarınca,
          OrbiraMind platformu aracılığıyla işlenen kişisel veriler bakımından{" "}
          <strong className="text-pro-text">veri sorumlusu</strong>, platformu
          işleten <strong className="text-pro-text">{SELLER.legalName}</strong>{" "}
          (bireysel satıcı) olup iletişim bilgileri aşağıdadır:
        </p>
        <ul className="space-y-0.5">
          <li><strong className="text-pro-text">Adres:</strong> {SELLER_DISPLAY.addressSingle}</li>
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
        </ul>
      </div>
    ),
  },
  {
    id: "02",
    title: "İşlenen Kişisel Veri Kategorileri",
    content: (
      <div className="space-y-3 text-pro-text-secondary">
        <div>
          <h4 className="font-semibold text-pro-text mb-1">a) Kimlik ve İletişim</h4>
          <p>Ad, soyad, e-posta, telefon (opsiyonel), il/ilçe.</p>
        </div>
        <div>
          <h4 className="font-semibold text-pro-text mb-1">b) Müşteri İşlem</h4>
          <p>
            Sipariş geçmişi, satın alınan kredi paketleri, ödeme tarih/tutarı,
            fatura/dekont bilgileri.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-pro-text mb-1">c) İşlem Güvenliği</h4>
          <p>IP adresi, log kayıtları, oturum tokenları, tarayıcı/cihaz bilgisi.</p>
        </div>
        <div>
          <h4 className="font-semibold text-pro-text mb-1">
            d) Mesleki Deneyim (Profesyonel Kullanıcılar)
          </h4>
          <p>Uzmanlık alanı, çalışma şekli, klinik/işyeri adı.</p>
        </div>
        <div>
          <h4 className="font-semibold text-pro-text mb-1">
            e) Danışan Verileri (Profesyonel tarafından girilen)
          </h4>
          <p>
            Ad, soyad, e-posta, telefon, doğum tarihi, cinsiyet, randevu
            kayıtları, notlar, kişilik analizi sonuçları. Bu verilere ilişkin{" "}
            <strong className="text-pro-text">aydınlatma ve rıza alma yükümlülüğü</strong>{" "}
            doğrudan profesyonel kullanıcıya aittir.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-pro-text mb-1">
            f) Ödeme Verisi
          </h4>
          <p>
            Kart numarası, CVV gibi hassas ödeme verileri{" "}
            <strong className="text-pro-text">veri sorumlusu tarafından görülmez ve saklanmaz</strong>;
            doğrudan BDDK lisanslı ödeme altyapısı sağlayıcısı (iyzico / Shopier)
            tarafından PCI-DSS standartlarında işlenir.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "03",
    title: "Kişisel Verilerin İşlenme Amaçları",
    content: (
      <ul className="list-disc list-inside space-y-1.5 text-pro-text-secondary">
        <li>Hesap oluşturma, kimlik doğrulama ve hesap yönetimi</li>
        <li>Platform hizmetlerinin sunulması, sürdürülmesi ve iyileştirilmesi</li>
        <li>Kredi paketi satışı, siparişlerin takibi ve teslim edilmesi</li>
        <li>Ödeme işlemlerinin yürütülmesi ve doğrulanması</li>
        <li>Müşteri destek taleplerinin karşılanması</li>
        <li>Yasal yükümlülüklerin (vergi, saklama, bildirim) yerine getirilmesi</li>
        <li>Platform güvenliğinin sağlanması ve kötüye kullanımın engellenmesi</li>
        <li>Uyuşmazlık çözümü ve hukuki süreçlerin takibi</li>
      </ul>
    ),
  },
  {
    id: "04",
    title: "İşlemenin Hukuki Sebepleri (KVKK m. 5)",
    content: (
      <ul className="list-disc list-inside space-y-1.5 text-pro-text-secondary">
        <li>
          <strong className="text-pro-text">Sözleşmenin kurulması veya ifası:</strong>{" "}
          kayıt, satın alma ve hizmet sunumu için zorunlu veriler.
        </li>
        <li>
          <strong className="text-pro-text">Yasal yükümlülük:</strong> vergi, log ve
          işlem kayıtlarına ilişkin saklama yükümlülükleri.
        </li>
        <li>
          <strong className="text-pro-text">Meşru menfaat:</strong> güvenlik, dolandırıcılık
          önleme ve platform iyileştirmesi amaçlı teknik veriler.
        </li>
        <li>
          <strong className="text-pro-text">Açık rıza:</strong> pazarlama iletişimi ve
          isteğe bağlı ileri analiz (AI) özellikleri gibi zorunlu olmayan işlemeler.
        </li>
      </ul>
    ),
  },
  {
    id: "05",
    title: "Kişisel Verilerin Aktarılması",
    content: (
      <div className="space-y-2 text-pro-text-secondary">
        <p>
          Kişisel verileriniz, işlenme amaçlarıyla sınırlı olmak üzere ve gerekli
          güvenlik önlemleri alınarak aşağıdaki taraflarla paylaşılabilir:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong className="text-pro-text">Altyapı sağlayıcıları (yurt içi / yurt dışı):</strong>{" "}
            Supabase (veritabanı ve kimlik doğrulama), Vercel (barındırma).
          </li>
          <li>
            <strong className="text-pro-text">Ödeme altyapısı sağlayıcıları:</strong> iyzico,
            Shopier veya eşdeğeri BDDK lisanslı kuruluşlar.
          </li>
          <li>
            <strong className="text-pro-text">Yetkili kamu kurum ve kuruluşları:</strong>{" "}
            hukuki yükümlülüklerin yerine getirilmesi amacıyla, yalnızca talep edilen
            kapsamda.
          </li>
          <li>
            <strong className="text-pro-text">Hukuki danışman ve muhasebe hizmet sağlayıcıları:</strong>{" "}
            yasal süreçlerin yürütülmesi amacıyla.
          </li>
        </ul>
        <p className="font-medium text-pro-text">
          Kişisel verileriniz pazarlama amacıyla üçüncü taraflara satılmaz ve
          aktarılmaz.
        </p>
      </div>
    ),
  },
  {
    id: "06",
    title: "Yurt Dışına Aktarım",
    content: (
      <p className="text-pro-text-secondary">
        Supabase ve Vercel altyapılarının bulut bölgeleri gereği kişisel veriler,
        AB ülkelerinde yer alan sunuculara aktarılabilir. Bu aktarımlar KVKK m. 9
        kapsamında uygun güvenlik önlemleri ve gerekli olduğu durumda açık rıza
        esasına dayanarak gerçekleştirilir.
      </p>
    ),
  },
  {
    id: "07",
    title: "Saklama Süreleri",
    content: (
      <ul className="list-disc list-inside space-y-1.5 text-pro-text-secondary">
        <li>
          <strong className="text-pro-text">Hesap verileri:</strong> hesap aktif olduğu
          sürece; silme talebinden sonra en fazla 30 gün içinde silinir.
        </li>
        <li>
          <strong className="text-pro-text">Satın alma ve ödeme kayıtları:</strong>{" "}
          vergi mevzuatı gereği 10 yıl.
        </li>
        <li>
          <strong className="text-pro-text">Log kayıtları:</strong> güvenlik amacıyla
          1–2 yıl.
        </li>
        <li>
          <strong className="text-pro-text">Oturum tokenları:</strong> oturum
          sonlandığında otomatik olarak silinir.
        </li>
      </ul>
    ),
  },
  {
    id: "08",
    title: "Veri Güvenliği Önlemleri",
    content: (
      <ul className="list-disc list-inside space-y-1.5 text-pro-text-secondary">
        <li>TLS/SSL ile uçtan uca şifreli veri iletimi</li>
        <li>Şifrelerin tek yönlü hash&apos;lenerek saklanması</li>
        <li>Row Level Security ile rol tabanlı erişim kontrolü</li>
        <li>Ödeme verilerinin PCI-DSS altyapı sağlayıcısına yönlendirilmesi</li>
        <li>Düzenli erişim denetimleri ve güvenlik güncellemeleri</li>
        <li>Veri ihlali durumunda 72 saat içinde Kurul&apos;a bildirim</li>
      </ul>
    ),
  },
  {
    id: "09",
    title: "İlgili Kişi Hakları (KVKK m. 11)",
    content: (
      <div className="space-y-2 text-pro-text-secondary">
        <p>KVKK uyarınca her ilgili kişi aşağıdaki haklara sahiptir:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Kişisel verilerinin işlenip işlenmediğini öğrenme</li>
          <li>İşlenmişse buna ilişkin bilgi talep etme</li>
          <li>İşleme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
          <li>Yurt içinde / yurt dışında aktarıldığı üçüncü kişileri bilme</li>
          <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
          <li>Kanunda öngörülen şartlar çerçevesinde silinmesini / yok edilmesini isteme</li>
          <li>Otomatik sistemlerle aleyhine bir sonuç doğmuşsa itiraz etme</li>
          <li>Hukuka aykırı işleme sebebiyle zarara uğramışsa tazminat talep etme</li>
        </ul>
      </div>
    ),
  },
  {
    id: "10",
    title: "Haklarınızı Nasıl Kullanabilirsiniz?",
    content: (
      <div className="space-y-2 text-pro-text-secondary">
        <p>KVKK m. 11 kapsamındaki başvurularınızı:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong className="text-pro-text">E-posta ile:</strong>{" "}
            <a href={SELLER_DISPLAY.emailHref} className="text-pro-primary underline">
              {SELLER_DISPLAY.emailDisplay}
            </a>
          </li>
          <li>
            <strong className="text-pro-text">Posta ile:</strong> {SELLER_DISPLAY.addressSingle}
          </li>
        </ul>
        <p>
          adresi üzerinden yapabilirsiniz. Başvuruda; ad-soyad, T.C. kimlik
          numarası, iletişim bilgisi ve talep konusunun açıkça yer alması
          gerekmektedir. Başvurunuz, Veri Sorumlusuna Başvuru Usul ve Esasları
          Hakkında Tebliğ uyarınca en geç <strong className="text-pro-text">30 gün</strong>{" "}
          içinde sonuçlandırılır.
        </p>
        <p>
          Başvurunuzun reddedilmesi veya verilen cevabı yetersiz bulmanız halinde,
          cevabı öğrendiğiniz tarihten itibaren 30 gün ve her halde başvuru
          tarihinden itibaren 60 gün içinde{" "}
          <strong className="text-pro-text">Kişisel Verileri Koruma Kurulu</strong>
          &apos;na şikâyette bulunma hakkınız bulunmaktadır.
        </p>
      </div>
    ),
  },
  {
    id: "11",
    title: "Güncellemeler",
    content: (
      <p className="text-pro-text-secondary">
        Bu aydınlatma metni mevzuatın ve platformun gelişimine bağlı olarak
        güncellenebilir. Önemli değişiklikler platform içi bildirim veya e-posta
        ile duyurulur; güncel metin bu sayfada yayımlandığı anda yürürlüğe girer.
      </p>
    ),
  },
];

export default function KvkkPage() {
  return (
    <LegalPageLayout
      icon={ShieldCheck}
      title="KVKK Aydınlatma Metni"
      subtitle="6698 sayılı Kanun kapsamında"
      intro={
        <p>
          OrbiraMind olarak kişisel verilerinizin korunmasına büyük önem veriyoruz.
          Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında{" "}
          <strong className="text-pro-text">veri sorumlusu</strong> sıfatıyla sizi
          işlenen verileriniz, amaçları, hukuki sebepleri ve haklarınız konusunda
          bilgilendirmek amacıyla hazırlanmıştır.
        </p>
      }
      sections={sections}
    />
  );
}
