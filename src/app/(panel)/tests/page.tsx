"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useProContext } from "@/lib/context";
import { useTests } from "@/lib/hooks/useTests";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { SendTestModal } from "@/components/tests/SendTestModal";
import { FlaskConical, Eye, Link2, Check, Send, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { TEST_STATUSES } from "@/lib/constants";
import { clsx } from "clsx";
import Link from "next/link";

type Filter = "waiting_analysis" | "waiting_client" | "completed";

export default function TestsPage() {
  const router = useRouter();
  const { creditBalance } = useProContext();
  const [filter, setFilter] = useState<Filter>("waiting_analysis");
  const { tests, counts, loading, loadingMore, hasMore, refresh, loadMore } = useTests(filter);
  const [showSendModal, setShowSendModal] = useState(false);
  const [copiedTestId, setCopiedTestId] = useState<string | null>(null);

  async function copyTestLinkById(token: string, testId: string) {
    const link = `${window.location.origin}/t/${token}`;
    await navigator.clipboard.writeText(link);
    setCopiedTestId(testId);
    toast.success("Link kopyalandı!");
    setTimeout(() => setCopiedTestId(null), 2000);
  }

  return (
    <>
      <TopBar title="Analizler" />
      <SendTestModal
        open={showSendModal}
        onClose={() => setShowSendModal(false)}
        onSent={refresh}
      />
      <main className="flex-1 p-3 sm:p-5 lg:p-6">
        <div className="mx-auto max-w-6xl">
          {/* Main Container - like Ofisim */}
          <div className="bg-gradient-to-br from-[#5B7B6A]/20 to-[#5B7B6A]/8 rounded-2xl p-4 sm:p-5 space-y-4">
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3">
              {creditBalance > 0 ? (
                <Card padding="md" variant="elevated">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-xl bg-[var(--pro-analysis-light)] flex items-center justify-center">
                        <FlaskConical className="h-5 w-5 text-[var(--pro-analysis)]" />
                      </div>
                      <p className="text-sm text-pro-text-secondary font-medium">Kalan MindTest Adedi</p>
                    </div>
                    <p className="text-3xl font-bold text-[var(--pro-analysis)]">{creditBalance}</p>
                  </div>
                </Card>
              ) : (
                <Card padding="md" variant="elevated" className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
                        <FlaskConical className="h-5 w-5 text-amber-600" />
                      </div>
                      <p className="text-sm text-amber-700 font-medium">MindTest Krediniz Bitti</p>
                    </div>
                    <button
                      onClick={() => router.push("/billing")}
                      className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors flex items-center gap-1"
                    >
                      Hemen Al →
                    </button>
                  </div>
                </Card>
              )}
              <Card padding="md" variant="elevated">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
                      <Send className="h-5 w-5 text-amber-600" />
                    </div>
                    <p className="text-sm text-pro-text-secondary font-medium">İşlenmemiş Analizler</p>
                  </div>
                  <p className="text-3xl font-bold text-amber-600">{counts.pending}</p>
                </div>
              </Card>
              <Card padding="md" variant="elevated">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center">
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="text-sm text-pro-text-secondary font-medium">Tamamlanan</p>
                  </div>
                  <p className="text-3xl font-bold text-green-600">{counts.completed}</p>
                </div>
              </Card>
            </div>

            {/* Analysis List Card */}
            <Card padding="lg" variant="elevated">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <h2 className="font-semibold text-pro-text flex items-center gap-2">
                    <span className="h-4 w-0.5 rounded-full bg-[var(--pro-analysis)]" />
                    Test Geçmişi
                  </h2>
                  <div className="flex gap-1 bg-pro-surface-alt rounded-lg p-1">
                    {(["waiting_analysis", "waiting_client", "completed"] as Filter[]).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={clsx(
                          "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                          filter === f
                            ? "bg-pro-surface text-pro-text shadow-sm"
                            : "text-pro-text-secondary hover:text-pro-text"
                        )}
                      >
                        {f === "waiting_analysis" ? "Analiz Hazır" : f === "waiting_client" ? "Danışan Bekleniyor" : "Tamamlanan"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content */}
              {loading ? (
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-pro-surface-alt">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-6 w-20" />
                    </div>
                  ))}
                </div>
              ) : tests.length === 0 ? (
                <EmptyState
                  icon={FlaskConical}
                  title="Bu kategoride sonuç yok"
                  description="Farklı bir filtre deneyin veya yeni MindTest gönderin"
                />
              ) : (
                <div className="space-y-2">
                  {tests.map((test) => {
                    const s = TEST_STATUSES.find((ts) => ts.id === test.status);
                    const canViewResults = test.status === "completed" || test.status === "reviewed";
                    const isPending = test.status === "sent" || test.status === "started";
                    const isCopied = copiedTestId === test.id;

                    return (
                      <div
                        key={test.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-pro-surface-alt hover:bg-pro-surface-alt/80 transition-colors"
                      >
                        <Avatar
                          firstName={test.client?.first_name || "?"}
                          lastName={test.client?.last_name || ""}
                          size="sm"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-pro-text">
                            {test.client?.first_name} {test.client?.last_name}
                          </p>
                          <p className="text-xs text-pro-text-tertiary">
                            {formatDate(test.created_at)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={s?.color as "success" | "warning" | "info" | "danger" | "accent" || "muted"} size="sm" dot>
                            {s?.label || test.status}
                          </Badge>
                          {isPending && (
                            <button
                              onClick={() => copyTestLinkById(test.token, test.id)}
                              className={clsx(
                                "p-1.5 rounded-lg transition-colors",
                                isCopied
                                  ? "text-pro-success bg-pro-success-light"
                                  : "text-pro-text-tertiary hover:text-[var(--pro-analysis)] hover:bg-[var(--pro-analysis-light)]"
                              )}
                              title="Test linkini kopyala"
                            >
                              {isCopied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                            </button>
                          )}
                          {canViewResults && (
                            <Link
                              href={`/tests/${test.id}`}
                              className="p-1.5 rounded-lg text-[var(--pro-analysis)] hover:bg-[var(--pro-analysis-light)] transition-colors"
                              title="Sonuçları Gör"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Load More Button */}
                  {hasMore && (
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="w-full py-3 mt-2 text-sm font-medium text-pro-text-secondary hover:text-pro-text hover:bg-pro-surface-alt rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loadingMore ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Yükleniyor...
                        </>
                      ) : (
                        "Daha Fazla Yükle"
                      )}
                    </button>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
