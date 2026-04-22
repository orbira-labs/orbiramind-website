import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { LEGAL_LAST_UPDATED } from "@/lib/legal";

export interface LegalSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface LegalPageLayoutProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  intro?: React.ReactNode;
  sections: LegalSection[];
  showBackToHome?: boolean;
  footerNote?: React.ReactNode;
}

export function LegalPageLayout({
  icon: Icon,
  title,
  subtitle,
  intro,
  sections,
  showBackToHome = true,
  footerNote,
}: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {showBackToHome && (
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-pro-text-secondary hover:text-pro-text transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Ana sayfa
          </Link>
        )}

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-pro-primary/10 flex items-center justify-center">
              <Icon className="h-5 w-5 text-pro-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-pro-text">{title}</h1>
              <p className="text-sm text-pro-text-tertiary">
                {subtitle ? `${subtitle} · ` : ""}Son güncelleme: {LEGAL_LAST_UPDATED}
              </p>
            </div>
          </div>
          {intro && (
            <div className="text-[15px] text-pro-text-secondary leading-relaxed">
              {intro}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-pro-surface border border-pro-border rounded-2xl p-6"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-xs font-mono text-pro-text-tertiary bg-pro-surface-alt px-2 py-0.5 rounded-md border border-pro-border shrink-0 mt-0.5">
                  {section.id}
                </span>
                <h2 className="text-base font-semibold text-pro-text">
                  {section.title}
                </h2>
              </div>
              <div className="text-[14px] leading-relaxed pl-9">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-pro-border text-center space-y-3">
          {footerNote}
          <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-2 text-xs text-pro-text-tertiary">
            <Link href="/hakkimizda" className="hover:text-pro-text transition-colors">
              Hakkımızda
            </Link>
            <span>·</span>
            <Link href="/iletisim" className="hover:text-pro-text transition-colors">
              İletişim
            </Link>
            <span>·</span>
            <Link href="/mesafeli-satis-sozlesmesi" className="hover:text-pro-text transition-colors">
              Mesafeli Satış
            </Link>
            <span>·</span>
            <Link href="/iade-iptal" className="hover:text-pro-text transition-colors">
              İade ve İptal
            </Link>
            <span>·</span>
            <Link href="/teslimat" className="hover:text-pro-text transition-colors">
              Teslimat
            </Link>
            <span>·</span>
            <Link href="/kvkk" className="hover:text-pro-text transition-colors">
              KVKK
            </Link>
            <span>·</span>
            <Link href="/cerez-politikasi" className="hover:text-pro-text transition-colors">
              Çerez Politikası
            </Link>
            <span>·</span>
            <Link href="/privacy" className="hover:text-pro-text transition-colors">
              Gizlilik
            </Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-pro-text transition-colors">
              Kullanım Koşulları
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
