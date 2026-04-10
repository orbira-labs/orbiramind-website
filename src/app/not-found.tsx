"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-gradient-to-br from-[#5B7B6A] to-[#3D5A4C] shadow-lg mb-6">
            <span className="text-white text-4xl font-bold">O</span>
          </div>
          <h1 className="text-8xl font-bold text-[#1a1a1a] mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-4">
            Sayfa Bulunamadı
          </h2>
          <p className="text-[#666] mb-8">
            Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white rounded-full font-medium hover:bg-[#333] transition-colors"
          >
            <Home className="h-4 w-4" />
            Ana Sayfa
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#eee] text-[#666] rounded-full font-medium hover:border-[#ccc] hover:text-[#1a1a1a] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Geri Dön
          </button>
        </div>
      </div>
    </div>
  );
}
