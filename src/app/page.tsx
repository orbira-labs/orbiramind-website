import Link from "next/link";
import { 
  Brain, 
  Users, 
  BarChart3, 
  Shield, 
  Sparkles, 
  Heart,
  ArrowRight,
  Zap,
  CheckCircle2,
  TrendingUp,
  Lock,
  Palette
} from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";

const PsychologyIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 4C10.477 4 6 8.477 6 14c0 3.5 1.8 6.5 4.5 8.3V26a2 2 0 002 2h7a2 2 0 002-2v-3.7c2.7-1.8 4.5-4.8 4.5-8.3 0-5.523-4.477-10-10-10z" fill="currentColor" fillOpacity="0.15"/>
    <path d="M16 4C10.477 4 6 8.477 6 14c0 3.5 1.8 6.5 4.5 8.3V26a2 2 0 002 2h7a2 2 0 002-2v-3.7c2.7-1.8 4.5-4.8 4.5-8.3 0-5.523-4.477-10-10-10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 14.5c0-1.5 1-3 2.5-3.5M16 11v3m0 0l-2 2m2-2l2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 28h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const GrowthIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 28V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 16c0-4-2-6-5-8 3 0 5 1 5 4 0-3 2-4 5-4-3 2-5 4-5 8z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 10c0-3-1.5-5-4-6 2.5 0 4 .5 4 3 0-2.5 1.5-3 4-3-2.5 1-4 3-4 6z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="16" cy="28" r="2" fill="currentColor"/>
    <path d="M10 28h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ConnectionIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="12" r="4" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2"/>
    <circle cx="22" cy="12" r="4" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2"/>
    <path d="M16 18c-3 0-6 2-6 5v3h12v-3c0-3-3-5-6-5z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 10v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const WellnessIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="10" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2"/>
    <path d="M16 8v4l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="16" cy="16" r="2" fill="currentColor"/>
    <path d="M8 16h2M22 16h2M16 22v2M16 6v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M11 11l1.5 1.5M19.5 19.5L21 21M11 21l1.5-1.5M19.5 12.5L21 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <LandingNavbar />

      {/* Hero - Compact & Powerful */}
      <section className="pt-28 sm:pt-36 pb-16 sm:pb-24 px-6 sm:px-8 lg:px-12 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-[10%] w-72 h-72 bg-[#5B7B6A]/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-40 right-[15%] w-64 h-64 bg-[#D4856A]/20 rounded-full blur-3xl animate-pulse delay-700" />
          <div className="absolute bottom-20 left-[30%] w-96 h-96 bg-[#E8D5B7]/30 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full shadow-lg shadow-black/5 border border-white mb-8">
              <div className="flex -space-x-1">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#5B7B6A] to-[#3D5A4C] flex items-center justify-center ring-2 ring-white">
                  <Brain className="h-3 w-3 text-white" />
                </div>
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#D4856A] to-[#B86B52] flex items-center justify-center ring-2 ring-white">
                  <Heart className="h-3 w-3 text-white" />
                </div>
              </div>
              <span className="text-sm font-medium text-[#1a1a1a]">Yapay Zeka Destekli Kişilik Analizi</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4856A] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4856A]"></span>
              </span>
            </div>
            
            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1a1a1a] leading-[1.05] tracking-tight mb-6">
              Danışanlarınızın
              <br />
              <span className="relative">
                <span className="bg-gradient-to-r from-[#5B7B6A] via-[#4A6A59] to-[#D4856A] bg-clip-text text-transparent">
                  İç Dünyasını
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 10C50 4 100 2 150 6C200 10 250 4 298 8" stroke="#D4856A" strokeWidth="3" strokeLinecap="round" className="animate-draw" />
                </svg>
              </span>
              {" "}Keşfedin
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-[#555] max-w-2xl mx-auto mb-10 leading-relaxed">
              <span className="font-semibold text-[#1a1a1a]">HAE & AQE motorları</span> ile bilimsel kişilik analizi.
              <br className="hidden sm:block" />
              <span className="text-[#D4856A] font-medium">Tek platformda</span> danışan yönetimi ve içgörü raporları.
            </p>
            
            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/auth/register"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#1a1a1a] to-[#333] text-white rounded-full font-semibold hover:shadow-2xl hover:shadow-black/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                <span>Hemen Başla</span>
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-[#D4856A] transition-colors">
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
              <Link
                href="/how-it-works"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#1a1a1a] rounded-full font-semibold border-2 border-[#eee] hover:border-[#5B7B6A] hover:shadow-xl transition-all duration-300"
              >
                <div className="h-8 w-8 rounded-full bg-[#5B7B6A]/10 flex items-center justify-center group-hover:bg-[#5B7B6A] transition-colors">
                  <Brain className="h-4 w-4 text-[#5B7B6A] group-hover:text-white transition-colors" />
                </div>
                <span>Neden HAE & AQE?</span>
              </Link>
            </div>
            
            {/* Trust Row */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#D4856A]/10 rounded-full">
                <Sparkles className="h-4 w-4 text-[#D4856A]" />
                <span className="text-[#D4856A] font-medium">İlk Analiz Hediye!</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-[#5B7B6A]/10 rounded-full">
                <Sparkles className="h-4 w-4 text-[#5B7B6A]" />
                <span className="text-[#5B7B6A] font-medium">En Modern Platform</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props - Visual Grid */}
      <section id="features" className="py-20 sm:py-28 px-6 sm:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#5B7B6A]/10 to-[#D4856A]/10 rounded-full mb-6">
              <Zap className="h-4 w-4 text-[#D4856A]" />
              <span className="text-sm font-semibold text-[#1a1a1a]">Neden OrbiraMind?</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#1a1a1a] tracking-tight">
              Fark yaratan <span className="text-[#D4856A]">üç</span> özellik
            </h2>
          </div>
          
          {/* Bento Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Feature - AI Engine */}
            <div className="lg:col-span-2 group relative p-8 sm:p-10 bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] rounded-[32px] overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#5B7B6A]/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#D4856A]/30 transition-colors duration-700" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4856A]/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative grid sm:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm text-white/90 mb-6">
                    <Brain className="h-4 w-4 text-[#D4856A]" />
                    <span>Orbira Labs Teknolojisi</span>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                    HAE & AQE
                    <br />
                    <span className="text-[#D4856A]">Analiz Motorları</span>
                  </h3>
                  <p className="text-white/70 mb-6 leading-relaxed">
                    Kişilik profili, duygusal harita ve davranış kalıplarını bilimsel yöntemlerle analiz eder.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["16 Kişilik Tipi", "Duygusal Zeka", "Stres Haritası"].map((tag) => (
                      <span key={tag} className="px-3 py-1.5 bg-white/10 rounded-full text-xs text-white/80">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-white/10 to-white/5 rounded-3xl backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:border-[#D4856A]/30 transition-colors">
                    <div className="relative">
                      <Brain className="h-24 w-24 text-white/20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-12 w-12 rounded-full bg-[#D4856A] flex items-center justify-center animate-pulse">
                          <Sparkles className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats Card - Accuracy */}
            <div className="group p-8 bg-gradient-to-br from-[#5B7B6A] to-[#4A6A59] rounded-[32px] text-white relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="relative">
                <TrendingUp className="h-10 w-10 text-white/80 mb-6" />
                <div className="text-5xl font-bold mb-2">%88</div>
                <p className="text-white/80 text-lg mb-4">Doğruluk Oranı</p>
                <p className="text-white/60 text-sm">Bilimsel kişilik analizi ile yüksek tutarlılık</p>
              </div>
            </div>
            
            {/* Feature Cards Row */}
            <div className="group p-8 bg-white rounded-[32px] border-2 border-[#eee] hover:border-[#D4856A]/30 transition-colors">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#D4856A]/20 to-[#D4856A]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-7 w-7 text-[#D4856A]" />
              </div>
              <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">Danışan Portföyü</h3>
              <p className="text-[#666]">Profiller, notlar, seanslar ve ilerleme — hepsi tek ekranda.</p>
            </div>
            
            <div className="group p-8 bg-white rounded-[32px] border-2 border-[#eee] hover:border-[#5B7B6A]/30 transition-colors">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#5B7B6A]/20 to-[#5B7B6A]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-7 w-7 text-[#5B7B6A]" />
              </div>
              <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">İçgörü Raporları</h3>
              <p className="text-[#666]">Görsel ve anlaşılır raporlarla seanslarınızı zenginleştirin.</p>
            </div>
            
            <div className="group p-8 bg-white rounded-[32px] border-2 border-[#eee] hover:border-[#D4856A]/30 transition-colors">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#E8D5B7] to-[#D4C4A8] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Palette className="h-7 w-7 text-[#8B6914]" />
              </div>
              <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">Minimal & Huzurlu</h3>
              <p className="text-[#666]">Dikkat dağıtmayan, profesyoneller için tasarlanmış arayüz.</p>
            </div>
          </div>
        </div>
      </section>

      {/* For Who - Horizontal Scroll Feel */}
      <section id="for-who" className="py-20 sm:py-28 px-6 sm:px-8 lg:px-12 bg-gradient-to-b from-[#F5F5F3] to-[#FAFAF8]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4856A]/10 rounded-full mb-4">
                <Heart className="h-4 w-4 text-[#D4856A]" />
                <span className="text-sm font-semibold text-[#D4856A]">Kimler İçin?</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-[#1a1a1a] tracking-tight">
                Sizin için <span className="text-[#5B7B6A]">tasarlandı</span>
              </h2>
            </div>
            <p className="text-lg text-[#666] max-w-md">
              İnsan psikolojisi ve wellness alanında çalışan tüm profesyoneller için.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Psikologlar */}
            <div className="group p-6 bg-white rounded-3xl border border-[#eee] hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1 transition-all duration-300">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#5B7B6A] to-[#5B7B6A]/30 flex items-center justify-center mb-4">
                <PsychologyIcon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#1a1a1a] mb-1">Psikologlar</h3>
              <p className="text-sm text-[#D4856A] font-medium mb-4">Klinik & Danışmanlık</p>
              <ul className="space-y-2">
                <li className="text-sm text-[#666] flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#5B7B6A]" />
                  Kişilik değerlendirmesi
                </li>
                <li className="text-sm text-[#666] flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#5B7B6A]" />
                  Terapi planlama
                </li>
              </ul>
            </div>
            
            {/* Yaşam Koçları */}
            <div className="group p-6 bg-white rounded-3xl border border-[#eee] hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1 transition-all duration-300">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#D4856A] to-[#D4856A]/30 flex items-center justify-center mb-4">
                <GrowthIcon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#1a1a1a] mb-1">Yaşam Koçları</h3>
              <p className="text-sm text-[#D4856A] font-medium mb-4">ICF & Bireysel</p>
              <ul className="space-y-2">
                <li className="text-sm text-[#666] flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#5B7B6A]" />
                  Hedef belirleme
                </li>
                <li className="text-sm text-[#666] flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#5B7B6A]" />
                  Davranış analizi
                </li>
              </ul>
            </div>
            
            {/* Terapistler */}
            <div className="group p-6 bg-white rounded-3xl border border-[#eee] hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1 transition-all duration-300">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#5B7B6A] to-[#5B7B6A]/30 flex items-center justify-center mb-4">
                <ConnectionIcon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#1a1a1a] mb-1">Terapistler</h3>
              <p className="text-sm text-[#D4856A] font-medium mb-4">Aile & Çift</p>
              <ul className="space-y-2">
                <li className="text-sm text-[#666] flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#5B7B6A]" />
                  İlişki dinamikleri
                </li>
                <li className="text-sm text-[#666] flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#5B7B6A]" />
                  Uyum analizi
                </li>
              </ul>
            </div>
            
            {/* Wellness Uzmanları */}
            <div className="group p-6 bg-white rounded-3xl border border-[#eee] hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1 transition-all duration-300">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#D4856A] to-[#D4856A]/30 flex items-center justify-center mb-4">
                <WellnessIcon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#1a1a1a] mb-1">Wellness Uzmanları</h3>
              <p className="text-sm text-[#D4856A] font-medium mb-4">Bütünsel Sağlık</p>
              <ul className="space-y-2">
                <li className="text-sm text-[#666] flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#5B7B6A]" />
                  Stres yönetimi
                </li>
                <li className="text-sm text-[#666] flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#5B7B6A]" />
                  Mindfulness
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Impactful */}
      <section className="py-20 sm:py-28 px-6 sm:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-12 sm:p-16 bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] rounded-[48px] text-center overflow-hidden">
            {/* Animated Orbs */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-10 left-10 w-32 h-32 bg-[#5B7B6A]/40 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#D4856A]/30 rounded-full blur-3xl animate-pulse delay-500" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#D4856A]/10 rounded-full blur-3xl" />
            </div>
            
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur rounded-full mb-8">
                <Sparkles className="h-4 w-4 text-[#D4856A]" />
                <span className="text-white/90 text-sm font-medium">İlk kullanıcılara 1 analiz hediye</span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                Bugün başlayın
              </h2>
              <p className="text-xl text-white/60 mb-10 max-w-lg mx-auto">
                Kayıt tamamen ücretsiz. Kredi kartı gerekmez.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/auth/register"
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-[#D4856A] to-[#C97B5D] text-white rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-[#D4856A]/30 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <span>Ücretsiz Hesap Oluştur</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/auth/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-5 text-white/70 hover:text-white rounded-full font-medium transition-all"
                >
                  Zaten hesabım var
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="py-12 px-6 sm:px-8 lg:px-12 border-t border-[#eee]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#5B7B6A] to-[#3D5A4C] flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">O</span>
              </div>
              <div>
                <span className="text-xl font-bold text-[#1a1a1a]">OrbiraMind</span>
                <p className="text-xs text-[#999]">by Orbira Labs</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-8 text-sm">
              <Link href="/#features" className="text-[#666] hover:text-[#1a1a1a] transition-colors">Özellikler</Link>
              <Link href="/#for-who" className="text-[#666] hover:text-[#1a1a1a] transition-colors">Kimler İçin</Link>
              <Link href="/privacy" className="text-[#666] hover:text-[#1a1a1a] transition-colors">Gizlilik</Link>
              <Link href="/terms" className="text-[#666] hover:text-[#1a1a1a] transition-colors">Kullanım Koşulları</Link>
              <a href="mailto:destek@orbiramind.com" className="text-[#D4856A] hover:text-[#C97B5D] font-medium transition-colors">Destek</a>
            </div>
          </div>
          
          <div className="pt-8 border-t border-[#eee] flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#999]">
            <p>© 2026 Orbira Labs. Tüm hakları saklıdır.</p>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                KVKK Uyumlu
              </span>
              <span className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Veriler Türkiye&apos;de
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
