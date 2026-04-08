import Link from "next/link";
import { Brain, Users, BarChart3, Shield, Zap, CheckCircle, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/80 backdrop-blur-xl border-b border-pro-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#5B7B6A] to-[#4A6A59] flex items-center justify-center">
              <span className="text-white text-lg font-bold">O</span>
            </div>
            <span className="text-lg font-semibold text-pro-text">OrbiraMind</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm text-pro-text-secondary hover:text-pro-text transition-colors"
            >
              Giriş Yap
            </Link>
            <Link
              href="/auth/register"
              className="text-sm px-4 py-2 bg-pro-primary text-white rounded-lg hover:bg-pro-primary/90 transition-colors"
            >
              Ücretsiz Dene
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-pro-primary/10 rounded-full text-sm text-pro-primary mb-6">
            <Brain className="h-4 w-4" />
            <span>Psikologlar için tasarlandı</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-pro-text leading-tight mb-6">
            Danışanlarınızı{" "}
            <span className="text-pro-primary">Daha İyi Anlayın</span>
          </h1>
          <p className="text-lg sm:text-xl text-pro-text-secondary max-w-2xl mx-auto mb-10">
            Kişilik analizi, danışan yönetimi ve randevu takibi için tek platform. 
            HAE ve AQE motorlarıyla bilimsel, güvenilir sonuçlar.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-pro-primary text-white rounded-xl font-medium hover:bg-pro-primary/90 transition-colors"
            >
              Ücretsiz Başla
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/auth/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-pro-surface border border-pro-border text-pro-text rounded-xl font-medium hover:bg-pro-surface-alt transition-colors"
            >
              Giriş Yap
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 bg-pro-surface/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-pro-text mb-4">
              Neden OrbiraMind?
            </h2>
            <p className="text-lg text-pro-text-secondary">
              Profesyoneller için tasarlanmış güçlü özellikler
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: "Kişilik Analizi",
                description: "HAE ve AQE motorları ile bilimsel temelli, derinlemesine kişilik analizleri oluşturun."
              },
              {
                icon: Users,
                title: "Danışan Yönetimi",
                description: "Tüm danışanlarınızı tek platformda yönetin, notlar alın, ilerlemeyi takip edin."
              },
              {
                icon: BarChart3,
                title: "Detaylı Raporlar",
                description: "Görsel raporlar ve analizlerle danışanlarınızın profilini daha iyi anlayın."
              },
              {
                icon: Zap,
                title: "Hızlı Test Akışı",
                description: "Danışanlara link gönderin, test sonuçları otomatik olarak sisteme aktarılsın."
              },
              {
                icon: Shield,
                title: "KVKK Uyumlu",
                description: "Verileriniz Türkiye'de, güvenli altyapıda. KVKK ve GDPR uyumlu işleme."
              },
              {
                icon: CheckCircle,
                title: "Kolay Kullanım",
                description: "Dakikalar içinde öğrenin, hemen kullanmaya başlayın. Teknik bilgi gerektirmez."
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 bg-pro-surface border border-pro-border rounded-2xl hover:border-pro-primary/30 transition-colors"
              >
                <div className="h-12 w-12 rounded-xl bg-pro-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-pro-primary" />
                </div>
                <h3 className="text-lg font-semibold text-pro-text mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-pro-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who is it for */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-pro-text mb-4">
            Kimler İçin?
          </h2>
          <p className="text-lg text-pro-text-secondary mb-12">
            OrbiraMind, danışanlarıyla çalışan tüm profesyoneller için
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { title: "Psikologlar", desc: "Klinik ve danışmanlık psikologları" },
              { title: "Yaşam Koçları", desc: "ICF sertifikalı koçlar" },
              { title: "Terapistler", desc: "Aile ve çift terapistleri" },
            ].map((item, i) => (
              <div key={i} className="p-6 bg-pro-surface border border-pro-border rounded-2xl">
                <h3 className="text-lg font-semibold text-pro-text mb-1">{item.title}</h3>
                <p className="text-sm text-pro-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-pro-primary/10 to-pro-primary/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-pro-text mb-4">
            Hemen Başlayın
          </h2>
          <p className="text-lg text-pro-text-secondary mb-8">
            Ücretsiz hesap oluşturun, platformu keşfedin.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-pro-primary text-white rounded-xl font-medium hover:bg-pro-primary/90 transition-colors"
          >
            Ücretsiz Hesap Oluştur
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 border-t border-pro-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#5B7B6A] to-[#4A6A59] flex items-center justify-center">
                <span className="text-white text-sm font-bold">O</span>
              </div>
              <span className="text-sm text-pro-text-secondary">
                OrbiraMind · Orbira Labs
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-pro-text-secondary">
              <Link href="/privacy" className="hover:text-pro-text transition-colors">
                Gizlilik Politikası
              </Link>
              <Link href="/terms" className="hover:text-pro-text transition-colors">
                Kullanım Koşulları
              </Link>
              <a href="mailto:info@orbiralabs.com" className="hover:text-pro-text transition-colors">
                İletişim
              </a>
            </div>
          </div>
          <p className="text-center text-xs text-pro-text-tertiary mt-8">
            © 2026 Orbira Labs. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  );
}
