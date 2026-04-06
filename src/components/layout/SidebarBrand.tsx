"use client";

import Link from "next/link";

export function SidebarBrand() {
  return (
    <Link href="/dashboard" className="select-none flex items-center gap-1.5">
      <span className="orbira-wordmark-primary">Orbira</span>
      <span className="orbira-wordmark-secondary">Mind</span>
    </Link>
  );
}
