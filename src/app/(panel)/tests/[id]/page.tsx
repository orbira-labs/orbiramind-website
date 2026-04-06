"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, Download } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { WellnessGauge } from "@/components/results/WellnessGauge";
import { DimensionRadar } from "@/components/results/DimensionRadar";
import { StrengthWeaknessGrid } from "@/components/results/StrengthWeaknessGrid";
import { CharacterAnalysis } from "@/components/results/CharacterAnalysis";
import { BlindSpotCard } from "@/components/results/BlindSpotCard";
import { CoachingTimeline } from "@/components/results/CoachingTimeline";
import { formatDate, formatDateTime } from "@/lib/utils";
import { staggerContainer, cardReveal } from "@/lib/animations";
import type { TestInvitation, Client, TestResults } from "@/lib/types";

type Tab = "overview" | "character" | "blindspots" | "roadmap";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Genel Bakış" },
  { id: "character", label: "Karakter Analizi" },
  { id: "blindspots", label: "Kör Noktalar" },
  { id: "roadmap", label: "Yol Haritası" },
];

export default function TestResultPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState<(TestInvitation & { client: Client }) | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  useEffect(() => {
    async function fetchTest() {
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

      setTest(data as (TestInvitation & { client: Client }) | null);
      setLoading(false);
    }

    fetchTest();
  }, [id]);

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
            <Skeleton className="h-10 w-full rounded-lg" />
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

  if (test.status !== "completed" || !test.results_snapshot) {
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

  const results = test.results_snapshot as unknown as TestResults;
  const { analysis, report } = results;

  return (
    <>
      <TopBar title="Analiz Sonucu" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <Link
            href="/tests"
            className="inline-flex items-center gap-1.5 text-sm text-pro-text-secondary hover:text-pro-text transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Analizlere Dön
          </Link>

          <Card padding="lg">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Avatar
                firstName={test.client?.first_name || "?"}
                lastName={test.client?.last_name || ""}
                size="lg"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-pro-text">
                  {test.client?.first_name} {test.client?.last_name}
                </h2>
                <div className="flex flex-wrap gap-4 mt-1 text-sm text-pro-text-secondary">
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
              <Badge variant="success" className="self-start sm:self-center">
                Tamamlandı
              </Badge>
            </div>
          </Card>

          <div className="flex gap-1 bg-pro-surface-alt rounded-lg p-1 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[100px] px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-pro-surface text-pro-text shadow-sm"
                    : "text-pro-text-secondary hover:text-pro-text"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div variants={cardReveal}>
                  <Card padding="lg">
                    <WellnessGauge score={analysis.wellness_score} size="lg" />
                  </Card>
                </motion.div>
                <motion.div variants={cardReveal}>
                  <Card padding="lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">10 Boyut Karakter Analizi</h3>
                    <DimensionRadar scores={analysis.dimension_scores} />
                  </Card>
                </motion.div>
              </div>

              <motion.div variants={cardReveal}>
                <Card padding="lg">
                  <StrengthWeaknessGrid
                    strengths={report.top5_and_weak5.top5}
                    weaknesses={report.top5_and_weak5.weak5}
                  />
                </Card>
              </motion.div>
            </motion.div>
          )}

          {activeTab === "character" && (
            <motion.div
              variants={cardReveal}
              initial="initial"
              animate="animate"
            >
              <Card padding="lg">
                <CharacterAnalysis text={report.character_analysis} />
              </Card>
            </motion.div>
          )}

          {activeTab === "blindspots" && (
            <motion.div
              variants={cardReveal}
              initial="initial"
              animate="animate"
            >
              <Card padding="lg">
                <BlindSpotCard blindSpots={report.blind_spots} />
              </Card>
            </motion.div>
          )}

          {activeTab === "roadmap" && (
            <motion.div
              variants={cardReveal}
              initial="initial"
              animate="animate"
            >
              <Card padding="lg">
                <CoachingTimeline roadmap={report.coaching_roadmap} />
              </Card>
            </motion.div>
          )}

          <div className="text-center text-xs text-gray-400 py-4">
            Rapor oluşturma: {report.generated_at ? formatDateTime(report.generated_at) : "—"} · Model: {report.model || "GPT-4o"}
          </div>
        </div>
      </main>
    </>
  );
}
