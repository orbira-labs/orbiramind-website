"use client";

import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { 
  TrendingUp, 
  TrendingDown, 
  ChevronRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";

interface ReportPreviewData {
  testId: string;
  clientName: string;
  clientFirstName: string;
  clientLastName: string;
  completedAt: string;
  wellnessScore?: number;
  topStrengths?: string[];
  topRisks?: string[];
}

interface ReportPreviewModalProps {
  open: boolean;
  onClose: () => void;
  data: ReportPreviewData | null;
}

function ScoreGauge({ score }: { score: number }) {
  const percentage = Math.min(100, Math.max(0, score));
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const getScoreColor = (s: number) => {
    if (s >= 70) return "#27AE60";
    if (s >= 40) return "#F39C12";
    return "#E74C3C";
  };

  return (
    <div className="relative w-28 h-28">
      <svg className="w-full h-full -rotate-90">
        <circle
          cx="56"
          cy="56"
          r="45"
          fill="none"
          stroke="#E5E0DB"
          strokeWidth="8"
        />
        <circle
          cx="56"
          cy="56"
          r="45"
          fill="none"
          stroke={getScoreColor(score)}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-pro-text">{score}</span>
        <span className="text-[10px] text-pro-text-tertiary uppercase tracking-wide">Skor</span>
      </div>
    </div>
  );
}

export function ReportPreviewModal({ open, onClose, data }: ReportPreviewModalProps) {
  if (!data) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Rapor Önizleme"
      size="md"
    >
      <div className="space-y-5">
        <div className="flex items-center gap-4 p-4 bg-pro-surface-alt rounded-xl">
          <Avatar
            firstName={data.clientFirstName}
            lastName={data.clientLastName}
            size="lg"
          />
          <div className="flex-1">
            <p className="font-semibold text-pro-text">{data.clientName}</p>
            <p className="text-xs text-pro-text-tertiary mt-0.5">
              Tamamlanma: {new Date(data.completedAt).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric"
              })}
            </p>
          </div>
          {data.wellnessScore !== undefined && (
            <ScoreGauge score={data.wellnessScore} />
          )}
        </div>

        {data.topStrengths && data.topStrengths.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-pro-success" />
              <span className="text-sm font-medium text-pro-text">Güçlü Yönler</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.topStrengths.slice(0, 3).map((strength, i) => (
                <Badge key={i} variant="success" size="sm">
                  {strength}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {data.topRisks && data.topRisks.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-pro-warning" />
              <span className="text-sm font-medium text-pro-text">Dikkat Alanları</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.topRisks.slice(0, 3).map((risk, i) => (
                <Badge key={i} variant="warning" size="sm">
                  {risk}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 bg-pro-primary-light/50 rounded-xl border border-pro-primary/10">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-pro-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-pro-text">AI Özeti</p>
              <p className="text-xs text-pro-text-secondary mt-1 leading-relaxed">
                Detaylı karakter analizi, güçlü/zayıf yönler, kör noktalar ve 
                koçluk yol haritası için tam rapora göz atın.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Kapat
          </Button>
          <Link href={`/tests/${data.testId}`} className="flex-1">
            <Button className="w-full">
              Tam Raporu Aç
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Modal>
  );
}
