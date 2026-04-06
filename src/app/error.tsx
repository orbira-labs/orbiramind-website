"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Uygulama hatası:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F9F7] via-white to-[#E8F0EC] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Beklenmedik Bir Hata Oluştu</h1>
        <p className="text-gray-500 text-sm mb-6">
          Sayfa yüklenirken bir sorun oluştu. Lütfen tekrar deneyin.
        </p>
        {error.digest && (
          <p className="text-xs text-gray-300 font-mono mb-6">Hata kodu: {error.digest}</p>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-[#5B7B6A] text-white rounded-2xl font-semibold text-sm hover:bg-[#4A6A59] transition-all active:scale-[0.98] shadow-lg shadow-[#5B7B6A]/20"
          >
            Tekrar Dene
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-3 bg-gray-100 text-gray-600 rounded-2xl font-semibold text-sm hover:bg-gray-200 transition-all active:scale-[0.98]"
          >
            Ana Sayfa
          </button>
        </div>
      </div>
    </div>
  );
}
