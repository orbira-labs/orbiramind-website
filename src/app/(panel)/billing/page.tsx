"use client";

import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { MindTestBadge } from "@/components/ui/MindTestBadge";
import {
  Check,
  Fingerprint,
  Eye,
  Route,
  ShieldAlert,
  ScanSearch,
  Sparkles,
  ClipboardList,
  TrendingUp,
  BrainCircuit,
  FlaskConical,
  X,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ArrowRight,
  ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const OUTPUTS = [
  {
    icon: Fingerprint,
    title: "Karakter Haritası",
    desc: "350+ psikolojik özellik üzerinden kişinin derinlemesine profili",
  },
  {
    icon: ShieldAlert,
    title: "Danışana Özel Kritik Rapor",
    desc: "Güçlü yönler, risk alanları ve çelişkileri tek bir bakışta",
  },
  {
    icon: Eye,
    title: "Gizli Katman — Kör Noktalar",
    desc: "Kişinin farkında olmadığı dinamikler, çıkarım motoru ile tespit edilir",
  },
  {
    icon: Route,
    title: "Danışanın Yol Haritası",
    desc: "Acil, kısa ve orta vadeli somut müdahale adımları",
  },
  {
    icon: ScanSearch,
    title: "Davranış Kalıpları & Çıkarımlar",
    desc: "Tekrarlayan örüntüler, gizli güçler ve tutarsızlık bayrakları",
  },
];

// Her MindTest analizinde ortak olan temel içerik — kredi paketlerinde
// ve Pro Üyelik'te birebir aynıdır, bu yüzden tek bir yerde gösterilir.
const PACKAGE_FEATURES = [
  "Karaktere özel adaptif sorular (AQE)",
  "HAE + AQE hibrit analiz",
  "Tam kapsamlı hibrit rapor",
  "350+ özellikli karakter haritası",
  "Kör nokta & tutarsızlık tespiti",
  "Koçluk yol haritası",
];

const PRO_FEATURES: { icon: typeof FlaskConical; title: string; desc: string }[] = [
  {
    icon: FlaskConical,
    title: "Aylık 15 MindTest Kredisi",
    desc: "Her ay otomatik yenilenen analiz hakkı ile portföyünüzü sürekli güncel tutun",
  },
  {
    icon: ClipboardList,
    title: "Danışana Özel Ödevler",
    desc: "Analiz sonuçlarına göre AI'ın oluşturduğu bireysel gelişim görevleri",
  },
  {
    icon: TrendingUp,
    title: "İlerleme Analizi",
    desc: "Danışanın süreç boyunca gösterdiği değişimi görselleştiren detaylı raporlar",
  },
  {
    icon: BrainCircuit,
    title: "AI Seans Asistanı",
    desc: "Görüşme öncesi hazırlanan brifing: geçmiş notlar, ödev durumu ve odak önerileri",
  },
];

// Karşılaştırma artık "Test Kredisi vs Pro Üyelik" ekseninde; aynı analiz
// özellikleri iki tarafta da geçerli olduğu için satır sayısı küçüldü.
const COMPARISON_ROWS: {
  feature: string;
  credits: boolean | string;
  pro: boolean | string;
}[] = [
  { feature: "Ödeme şekli", credits: "Tek seferlik", pro: "Aylık abonelik" },
  { feature: "Kredi yenilenmesi", credits: "—", pro: "Her ay 15 MindTest" },
  { feature: "Analiz başına maliyet", credits: "₺27 – ₺32,99", pro: "~₺19,93" },
  { feature: "Karaktere özel adaptif sorular (AQE)", credits: true, pro: true },
  { feature: "HAE + AQE hibrit analiz", credits: true, pro: true },
  { feature: "Tam kapsamlı hibrit rapor", credits: true, pro: true },
  { feature: "Kör nokta & tutarsızlık tespiti", credits: true, pro: true },
  { feature: "Koçluk yol haritası", credits: true, pro: true },
  { feature: "Danışana özel ödevler", credits: false, pro: true },
  { feature: "İlerleme analizi", credits: false, pro: true },
  { feature: "AI seans asistanı", credits: false, pro: true },
];

type BillingView = "root" | "credits" | "pro";

export default function BillingPage() {
  const [view, setView] = useState<BillingView>("root");
  const [showComparison, setShowComparison] = useState(false);

  return (
    <>
      <TopBar title="Satın Al" />
      <main className="flex-1 p-3 sm:p-5 lg:p-6">
        <div className="mx-auto max-w-4xl">
          <div className="bg-gradient-to-br from-[#5B7B6A]/20 to-[#5B7B6A]/8 rounded-2xl p-4 sm:p-5 space-y-4">

            {/* Top Info Card — analizlerde ne çıkıyor, her iki üründe de geçerli */}
            <Card padding="lg" variant="elevated">
              <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-pro-border">
                <div className="space-y-4 sm:pr-6 pb-4 sm:pb-0">
                  {OUTPUTS.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-pro-primary-light flex items-center justify-center shrink-0 mt-0.5">
                        <item.icon className="h-[15px] w-[15px] text-pro-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-pro-text">{item.title}</p>
                        <p className="text-xs text-pro-text-tertiary leading-relaxed mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4 sm:pl-6 pt-4 sm:pt-0">
                  {OUTPUTS.slice(3).map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-pro-primary-light flex items-center justify-center shrink-0 mt-0.5">
                        <item.icon className="h-[15px] w-[15px] text-pro-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-pro-text">{item.title}</p>
                        <p className="text-xs text-pro-text-tertiary leading-relaxed mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* View switcher: root (2 kategori) → credits | pro */}
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="space-y-4"
              >
                {view === "root" && <RootView onSelect={setView} />}
                {view === "credits" && <CreditsView onBack={() => setView("root")} />}
                {view === "pro" && <ProView onBack={() => setView("root")} />}
              </motion.div>
            </AnimatePresence>

            {/* Karşılaştırma — sadece kök ekranda, karar öncesi referans */}
            {view === "root" && (
              <>
                <div className="flex flex-col items-center gap-3">
                  <button
                    onClick={() => setShowComparison((s) => !s)}
                    aria-expanded={showComparison}
                    className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-pro-border bg-white hover:border-pro-primary/50 hover:shadow-sm transition-all text-sm text-pro-text-secondary hover:text-pro-primary"
                  >
                    {showComparison ? (
                      <ChevronUp className="h-4 w-4 text-pro-primary" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-pro-primary" />
                    )}
                    Paket mi, Üyelik mi? Farkı gör
                  </button>
                </div>

                {showComparison && <ComparisonTable />}
              </>
            )}

            {/* Nasıl analiz ediyoruz — tüm görünümlerde sabit alt CTA */}
            <div className="flex justify-center">
              <a
                href="/engines"
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-pro-border bg-white hover:border-pro-primary/50 hover:shadow-sm transition-all text-sm text-pro-text-secondary hover:text-pro-primary"
              >
                <svg className="h-4 w-4 text-pro-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                Nasıl analiz ediyoruz?
                <svg className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </a>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Root: iki kategori kartı
// ─────────────────────────────────────────────────────────────────────────
function RootView({ onSelect }: { onSelect: (v: BillingView) => void }) {
  return (
    <div>
      <div className="mb-4 text-center">
        <h2 className="text-base sm:text-lg font-bold text-pro-text">Nasıl devam etmek istiyorsunuz?</h2>
        <p className="text-xs sm:text-sm text-pro-text-tertiary mt-1">Tek seferlik test kredisi mi, aylık Pro Üyelik mi?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Test Satın Al */}
        <button
          type="button"
          onClick={() => onSelect("credits")}
          className="group text-left rounded-2xl border-2 border-pro-border bg-white p-5 sm:p-6 hover:border-pro-primary hover:shadow-lg transition-all active:scale-[0.99] min-h-[180px] flex flex-col"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="h-11 w-11 rounded-xl bg-pro-primary-light flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-pro-primary" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-pro-text mb-1">Test Satın Al</h3>
          <p className="text-xs font-medium text-pro-text-tertiary mb-3 uppercase tracking-wide">Tek seferlik · kullandıkça öde</p>
          <p className="text-sm text-pro-text-secondary leading-relaxed mb-5 flex-1">
            5&apos;lik veya 20&apos;lik MindTest paketi. Kredi süresiz geçerlidir, üyelik gerekmez.
          </p>
          <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-pro-primary group-hover:gap-2.5 transition-all">
            Paketleri gör
            <ArrowRight className="h-4 w-4" />
          </div>
        </button>

        {/* Pro Üyelik */}
        <button
          type="button"
          onClick={() => onSelect("pro")}
          className="group text-left rounded-2xl overflow-hidden relative p-5 sm:p-6 hover:shadow-xl transition-all active:scale-[0.99] min-h-[180px] flex flex-col"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED] via-[#8B5CF6] to-[#6D28D9]" />
          <div className="absolute top-0 right-0 w-[140px] h-[140px] rounded-full bg-white opacity-[0.08] blur-[50px]" />

          <div className="relative flex items-start justify-between mb-4">
            <div className="h-11 w-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[10px] font-bold text-white tracking-wide">
              YAKINDA
            </span>
          </div>
          <h3 className="relative text-lg font-bold text-white mb-1">Pro Üyelik</h3>
          <p className="relative text-xs font-medium text-white/70 mb-3 uppercase tracking-wide">Aylık abonelik · AI asistanlı</p>
          <p className="relative text-sm text-white/80 leading-relaxed mb-5 flex-1">
            Otomatik yenilenen kredi, danışan ödevleri, ilerleme analizi ve AI seans asistanı.
          </p>
          <div className="relative inline-flex items-center gap-1.5 text-sm font-semibold text-white group-hover:gap-2.5 transition-all">
            Detayları gör
            <ArrowRight className="h-4 w-4" />
          </div>
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Credits view: 5 MindTest + 20 MindTest + ortak içerik kartı
// ─────────────────────────────────────────────────────────────────────────
function CreditsView({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-pro-text-secondary hover:text-pro-primary transition-colors"
        aria-label="Geri dön"
      >
        <ArrowLeft className="h-4 w-4" />
        Geri dön
      </button>

      <div>
        <h2 className="text-lg font-bold text-pro-text">Test Kredisi Paketleri</h2>
        <p className="text-xs text-pro-text-tertiary mt-0.5">
          Tek seferlik ödeme · kredi süresiz geçerli · istediğin zaman kullan
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 5 MindTest — sade */}
        <div className="rounded-2xl border-2 border-pro-border bg-white overflow-hidden flex flex-col">
          <div className="bg-gradient-to-br from-[#EDF5F0] to-[#E0EDE4] px-6 py-5 border-b border-pro-border">
            <MindTestBadge count={5} size="lg" variant="primary" />
            <p className="text-xs text-pro-text-tertiary mt-1">analiz başına ₺32,99</p>
          </div>
          <div className="px-6 py-5 flex-1 flex flex-col">
            <div className="text-3xl font-bold text-pro-text leading-none">₺164,95</div>
            <p className="text-xs text-pro-text-tertiary mt-1 mb-5">tek ödeme</p>
            <button
              type="button"
              onClick={() => toast.info("Ödeme sistemi yakında aktif olacak")}
              className="mt-auto w-full min-h-[48px] py-3 rounded-xl border-2 border-pro-primary text-pro-primary font-semibold hover:bg-pro-primary hover:text-white transition-all active:scale-[0.98]"
            >
              Satın Al
            </button>
          </div>
        </div>

        {/* 20 MindTest — gold, en popüler */}
        <div className="rounded-2xl overflow-hidden flex flex-col relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C] via-[#E8C963] to-[#A67C34]" />
          <div className="absolute top-0 right-0 w-[140px] h-[140px] rounded-full bg-white opacity-[0.08] blur-[50px]" />

          {/* %18 tasarruf rozeti */}
          <div className="absolute -right-[30px] top-[18px] z-10 rotate-45 bg-white shadow-md px-8 py-1">
            <span className="text-[11px] font-bold text-[#8B6914] tracking-wide">%18 tasarruf</span>
          </div>

          {/* Mobilde "EN POPÜLER" etiketi */}
          <div className="sm:hidden absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-[10px] font-bold text-[#8B6914] tracking-wide">EN POPÜLER</span>
          </div>

          <div className="relative px-6 py-5 border-b border-white/20">
            <MindTestBadge count={20} size="lg" variant="white" />
            <p className="text-xs text-white/70 mt-1">analiz başına ₺27,00</p>
          </div>
          <div className="relative px-6 py-5 flex-1 flex flex-col">
            <div className="text-3xl font-bold text-white leading-none">₺540,00</div>
            <p className="text-xs text-white/70 mt-1 mb-5">tek ödeme</p>
            <button
              type="button"
              onClick={() => toast.info("Ödeme sistemi yakında aktif olacak")}
              className="mt-auto w-full min-h-[48px] py-3 rounded-xl bg-white text-[#8B6914] font-semibold shadow-lg hover:bg-white/95 transition-all active:scale-[0.98]"
            >
              Satın Al
            </button>
          </div>
        </div>
      </div>

      {/* Her pakette ortak olan analiz içeriği — bir kez listelenir */}
      <Card padding="lg" variant="elevated">
        <div className="flex items-start gap-3 mb-3">
          <div className="h-8 w-8 rounded-lg bg-pro-primary-light flex items-center justify-center shrink-0">
            <Check className="h-4 w-4 text-pro-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-pro-text">Her MindTest analizinde ne var?</p>
            <p className="text-xs text-pro-text-tertiary mt-0.5">İki paket de birebir aynı içerikle gelir</p>
          </div>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-pro-border">
          {PACKAGE_FEATURES.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-pro-text-secondary">
              <Check className="h-4 w-4 text-pro-success shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Pro view: tek hero kart — eski modalın içeriği inline
// ─────────────────────────────────────────────────────────────────────────
function ProView({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-pro-text-secondary hover:text-pro-primary transition-colors"
        aria-label="Geri dön"
      >
        <ArrowLeft className="h-4 w-4" />
        Geri dön
      </button>

      <div className="rounded-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED] via-[#8B5CF6] to-[#6D28D9]" />
        <div className="absolute top-0 right-0 w-[260px] h-[260px] rounded-full bg-white opacity-[0.08] blur-[60px]" />
        <div className="absolute bottom-0 left-0 w-[180px] h-[180px] rounded-full bg-white opacity-[0.05] blur-[50px]" />

        {/* Yakında rozeti */}
        <div className="absolute -right-[30px] top-[18px] z-10 rotate-45 bg-white shadow-md px-8 py-1">
          <span className="text-[11px] font-bold text-[#7C3AED] tracking-wide">Yakında</span>
        </div>

        <div className="relative p-6 sm:p-8">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm mb-4">
            <Sparkles className="h-7 w-7 text-white" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Pro Üyelik</h2>
          <p className="text-white/75 mb-6 max-w-xl leading-relaxed">
            Danışanlarınızla aranızdaki bağı güçlendiren, seanslarınızı zenginleştiren AI destekli asistanınız.
            Tek seferlik analiz değil; sürecin her aşamasında sizinle olan bir sistem.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {PRO_FEATURES.map((f, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <f.icon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{f.title}</p>
                  <p className="text-white/60 text-xs mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Fiyat çapası */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-4">
            <div className="flex items-baseline justify-center gap-2 mb-1">
              <span className="text-3xl font-bold text-white">~₺19,93</span>
              <span className="text-white/60 text-sm">/ analiz</span>
            </div>
            <p className="text-center text-xs text-white/60">
              Aylık 15 MindTest · istediğin zaman iptal
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              toast.success("Lansmandan haberdar olmanız için listeye aldık. Teşekkürler!")
            }
            className="w-full min-h-[52px] py-3 rounded-xl bg-white text-[#7C3AED] font-semibold shadow-lg hover:bg-white/95 transition-all active:scale-[0.98]"
          >
            Lansmandan haberim olsun
          </button>

          <p className="text-center text-xs text-white/50 mt-3">
            Mevcut test kredileriniz üyelik başladıktan sonra da geçerli kalır.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Comparison: Test Kredisi vs Pro Üyelik (2 sütun)
// ─────────────────────────────────────────────────────────────────────────
function ComparisonTable() {
  return (
    <Card padding="none" variant="elevated">
      <div className="relative">
        {/* Mobilde scroll affordance */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 md:hidden" />

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-pro-border">
                <th className="text-left px-4 py-3 text-pro-text-tertiary font-medium sticky left-0 bg-white z-20 min-w-[160px]">
                  Özellik
                </th>
                <th className="text-center px-3 py-3 text-pro-text font-semibold whitespace-nowrap">
                  <span className="inline-block px-2.5 py-1 bg-pro-primary-light rounded-md text-pro-primary text-xs">
                    Test Kredisi
                  </span>
                </th>
                <th className="text-center px-3 py-3 text-pro-text font-semibold whitespace-nowrap">
                  <span className="inline-block px-2.5 py-1 bg-[#8B5CF6]/10 rounded-md text-[#7C3AED] text-xs">
                    Pro Üyelik
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-pro-primary-light/30" : ""}>
                  <td
                    className={`px-4 py-2.5 text-pro-text-secondary sticky left-0 z-20 ${
                      i % 2 === 0 ? "bg-[#f5f9f6]" : "bg-white"
                    }`}
                  >
                    {row.feature}
                  </td>
                  {(["credits", "pro"] as const).map((plan) => (
                    <td key={plan} className="text-center px-3 py-2.5">
                      {row[plan] === true ? (
                        <Check className="h-4 w-4 text-pro-success mx-auto" />
                      ) : row[plan] === false ? (
                        <X className="h-4 w-4 text-pro-text-tertiary/40 mx-auto" />
                      ) : (
                        <span className="text-xs font-semibold text-pro-text">{row[plan]}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}
