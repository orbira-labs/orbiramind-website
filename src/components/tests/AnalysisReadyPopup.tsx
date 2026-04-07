"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, X, Sparkles, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import type { AnalysisCompletedNotification } from "@/lib/hooks/useCompletedAnalysisNotifications";

interface AnalysisReadyPopupProps {
  notification: AnalysisCompletedNotification | null;
  onDismiss: () => void;
}

export function AnalysisReadyPopup({ notification, onDismiss }: AnalysisReadyPopupProps) {
  const router = useRouter();

  useEffect(() => {
    if (notification) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [notification]);

  const handleViewResults = () => {
    if (notification?.href) {
      router.push(notification.href);
    }
    onDismiss();
  };

  return (
    <AnimatePresence>
      {notification && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            onClick={onDismiss}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90%] max-w-md"
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-[var(--pro-analysis)]/20">
              {/* Header with animated sparkles */}
              <div className="bg-gradient-to-r from-[var(--pro-analysis)] to-[#4A8B6E] px-6 py-5 relative overflow-hidden">
                {/* Animated sparkles */}
                <motion.div
                  className="absolute top-2 right-8"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="h-4 w-4 text-white/40" />
                </motion.div>
                <motion.div
                  className="absolute bottom-3 right-16"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  <Sparkles className="h-3 w-3 text-white/30" />
                </motion.div>
                <motion.div
                  className="absolute top-4 right-24"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.9, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  <Sparkles className="h-2 w-2 text-white/50" />
                </motion.div>

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="bg-white/20 rounded-xl p-2.5"
                    >
                      <FileText className="h-6 w-6 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Analiz Hazır!</h3>
                      <p className="text-white/80 text-sm">Rapor incelemeye hazır</p>
                    </div>
                  </div>
                  <button
                    onClick={onDismiss}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-white/70" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Client info */}
                <div className="bg-[var(--pro-analysis-light)]/50 rounded-2xl p-4 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 rounded-full bg-[var(--pro-analysis)] text-white flex items-center justify-center text-lg font-semibold">
                      {notification.clientName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-pro-text">{notification.clientName}</p>
                      <p className="text-sm text-pro-text-secondary">Karakter analizi tamamlandı</p>
                    </div>
                  </div>
                </div>

                {/* Success indicator */}
                <div className="text-center mb-5">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="font-semibold">Rapor hazır</span>
                  </motion.div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={onDismiss}
                    className="flex-1 px-4 py-3 rounded-xl border border-pro-border text-pro-text-secondary font-medium hover:bg-pro-surface-alt transition-colors"
                  >
                    Sonra
                  </button>
                  <button
                    onClick={handleViewResults}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-[var(--pro-analysis)] to-[#4A8B6E] text-white font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Sonuçları Gör
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
