"use client";

import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import {
  Sparkles,
  ShieldCheck,
  Infinity as InfinityIcon,
  Zap,
  Fingerprint,
  ShieldAlert,
  Eye,
  Route,
  ScanSearch,
  FlaskConical,
  ClipboardList,
  TrendingUp,
  BrainCircuit,
  ArrowRight,
  ArrowLeft,
  ShoppingCart,
  Check,
  Gift,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────
// Veri
// ─────────────────────────────────────────────────────────────────────────

type Plan = {
  id: string;
  name: string;
  tagline: string;
  credits: number;
  pricePerCredit: number;
  total: number;
  savings?: string;
  badge?: string;
  variant?: "gold" | "diamond";
};

const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Başlangıç",
    tagline: "Pratiği denemek için ideal başlangıç",
    credits: 5,
    pricePerCredit: 32.99,
    total: 164.95,
  },
  {
    id: "popular",
    name: "Dengeli",
    tagline: "Düzenli kullanan uzmanlar için en dengeli seçim",
    credits: 15,
    pricePerCredit: 27.99,
    total: 419.85,
    savings: "%15 tasarruf",
    badge: "POPÜLER",
    variant: "gold",
  },
  {
    id: "pro-pack",
    name: "Profesyonel",
    tagline: "Yoğun portföylü uzmanlar için en avantajlı paket",
    credits: 45,
    pricePerCredit: 23.99,
    total: 1079.55,
    savings: "%27 tasarruf",
    badge: "EN AVANTAJLI",
    variant: "diamond",
  },
];

const ANALYSIS_INCLUDES = [
  {
    icon: Fingerprint,
    title: "Karakter Haritası",
    desc: "350+ psikolojik özellik üzerinden derinlemesine profil",
  },
  {
    icon: ShieldAlert,
    title: "Kritik Rapor",
    desc: "Güçlü yönler, risk alanları ve çelişkiler tek bakışta",
  },
  {
    icon: Eye,
    title: "Kör Noktalar",
    desc: "Kişinin farkında olmadığı gizli dinamikler",
  },
  {
    icon: Route,
    title: "Yol Haritası",
    desc: "Acil, kısa ve orta vadeli somut müdahale adımları",
  },
  {
    icon: ScanSearch,
    title: "Davranış Kalıpları",
    desc: "Tekrarlayan örüntüler ve tutarsızlık bayrakları",
  },
  {
    icon: Check,
    title: "Hibrit Analiz Motoru",
    desc: "AQE + HAE bütünleşik değerlendirme modeli",
  },
];

const PRO_FEATURES = [
  {
    icon: Gift,
    title: "Aylık 10 MindTest Hediye",
    desc: "Her ay 10 test kredisi otomatik olarak hesabınıza tanımlanır, birikir.",
  },
  {
    icon: ClipboardList,
    title: "Danışana Özel Ödevler",
    desc: "Analiz sonuçlarına göre yapay zekânın önerdiği bireysel gelişim görevleri.",
  },
  {
    icon: TrendingUp,
    title: "İlerleme Analizi",
    desc: "Danışanın süreç boyunca gösterdiği değişimi ölçümleyen detaylı raporlar.",
  },
  {
    icon: BrainCircuit,
    title: "Seans Asistanı",
    desc: "Görüşme öncesi hazırlanan brifing: geçmiş notlar, ödev durumu ve odak önerileri.",
  },
];

const fmt = (n: number) =>
  n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─────────────────────────────────────────────────────────────────────────
// Sayfa
// ─────────────────────────────────────────────────────────────────────────

type View = "root" | "credits" | "pro";

export default function BillingPage() {
  const [view, setView] = useState<View>("root");

  return (
    <>
      <TopBar title="Satın Al" />
      <main className="flex-1 p-3 sm:p-5 lg:p-6">
        <div className="mx-auto max-w-6xl py-2 sm:py-4">
          <AnimatePresence mode="wait">
            {view === "root" && (
              <motion.div
                key="root"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <RootView onSelect={setView} />
              </motion.div>
            )}
            {view === "credits" && (
              <motion.div
                key="credits"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <CreditsView onBack={() => setView("root")} />
              </motion.div>
            )}
            {view === "pro" && (
              <motion.div
                key="pro"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <ProView onBack={() => setView("root")} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Root: iki premium giriş kartı
// ─────────────────────────────────────────────────────────────────────────

function RootView({ onSelect }: { onSelect: (v: View) => void }) {
  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto space-y-3 pt-4 sm:pt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pro-primary-light">
          <Sparkles className="h-3.5 w-3.5 text-pro-primary" />
          <span className="text-[11px] font-semibold text-pro-primary tracking-[0.14em] uppercase">
            Satın Alma Seçenekleri
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-pro-text leading-[1.1] tracking-tight">
          Nasıl devam etmek istersiniz?
        </h1>
        <p className="text-sm sm:text-base text-pro-text-secondary leading-relaxed max-w-lg mx-auto">
          İki farklı yol sunuyoruz: ihtiyaç duydukça kredi alın ya da Pro Üyelikle
          her ay yenilenen bir danışan takip ekosistemine sahip olun.
        </p>
      </div>

      {/* İki büyük giriş kartı */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* Test Kredisi */}
        <button
          type="button"
          onClick={() => onSelect("credits")}
          className="group relative text-left rounded-3xl border border-pro-border bg-white overflow-hidden transition-all hover:border-pro-primary/50 hover:shadow-2xl hover:-translate-y-0.5 active:scale-[0.995] min-h-[400px] flex flex-col"
        >
          {/* Dekoratif arka plan */}
          <div className="absolute -top-20 -right-20 w-[280px] h-[280px] rounded-full bg-pro-primary-light opacity-60 blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-pro-primary-light/30 pointer-events-none" />

          <div className="relative p-7 sm:p-9 flex flex-col h-full">
            <div className="flex items-start justify-between mb-8">
              <div className="h-14 w-14 rounded-2xl bg-pro-primary-light flex items-center justify-center ring-1 ring-pro-primary/10">
                <ShoppingCart className="h-6 w-6 text-pro-primary" />
              </div>
              <span className="text-[10px] font-bold text-pro-primary bg-pro-primary-light px-2.5 py-1 rounded-full tracking-[0.1em]">
                TEK SEFERLİK
              </span>
            </div>

            <div className="space-y-2 mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-pro-text leading-tight">
                Test Kredisi
              </h2>
              <p className="text-sm text-pro-text-secondary leading-relaxed">
                İhtiyaç duyduğunuzda kredi paketi satın alın, süresiz kullanın.
                Abonelik veya düzenli ödeme yoktur.
              </p>
            </div>

            <div className="space-y-2.5 mb-8 flex-1">
              {[
                { icon: InfinityIcon, text: "Krediler süresiz geçerlidir" },
                { icon: Zap, text: "Ödeme sonrası anında aktif" },
                { icon: ShieldCheck, text: "Abonelik yok, gizli ücret yok" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="h-6 w-6 rounded-md bg-pro-primary-light flex items-center justify-center shrink-0">
                    <item.icon className="h-3.5 w-3.5 text-pro-primary" />
                  </div>
                  <span className="text-sm text-pro-text-secondary">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="inline-flex items-center gap-2 text-pro-primary font-semibold text-sm group-hover:gap-3 transition-all">
              Paketleri keşfet
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </button>

        {/* Pro Üyelik */}
        <button
          type="button"
          onClick={() => onSelect("pro")}
          className="group relative text-left rounded-3xl overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-0.5 active:scale-[0.995] min-h-[400px] flex flex-col"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED] via-[#8B5CF6] to-[#6D28D9]" />
          <div className="absolute -top-24 -right-24 w-[320px] h-[320px] rounded-full bg-white opacity-[0.12] blur-[70px] pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-[240px] h-[240px] rounded-full bg-white opacity-[0.08] blur-[60px] pointer-events-none" />

          <div className="relative p-7 sm:p-9 flex flex-col h-full">
            <div className="flex items-start justify-between mb-8">
              <div className="h-14 w-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/20">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-[10px] font-bold text-white bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-full tracking-[0.1em]">
                YAKINDA
              </span>
            </div>

            <div className="space-y-2 mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                Pro Üyelik
              </h2>
              <p className="text-sm text-white/80 leading-relaxed">
                Her ay 10 MindTest kredisi hediye ve yapay zekâ destekli danışan
                takip ekosistemi ile çalışın.
              </p>
            </div>

            <div className="space-y-2.5 mb-8 flex-1">
              {[
                { icon: Gift, text: "Her ay 10 kredi hediye olarak tanımlanır" },
                { icon: BrainCircuit, text: "Seans asistanı ve ödev sistemi" },
                { icon: TrendingUp, text: "Danışan bazlı ilerleme analizi" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="h-6 w-6 rounded-md bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0">
                    <item.icon className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-sm text-white/85">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="inline-flex items-center gap-2 text-white font-semibold text-sm group-hover:gap-3 transition-all">
              Üyeliği incele
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </button>
      </div>

      {/* Alt link */}
      <div className="flex justify-center pt-2">
        <a
          href="/engines"
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-pro-border bg-white hover:border-pro-primary/50 hover:shadow-sm transition-all text-sm text-pro-text-secondary hover:text-pro-primary"
        >
          <Sparkles className="h-4 w-4 text-pro-primary" />
          Nasıl analiz ediyoruz?
          <ArrowRight className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
        </a>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Credits detay: 3 paket + içerik + güven bandı
// ─────────────────────────────────────────────────────────────────────────

function CreditsView({ onBack }: { onBack: () => void }) {
  const handlePurchase = (plan: Plan) => {
    toast.info(
      `${plan.name} paketi (${plan.credits} kredi): Ödeme sistemi yakında devreye alınacak.`,
    );
  };

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* Geri navigasyonu */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-pro-text-secondary hover:text-pro-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Geri
      </button>

      {/* Başlık */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pro-primary-light">
          <ShoppingCart className="h-3.5 w-3.5 text-pro-primary" />
          <span className="text-[11px] font-semibold text-pro-primary tracking-[0.14em] uppercase">
            Test Kredisi Paketleri
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-pro-text leading-[1.1] tracking-tight">
          İhtiyacınız kadar kredi alın
        </h1>
        <p className="text-sm sm:text-base text-pro-text-secondary leading-relaxed">
          Süresiz geçerli, abonelik gerektirmez. Paket büyüdükçe analiz başına
          maliyet düşer.
        </p>
      </section>

      {/* Fiyat kartları */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 md:items-stretch">
        {PLANS.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            onPurchase={() => handlePurchase(plan)}
          />
        ))}
      </section>

      {/* Her analizde ne var */}
      <section>
        <div className="text-center mb-6 sm:mb-8 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-pro-text">
            Her analizde neler yer alır?
          </h2>
          <p className="text-sm text-pro-text-tertiary mt-2 leading-relaxed">
            Paket büyüklüğünden bağımsız olarak her MindTest analizi birebir aynı
            kalite ve içerikle sunulur.
          </p>
        </div>
        <Card padding="lg" variant="elevated">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
            {ANALYSIS_INCLUDES.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-pro-primary-light flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon className="h-[16px] w-[16px] text-pro-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-pro-text">{item.title}</p>
                  <p className="text-xs text-pro-text-tertiary mt-0.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Pro Üyelik detay: konsept odaklı, fiyat karşılaştırması yok
// ─────────────────────────────────────────────────────────────────────────

function ProView({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-10 sm:space-y-12">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-pro-text-secondary hover:text-pro-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Geri
      </button>

      {/* Mor premium hero */}
      <section className="relative rounded-3xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED] via-[#8B5CF6] to-[#6D28D9]" />
        <div className="absolute -top-24 -right-24 w-[400px] h-[400px] rounded-full bg-white opacity-[0.10] blur-[80px]" />
        <div className="absolute -bottom-24 -left-24 w-[320px] h-[320px] rounded-full bg-white opacity-[0.06] blur-[60px]" />

        <div className="relative p-7 sm:p-10 md:p-14 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm mb-6">
            <Sparkles className="h-3.5 w-3.5 text-white" />
            <span className="text-[11px] font-bold text-white tracking-[0.14em] uppercase">
              Yakında · Pro Üyelik
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-white leading-[1.1] tracking-tight mb-4">
            Her ay 10 kredi hediye.
            <br />
            Her danışanınız için yanınızda.
          </h1>
          <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-xl mx-auto mb-6">
            Pro Üyelik bir fiyatlandırma planı değil; danışan süreçlerinizi
            uçtan uca destekleyen bir ekosistemdir. Her ay 10 MindTest kredisi
            hesabınıza hediye olarak tanımlanır; yanında yapay zekâ destekli
            araçlar gelir.
          </p>

          <div className="inline-flex items-baseline gap-2 px-5 py-3 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25">
            <span className="text-3xl sm:text-4xl font-bold text-white leading-none">
              ₺339
            </span>
            <span className="text-sm font-medium text-white/85">/ ay</span>
          </div>
        </div>
      </section>

      {/* 4 özellik kartı */}
      <section>
        <div className="text-center mb-6 sm:mb-8 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-pro-text">
            Üyelikte neler var?
          </h2>
          <p className="text-sm text-pro-text-tertiary mt-2 leading-relaxed">
            Pro Üyelik; krediyle birlikte, danışan takibinizi bütünsel hâle
            getiren dört temel modülü içerir.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {PRO_FEATURES.map((f, i) => (
            <div
              key={i}
              className="relative bg-white border border-pro-border rounded-2xl p-5 sm:p-6 hover:border-[#7C3AED]/30 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#7C3AED]/10 to-[#8B5CF6]/5 flex items-center justify-center shrink-0 ring-1 ring-[#7C3AED]/15">
                  <f.icon className="h-5 w-5 text-[#7C3AED]" />
                </div>
                <div className="min-w-0">
                  <p className="text-base font-semibold text-pro-text">
                    {f.title}
                  </p>
                  <p className="text-sm text-pro-text-tertiary mt-1 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lansman CTA */}
      <section className="relative rounded-2xl overflow-hidden border border-pro-border bg-white">
        <div className="relative p-6 sm:p-8 text-center max-w-xl mx-auto">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#7C3AED]/15 to-[#8B5CF6]/5 flex items-center justify-center mx-auto mb-4 ring-1 ring-[#7C3AED]/15">
            <Clock className="h-5 w-5 text-[#7C3AED]" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-pro-text mb-2">
            Pro Üyelik yakında açılıyor
          </h3>
          <p className="text-sm text-pro-text-secondary mb-5 leading-relaxed">
            Lansman listesine katılın, üyelik açıldığında ilk siz haberdar olun.
            Mevcut kredileriniz üyelik başladıktan sonra da geçerliliğini korur.
          </p>
          <button
            type="button"
            onClick={() =>
              toast.success(
                "Lansman bildirim listesine eklendiniz. Teşekkür ederiz.",
              )
            }
            className="inline-flex items-center gap-2 bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
          >
            Lansmanda haber ver
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Fiyat kartı (credits detay içinde)
// ─────────────────────────────────────────────────────────────────────────

function PricingCard({
  plan,
  onPurchase,
}: {
  plan: Plan;
  onPurchase: () => void;
}) {
  if (plan.variant === "gold") {
    return (
      <div className="relative rounded-2xl overflow-visible h-full">
        {plan.badge && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 bg-white rounded-full px-3 py-1 shadow-md ring-1 ring-[#C9A84C]/30">
            <span className="text-[10px] font-bold text-[#8B6914] tracking-[0.1em]">
              {plan.badge}
            </span>
          </div>
        )}
        <div className="relative rounded-2xl overflow-hidden shadow-xl h-full flex">
          <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C] via-[#E8C963] to-[#A67C34]" />
          <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full bg-white opacity-[0.10] blur-[55px]" />
          <div className="absolute bottom-0 left-0 w-[160px] h-[160px] rounded-full bg-white opacity-[0.06] blur-[45px]" />

          <div className="relative p-6 sm:p-7 flex flex-col h-full w-full">
            <div className="space-y-1 mb-4">
              <p className="text-[11px] font-semibold text-white/85 uppercase tracking-[0.14em]">
                {plan.name}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-bold text-white leading-none">
                  {plan.credits}
                </span>
                <span className="text-base font-semibold text-white/75">
                  kredi
                </span>
              </div>
              <p className="text-xs text-white/75 leading-relaxed pt-1">
                {plan.tagline}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3.5 mb-4 border border-white/20">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-2xl font-bold text-white leading-none">
                    ₺{fmt(plan.total)}
                  </p>
                  <p className="text-[11px] text-white/75 mt-1.5">
                    Analiz başına ₺{fmt(plan.pricePerCredit)}
                  </p>
                </div>
                {plan.savings && (
                  <span className="inline-flex items-center gap-1 bg-white text-[#8B6914] px-2 py-1 rounded-md text-[11px] font-bold shrink-0">
                    <Zap className="h-3 w-3" />
                    {plan.savings}
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onPurchase}
              className="mt-auto w-full min-h-[48px] py-3.5 rounded-xl bg-white text-[#8B6914] font-semibold shadow-lg hover:bg-white/95 transition-all active:scale-[0.98] inline-flex items-center justify-center gap-2"
            >
              Satın Al
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (plan.variant === "diamond") {
    return (
      <div className="relative rounded-2xl overflow-visible h-full">
        {plan.badge && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 rounded-full px-3 py-1 bg-white shadow-md ring-1 ring-[#6D28D9]/30">
            <span className="text-[10px] font-bold tracking-[0.1em] text-[#4C1D95]">
              {plan.badge}
            </span>
          </div>
        )}
        {/* Outer iridescent glow */}
        <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-br from-[#22D3EE] via-[#8B5CF6] to-[#EC4899] opacity-90 blur-[2px]" aria-hidden />
        <div
          className="relative rounded-2xl overflow-hidden h-full flex shadow-[0_25px_60px_-20px_rgba(99,102,241,0.65)]"
          style={{
            background:
              "linear-gradient(135deg, #0F172A 0%, #1E1B4B 18%, #3730A3 38%, #6D28D9 58%, #2563EB 78%, #0EA5E9 100%)",
          }}
        >
          {/* Iridescent shimmer overlays */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,0.35),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(236,72,153,0.25),transparent_55%)]" />
          <div className="absolute -top-16 -right-16 w-[220px] h-[220px] rounded-full bg-cyan-300 opacity-[0.18] blur-[60px]" />
          <div className="absolute -bottom-16 -left-16 w-[200px] h-[200px] rounded-full bg-fuchsia-400 opacity-[0.14] blur-[55px]" />
          {/* Subtle diagonal sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

          <div className="relative p-6 sm:p-7 flex flex-col h-full w-full">
            <div className="space-y-1 mb-4">
              <p className="text-[11px] font-semibold text-white/90 uppercase tracking-[0.14em]">
                {plan.name}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-bold text-white leading-none drop-shadow-[0_2px_8px_rgba(34,211,238,0.35)]">
                  {plan.credits}
                </span>
                <span className="text-base font-semibold text-white/80">
                  kredi
                </span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed pt-1">
                {plan.tagline}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-3.5 mb-4 border border-white/25">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-2xl font-bold text-white leading-none">
                    ₺{fmt(plan.total)}
                  </p>
                  <p className="text-[11px] text-white/80 mt-1.5">
                    Analiz başına ₺{fmt(plan.pricePerCredit)}
                  </p>
                </div>
                {plan.savings && (
                  <span className="inline-flex items-center gap-1 bg-white text-[#1E1B4B] px-2 py-1 rounded-md text-[11px] font-bold shrink-0 shadow-md">
                    <Zap className="h-3 w-3" />
                    {plan.savings}
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onPurchase}
              className="mt-auto w-full min-h-[48px] py-3.5 rounded-xl bg-white text-[#1E1B4B] font-semibold shadow-lg hover:bg-white/95 transition-all active:scale-[0.98] inline-flex items-center justify-center gap-2"
            >
              Satın Al
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl border-2 border-pro-border bg-white p-6 sm:p-7 hover:border-pro-primary/50 hover:shadow-lg transition-all flex flex-col h-full">
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pro-primary text-white rounded-full px-3 py-1 shadow-sm">
          <span className="text-[10px] font-bold tracking-[0.1em]">
            {plan.badge}
          </span>
        </div>
      )}

      <div className="space-y-1 mb-4">
        <p className="text-[11px] font-semibold text-pro-text-tertiary uppercase tracking-[0.14em]">
          {plan.name}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-6xl font-bold text-pro-text leading-none">
            {plan.credits}
          </span>
          <span className="text-base font-semibold text-pro-text-secondary">
            kredi
          </span>
        </div>
        <p className="text-xs text-pro-text-tertiary leading-relaxed pt-1">
          {plan.tagline}
        </p>
      </div>

      <div className="bg-pro-primary-light/40 rounded-xl px-4 py-3.5 mb-4 border border-pro-border">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-2xl font-bold text-pro-text leading-none">
              ₺{fmt(plan.total)}
            </p>
            <p className="text-[11px] text-pro-text-tertiary mt-1.5">
              Analiz başına ₺{fmt(plan.pricePerCredit)}
            </p>
          </div>
          {plan.savings && (
            <span className="inline-flex items-center gap-1 bg-pro-success/10 text-pro-success px-2 py-1 rounded-md text-[11px] font-bold shrink-0">
              <Zap className="h-3 w-3" />
              {plan.savings}
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onPurchase}
        className="mt-auto w-full min-h-[48px] py-3.5 rounded-xl border-2 border-pro-primary text-pro-primary font-semibold hover:bg-pro-primary hover:text-white transition-all active:scale-[0.98] inline-flex items-center justify-center gap-2"
      >
        Satın Al
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
