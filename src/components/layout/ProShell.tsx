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
      <div className="flex h-screen overflow-hidden bg-[var(--background)] relative">
        <PageDecoration />
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 relative z-[1] overflow-y-auto">
          {children}
          <TrustFooter showBadges={false} showDate={true} />
          <div className="h-20 lg:hidden" />
        </div>
        <BottomNav />
      </div>
    </ProProvider>
  );
}
