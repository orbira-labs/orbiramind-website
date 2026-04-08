"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LandingNavbar() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        router.replace("/dashboard");
      }
    });
  }, [router]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAF8]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#5B7B6A] to-[#3D5A4C] flex items-center justify-center shadow-lg shadow-[#5B7B6A]/20">
            <span className="text-white text-xl font-semibold">O</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-[#1a1a1a] tracking-tight">OrbiraMind</span>
            <span className="text-[10px] text-[#5B7B6A] font-medium -mt-0.5 tracking-wider uppercase">Wellness Platform</span>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-[#666] hover:text-[#1a1a1a] transition-colors">Özellikler</a>
          <a href="#for-who" className="text-sm text-[#666] hover:text-[#1a1a1a] transition-colors">Kimler İçin</a>
          <a href="#testimonials" className="text-sm text-[#666] hover:text-[#1a1a1a] transition-colors">Referanslar</a>
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm text-[#666] hover:text-[#1a1a1a] transition-colors px-4 py-2"
          >
            Giriş Yap
          </Link>
          <Link
            href="/auth/register"
            className="text-sm px-5 py-2.5 bg-[#1a1a1a] text-white rounded-full hover:bg-[#333] transition-all shadow-lg shadow-black/10"
          >
            Ücretsiz Başla
          </Link>
        </div>
      </div>
    </nav>
  );
}
