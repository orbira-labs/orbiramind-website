import Link from "next/link";
import { ArrowRight, ArrowLeft, Brain, Sparkles, CheckCircle2, AlertTriangle } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Neden HAE & AQE? | OrbiraMind",
  description: "Sadece AI değil, sadece algoritma değil. İkisinin mükemmel birleşimi. HAE & AQE motorlarının farkını keşfedin.",
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAF8]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#5B7B6A] to-[#3D5A4C] flex items-center justify-center shadow-lg shadow-[#5B7B6A]/20">
              <span className="text-white text-xl font-semibold">O</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight"><span className="text-[#1a1a1a]">Orbira</span><span className="text-[#D4856A]">Mind</span></span>
              <span className="text-[10px] text-[#5B7B6A] font-medium -mt-0.5 tracking-wider uppercase">Human Analysis Platform</span>
            </div>
          </Link>
          
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-[#666] hover:text-[#1a1a1a] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Ana Sayfa</span>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 sm:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#5B7B6A]/10 to-[#D4856A]/10 rounded-full mb-8">
            <Brain className="h-4 w-4 text-[#5B7B6A]" />
            <span className="text-sm font-medium text-[#5B7B6A]">Hybrid Teknoloji</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1a1a1a] leading-tight mb-6">
            Neden <span className="text-[#5B7B6A]">HAE</span> & <span className="text-[#D4856A]">AQE</span>?
          </h1>
          
          <p className="text-xl text-[#666] max-w-2xl mx-auto">
            İnsanı anlamak için tek başına yapay zeka yetmez. 
            Tek başına algoritma da. Biz ikisini birleştirdik.
          </p>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-16 px-6 sm:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-4">Klasik Yaklaşımların Sorunu</h2>
            <p className="text-[#666] max-w-xl mx-auto">Her iki yaklaşımın da güçlü ve zayıf yanları var</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Only AI */}
            <div className="relative bg-white rounded-3xl p-8 border-2 border-[#D4856A]/20 shadow-lg">
              <div className="absolute -top-4 left-8 px-4 py-1 bg-[#D4856A]/10 rounded-full border border-[#D4856A]/30">
                <span className="text-sm font-medium text-[#D4856A]">Sadece Yapay Zeka</span>
              </div>
              
              <div className="mt-4 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-[#D4856A]/10 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-[#D4856A]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a1a1a] mb-1">Tahmin Edebilir, Yanılabilir</h3>
                    <p className="text-sm text-[#666]">
                      AI her seferinde farklı yorumlar üretebilir. Aynı kişiye bugün ve yarın farklı analiz çıkabilir.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-[#D4856A]/10 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-[#D4856A]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a1a1a] mb-1">Yüksek Maliyet</h3>
                    <p className="text-sm text-[#666]">
                      Her analiz için yoğun AI işlem gücü gerekir. Bu da kullanıcıya yansıyan yüksek maliyetler demek.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-[#D4856A]/10 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-[#D4856A]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a1a1a] mb-1">Kara Kutu Problemi</h3>
                    <p className="text-sm text-[#666]">
                      Neden bu sonuca ulaştığını açıklayamaz. "AI böyle dedi" güven vermez.
                    </p>
                  </div>
                </div>
              </div>

              {/* Visual */}
              <div className="mt-8 p-4 bg-gradient-to-br from-[#D4856A]/5 to-[#D4856A]/10 rounded-2xl">
                <div className="flex items-center justify-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#D4856A] to-[#c4745a] flex items-center justify-center text-white font-bold">
                    AI
                  </div>
                  <ArrowRight className="h-5 w-5 text-[#999]" />
                  <div className="h-12 w-12 rounded-xl bg-[#f5f5f5] flex items-center justify-center">
                    <span className="text-2xl">🎲</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-[#999]" />
                  <div className="px-4 py-2 bg-[#D4856A]/20 rounded-lg text-sm text-[#D4856A] font-medium">
                    ?
                  </div>
                </div>
                <p className="text-center text-xs text-[#999] mt-3">Her seferinde farklı sonuç riski</p>
              </div>
            </div>

            {/* Only Algorithm */}
            <div className="relative bg-white rounded-3xl p-8 border-2 border-[#1a1a1a]/10 shadow-lg">
              <div className="absolute -top-4 left-8 px-4 py-1 bg-[#1a1a1a]/5 rounded-full border border-[#1a1a1a]/20">
                <span className="text-sm font-medium text-[#1a1a1a]">Sadece Algoritma</span>
              </div>
              
              <div className="mt-4 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-[#1a1a1a]/5 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-[#666]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a1a1a] mb-1">Yüzeysel Kalır</h3>
                    <p className="text-sm text-[#666]">
                      Sadece sayısal skorlar üretir. İnsanın karmaşık iç dünyasını anlayamaz, bağlam kuramaz.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-[#1a1a1a]/5 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-[#666]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a1a1a] mb-1">Esnek Değil</h3>
                    <p className="text-sm text-[#666]">
                      Herkese aynı soruları sorar. Kişiye özel derinleşemez, gereksiz sorular sıkıcıdır.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-[#1a1a1a]/5 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-[#666]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a1a1a] mb-1">Tutarsızlıkları Kaçırır</h3>
                    <p className="text-sm text-[#666]">
                      Çelişkili cevapları fark edemez. Yanıltıcı veya tutarsız verilerle hatalı sonuç üretir.
                    </p>
                  </div>
                </div>
              </div>

              {/* Visual */}
              <div className="mt-8 p-4 bg-gradient-to-br from-[#f5f5f5] to-[#eee] rounded-2xl">
                <div className="flex items-center justify-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#1a1a1a] to-[#333] flex items-center justify-center text-white font-bold text-xs">
                    01
                  </div>
                  <ArrowRight className="h-5 w-5 text-[#999]" />
                  <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center border border-[#eee]">
                    <span className="text-2xl">📊</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-[#999]" />
                  <div className="px-4 py-2 bg-[#1a1a1a]/10 rounded-lg text-sm text-[#666] font-medium">
                    72/100
                  </div>
                </div>
                <p className="text-center text-xs text-[#999] mt-3">Sadece kuru sayılar, anlam yok</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution Section */}
      <section className="py-16 px-6 sm:px-8 lg:px-12 bg-gradient-to-b from-[#FAFAF8] to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#5B7B6A]/10 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-[#5B7B6A]" />
              <span className="text-sm font-medium text-[#5B7B6A]">Çözüm</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-4">İkisinin Mükemmel Birleşimi</h2>
            <p className="text-[#666] max-w-xl mx-auto">Deterministik hassasiyet + AI derinliği = Güvenilir analiz</p>
          </div>

          {/* Hybrid Visual */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-[#5B7B6A]/20 shadow-xl mb-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left - Flow Diagram */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#5B7B6A] to-[#3D5A4C] flex items-center justify-center text-white font-bold shadow-lg">
                    1
                  </div>
                  <div className="flex-1 p-4 bg-[#5B7B6A]/5 rounded-xl border border-[#5B7B6A]/20">
                    <p className="font-semibold text-[#1a1a1a]">Algoritma hassasiyeti sağlar</p>
                    <p className="text-sm text-[#666]">Tekrarlanabilir, tutarlı hesaplamalar</p>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-[#5B7B6A] to-[#D4856A]"></div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#D4856A] to-[#c4745a] flex items-center justify-center text-white font-bold shadow-lg">
                    2
                  </div>
                  <div className="flex-1 p-4 bg-[#D4856A]/5 rounded-xl border border-[#D4856A]/20">
                    <p className="font-semibold text-[#1a1a1a]">AI derinlik katar</p>
                    <p className="text-sm text-[#666]">Bağlam, anlam ve doğrulama</p>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-[#D4856A] to-[#1a1a1a]"></div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#333] flex items-center justify-center text-white font-bold shadow-lg">
                    ✓
                  </div>
                  <div className="flex-1 p-4 bg-gradient-to-r from-[#5B7B6A]/10 to-[#D4856A]/10 rounded-xl border border-[#5B7B6A]/20">
                    <p className="font-semibold text-[#1a1a1a]">Güvenilir, derin analiz</p>
                    <p className="text-sm text-[#666]">Her seferinde tutarlı + anlamlı</p>
                  </div>
                </div>
              </div>
              
              {/* Right - Benefits */}
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-[#f8f8f6] rounded-xl">
                  <CheckCircle2 className="h-6 w-6 text-[#5B7B6A] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#1a1a1a]">%95 daha düşük maliyet</p>
                    <p className="text-sm text-[#666]">AI sadece gerektiğinde devreye girer</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-[#f8f8f6] rounded-xl">
                  <CheckCircle2 className="h-6 w-6 text-[#5B7B6A] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#1a1a1a]">Tutarlı sonuçlar</p>
                    <p className="text-sm text-[#666]">Aynı veriye her zaman aynı analiz</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-[#f8f8f6] rounded-xl">
                  <CheckCircle2 className="h-6 w-6 text-[#5B7B6A] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#1a1a1a]">Derin içgörüler</p>
                    <p className="text-sm text-[#666]">Sayıların ötesinde gerçek anlam</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-[#f8f8f6] rounded-xl">
                  <CheckCircle2 className="h-6 w-6 text-[#5B7B6A] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#1a1a1a]">Tutarsızlık tespiti</p>
                    <p className="text-sm text-[#666]">Çelişkili cevaplar otomatik yakalanır</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Flow */}
      <section className="py-16 px-6 sm:px-8 lg:px-12 bg-gradient-to-b from-white to-[#FAFAF8]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-4">Pratikte Nasıl Çalışır?</h2>
            <p className="text-[#666]">Siz sadece link gönderirsiniz, gerisini biz hallederiz</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-6 p-6 bg-white rounded-2xl border border-[#eee] shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-[#5B7B6A] flex items-center justify-center text-white font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold text-[#1a1a1a] mb-1">Danışanınıza link gönderin</h3>
                <p className="text-sm text-[#666]">Tek tıklama ile başlar, uygulama indirme yok</p>
              </div>
            </div>

            <div className="flex items-center gap-6 p-6 bg-white rounded-2xl border border-[#eee] shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-[#D4856A] flex items-center justify-center text-white font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold text-[#1a1a1a] mb-1">AQE kişiye özel sorular sorar</h3>
                <p className="text-sm text-[#666]">Her yanıt bir sonraki soruyu şekillendirir, sıkılmadan tamamlar</p>
              </div>
            </div>

            <div className="flex items-center gap-6 p-6 bg-white rounded-2xl border border-[#eee] shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-[#5B7B6A] flex items-center justify-center text-white font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold text-[#1a1a1a] mb-1">HAE çok katmanlı analiz yapar</h3>
                <p className="text-sm text-[#666]">Algoritmik hassasiyet + AI doğrulaması = güvenilir sonuç</p>
              </div>
            </div>

            <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-[#5B7B6A]/10 to-[#D4856A]/10 rounded-2xl border border-[#5B7B6A]/20">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#1a1a1a] to-[#333] flex items-center justify-center text-white flex-shrink-0">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-[#1a1a1a] mb-1">Profesyonel rapor elinizde</h3>
                <p className="text-sm text-[#666]">Karakter analizi, güçlü-zayıf yanlar, koçluk yol haritası hazır</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 sm:px-8 lg:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-6">
            İlk analiziniz bizden hediye
          </h2>
          <p className="text-[#666] mb-8 max-w-xl mx-auto">
            Hiçbir ödeme bilgisi gerekmez. Hemen kayıt olun, bir danışanınızla deneyin, farkı görün.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#1a1a1a] to-[#333] text-white rounded-full font-semibold hover:shadow-2xl hover:shadow-black/30 hover:-translate-y-0.5 transition-all duration-300"
          >
            <span>Ücretsiz Başla</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#eee]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#999]">© 2026 OrbiraMind. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-[#666] hover:text-[#1a1a1a] transition-colors">
              Gizlilik
            </Link>
            <Link href="/terms" className="text-sm text-[#666] hover:text-[#1a1a1a] transition-colors">
              Kullanım Koşulları
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
