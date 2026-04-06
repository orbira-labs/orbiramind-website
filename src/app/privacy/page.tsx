import type { Metadata } from "next";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Gizlilik Politikası & KVKK Aydınlatma Metni",
};

const sections = [
  {
    id: "01",
    title: "Veri Sorumlusu",
    content: (
      <p>
        Bu platform, <strong>Orbira Labs</strong> tarafından işletilmektedir.{" "}
        <strong>OrbiraMind</strong>, psikologlar, koçlar ve danışmanlar için
        tasarlanmış bir danışan yönetim ve analiz platformudur. Kişisel
        verilerinizin işlenmesinden sorumlu veri sorumlusu Orbira Labs olup
        iletişim adresi{" "}
        <a
          href="mailto:info@orbiralabs.com"
          className="text-pro-primary underline"
        >
          info@orbiralabs.com
        </a>
        &apos;dur.
      </p>
    ),
  },
  {
    id: "02",
    title: "Toplanan Veriler",
    content: (
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-pro-text mb-1">
            a) Profesyonel Kullanıcı Verileri
          </h4>
          <ul className="list-disc list-inside space-y-1 text-pro-text-secondary">
            <li>Ad, soyad</li>
            <li>E-posta adresi ve şifre (şifrelenmiş olarak)</li>
            <li>Telefon numarası (opsiyonel)</li>
            <li>İl ve ilçe bilgisi</li>
            <li>Çalışma şekli (bireysel / kurumsal) ve işyeri/klinik adı</li>
            <li>Uzmanlık alanları</li>
            <li>KVKK ve kullanım koşulları onay tarihi</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-pro-text mb-1">
            b) Danışan Verileri (Profesyoneller tarafından girilen)
          </h4>
          <p className="text-pro-text-secondary mb-2">
            Bu platformda profesyonel kullanıcılar, kendi danışanlarına ait
            aşağıdaki verileri sisteme girebilmektedir. Bu verilerin işlenmesi
            için profesyonel kullanıcı, danışanlarından gerekli rızayı almakla{" "}
            <strong>yükümlüdür</strong>.
          </p>
          <ul className="list-disc list-inside space-y-1 text-pro-text-secondary">
            <li>Ad, soyad</li>
            <li>E-posta adresi (opsiyonel)</li>
            <li>Telefon numarası (opsiyonel)</li>
            <li>Doğum tarihi (opsiyonel)</li>
            <li>Cinsiyet (opsiyonel)</li>
            <li>Randevu kayıtları ve notlar</li>
            <li>Kişilik analizi test sonuçları</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-pro-text mb-1">
            c) Teknik ve Kullanım Verileri
          </h4>
          <ul className="list-disc list-inside space-y-1 text-pro-text-secondary">
            <li>IP adresi ve yaklaşık konum</li>
            <li>Tarayıcı türü ve cihaz bilgisi</li>
            <li>Oturum ve kimlik doğrulama tokenları (Supabase)</li>
            <li>Hata kayıtları</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "03",
    title: "Verilerin İşlenme Amaçları",
    content: (
      <ul className="list-disc list-inside space-y-1.5 text-pro-text-secondary">
        <li>Hesap oluşturma, doğrulama ve yönetimi</li>
        <li>Platform hizmetlerinin sunulması ve sürdürülmesi</li>
        <li>Danışan yönetimi, randevu ve analiz özelliklerinin çalıştırılması</li>
        <li>Kişilik analizi test akışlarının oluşturulması ve sonuçlandırılması</li>
        <li>Platform güvenliğinin sağlanması ve kötüye kullanımın önlenmesi</li>
        <li>Yasal yükümlülüklerin yerine getirilmesi</li>
        <li>Kullanıcı destek taleplerinin yanıtlanması</li>
        <li>Platform performansının iyileştirilmesi</li>
      </ul>
    ),
  },
  {
    id: "04",
    title: "Hukuki Dayanak (KVKK md. 5)",
    content: (
      <ul className="list-disc list-inside space-y-1.5 text-pro-text-secondary">
        <li>
          <strong className="text-pro-text">Açık Rıza:</strong> Kayıt ve
          onboarding sırasında alınan onaylar
        </li>
        <li>
          <strong className="text-pro-text">Sözleşmenin İfası:</strong> Platform
          hizmetlerinin sunulabilmesi için zorunlu veriler
        </li>
        <li>
          <strong className="text-pro-text">Yasal Yükümlülük:</strong> Kanunların
          öngördüğü durumlarda veri saklama
        </li>
        <li>
          <strong className="text-pro-text">Meşru Menfaat:</strong> Güvenlik ve
          dolandırıcılık önleme amaçlı teknik veriler
        </li>
      </ul>
    ),
  },
  {
    id: "05",
    title: "Danışan Verilerinde Sorumluluk",
    content: (
      <div className="space-y-3 text-pro-text-secondary">
        <p>
          OrbiraMind, profesyonel kullanıcıların kendi danışanlarına ait verileri
          sisteme girebildiği bir platform olarak <strong className="text-pro-text">veri işleyen</strong>{" "}
          konumundadır. Danışan verilerinin KVKK kapsamında işlenmesi için gerekli
          aydınlatma ve rızanın alınması, <strong className="text-pro-text">profesyonel kullanıcının sorumluluğundadır</strong>.
        </p>
        <p>
          Platformu kullanan her profesyonel, danışanlarına şunları bildirmekle
          yükümlüdür:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Hangi kişisel verilerin bu platform üzerinden işlendiği
          </li>
          <li>
            Bu işlemenin amacı ve hukuki dayanağı
          </li>
          <li>Verilerin Orbira Labs altyapısında saklandığı</li>
          <li>Danışanın sahip olduğu KVKK hakları</li>
        </ul>
      </div>
    ),
  },
  {
    id: "06",
    title: "Yapay Zeka ve Analiz Motorları",
    content: (
      <div className="space-y-3 text-pro-text-secondary">
        <p>
          OrbiraMind, kişilik analizi için <strong className="text-pro-text">HAE (Human Analysis Engine)</strong> ve{" "}
          <strong className="text-pro-text">AQE (Adaptive Question Engine)</strong> adlı Orbira Labs
          proprietary hybrid motorlarını kullanmaktadır.
        </p>
        <ul className="list-disc list-inside space-y-1.5">
          <li>
            <strong className="text-pro-text">Algoritmik Katman:</strong> Test
            cevapları kural tabanlı sistemlerle işlenir; veriler üçüncü taraf AI
            servislerine gönderilmez.
          </li>
          <li>
            <strong className="text-pro-text">AI Katmanı:</strong> İsteğe bağlı
            gelişmiş analiz özelliklerinde yalnızca açık rıza alındıktan sonra
            ve minimum veriyle çalışır.
          </li>
          <li>
            Motor çıktıları <strong className="text-pro-text">bilgilendirme amaçlıdır</strong>;
            klinik tanı veya profesyonel tıbbi görüş yerine geçmez.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "07",
    title: "Verilerin Paylaşılması",
    content: (
      <div className="space-y-2 text-pro-text-secondary">
        <p>
          Kişisel verileriniz yalnızca aşağıdaki taraflarla ve gerekli ölçüde
          paylaşılır:
        </p>
        <ul className="list-disc list-inside space-y-1.5">
          <li>
            <strong className="text-pro-text">Supabase:</strong> Veritabanı ve
            kimlik doğrulama altyapısı (Türkiye veya AB bölgesinde)
          </li>
          <li>
            <strong className="text-pro-text">Vercel:</strong> Platform barındırma
            ve dağıtım hizmetleri
          </li>
          <li>
            <strong className="text-pro-text">Yasal Merciler:</strong> Hukuken
            yetkili kamu kurumları ve mahkemeler
          </li>
        </ul>
        <p className="font-medium text-pro-text mt-3">
          Orbira Labs, kişisel verilerinizi asla satmaz ve pazarlama amacıyla
          üçüncü taraflarla paylaşmaz.
        </p>
      </div>
    ),
  },
  {
    id: "08",
    title: "Çerezler",
    content: (
      <p className="text-pro-text-secondary">
        OrbiraMind yalnızca oturum yönetimi için zorunlu kimlik doğrulama
        çerezleri (Supabase session token) kullanmaktadır. Analitik, reklam
        veya takip amaçlı üçüncü taraf çerez kullanılmamaktadır. Bu çerezler
        platformun çalışması için zorunludur ve tarayıcı ayarlarından
        yönetilebilir; ancak çerezlerin devre dışı bırakılması oturum
        işlevlerini etkileyebilir.
      </p>
    ),
  },
  {
    id: "09",
    title: "Veri Saklama Süresi",
    content: (
      <ul className="list-disc list-inside space-y-1.5 text-pro-text-secondary">
        <li>Hesap verileri: Hesap aktif olduğu sürece ve silme talebinden sonra 30 gün</li>
        <li>Danışan kayıtları: Profesyonel hesabıyla birlikte veya silme talebinde</li>
        <li>İşlem kayıtları: Yasal yükümlülükler gereği 10 yıla kadar</li>
        <li>Oturum tokenları: Oturum sonunda otomatik silinir</li>
        <li>Log kayıtları: Güvenlik amaçlı 1–2 yıl</li>
      </ul>
    ),
  },
  {
    id: "10",
    title: "Kullanıcı Hakları (KVKK md. 11)",
    content: (
      <div className="space-y-2">
        <p className="text-pro-text-secondary">
          6698 sayılı KVKK kapsamında aşağıdaki haklara sahipsiniz:
        </p>
        <ul className="list-disc list-inside space-y-1.5 text-pro-text-secondary">
          <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
          <li>İşlenen verilere ilişkin bilgi talep etme</li>
          <li>Yanlış veya eksik verilerin düzeltilmesini isteme</li>
          <li>Belirli şartlarda verilerin silinmesini talep etme</li>
          <li>İşlemeye itiraz etme</li>
          <li>Açık rızaya dayalı işlemlerde rızanızı geri çekme</li>
          <li>Kişisel Verileri Koruma Kurulu&apos;na şikayette bulunma</li>
        </ul>
        <p className="text-pro-text-secondary mt-2">
          Bu haklarınızı kullanmak için{" "}
          <a
            href="mailto:info@orbiralabs.com"
            className="text-pro-primary underline"
          >
            info@orbiralabs.com
          </a>{" "}
          adresine başvurabilirsiniz. Talebiniz 30 gün içinde yanıtlanacaktır.
        </p>
      </div>
    ),
  },
  {
    id: "11",
    title: "Veri Güvenliği",
    content: (
      <ul className="list-disc list-inside space-y-1.5 text-pro-text-secondary">
        <li>Veri aktarımında TLS/SSL şifreleme</li>
        <li>Şifrelerin hash&apos;lenerek saklanması (Supabase Auth)</li>
        <li>Rol tabanlı erişim kontrolü (her profesyonel yalnızca kendi verilerine erişir)</li>
        <li>Düzenli güvenlik denetimleri</li>
        <li>Veri ihlali durumunda 72 saat içinde KVKK kuruluna bildirim</li>
      </ul>
    ),
  },
  {
    id: "12",
    title: "Çocukların Gizliliği",
    content: (
      <p className="text-pro-text-secondary">
        OrbiraMind doğrudan 18 yaş altı bireylere yönelik değildir. Platformu
        kullanan profesyoneller, reşit olmayan bireylerle çalışırken kendi
        mesleki etik kurallarına ve ilgili yasal gerekliliklere uymakla
        yükümlüdür.
      </p>
    ),
  },
  {
    id: "13",
    title: "Politika Güncellemeleri",
    content: (
      <p className="text-pro-text-secondary">
        Bu politika zaman zaman güncellenebilir. Önemli değişiklikler e-posta
        veya platform bildirimi ile duyurulacaktır. Güncel metin bu sayfada
        yayımlandığı anda yürürlüğe girer.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Back */}
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1.5 text-sm text-pro-text-secondary hover:text-pro-text transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Geri dön
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-pro-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-pro-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-pro-text">
                Gizlilik Politikası
              </h1>
              <p className="text-sm text-pro-text-tertiary">
                KVKK Aydınlatma Metni · Son güncelleme: Nisan 2026
              </p>
            </div>
          </div>
          <p className="text-[15px] text-pro-text-secondary leading-relaxed">
            <strong className="text-pro-text">OrbiraMind</strong> olarak
            gizliliğinize ve veri güvenliğine büyük önem veriyoruz. Bu belge,
            6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında
            hazırlanmış aydınlatma metnidir. Platformu kullanarak bu politikayı
            okuduğunuzu ve kabul ettiğinizi beyan etmiş olursunuz.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-pro-surface border border-pro-border rounded-2xl p-6"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-xs font-mono text-pro-text-tertiary bg-pro-surface-alt px-2 py-0.5 rounded-md border border-pro-border shrink-0 mt-0.5">
                  {section.id}
                </span>
                <h2 className="text-base font-semibold text-pro-text">
                  {section.title}
                </h2>
              </div>
              <div className="text-[14px] leading-relaxed pl-9">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 pt-8 border-t border-pro-border text-center space-y-2">
          <p className="text-sm text-pro-text-secondary">
            Sorularınız için:{" "}
            <a
              href="mailto:info@orbiralabs.com"
              className="text-pro-primary underline"
            >
              info@orbiralabs.com
            </a>
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-pro-text-tertiary">
            <Link href="/terms" className="hover:text-pro-text transition-colors">
              Kullanım Koşulları
            </Link>
            <span>·</span>
            <Link href="/auth/login" className="hover:text-pro-text transition-colors">
              OrbiraMind&apos;a Giriş Yap
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
