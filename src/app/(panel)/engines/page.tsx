"use client";

import { TopBar } from "@/components/layout/TopBar";

type Step = { step: string; label: string; ai?: boolean; transfer?: boolean; done?: boolean };

const AQE_STEPS: Step[] = [
  { step: "01", label: "Danışandan Ham Veriler Toplanır" },
  { step: "02", label: "Kişisel Temel Profil Oluşturulur" },
  { step: "03", label: "İlk Sinyaller Yakalanır" },
  { step: "AI", label: "Tutarlılık Kontrolü — Coherence Shield", ai: true },
  { step: "AI", label: "Anomali Tespiti — Anomaly Interceptor", ai: true },
  { step: "04", label: "Kişiye Özel Soru Havuzu Aktive Edilir" },
  { step: "05", label: "Derinlemesine Soru Akışı Başlar" },
  { step: "→", label: "Veriler İşlenerek HAE'ye İletilir", transfer: true },
];

const HAE_STEPS: Step[] = [
  { step: "↓", label: "AQE'den İşlenmiş Veriler Teslim Alınır", transfer: true },
  { step: "01", label: "Sinyaller Normalize Edilir" },
  { step: "02", label: "Kişilik Örüntüleri Aktive Edilir" },
  { step: "03", label: "Davranış Kalıpları Tespit Edilir" },
  { step: "AI", label: "4 Katmanlı AI Doğrulamasından Geçirilir", ai: true },
  { step: "04", label: "Kör Noktalar ve Gizli Dinamikler Çıkarılır" },
  { step: "05", label: "Çok Boyutlu Puanlama Yapılır" },
  { step: "✓", label: "Tam Kapsamlı Profil ve Rapor Hazır", done: true },
];

function StepList({
  steps,
  accentColor,
  aiBg,
  aiText,
  transferBg,
  transferText,
}: {
  steps: Step[];
  accentColor: string;
  aiBg: string;
  aiText: string;
  transferBg: string;
  transferText: string;
}) {
  return (
    <div className="space-y-0">
      {steps.map((s, i) => (
        <div key={i} className="flex gap-3">
          {/* Left: step indicator + connector line */}
          <div className="flex flex-col items-center">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 z-10"
              style={{
                background: s.ai ? aiBg : s.transfer || s.done ? transferBg : accentColor + "18",
                color: s.ai ? aiText : s.transfer || s.done ? transferText : accentColor,
                border: `1.5px solid ${s.ai ? aiText + "40" : s.transfer || s.done ? transferText + "50" : accentColor + "40"}`,
              }}
            >
              {s.step}
            </div>
            {i < steps.length - 1 && (
              <div className="w-px flex-1 my-1" style={{ background: accentColor + "20", minHeight: "16px" }} />
            )}
          </div>

          {/* Right: label */}
          <div className="pb-3 pt-1.5 flex-1">
            <p
              className="text-sm leading-snug"
              style={{
                fontWeight: s.ai || s.transfer || s.done ? 600 : 400,
                color: s.ai ? aiText : s.transfer || s.done ? transferText : "#4B5563",
              }}
            >
              {s.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function EnginesPage() {
  return (
    <>
      <TopBar title="Nasıl Analiz Ediyoruz?" />
      <main className="flex-1 p-3 sm:p-5 lg:p-6">
        <div className="mx-auto max-w-5xl">
          <div className="bg-gradient-to-br from-[#5B7B6A]/20 to-[#5B7B6A]/8 rounded-2xl p-4 sm:p-5 space-y-4">

            {/* Engine cards */}
            <div className="grid sm:grid-cols-2 gap-4">

              {/* AQE */}
              <div className="rounded-2xl overflow-hidden border border-[#C5CAF5]/60 bg-white">
                {/* Header */}
                <div className="relative px-6 py-5 overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #3D44B8 0%, #7C6FCD 60%, #9B8CF0 100%)" }}>
                  <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5 blur-2xl" />
                  <div className="relative flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-mono text-white/40 mb-1">aqe.flow.engine — running</p>
                      <h2 className="text-2xl font-black text-white tracking-tight">AQE</h2>
                      <p className="text-sm text-white/60 mt-0.5">Adaptive Question Engine</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/15 self-start">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-300 animate-pulse" />
                      <span className="text-[10px] text-white/80 font-medium">v1.0</span>
                    </div>
                  </div>
                </div>

                {/* Steps */}
                <div className="px-6 py-5">
                  <StepList
                    steps={AQE_STEPS}
                    accentColor="#5B63D3"
                    aiBg="#EEF0FF"
                    aiText="#4B4FBE"
                    transferBg="#E8F0FF"
                    transferText="#3D44B8"
                  />
                </div>

                {/* Footer link */}
                <div className="px-6 pb-5">
                  <a
                    href="https://www.orbiralabs.com/engines/aqe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden flex items-center justify-between px-4 py-3 rounded-xl"
                    style={{ background: "linear-gradient(135deg, #3D44B8, #7C6FCD)" }}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)" }} />
                    <span className="text-sm font-semibold text-white relative">Teknik detayları incele</span>
                    <svg className="h-4 w-4 text-white/70 group-hover:text-white group-hover:translate-x-0.5 transition-all relative" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* HAE */}
              <div className="rounded-2xl overflow-hidden border border-[#A8D5B8]/60 bg-white">
                {/* Header */}
                <div className="relative px-6 py-5 overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #1B5E3E 0%, #2E7D52 60%, #3DAA6E 100%)" }}>
                  <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5 blur-2xl" />
                  <div className="relative flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-mono text-white/40 mb-1">hae.engine.core — active</p>
                      <h2 className="text-2xl font-black text-white tracking-tight">HAE</h2>
                      <p className="text-sm text-white/60 mt-0.5">Human Analysis Engine</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/15 self-start">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-300 animate-pulse" />
                      <span className="text-[10px] text-white/80 font-medium">v2.0</span>
                    </div>
                  </div>
                </div>

                {/* Steps */}
                <div className="px-6 py-5">
                  <StepList
                    steps={HAE_STEPS}
                    accentColor="#2E7D52"
                    aiBg="#E8F5EE"
                    aiText="#1B5E3E"
                    transferBg="#F0FAF4"
                    transferText="#2E7D52"
                  />
                </div>

                {/* Footer link */}
                <div className="px-6 pb-5">
                  <a
                    href="https://www.orbiralabs.com/engines/hae"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden flex items-center justify-between px-4 py-3 rounded-xl"
                    style={{ background: "linear-gradient(135deg, #1B5E3E, #3DAA6E)" }}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)" }} />
                    <span className="text-sm font-semibold text-white relative">Teknik detayları incele</span>
                    <svg className="h-4 w-4 text-white/70 group-hover:text-white group-hover:translate-x-0.5 transition-all relative" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </>
  );
}
