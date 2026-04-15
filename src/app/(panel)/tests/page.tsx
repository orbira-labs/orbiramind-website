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
import { FlaskConical, Eye, Link2, Check, Send, Loader2, ChevronRight, Plus, RefreshCw } from "lucide-react";
import { formatDate, formatRelativeDate, groupByRelativeDate } from "@/lib/utils";
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

      {/* ============================================================
          DESKTOP VIEW - Grid Layout
          ============================================================ */}
      <main className="desktop-only flex-1 p-3 sm:p-5 lg:p-6">
        <div className="mx-auto max-w-6xl">
          <div className="bg-gradient-to-br from-[#5B7B6A]/12 to-[#5B7B6A]/5 rounded-2xl p-2.5 sm:p-3 space-y-3">
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {creditBalance > 0 ? (
                <Card padding="md" variant="elevated">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-xl bg-[var(--pro-analysis-light)] flex items-center justify-center">
                        <FlaskConical className="h-5 w-5 text-[var(--pro-analysis)]" />
                      </div>
                      <p className="text-sm text-pro-text-secondary font-medium">Kalan MindTest</p>
                    </div>
                    <p className="text-3xl font-bold text-[var(--pro-analysis)]">{creditBalance}</p>
                  </div>
                </Card>
              ) : (
                <Card padding="md" variant="elevated" className="bg-gradient-to-br from-[#8B9D83]/10 to-[#8B9D83]/5 border-[#8B9D83]/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-xl bg-[#8B9D83]/20 flex items-center justify-center">
                        <FlaskConical className="h-5 w-5 text-[#6B7D63]" />
                      </div>
                      <p className="text-sm text-[#5B6B53] font-medium">MindTest Krediniz Bitti</p>
                    </div>
                    <button
                      onClick={() => router.push("/billing")}
                      className="text-sm font-semibold text-[#5B7B6A] hover:text-[#4A6A59] transition-colors flex items-center gap-1"
                    >
                      Hemen Al →
                    </button>
                  </div>
                </Card>
              )}
              <Card padding="md" variant="elevated">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-xl bg-[#8B9D83]/15 flex items-center justify-center">
                      <Send className="h-5 w-5 text-[#6B7D63]" />
                    </div>
                    <p className="text-sm text-pro-text-secondary font-medium">Bekleyen Analizler</p>
                  </div>
                  <p className="text-3xl font-bold text-[#6B7D63]">{counts.pending}</p>
                </div>
              </Card>
              <Card padding="md" variant="elevated">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-xl bg-[#5B7B6A]/15 flex items-center justify-center">
                      <Check className="h-5 w-5 text-[#5B7B6A]" />
                    </div>
                    <p className="text-sm text-pro-text-secondary font-medium">Tamamlanan</p>
                  </div>
                  <p className="text-3xl font-bold text-[#5B7B6A]">{counts.completed}</p>
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
                {/* Desktop MindTest Gönder CTA */}
                <button
                  onClick={() => setShowSendModal(true)}
                  disabled={creditBalance <= 0}
                  className={clsx(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                    creditBalance > 0
                      ? "bg-[var(--pro-analysis)] text-white hover:bg-[var(--pro-analysis-hover)] shadow-sm"
                      : "bg-pro-surface-alt text-pro-text-tertiary cursor-not-allowed"
                  )}
                >
                  <Send className="h-4 w-4" />
                  MindTest Gönder
                </button>
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
                        onClick={() => canViewResults && router.push(`/tests/${test.id}`)}
                        className={clsx(
                          "flex items-center gap-3 p-3 rounded-lg bg-pro-surface-alt hover:bg-pro-surface-alt/80 transition-colors",
                          canViewResults && "cursor-pointer"
                        )}
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
                              onClick={(e) => {
                                e.stopPropagation();
                                copyTestLinkById(test.token, test.id);
                              }}
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
                              onClick={(e) => e.stopPropagation()}
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

      {/* ============================================================
          MOBILE VIEW - List Layout
          ============================================================ */}
      <main className="mobile-only flex-1 pb-20">
        {/* Mobile Stats - Horizontal Scroll */}
        <div className="px-4 py-3">
          <div className="mobile-scroll-snap gap-3 pb-2">
            {creditBalance > 0 ? (
              <div className="mobile-stat-card min-w-[140px]">
                <div className="h-10 w-10 rounded-xl bg-[var(--pro-analysis-light)] flex items-center justify-center mb-2">
                  <FlaskConical className="h-5 w-5 text-[var(--pro-analysis)]" />
                </div>
                <p className="text-2xl font-bold text-[var(--pro-analysis)]">{creditBalance}</p>
                <p className="text-xs text-pro-text-secondary">Kalan Test</p>
              </div>
            ) : (
              <button
                onClick={() => router.push("/billing")}
                className="mobile-stat-card min-w-[140px] bg-gradient-to-br from-[#8B9D83]/10 to-[#8B9D83]/5 border-[#8B9D83]/30"
              >
                <div className="h-10 w-10 rounded-xl bg-[#8B9D83]/20 flex items-center justify-center mb-2">
                  <FlaskConical className="h-5 w-5 text-[#6B7D63]" />
                </div>
                <p className="text-xs text-[#5B6B53] font-medium">Kredi Bitti</p>
                <p className="text-xs text-[#5B7B6A] font-semibold mt-1">Al →</p>
              </button>
            )}
            <div className="mobile-stat-card min-w-[120px]">
              <div className="h-10 w-10 rounded-xl bg-[#8B9D83]/15 flex items-center justify-center mb-2">
                <Send className="h-5 w-5 text-[#6B7D63]" />
              </div>
              <p className="text-2xl font-bold text-[#6B7D63]">{counts.pending}</p>
              <p className="text-xs text-pro-text-secondary">Bekleyen</p>
            </div>
            <div className="mobile-stat-card min-w-[120px]">
              <div className="h-10 w-10 rounded-xl bg-[#5B7B6A]/15 flex items-center justify-center mb-2">
                <Check className="h-5 w-5 text-[#5B7B6A]" />
              </div>
              <p className="text-2xl font-bold text-[#5B7B6A]">{counts.completed}</p>
              <p className="text-xs text-pro-text-secondary">Tamamlanan</p>
            </div>
          </div>
        </div>

        {/* Mobile Filter Chips with scroll affordance */}
        <div className="px-4 pb-3 relative">
          <div className="mobile-scroll-snap gap-2 pr-6">
            {(["waiting_analysis", "waiting_client", "completed"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={clsx(
                  "mobile-chip min-h-[36px] px-4",
                  filter === f && "mobile-chip-active"
                )}
              >
                {f === "waiting_analysis" ? "Analiz Hazır" : f === "waiting_client" ? "Bekleyen" : "Tamamlanan"}
              </button>
            ))}
          </div>
          {/* Scroll affordance gradient */}
          <div className="absolute right-4 top-0 bottom-0 w-8 bg-gradient-to-l from-[var(--background)] to-transparent pointer-events-none" />
        </div>

        {/* Mobile List with date grouping */}
        <div className="bg-pro-surface rounded-t-2xl min-h-[60vh]">
          {loading ? (
            <div className="p-4 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="mobile-list-item border-none bg-pro-surface-alt rounded-xl">
                  <Skeleton className="h-11 w-11 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              ))}
            </div>
          ) : tests.length === 0 ? (
            <div className="mobile-empty-state">
              <div className="h-16 w-16 rounded-2xl bg-pro-surface-alt flex items-center justify-center mb-4">
                <FlaskConical className="h-8 w-8 text-pro-text-tertiary" />
              </div>
              <p className="text-base font-semibold text-pro-text mb-1">Sonuç Bulunamadı</p>
              <p className="text-sm text-pro-text-tertiary mb-4">Farklı bir filtre deneyin</p>
              {creditBalance > 0 && (
                <button
                  onClick={() => setShowSendModal(true)}
                  className="mobile-btn bg-[var(--pro-analysis)] text-white max-w-[200px]"
                >
                  <Send className="h-5 w-5" />
                  MindTest Gönder
                </button>
              )}
            </div>
          ) : (
            <div>
              {groupByRelativeDate(tests).map((group) => (
                <div key={group.label}>
                  {/* Date Group Header */}
                  <div className="sticky top-0 bg-pro-surface-alt/95 backdrop-blur-sm px-4 py-2 border-b border-pro-border z-10">
                    <p className="text-xs font-semibold text-pro-text-secondary uppercase tracking-wide">
                      {group.label}
                    </p>
                  </div>
                  <div className="divide-y divide-pro-border">
                    {group.items.map((test) => {
                      const s = TEST_STATUSES.find((ts) => ts.id === test.status);
                      const canViewResults = test.status === "completed" || test.status === "reviewed";
                      const isPending = test.status === "sent" || test.status === "started";
                      const isCopied = copiedTestId === test.id;

                      return (
                        <div
                          key={test.id}
                          onClick={() => canViewResults && router.push(`/tests/${test.id}`)}
                          className={clsx(
                            "mobile-list-item touch-manipulation",
                            canViewResults && "active:bg-pro-surface-alt"
                          )}
                        >
                          <Avatar
                            firstName={test.client?.first_name || "?"}
                            lastName={test.client?.last_name || ""}
                            size="sm"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-pro-text line-clamp-1">
                              {test.client?.first_name} {test.client?.last_name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge variant={s?.color as "success" | "warning" | "info" | "danger" | "accent" || "muted"} size="sm" dot>
                                {s?.label || test.status}
                              </Badge>
                              <span className="text-xs text-pro-text-tertiary">
                                {formatDate(test.created_at)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {isPending && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyTestLinkById(test.token, test.id);
                                }}
                                className={clsx(
                                  "p-2.5 rounded-full touch-target transition-colors",
                                  isCopied
                                    ? "text-pro-success bg-pro-success-light"
                                    : "text-pro-text-tertiary active:bg-pro-surface-alt"
                                )}
                              >
                                {isCopied ? <Check className="h-5 w-5" /> : <Link2 className="h-5 w-5" />}
                              </button>
                            )}
                            {canViewResults && (
                              <div className="p-2.5 touch-target">
                                <Eye className="h-5 w-5 text-[var(--pro-analysis)]" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              
              {/* Load More Button */}
              {hasMore && (
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="w-full py-4 text-sm font-medium text-pro-primary flex items-center justify-center gap-2 disabled:opacity-50 touch-manipulation min-h-[48px]"
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
        </div>

        {/* Mobile FAB - MindTest Gönder */}
        {creditBalance > 0 && (
          <button
            onClick={() => setShowSendModal(true)}
            className="mobile-fab bg-[var(--pro-analysis)] text-white shadow-lg active:scale-95 transition-transform"
            aria-label="MindTest Gönder"
          >
            <Plus className="h-6 w-6" />
          </button>
        )}
      </main>
    </>
  );
}
