"use client";

import Link from "next/link";

export function SidebarBrand() {
  return (
    <Link href="/dashboard" className="select-none flex items-center gap-1.5 no-underline">
      <span
        className="text-[18px] font-extrabold tracking-tight text-white"
        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.15)" }}
      >
        Orbira
      </span>
      <span className="text-[18px] font-normal tracking-tight text-white/70">
        Mind
      </span>
    </Link>
  );
}
