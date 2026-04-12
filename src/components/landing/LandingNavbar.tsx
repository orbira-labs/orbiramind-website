"use client";

import { useEffect, useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LandingNavbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        router.replace("/dashboard");
      }
    });
  }, [router]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const scrollToSection = useCallback((e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navHeight,
        behavior: "smooth"
      });
      window.history.pushState(null, "", `#${sectionId}`);
    }
  }, []);

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="desktop-only-flex fixed top-0 left-0 right-0 z-50 bg-[#FAFAF8]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-20 flex items-center justify-between w-full">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#5B7B6A] to-[#3D5A4C] flex items-center justify-center shadow-lg shadow-[#5B7B6A]/20">
              <span className="text-white text-xl font-semibold">O</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight"><span className="text-[#1a1a1a]">Orbira</span><span className="text-[#D4856A]">Mind</span></span>
              <span className="text-[10px] text-[#5B7B6A] font-medium -mt-0.5 tracking-wider uppercase">Human Analysis Platform</span>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <a 
              href="#features" 
              onClick={(e) => scrollToSection(e, "features")}
              className="text-sm text-[#666] hover:text-[#1a1a1a] transition-colors"
            >
              Özellikler
            </a>
            <a 
              href="#for-who" 
              onClick={(e) => scrollToSection(e, "for-who")}
              className="text-sm text-[#666] hover:text-[#1a1a1a] transition-colors"
            >
              Kimler İçin
            </a>
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

      {/* Mobile Navbar */}
      <nav className="mobile-only-flex fixed top-0 left-0 right-0 z-50 bg-[#FAFAF8]/80 backdrop-blur-xl">
        <div className="w-full px-4 h-16 flex items-center justify-between">
          {/* Mobile Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#5B7B6A] to-[#3D5A4C] flex items-center justify-center shadow-md shadow-[#5B7B6A]/20">
              <span className="text-white text-base font-semibold">O</span>
            </div>
            <span className="text-base font-semibold tracking-tight">
              <span className="text-[#1a1a1a]">Orbira</span>
              <span className="text-[#D4856A]">Mind</span>
            </span>
          </Link>

          {/* Mobile Right Side */}
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm text-[#666] hover:text-[#1a1a1a] transition-colors px-3 py-1.5"
            >
              Giriş Yap
            </Link>
            
            {/* Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-[#E8E8E4] transition-colors"
              aria-label="Menüyü aç"
            >
              <svg
                className="w-6 h-6 text-[#1a1a1a]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <div
          className={`absolute top-16 left-0 right-0 bg-[#FAFAF8]/95 backdrop-blur-xl border-t border-[#E8E8E4] shadow-lg transition-all duration-300 ease-in-out ${
            mobileMenuOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          <div className="px-4 py-6 flex flex-col gap-4">
            <a
              href="#features"
              onClick={(e) => scrollToSection(e, "features")}
              className="text-base text-[#666] hover:text-[#1a1a1a] transition-colors py-3 border-b border-[#E8E8E4]"
            >
              Özellikler
            </a>
            <a
              href="#for-who"
              onClick={(e) => scrollToSection(e, "for-who")}
              className="text-base text-[#666] hover:text-[#1a1a1a] transition-colors py-3 border-b border-[#E8E8E4]"
            >
              Kimler İçin
            </a>
            <Link
              href="/auth/register"
              className="mt-2 text-center text-sm px-5 py-3 bg-[#1a1a1a] text-white rounded-full hover:bg-[#333] transition-all shadow-lg shadow-black/10"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ücretsiz Başla
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="mobile-only fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
