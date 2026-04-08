import Link from "next/link";
import { 
  Brain, 
  Users, 
  BarChart3, 
  Shield, 
  Sparkles, 
  Heart,
  ArrowRight,
  Leaf,
  Star,
  CheckCircle2,
  Play,
  Quote
} from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Navbar */}
      <LandingNavbar />

      {/* Hero */}
      <section className="pt-32 sm:pt-40 pb-20 sm:pb-32 px-6 sm:px-8 lg:px-12 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#5B7B6A]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#E8D5B7]/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#5B7B6A]/5 to-transparent rounded-full" />
        
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full shadow-sm border border-[#eee] mb-8">
              <div className="flex items-center gap-1">
                <Leaf className="h-4 w-4 text-[#5B7B6A]" />
                <Heart className="h-4 w-4 text-[#C4A484]" />
              </div>
              <span className="text-sm text-[#666]">Psikolojik Sağlık & Wellness Profesyonelleri İçin</span>
            </div>
            
            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold text-[#1a1a1a] leading-[1.1] tracking-tight mb-8">
              Danışanlarınızın
              <br />
              <span className="bg-gradient-to-r from-[#5B7B6A] via-[#6B8B7A] to-[#5B7B6A] bg-clip-text text-transparent">
                İç Dünyasını Anlayın
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-[#666] max-w-2xl mx-auto mb-12 leading-relaxed font-light">
              Bilimsel kişilik analizi, bütünsel danışan yönetimi ve içgörü raporları 
              — <span className="text-[#5B7B6A] font-medium">hepsi tek platformda.</span>
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                href="/auth/register"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#1a1a1a] text-white rounded-full font-medium hover:bg-[#333] transition-all shadow-xl shadow-black/20"
              >
                <span>14 Gün Ücretsiz Dene</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#demo"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#1a1a1a] rounded-full font-medium border border-[#e5e5e5] hover:border-[#ccc] hover:shadow-lg transition-all"
              >
                <Play className="h-5 w-5 text-[#5B7B6A]" />
                <span>Demo İzle</span>
              </Link>
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-[#999]">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>KVKK Uyumlu</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>256-bit SSL</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>500+ Profesyonel</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos/Social Proof */}
      <section className="py-12 px-6 sm:px-8 border-y border-[#eee] bg-white/50">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-sm text-[#999] mb-8">Türkiye'nin önde gelen profesyonelleri tarafından tercih ediliyor</p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-50">
            <span className="text-xl font-semibold text-[#666]">TPD</span>
            <span className="text-xl font-semibold text-[#666]">ICF Türkiye</span>
            <span className="text-xl font-semibold text-[#666]">PERYÖN</span>
            <span className="text-xl font-semibold text-[#666]">TKD</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 sm:py-32 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 bg-[#5B7B6A]/10 rounded-full text-sm text-[#5B7B6A] font-medium mb-6">
              Platform Özellikleri
            </span>
            <h2 className="text-4xl sm:text-5xl font-semibold text-[#1a1a1a] mb-6 tracking-tight">
              Pratiğinizi Dönüştürün
            </h2>
            <p className="text-xl text-[#666] max-w-2xl mx-auto">
              Danışan ilişkilerinizi güçlendiren, içgörü odaklı araçlar
            </p>
          </div>
          
          {/* Main Feature */}
          <div className="mb-16 p-8 sm:p-12 bg-gradient-to-br from-[#5B7B6A] to-[#3D5A4C] rounded-[32px] text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm mb-6">
                  <Sparkles className="h-4 w-4" />
                  <span>Yapay Zeka Destekli</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-semibold mb-6 leading-tight">
                  HAE & AQE Analiz Motorları
                </h3>
                <p className="text-lg text-white/80 mb-8 leading-relaxed">
                  Orbira Labs'ın özel geliştirdiği <strong>Human Analysis Engine</strong> ve <strong>Adaptive Question Engine</strong> ile 
                  danışanlarınızın kişilik profilini, duygusal haritasını ve davranış kalıplarını keşfedin.
                </p>
                <ul className="space-y-3">
                  {["Bilimsel temelli 16 kişilik tipi analizi", "Duygusal zeka ve stres tepki haritası", "Kişiye özel soru adaptasyonu"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-white/80 shrink-0" />
                      <span className="text-white/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="aspect-square bg-white/10 rounded-3xl backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <Brain className="h-32 w-32 text-white/30" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: "Danışan Portföyü",
                description: "Tüm danışanlarınızı organize edin. Profiller, geçmiş, notlar ve ilerleme — tek ekranda.",
                color: "from-[#E8D5B7] to-[#D4C4A8]"
              },
              {
                icon: BarChart3,
                title: "İçgörü Raporları",
                description: "Görsel ve anlaşılır raporlarla danışanlarınızın profilini paylaşın ve seansları zenginleştirin.",
                color: "from-[#C9E4DE] to-[#B5D6CE]"
              },
              {
                icon: Heart,
                title: "Wellness Takibi",
                description: "Danışanlarınızın iyilik halini izleyin. Mood tracking, ilerleme grafikleri ve hatırlatıcılar.",
                color: "from-[#F5E6E0] to-[#E8D5CF]"
              },
              {
                icon: Shield,
                title: "Gizlilik & Güvenlik",
                description: "KVKK ve GDPR uyumlu. Verileriniz Türkiye'de, şifreli ve güvende. Rol tabanlı erişim kontrolü.",
                color: "from-[#E0E7EE] to-[#D0D7DE]"
              },
              {
                icon: Sparkles,
                title: "Akıllı Öneriler",
                description: "Analiz sonuçlarına göre seans stratejileri ve okuma önerileri. Yapay zeka destekli içgörüler.",
                color: "from-[#F0E6F5] to-[#E0D6E5]"
              },
              {
                icon: Leaf,
                title: "Minimal & Huzurlu",
                description: "Dikkat dağıtmayan, sakin tasarım. Siz ve danışanlarınız için huzurlu bir deneyim.",
                color: "from-[#E6F0E8] to-[#D6E0D8]"
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-8 bg-white rounded-3xl border border-[#eee] hover:border-[#ddd] hover:shadow-xl hover:shadow-black/5 transition-all duration-300"
              >
                <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-7 w-7 text-[#1a1a1a]/70" />
                </div>
                <h3 className="text-xl font-semibold text-[#1a1a1a] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#666] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Who */}
      <section id="for-who" className="py-24 sm:py-32 px-6 sm:px-8 lg:px-12 bg-[#F5F5F3]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 bg-[#C4A484]/20 rounded-full text-sm text-[#8B6914] font-medium mb-6">
              Kimler İçin
            </span>
            <h2 className="text-4xl sm:text-5xl font-semibold text-[#1a1a1a] mb-6 tracking-tight">
              Sizin İçin Tasarlandı
            </h2>
            <p className="text-xl text-[#666] max-w-2xl mx-auto">
              İnsan psikolojisi ve wellness alanında çalışan tüm profesyoneller için
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                title: "Psikologlar", 
                desc: "Klinik & Danışmanlık",
                icon: "🧠",
                items: ["Kişilik değerlendirmesi", "Terapi planlama", "İlerleme takibi"]
              },
              { 
                title: "Yaşam Koçları", 
                desc: "ICF & Bireysel",
                icon: "🌱",
                items: ["Hedef belirleme", "Davranış analizi", "Koçluk seansları"]
              },
              { 
                title: "Terapistler", 
                desc: "Aile & Çift",
                icon: "💚",
                items: ["İlişki dinamikleri", "Uyum analizi", "Ortak seanslar"]
              },
              { 
                title: "Wellness Uzmanları", 
                desc: "Bütünsel Sağlık",
                icon: "✨",
                items: ["Stres yönetimi", "Mindfulness", "İyilik hali"]
              },
            ].map((item, i) => (
              <div 
                key={i} 
                className="p-8 bg-white rounded-3xl border border-[#eee] hover:shadow-xl hover:shadow-black/5 transition-all"
              >
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h3 className="text-xl font-semibold text-[#1a1a1a] mb-1">{item.title}</h3>
                <p className="text-sm text-[#5B7B6A] font-medium mb-4">{item.desc}</p>
                <ul className="space-y-2">
                  {item.items.map((li, j) => (
                    <li key={j} className="text-sm text-[#666] flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#5B7B6A]" />
                      {li}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 sm:py-32 px-6 sm:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 bg-[#5B7B6A]/10 rounded-full text-sm text-[#5B7B6A] font-medium mb-6">
              Kullanıcı Yorumları
            </span>
            <h2 className="text-4xl sm:text-5xl font-semibold text-[#1a1a1a] mb-6 tracking-tight">
              Profesyoneller Ne Diyor?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                quote: "HAE motoru danışanlarımı anlama şeklimi tamamen değiştirdi. Seanslar çok daha derinlikli ve verimli geçiyor.",
                author: "Dr. Elif Yıldız",
                title: "Klinik Psikolog, İstanbul",
                rating: 5
              },
              {
                quote: "Koçluk seanslarımda artık somut verilerle çalışabiliyorum. Danışanlarım da görsel raporları çok seviyor.",
                author: "Mehmet Karaca",
                title: "ICF Sertifikalı Yaşam Koçu",
                rating: 5
              },
              {
                quote: "Minimal tasarımı ve kullanım kolaylığı harika. Teknolojiyle aram iyi değil ama OrbiraMind'ı hemen öğrendim.",
                author: "Zeynep Aksoy",
                title: "Aile Terapisti, Ankara",
                rating: 5
              },
            ].map((item, i) => (
              <div 
                key={i} 
                className="p-8 bg-white rounded-3xl border border-[#eee] hover:shadow-xl hover:shadow-black/5 transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(item.rating)].map((_, j) => (
                    <Star key={j} className="h-5 w-5 fill-[#C4A484] text-[#C4A484]" />
                  ))}
                </div>
                <Quote className="h-8 w-8 text-[#eee] mb-4" />
                <p className="text-[#666] leading-relaxed mb-6">
                  "{item.quote}"
                </p>
                <div>
                  <p className="font-semibold text-[#1a1a1a]">{item.author}</p>
                  <p className="text-sm text-[#999]">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 sm:py-32 px-6 sm:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-12 sm:p-16 bg-[#1a1a1a] rounded-[40px] text-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#5B7B6A]/20 to-transparent" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#5B7B6A]/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#C4A484]/20 rounded-full blur-3xl" />
            
            <div className="relative">
              <h2 className="text-4xl sm:text-5xl font-semibold text-white mb-6 tracking-tight">
                Pratiğinizi Yükseltin
              </h2>
              <p className="text-xl text-white/70 mb-10 max-w-xl mx-auto">
                14 gün ücretsiz deneyin. Kredi kartı gerekmez. 
                İstediğiniz zaman iptal edin.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/auth/register"
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#1a1a1a] rounded-full font-medium hover:bg-[#f5f5f5] transition-all"
                >
                  <span>Ücretsiz Hesap Oluştur</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/auth/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-white/80 hover:text-white rounded-full font-medium transition-all"
                >
                  Zaten hesabım var
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 sm:px-8 lg:px-12 border-t border-[#eee]">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#5B7B6A] to-[#3D5A4C] flex items-center justify-center">
                  <span className="text-white text-xl font-semibold">O</span>
                </div>
                <div>
                  <span className="text-lg font-semibold text-[#1a1a1a]">OrbiraMind</span>
                </div>
              </div>
              <p className="text-sm text-[#666] leading-relaxed">
                Psikolojik sağlık ve wellness profesyonelleri için tasarlanmış premium danışan yönetim platformu.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[#1a1a1a] mb-4">Platform</h4>
              <ul className="space-y-3 text-sm text-[#666]">
                <li><a href="#features" className="hover:text-[#1a1a1a] transition-colors">Özellikler</a></li>
                <li><a href="#for-who" className="hover:text-[#1a1a1a] transition-colors">Kimler İçin</a></li>
                <li><Link href="/auth/register" className="hover:text-[#1a1a1a] transition-colors">Ücretsiz Dene</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#1a1a1a] mb-4">Yasal</h4>
              <ul className="space-y-3 text-sm text-[#666]">
                <li><Link href="/privacy" className="hover:text-[#1a1a1a] transition-colors">Gizlilik Politikası</Link></li>
                <li><Link href="/terms" className="hover:text-[#1a1a1a] transition-colors">Kullanım Koşulları</Link></li>
                <li><a href="#" className="hover:text-[#1a1a1a] transition-colors">KVKK Aydınlatma</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#1a1a1a] mb-4">İletişim</h4>
              <ul className="space-y-3 text-sm text-[#666]">
                <li><a href="mailto:info@orbiralabs.com" className="hover:text-[#1a1a1a] transition-colors">info@orbiralabs.com</a></li>
                <li><a href="mailto:destek@orbiramind.com" className="hover:text-[#1a1a1a] transition-colors">destek@orbiramind.com</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-[#eee] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#999]">
              © 2026 Orbira Labs. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center gap-2 text-sm text-[#999]">
              <span>Powered by</span>
              <span className="font-semibold text-[#666]">Orbira Labs</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
