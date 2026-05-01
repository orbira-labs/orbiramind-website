"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, AlertCircle } from "lucide-react";

/**
 * UnsupportedQuestionFallback
 *
 * Backend yeni bir `answer_type` döndürdüğünde (örn. `slider`, `date`) bu
 * client'ın render desteği henüz eklenmemiş olabilir. O durumda:
 *   - Kullanıcı stuck KALMAZ — "Bu soru desteklenmiyor, atla" UI gösterilir.
 *   - `console.warn` ile dev catch için log basılır.
 *   - Atla butonu otomatik next'e götürür.
 *
 * Bu, "Altın Kural #7" ihlali olan deploy sıralamasına karşı son savunma
 * hattıdır. Normalde DB'de yeni answer_type eklemeden önce client release
 * gitmiş olmalı; bu component sıralama bozulduğunda graceful degradation sağlar.
 */
export function UnsupportedQuestionFallback({
  fieldId,
  answerType,
  questionText,
  onSkip,
}: {
  fieldId: string;
  answerType?: string;
  questionText?: string;
  onSkip: () => void;
}) {
  useEffect(() => {
    console.warn(
      `[TestFlow] Unsupported answer_type="${answerType}" for field "${fieldId}". ` +
        "Client may need an update. Skipping with fallback UI.",
    );
  }, [fieldId, answerType]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col items-center justify-center p-6"
    >
      <div className="max-w-md w-full bg-white/90 backdrop-blur rounded-3xl shadow-lg p-8 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-50 flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-amber-500" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Bu soru henüz desteklenmiyor
        </h2>
        {questionText && (
          <p className="text-sm text-gray-500 mb-1 line-clamp-2">{questionText}</p>
        )}
        <p className="text-xs text-gray-400 mb-6">
          Uygulamanız güncellenince doğru şekilde gösterilecek. Şimdilik atlayabilirsiniz.
        </p>
        <button
          onClick={onSkip}
          className="inline-flex items-center gap-2 min-h-[48px] px-6 py-3 bg-[#5B7B6A] text-white rounded-2xl font-semibold hover:bg-[#4A6A59] transition-all active:scale-[0.98] shadow-md shadow-[#5B7B6A]/20 touch-manipulation"
        >
          Atla
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
