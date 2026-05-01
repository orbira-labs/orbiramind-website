"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  User,
  CheckCircle,
  Loader2,
  BarChart3,
  ArrowUpDown,
  MapIcon,
  Search,
  Share2,
  ChevronLeft,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { WellnessGauge } from "@/components/results/WellnessGauge";
import { ProfileCard } from "@/components/results/ProfileCard";
import { StrengthWeaknessGrid } from "@/components/results/StrengthWeaknessGrid";
import { CharacterAnalysis } from "@/components/results/CharacterAnalysis";
import { ClinicianInsights } from "@/components/results/ClinicianInsights";
import { CoachingTimeline } from "@/components/results/CoachingTimeline";
import { CrisisAlertBanner } from "@/components/results/CrisisAlertBanner";

import { formatDate, formatDateTime } from "@/lib/utils";
import type { TestInvitation, Client, TestResults } from "@/lib/types";

type Tab = "overview" | "strengths" | "clinician" | "roadmap";

const TABS: { id: Tab; label: string; icon: React.ReactNode; description: string }[] = [
  {
    id: "overview",
    label: "Genel Bakış",
    icon: <BarChart3 className="h-4 w-4" />,
    description: "Kimlik & skorlar",
  },
  {
    id: "strengths",
    label: "Güçlü & Gelişim",
    icon: <ArrowUpDown className="h-4 w-4" />,
    description: "Yönler & gelişim alanları",
  },
  {
    id: "clinician",
    label: "Terapist Görünümü",
    icon: <Search className="h-4 w-4" />,
    description: "Hipotezler & örüntüler",
  },
  {
    id: "roadmap",
    label: "Yol Haritası",
    icon: <MapIcon className="h-4 w-4" />,
    description: "Aksiyon planı",
  },
];

const tabContentVariants = {
  initial: { opacity: 0, y: 12, scale: 0.99 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.99,
    transition: { duration: 0.2 },
  },
};

export default function TestResultPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState<(TestInvitation & { client: Client }) | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [markingComplete, setMarkingComplete] = useState(false);
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<Tab, HTMLButtonElement | null>>({
    overview: null,
    strengths: null,
    clinician: null,
    roadmap: null,
  });

  const scrollTabIntoView = useCallback((tabId: Tab) => {
    const container = tabContainerRef.current;
    const tabEl = tabRefs.current[tabId];
    if (!container || !tabEl) return;

    const containerRect = container.getBoundingClientRect();
    const tabRect = tabEl.getBoundingClientRect();
    const scrollLeft = tabEl.offsetLeft - (containerRect.width / 2) + (tabRect.width / 2);
    
    container.scrollTo({
      left: Math.max(0, scrollLeft),
      behavior: "smooth",
    });
  }, []);

  const handleTabChange = useCallback((tabId: Tab) => {
    setActiveTab(tabId);
    scrollTabIntoView(tabId);
  }, [scrollTabIntoView]);

  const loadTest = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("test_invitations")
      .select("*, client:clients(*)")
      .eq("id", id)
      .eq("professional_id", user.id)
      .single();

    const testData = data as (TestInvitation & { client: Client }) | null;
    setTest(testData);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    loadTest();
  }, [loadTest]);

  async function markAsCompleted() {
    if (!test || markingComplete) return;

    setMarkingComplete(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("test_invitations")
        .update({
          status: "reviewed",
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      setTest({ ...test, status: "reviewed", reviewed_at: new Date().toISOString() });
      toast.success("Analiz tamamlandı olarak işaretlendi");
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setMarkingComplete(false);
    }
  }

  if (loading) {
    return (
      <>
        <TopBar title="Yükleniyor..." />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-5xl space-y-6">
            <Skeleton className="h-4 w-32" />
            <Card padding="lg">
              <div className="flex items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
            </Card>
            <Skeleton className="h-12 w-full rounded-xl" />
            <div className="grid md:grid-cols-2 gap-6">
              <Skeleton className="h-[300px] rounded-xl" />
              <Skeleton className="h-[300px] rounded-xl" />
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!test) {
    return (
      <>
        <TopBar title="Analiz Bulunamadı" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-5xl">
            <EmptyState
              icon={Calendar}
              title="Analiz bulunamadı"
              description="Bu analiz mevcut değil veya erişim yetkiniz yok"
              actionLabel="Analizlere Dön"
              onAction={() => router.push("/tests")}
            />
          </div>
        </main>
      </>
    );
  }

  const results = test.results_snapshot as unknown as TestResults | null;
  const hasValidReport =
    results?.report &&
    typeof results.report.character_analysis === "string" &&
    results.report.top5_and_weak5 &&
    // New format (therapeutic_tasks) or legacy format (coaching_roadmap) is acceptable
    (Boolean(results.report.therapeutic_tasks?.length) ||
      Boolean(results.report.coaching_roadmap));
  const isReportError =
    results?.report && "error" in results.report && !hasValidReport;

  if (test.status === "error" || isReportError) {
    return (
      <>
        <TopBar title="Analiz Hatası" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-5xl">
            <Link
              href="/tests"
              className="inline-flex items-center gap-1.5 text-sm text-pro-text-secondary hover:text-pro-text transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Analizlere Dön
            </Link>

            <Card padding="lg">
              <div className="flex items-center gap-4 mb-6">
                <Avatar
                  firstName={test.client?.first_name || "?"}
                  lastName={test.client?.last_name || ""}
                  size="lg"
                />
                <div>
                  <h2 className="text-xl font-semibold text-pro-text">
                    {test.client?.first_name} {test.client?.last_name}
                  </h2>
                  <p className="text-sm text-pro-text-secondary">
                    {formatDate(test.created_at)}
                  </p>
                </div>
                <Badge variant="danger" className="ml-auto">
                  Hata
                </Badge>
              </div>

              <div className="text-center py-8">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Rapor Oluşturulamadı</h3>
                <p className="text-gray-600">
                  Analiz sırasında bir hata oluştu. Lütfen testi tekrar göndermeyi deneyin.
                </p>
              </div>
            </Card>
          </div>
        </main>
      </>
    );
  }

  if ((test.status !== "completed" && test.status !== "reviewed") || !test.results_snapshot) {
    return (
      <>
        <TopBar title="Analiz Sonucu" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-5xl">
            <Link
              href="/tests"
              className="inline-flex items-center gap-1.5 text-sm text-pro-text-secondary hover:text-pro-text transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Analizlere Dön
            </Link>

            <Card padding="lg">
              <div className="flex items-center gap-4 mb-6">
                <Avatar
                  firstName={test.client?.first_name || "?"}
                  lastName={test.client?.last_name || ""}
                  size="lg"
                />
                <div>
                  <h2 className="text-xl font-semibold text-pro-text">
                    {test.client?.first_name} {test.client?.last_name}
                  </h2>
                  <p className="text-sm text-pro-text-secondary">
                    {formatDate(test.created_at)}
                  </p>
                </div>
                <Badge variant="warning" className="ml-auto">
                  {test.status === "sent" ? "Gönderildi" : test.status === "started" ? "Başladı" : "Süresi Doldu"}
                </Badge>
              </div>

              <div className="text-center py-8">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Analiz Henüz Tamamlanmadı</h3>
                <p className="text-gray-600">Danışan analizi tamamladığında sonuçlar burada görüntülenecektir.</p>
              </div>
            </Card>
          </div>
        </main>
      </>
    );
  }

  if (!hasValidReport) {
    return (
      <>
        <TopBar title="Analiz Sonucu" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-5xl">
            <EmptyState
              icon={Calendar}
              title="Rapor verileri eksik"
              description="Analiz tamamlandı ancak AI raporu üretilmemiş veya geçersiz. Aşağıdaki butona tıklayarak raporu yeniden üretebilirsiniz."
              actionLabel="Analizlere Dön"
              onAction={() => router.push("/tests")}
            />
            <div className="mt-6 flex justify-center">
              <RegenerateReportButton testId={id} onRegenerated={() => loadTest()} />
            </div>
          </div>
        </main>
      </>
    );
  }

  const { analysis, report: reportOrNull } = results;
  const report = reportOrNull!;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${test?.client?.first_name} ${test?.client?.last_name} - Analiz Raporu`,
          text: "Orbira Mind analiz raporu",
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link panoya kopyalandı");
      }
    } catch {
      // User cancelled or share failed
    }
  };

  return (
    <>
      {/* Mobile back button in TopBar area */}
      <div className="md:hidden sticky top-0 z-40 flex items-center h-14 border-b border-[#B8CCBE] bg-gradient-to-r from-[#DCE8E0] via-[#E3ECE6] to-[#E8EDE9] px-4 pt-[env(safe-area-inset-top)]">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center min-w-[44px] min-h-[44px] -ml-2 rounded-lg active:bg-white/50 transition-colors touch-manipulation"
          aria-label="Geri"
        >
          <ChevronLeft className="h-6 w-6 text-[#3D5A4C]" />
        </button>
        <h1 className="flex-1 text-base font-semibold text-[#3D5A4C] truncate">
          Analiz Sonucu
        </h1>
      </div>
      
      {/* Desktop TopBar */}
      <div className="hidden md:block">
        <TopBar title="Analiz Sonucu" />
      </div>
      
      <main className="relative flex-1 p-3 sm:p-6 lg:p-8 pb-24 md:pb-8">
        {/* Ambient background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute -top-60 -right-60 w-[500px] h-[500px] bg-[#5B7B6A]/[0.025] rounded-full blur-[100px]" />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-[#C4956A]/[0.015] rounded-full blur-[80px]" />
        </div>

        <div className="relative mx-auto max-w-5xl space-y-4 sm:space-y-6">
          {/* Back link - desktop only */}
          <Link
            href="/tests"
            className="hidden md:inline-flex items-center gap-1.5 text-sm text-pro-text-secondary hover:text-pro-text transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Analizlere Dön
          </Link>

          {/* Client header card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Card padding="lg" variant="elevated">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="relative">
                  <Avatar
                    firstName={test.client?.first_name || "?"}
                    lastName={test.client?.last_name || ""}
                    size="lg"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 border-2 border-white flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-pro-text">
                    {test.client?.first_name} {test.client?.last_name}
                  </h2>
                  <div className="flex flex-wrap gap-4 mt-1.5 text-sm text-pro-text-secondary">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {test.completed_at ? formatDateTime(test.completed_at) : formatDate(test.created_at)}
                    </span>
                    {test.client && (
                      <Link
                        href={`/clients/${test.client_id}`}
                        className="flex items-center gap-1.5 text-pro-primary hover:underline"
                      >
                        <User className="h-3.5 w-3.5" />
                        Danışan Profili
                      </Link>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-center">
                  {test.status === "reviewed" ? (
                    <Badge variant="success">Tamamlandı</Badge>
                  ) : (
                    <>
                      <Badge variant="accent">Analiz Hazır</Badge>
                      <button
                        onClick={markAsCompleted}
                        disabled={markingComplete}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-pro-success hover:bg-pro-success/90 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {markingComplete ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                        Tamamla
                      </button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Crisis alerts — critical tier patternler ve yüksek şiddetli inference'lar.
              Motor iki yere yazıyor: report.crisis_alerts (Phase 2 rapor üretildikten
              sonra) ve analysis.crisis_alerts (senkron, rapor hazır değilse de
              terapist görsün diye). İkisini de birleştirip unique title ile gösteriyoruz. */}
          {(() => {
            const fromReport = report.crisis_alerts ?? [];
            const fromAnalysis = (analysis as { crisis_alerts?: typeof fromReport }).crisis_alerts ?? [];
            const seen = new Set<string>();
            const merged = [...fromReport, ...fromAnalysis].filter((alert) => {
              const key = alert?.title ?? "";
              if (seen.has(key)) return false;
              seen.add(key);
              return true;
            });
            return merged.length > 0 ? <CrisisAlertBanner alerts={merged} /> : null;
          })()}

          {/* Premium tab bar - sticky on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="sticky top-14 md:top-16 z-30 -mx-3 px-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-2 bg-[#F5F8F6]/95 backdrop-blur-sm md:relative md:top-auto md:mx-0 md:px-0 md:py-0 md:bg-transparent md:backdrop-blur-none"
          >
            <div 
              ref={tabContainerRef}
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-pro-border p-1.5 shadow-[var(--pro-shadow-sm)] overflow-x-auto scrollbar-hide scroll-smooth"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <div className="flex gap-1 min-w-max">
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      ref={(el) => { tabRefs.current[tab.id] = el; }}
                      onClick={() => handleTabChange(tab.id)}
                      className={`relative flex-1 min-w-[90px] sm:min-w-[120px] flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 touch-manipulation ${
                        isActive
                          ? "text-white shadow-md"
                          : "text-pro-text-secondary hover:text-pro-text hover:bg-gray-50 active:bg-gray-100"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-[#5B7B6A] to-[#4A6A59] rounded-xl"
                          transition={{ type: "spring", stiffness: 400, damping: 35 }}
                        />
                      )}
                      <span className="relative flex items-center gap-1.5 sm:gap-2">
                        {tab.icon}
                        <span className="text-xs sm:text-sm">{tab.label}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={tabContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {analysis.profile_summary && (
                    <Card padding="lg" variant="elevated">
                      <ProfileCard summary={analysis.profile_summary} />
                    </Card>
                  )}

                  <Card padding="lg" variant="elevated">
                    <CharacterAnalysis
                      text={report.character_analysis}
                      scoreWidget={<WellnessGauge score={analysis.wellness_score} size="sm" />}
                    />
                  </Card>
                </div>
              )}

              {activeTab === "strengths" && (
                <div className="space-y-6">
                  <Card padding="lg" variant="elevated">
                    <StrengthWeaknessGrid
                      strengths={report.top5_and_weak5.top5}
                      weaknesses={report.top5_and_weak5.weak5}
                    />
                  </Card>
                </div>
              )}

              {activeTab === "clinician" && (
                <Card padding="lg" variant="elevated">
                  <ClinicianInsights
                    sessionGuide={report.session_guide}
                    reportBlindSpots={report.blind_spots}
                    therapeuticGuidance={report.therapeutic_guidance}
                    analysisBlindSpots={analysis.blind_spots}
                    inferences={analysis.inferences}
                  />
                </Card>
              )}

              {activeTab === "roadmap" && (
                <Card padding="lg" variant="elevated">
                  <CoachingTimeline roadmap={report.coaching_roadmap} tasks={report.therapeutic_tasks} />
                </Card>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-2 py-6"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gray-200" />
            <p className="text-xs text-gray-400">
              Rapor oluşturma: {report.generated_at ? formatDateTime(report.generated_at) : "—"}
            </p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gray-200" />
          </motion.div>
        </div>

        {/* Mobile sticky share footer */}
        <div className="fixed bottom-20 left-0 right-0 md:hidden z-30 px-4 pb-[env(safe-area-inset-bottom)]">
          <button
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-xl bg-gradient-to-r from-[#5B7B6A] to-[#4A6A59] text-white font-medium shadow-lg active:opacity-90 transition-opacity touch-manipulation"
          >
            <Share2 className="h-5 w-5" />
            Raporu Paylaş
          </button>
        </div>
      </main>
    </>
  );
}

/**
 * "Raporu Üret" butonu.
 *
 * Eski misconfig sebebiyle (yanlış API key → AI rapor devre dışı) tamamlanmış
 * testlerin AI raporu yok. Bu buton orbiramind backend'in regenerate endpoint'ini
 * tetikler, arka planda raporu poll eder ve bittiğinde test invitation'ı günceller.
 * Frontend her 8 saniyede bir loadTest çağırarak otomatik yenilenir.
 */
function RegenerateReportButton({
  testId,
  onRegenerated,
}: {
  testId: string;
  onRegenerated: () => void | Promise<void>;
}) {
  const [pending, setPending] = useState(false);
  const [polling, setPolling] = useState(false);
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, []);

  async function startPolling() {
    setPolling(true);
    let elapsed = 0;
    const interval = 8_000;
    const maxMs = 4 * 60 * 1000; // 4 dakika

    pollTimerRef.current = setInterval(async () => {
      elapsed += interval;
      try {
        await onRegenerated();
      } catch {
        /* swallow — bir sonraki tick yeniden dener */
      }
      if (elapsed >= maxMs) {
        if (pollTimerRef.current) clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
        setPolling(false);
        toast.error("Rapor süresi içinde hazır olmadı. Lütfen birkaç dakika sonra tekrar deneyin.");
      }
    }, interval);
  }

  async function handleClick() {
    setPending(true);
    try {
      const res = await fetch(`/api/tests/${testId}/regenerate-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force: false }),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(json?.error ?? `Failed: ${res.status}`);
      }

      if (json.status === "already_exists") {
        toast.info("Rapor zaten mevcut. Sayfa yenileniyor...");
        await onRegenerated();
        return;
      }

      toast.success("Rapor üretimi başlatıldı. 30-90 saniye sürebilir.");
      void startPolling();
    } catch (err) {
      toast.error(`Hata: ${err instanceof Error ? err.message : "Bilinmeyen"}`);
    } finally {
      setPending(false);
    }
  }

  const busy = pending || polling;

  return (
    <button
      onClick={handleClick}
      disabled={busy}
      className="inline-flex items-center gap-2 min-h-[44px] px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#5B7B6A] to-[#4A6A59] text-white font-medium shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all"
    >
      {busy ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {polling ? "Rapor üretiliyor..." : "Başlatılıyor..."}
        </>
      ) : (
        <>
          <Loader2 className="h-4 w-4" />
          Raporu Üret
        </>
      )}
    </button>
  );
}
