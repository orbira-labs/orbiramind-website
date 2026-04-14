"use client";

interface AnalysisSubmittedProps {
  state?: "submitting" | "processing";
}

export function AnalysisSubmitted({
  state = "processing",
}: AnalysisSubmittedProps) {
  const isSubmitting = state === "submitting";

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-[#F5F9F7] via-white to-[#E8F0EC] flex items-center justify-center p-4 pb-safe">
      <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-[#5B7B6A] to-[#4A6A59] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#5B7B6A]/25">
          {isSubmitting ? (
            <div className="w-9 h-9 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          {isSubmitting ? "Yanıtlarınız gönderiliyor..." : "Yanıtlarınız alındı"}
        </h1>

        <p className="text-gray-600 mb-2">
          {isSubmitting
            ? "İsteğiniz arka planda işlenmek üzere iletiliyor."
            : "Raporunuz arka planda hazırlanıyor."}
        </p>

        <p className="text-sm text-gray-500">
          Bu pencereyi şimdi kapatabilirsiniz. Sonuçlar uzmanınızla
          paylaşılacaktır.
        </p>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-300 font-medium tracking-wider uppercase">
            Powered by Orbira
          </p>
        </div>
      </div>
    </div>
  );
}
