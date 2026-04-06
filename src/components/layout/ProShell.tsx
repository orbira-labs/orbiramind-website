"use client";

import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { TrustFooter } from "./TrustFooter";
import { PageDecoration } from "../ui/PageDecoration";
import { ProProvider } from "@/lib/context";
import type { Professional } from "@/lib/types";

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
      <div className="flex min-h-screen bg-[var(--background)] relative">
        <PageDecoration />
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 relative z-[1]">
          {children}
          <TrustFooter showBadges={false} />
          <div className="h-20 lg:hidden" />
        </div>
        <BottomNav />
      </div>
    </ProProvider>
  );
}
