"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, X, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReminderNotification } from "@/lib/hooks/useAppointmentReminders";

interface AppointmentReminderPopupProps {
  notification: ReminderNotification | null;
  onDismiss: () => void;
}

export function AppointmentReminderPopup({ notification, onDismiss }: AppointmentReminderPopupProps) {
  const router = useRouter();

  // Prevent body scroll when popup is open
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

  const handleGoToAppointment = () => {
    router.push("/appointments");
    onDismiss();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
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
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-[var(--pro-appointment)]/20">
              {/* Header with animated bell */}
              <div className="bg-gradient-to-r from-[var(--pro-appointment)] to-[var(--pro-appointment-hover)] px-6 py-5 relative overflow-hidden">
                {/* Animated rings */}
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-white/20"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-white/30"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                />

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: [-10, 10, -10] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="bg-white/20 rounded-xl p-2.5"
                    >
                      <Bell className="h-6 w-6 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Randevu Hatırlatması</h3>
                      <p className="text-white/80 text-sm">15 dakika kaldı!</p>
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
                <div className="bg-[var(--pro-appointment-light)]/50 rounded-2xl p-4 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 rounded-full bg-[var(--pro-appointment)] text-white flex items-center justify-center text-lg font-semibold">
                      {notification.clientName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-pro-text">{notification.clientName}</p>
                      <p className="text-sm text-pro-text-secondary">ile randevunuz var</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-pro-text-secondary">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">{formatTime(notification.startsAt)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-pro-text-secondary">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {notification.startsAt.toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "long",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Countdown */}
                <div className="text-center mb-5">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="font-semibold">
                      {notification.minutesUntil} dakika kaldı
                    </span>
                  </motion.div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={onDismiss}
                    className="flex-1 px-4 py-3 rounded-xl border border-pro-border text-pro-text-secondary font-medium hover:bg-pro-surface-alt transition-colors"
                  >
                    Kapat
                  </button>
                  <button
                    onClick={handleGoToAppointment}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-[var(--pro-appointment)] to-[var(--pro-appointment-hover)] text-white font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    Randevuya Git
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
