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
import { FlaskConical, Eye, Link2, Check, Send } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { TEST_STATUSES } from "@/lib/constants";
import { clsx } from "clsx";
import Link from "next/link";

type Filter = "all" | "pending" | "completed";

export default function TestsPage() {
  const router = useRouter();
  const { creditBalance } = useProContext();
  const { tests, loading, refresh, completedCount, pendingCount } = useTests();
  const [showSendModal, setShowSendModal] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [copiedTestId, setCopiedTestId] = useState<string | null>(null);

  const filtered = tests.filter((t) => {
    if (filter === "pending") return t.status === "sent" || t.status === "started";
    if (filter === "completed") return t.status === "completed";
    return true;
  });

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
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[var(--pro-analysis-light)] flex items-center justify-center">
                      <FlaskConical className="h-5 w-5 text-[var(--pro-analysis)]" />
                    </div>
                    <div>
                      <p className="text-xs text-pro-text-secondary font-medium">Test Kredisi</p>
                      <p className="text-2xl font-bold text-[var(--pro-analysis)]">{creditBalance}</p>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card padding="md" variant="elevated" className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
                      <FlaskConical className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-amber-700 font-medium">Test Krediniz Bitti</p>
                      <button
                        onClick={() => router.push("/billing")}
                        className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors flex items-center gap-1 mt-0.5"
                      >
                        Hemen Al →
                      </button>
                    </div>
                  </div>
                </Card>
              )}
              <Card padding="md" variant="elevated">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Send className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-pro-text-secondary font-medium">İşlenmemiş Analizler</p>
                    <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
                  </div>
                </div>
              </Card>
              <Card padding="md" variant="elevated">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-pro-text-secondary font-medium">Tamamlanan</p>
                    <p className="text-2xl font-bold text-green-600">{completedCount}</p>
                  </div>
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
                    {(["all", "pending", "completed"] as Filter[]).map((f) => (
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
                        {f === "all" ? "Tümü" : f === "pending" ? "İşlenmemiş" : "Tamamlanan"}
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
              ) : filtered.length === 0 ? (
                <EmptyState
                  icon={FlaskConical}
                  title={tests.length === 0 ? "Henüz test gönderilmemiş" : "Sonuç bulunamadı"}
                  description={tests.length === 0 ? "Danışanlarınıza test göndererek içgörüler elde edin" : "Farklı bir filtre deneyin"}
                  actionLabel={tests.length === 0 ? "Test Gönder" : undefined}
                  onAction={tests.length === 0 ? () => setShowSendModal(true) : undefined}
                  actionVariant={tests.length === 0 ? "blue" : undefined}
                />
              ) : (
                <div className="space-y-2">
                  {filtered.map((test) => {
                    const s = TEST_STATUSES.find((ts) => ts.id === test.status);
                    const isCompleted = test.status === "completed";
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
                          <Badge variant={s?.color as "success" | "warning" | "info" | "danger" || "muted"} size="sm" dot>
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
                          {isCompleted && (
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
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
