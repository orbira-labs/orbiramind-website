"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { 
  Eye, 
  Link2, 
  Check, 
  Clock,
  RefreshCw,
  ChevronRight
} from "lucide-react";
import { TEST_STATUSES } from "@/lib/constants";
import { formatDate, formatRelative } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import { clsx } from "clsx";

interface AnalysisCardClient {
  first_name: string;
  last_name: string;
}

interface AnalysisCardProps {
  test: {
    id: string;
    token: string;
    status: string;
    created_at: string;
    started_at?: string | null;
    completed_at?: string | null;
    client: AnalysisCardClient | null;
  };
  onCopyLink?: (token: string) => void;
  onResend?: (testId: string) => void;
  onPreview?: (testId: string) => void;
}

export function AnalysisCard({ test, onCopyLink, onResend, onPreview }: AnalysisCardProps) {
  const [linkCopied, setLinkCopied] = useState(false);

  const statusInfo = TEST_STATUSES.find((s) => s.id === test.status);
  const isCompleted = test.status === "completed";
  const isPending = test.status === "sent" || test.status === "started";
  const isStarted = test.status === "started";

  const handleCopyLink = async () => {
    const link = `${window.location.origin}/t/${test.token}`;
    await navigator.clipboard.writeText(link);
    setLinkCopied(true);
    toast.success("Link kopyalandı!");
    setTimeout(() => setLinkCopied(false), 2000);
    onCopyLink?.(test.token);
  };

  return (
    <>
      {/* ============================================================
          DESKTOP VIEW - Card Layout
          ============================================================ */}
      <Card hover padding="md" className="desktop-only group">
        <div className="flex items-start gap-4">
          <Avatar
            firstName={test.client?.first_name || "?"}
            lastName={test.client?.last_name || ""}
            size="md"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-pro-text">
                  {test.client?.first_name} {test.client?.last_name}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-pro-text-tertiary">
                  <span>{formatDate(test.created_at)}</span>
                </div>
              </div>
              
              <Badge 
                variant={statusInfo?.color as "success" | "warning" | "info" | "danger" || "muted"} 
                dot
              >
                {statusInfo?.label || test.status}
              </Badge>
            </div>

            {isStarted && test.started_at && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-pro-info">
                <Clock className="h-3 w-3" />
                <span>Başlandı: {formatRelative(test.started_at)}</span>
              </div>
            )}

            {isCompleted && test.completed_at && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-pro-success">
                <Check className="h-3 w-3" />
                <span>Tamamlandı: {formatRelative(test.completed_at)}</span>
              </div>
            )}

            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-pro-border">
              {isPending && (
                <>
                  <button
                    onClick={handleCopyLink}
                    className={clsx(
                      "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors",
                      linkCopied
                        ? "text-pro-success bg-pro-success-light"
                        : "text-pro-text-secondary hover:text-[var(--pro-analysis)] hover:bg-[var(--pro-analysis-light)]"
                    )}
                  >
                    {linkCopied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
                    {linkCopied ? "Kopyalandı" : "Link"}
                  </button>
                  
                  {onResend && (
                    <button
                      onClick={() => onResend(test.id)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-pro-text-secondary hover:text-pro-warning hover:bg-pro-warning-light transition-colors"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Hatırlat
                    </button>
                  )}
                </>
              )}
              
              {isCompleted && (
                <>
                  {onPreview && (
                    <button
                      onClick={() => onPreview(test.id)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-pro-text-secondary hover:text-[var(--pro-analysis)] hover:bg-[var(--pro-analysis-light)] transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Önizleme
                    </button>
                  )}
                  
                  <Link
                    href={`/tests/${test.id}`}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--pro-analysis)] hover:bg-[var(--pro-analysis-light)] transition-colors ml-auto"
                  >
                    Raporu Aç
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* ============================================================
          MOBILE VIEW - Compact List Item
          ============================================================ */}
      <div className="mobile-only mobile-list-item touch-manipulation group">
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
            <Badge 
              variant={statusInfo?.color as "success" | "warning" | "info" | "danger" || "muted"} 
              size="sm"
              dot
            >
              {statusInfo?.label || test.status}
            </Badge>
            <span className="text-xs text-pro-text-tertiary">
              {formatDate(test.created_at)}
            </span>
          </div>
          
          {isStarted && test.started_at && (
            <div className="mt-1 flex items-center gap-1 text-xs text-pro-info">
              <Clock className="h-3 w-3" />
              <span>{formatRelative(test.started_at)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          {isPending && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopyLink();
              }}
              className={clsx(
                "p-2 rounded-full touch-target transition-colors",
                linkCopied
                  ? "text-pro-success bg-pro-success-light"
                  : "text-pro-text-tertiary active:bg-pro-surface-alt"
              )}
            >
              {linkCopied ? <Check className="h-5 w-5" /> : <Link2 className="h-5 w-5" />}
            </button>
          )}
          
          {isCompleted && (
            <Link
              href={`/tests/${test.id}`}
              className="p-2 rounded-full text-pro-text-tertiary active:bg-pro-surface-alt touch-target"
            >
              <ChevronRight className="h-5 w-5" />
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
