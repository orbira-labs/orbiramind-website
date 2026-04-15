"use client";

import dynamic from "next/dynamic";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { TrustFooter } from "./TrustFooter";
import { ProProvider } from "@/lib/context";
import type { Professional } from "@/lib/types";

const PageDecoration = dynamic(
  () => import("../ui/PageDecoration").then((m) => m.PageDecoration),
  { ssr: false }
);

interface ProShellProps {
  children: React.ReactNode;
  initialProfessional: Professional;
  initialCredits: number;
}

export function ProShell({
  children,
  initialProfessional,
  initialCredits,
}: ProShellProps) {
  return (
    <ProProvider initialProfessional={initialProfessional} initialCredits={initialCredits}>
      {/* Desktop: fixed height with internal scroll */}
      {/* Mobile: natural document flow with proper scroll */}
      <div className="flex min-h-[100dvh] lg:h-screen lg:overflow-hidden bg-[var(--background)] relative">
        <PageDecoration />
        <Sidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 relative z-[1] lg:overflow-y-auto lg:overscroll-contain">
          {/* Mobile safe-area top padding handled by TopBar */}
          {children}
          <TrustFooter showBadges={false} showDate={true} />
          
          {/* Mobile bottom spacer for BottomNav + safe area */}
          <div className="h-20 pb-[env(safe-area-inset-bottom)] lg:hidden" />
        </div>
        
        <BottomNav />
      </div>
    </ProProvider>
  );
}
