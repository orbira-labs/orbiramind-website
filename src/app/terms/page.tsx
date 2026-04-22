import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";
import { SELLER, SELLER_DISPLAY, LEGAL_LAST_UPDATED } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Kullanım Koşulları",
  description:
    "OrbiraMind platformunun kullanımına ilişkin şartlar, kullanıcı yükümlülükleri ve hizmet koşulları.",
};

const sections = [
  {
    id: "01",
    title: "Taraflar ve Kapsam",
    content: (
      <p className="text-pro-text-secondary">
        Bu Kullanım Koşulları, <strong className="text-pro-text">{SELLER.legalName}</strong>{" "}
        (bireysel satıcı) tarafından işletilen{" "}
        <strong className="text-pro-text">OrbiraMind</strong> platformunun kullanımına
        ilişkin şartları düzenler. Platformu kullanarak bu koşulları okuduğunuzu,
        anladığınızı ve kabul ettiğinizi beyan etmiş olursunuz. Koşulları kabul
        etmiyorsanız platformu kullanmamanız gerekmektedir.
      </p>
    ),
  },
  {
    id: "02",
    title: "Hizmet Kapsamı",
    content: (
      <div className="space-y-2 text-pro-text-secondary">
        <p>OrbiraMind; psikologlar, koçlar ve danışmanlar için aşağıdaki hizmetleri sunar:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Danışan kaydı ve profil yönetimi</li>
          <li>Randevu planlama ve takibi</li>
          <li>Kişilik analizi test akışları oluşturma ve gönderme</li>
          <li>HAE ve AQE hybrid motorları ile analiz raporları</li>
          <li>Danışan ilerleme ve oturum notları</li>
        </ul>
        <p>
          İşletici, hizmet kapsamını önceden bildirim yaparak değiştirme
          hakkını saklı tutar.
        </p>
      </div>
    ),
  },
  {
    id: "03",
    title: "Kullanıcı Yükümlülükleri",
    content: (
      <ul className="list-disc list-inside space-y-1.5 text-pro-text-secondary">
        <li>Platformu yalnızca mesleki ve hukuka uygun amaçlarla kullanmak</li>
        <li>
          Sisteme girilen danışan verilerinin işlenmesi için ilgili kişilerden
          KVKK kapsamında gerekli rızayı almak
        </li>
        <li>
          Hesap bilgilerini doğru ve güncel tutmak; şifreyi üçüncü kişilerle
          paylaşmamak
        </li>
        <li>Platform güvenliğini tehlikeye atacak girişimlerde bulunmamak</li>
        <li>
          Analiz sonuçlarını yalnızca bilgilendirme amaçlı kullanmak; klinik
          tanı yerine geçtiği izlenimi vermemek
        </li>
        <li>
          İlgili meslek etik kurallarına (TKD, BİP, ICF vb.) uymak
        </li>
      </ul>
    ),
  },
  {
    id: "04",
    title: "Danışan Verilerinde Sorumluluk",
    content: (
      <div className="space-y-2 text-pro-text-secondary">
        <p>
          Platformu kullanan profesyonel, sisteme girdiği danışan verilerinin
          hukuka uygunluğundan ve KVKK kapsamındaki aydınlatma/rıza
          yükümlülüklerinden <strong className="text-pro-text">münhasıran sorumludur</strong>.
        </p>
        <p>
          OrbiraMind bu verilerde <strong className="text-pro-text">veri işleyen</strong>{" "}
          konumundadır ve verileri yalnızca hizmet sunumu amacıyla işler.
          Danışan verilerinin herhangi bir üçüncü tarafla paylaşılması,
          satılması veya pazarlama amacıyla kullanılması kesinlikle yasaktır.
        </p>
      </div>
    ),
  },
  {
    id: "05",
    title: "Hesap Güvenliği",
    content: (
      <p className="text-pro-text-secondary">
        Hesabınız ve hesabınız üzerinden gerçekleştirilen tüm işlemlerden
        yalnızca siz sorumlusunuz. Yetkisiz erişim veya güvenlik ihlali
        şüpheniz durumunda derhal{" "}
        <a href={SELLER_DISPLAY.emailHref} className="text-pro-primary underline">
          {SELLER_DISPLAY.emailDisplay}
        </a>{" "}
        adresine bildirmeniz gerekmektedir. İşletici, yetkisiz erişimden
        kaynaklanan zararlardan sorumlu tutulamaz.
      </p>
    ),
  },
  {
    id: "06",
    title: "Yaş Sınırı",
    content: (
      <p className="text-pro-text-secondary">
        OrbiraMind yalnızca <strong className="text-pro-text">18 yaşını doldurmuş</strong>{" "}
        mesleki kullanıcılara yönelik bir platformdur. Platformu kullanarak bu
        yaş şartını karşıladığınızı beyan etmiş olursunuz.
      </p>
    ),
  },
  {
    id: "07",
    title: "Fikri Mülkiyet",
    content: (
      <div className="space-y-2 text-pro-text-secondary">
        <p>
          Platform; arayüz tasarımı, kaynak kodu, algoritmalar, motor
          mimarileri (HAE, AQE), analiz şablonları ve tüm içerikler dahil
          olmak üzere işleticinin münhasır fikri mülkiyetindedir.
        </p>
        <p>
          Kullanıcıya yalnızca kişisel mesleki kullanım amacıyla sınırlı,
          devredilemez ve geri alınabilir bir kullanım hakkı verilir. Platformun
          herhangi bir bölümünün kopyalanması, tersine mühendislik ile analiz
          edilmesi veya ticari amaçla dağıtılması yasaktır.
        </p>
      </div>
    ),
  },
  {
    id: "08",
    title: "Analiz Sonuçlarının Niteliği",
    content: (
      <div className="space-y-2 text-pro-text-secondary">
        <p>
          OrbiraMind tarafından üretilen tüm kişilik analizi sonuçları ve
          raporlar <strong className="text-pro-text">yalnızca bilgilendirme ve yönlendirme amaçlıdır</strong>.
          Bu çıktılar:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Klinik tanı veya psikiyatrik değerlendirme yerine geçmez</li>
          <li>Tıbbi, hukuki veya finansal tavsiye niteliği taşımaz</li>
          <li>Bir hastanın teşhisi için tek başına kullanılamaz</li>
        </ul>
        <p>
          Profesyonel kullanıcılar bu sonuçları kendi mesleki değerlendirmeleri
          ile birlikte değerlendirmekle yükümlüdür.
        </p>
      </div>
    ),
  },
  {
    id: "09",
    title: "Yasaklı Kullanımlar",
    content: (
      <ul className="list-disc list-inside space-y-1.5 text-pro-text-secondary">
        <li>Hizmetin yasadışı veya zararlı amaçlarla kullanımı</li>
        <li>Başkalarının verilerine veya hesaplarına yetkisiz erişim girişimi</li>
        <li>Bot, otomasyon veya scraping araçlarıyla sistem yüklenmesi</li>
        <li>Güvenlik açıklarının istismarı (SQL injection, XSS vb.)</li>
        <li>Platform içeriklerinin izinsiz kopyalanması veya dağıtılması</li>
        <li>Yanıltıcı veya sahte danışan profilleri oluşturulması</li>
        <li>Analiz sonuçlarının manipüle edilerek sunulması</li>
      </ul>
    ),
  },
  {
    id: "10",
    title: "Ücretli Hizmetler",
    content: (
      <div className="space-y-2 text-pro-text-secondary">
        <p>
          Platformun bazı özellikleri kredi veya abonelik sistemiyle sunulabilir.
          Ücretlendirme koşulları ilgili ekranlarda ayrıca belirtilir. İşletici,
          fiyatlandırmayı önceden bildirerek değiştirme hakkını saklı tutar;
          aktif abonelikler dönem sonuna kadar mevcut koşullardan devam eder.
        </p>
        <p>
          Satın alma işlemlerine ilişkin taraf hak ve yükümlülükleri{" "}
          <Link href="/mesafeli-satis-sozlesmesi" className="text-pro-primary underline">
            Mesafeli Satış Sözleşmesi
          </Link>
          , iade ve cayma hakkı kuralları ise{" "}
          <Link href="/iade-iptal" className="text-pro-primary underline">
            İade, İptal ve Cayma Hakkı
          </Link>
          {" "}sayfasında düzenlenir.
        </p>
      </div>
    ),
  },
  {
    id: "11",
    title: "Hesap Sonlandırma",
    content: (
      <p className="text-pro-text-secondary">
        Bu koşulların ihlali, şüpheli aktivite veya yasal zorunluluklar
        halinde işletici, hesabınızı önceden bildirim yapmaksızın askıya
        alabilir veya sonlandırabilir. Hesap silme talebinde danışan verileri
        dahil tüm veriler KVKK kapsamında belirlenen süreler içinde imha
        edilir.
      </p>
    ),
  },
  {
    id: "12",
    title: "Sorumluluğun Sınırlandırılması",
    content: (
      <p className="text-pro-text-secondary">
        Platform &quot;olduğu gibi&quot; sunulur. İşletici; kesintisiz hizmet,
        hatasız çalışma veya analiz sonuçlarının belirli bir amaca
        uygunluğuna dair garanti vermez. Yürürlükteki hukukun izin verdiği
        azami ölçüde, dolaylı veya arızi zararlardan sorumlu tutulamaz.
      </p>
    ),
  },
  {
    id: "13",
    title: "Gizlilik",
    content: (
      <p className="text-pro-text-secondary">
        Kişisel verilerin işlenmesine ilişkin detaylar{" "}
        <Link href="/privacy" className="text-pro-primary underline">
          Gizlilik Politikası
        </Link>{" "}
        içinde açıklanır. Bu belge, Gizlilik Politikası ile birlikte
        okunmalı ve her ikisi birlikte değerlendirilmelidir.
      </p>
    ),
  },
  {
    id: "14",
    title: "Uygulanacak Hukuk",
    content: (
      <p className="text-pro-text-secondary">
        Bu koşullar <strong className="text-pro-text">Türkiye Cumhuriyeti hukuku</strong>{" "}
        kapsamında yorumlanır. Bu koşullardan doğan uyuşmazlıklarda{" "}
        <strong className="text-pro-text">Muğla Mahkemeleri ve İcra Daireleri</strong>{" "}
        yetkilidir. 6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamındaki
        tüketici uyuşmazlıklarında, Ticaret Bakanlığı&apos;nca ilan edilen parasal
        sınıra göre Tüketici Hakem Heyetleri veya Tüketici Mahkemeleri yetkilidir.
        AB vatandaşları için GDPR hükümleri uygulanabildiği ölçüde saklıdır.
      </p>
    ),
  },
  {
    id: "15",
    title: "Değişiklikler",
    content: (
      <p className="text-pro-text-secondary">
        Bu koşullar zaman zaman güncellenebilir. Önemli değişiklikler e-posta
        veya platform bildirimi ile duyurulacaktır. Değişikliklerden sonra
        platformu kullanmaya devam etmeniz güncel koşulları kabul ettiğiniz
        anlamına gelir.
      </p>
    ),
  },
  {
    id: "16",
    title: "İletişim",
    content: (
      <div className="space-y-1 text-pro-text-secondary">
        <p>Kullanım koşullarına ilişkin soru ve talepleriniz için:</p>
        <ul className="space-y-0.5">
          <li>
            <strong className="text-pro-text">İşletici:</strong> {SELLER.legalName}
          </li>
          <li>
            <strong className="text-pro-text">Adres:</strong> {SELLER_DISPLAY.addressSingle}
          </li>
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
        </ul>
      </div>
    ),
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-pro-text-secondary hover:text-pro-text transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Ana sayfa
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-pro-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-pro-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-pro-text">
                Kullanım Koşulları
              </h1>
              <p className="text-sm text-pro-text-tertiary">
                Son güncelleme: {LEGAL_LAST_UPDATED}
              </p>
            </div>
          </div>
          <p className="text-[15px] text-pro-text-secondary leading-relaxed">
            Bu Kullanım Koşulları, <strong className="text-pro-text">OrbiraMind</strong>{" "}
            platformunu kullanan profesyonellerin hak ve yükümlülüklerini
            düzenler. Platformu kullanarak bu koşulları kabul etmiş
            sayılırsınız.
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
        <div className="mt-10 pt-8 border-t border-pro-border text-center space-y-3">
          <p className="text-sm text-pro-text-secondary">
            Sorularınız için:{" "}
            <a
              href={SELLER_DISPLAY.emailHref}
              className="text-pro-primary underline"
            >
              {SELLER_DISPLAY.emailDisplay}
            </a>
          </p>
          <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-2 text-xs text-pro-text-tertiary">
            <Link href="/privacy" className="hover:text-pro-text transition-colors">
              Gizlilik
            </Link>
            <span>·</span>
            <Link href="/kvkk" className="hover:text-pro-text transition-colors">
              KVKK
            </Link>
            <span>·</span>
            <Link href="/mesafeli-satis-sozlesmesi" className="hover:text-pro-text transition-colors">
              Mesafeli Satış
            </Link>
            <span>·</span>
            <Link href="/iade-iptal" className="hover:text-pro-text transition-colors">
              İade ve İptal
            </Link>
            <span>·</span>
            <Link href="/iletisim" className="hover:text-pro-text transition-colors">
              İletişim
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
