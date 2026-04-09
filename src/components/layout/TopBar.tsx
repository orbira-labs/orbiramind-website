"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Send, Clock } from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { NotificationCenter, type ProPanelNotification } from "./NotificationCenter";
import { useProContext } from "@/lib/context";
import { useCombinedNotifications } from "@/lib/hooks/useCombinedNotifications";
import { SendTestModal } from "@/components/tests/SendTestModal";
import { AppointmentReminderPopup } from "@/components/appointments/AppointmentReminderPopup";
import { AnalysisReadyPopup } from "@/components/tests/AnalysisReadyPopup";

interface TopBarProps {
  title?: string;
  onTestSent?: () => void;
  showGreeting?: boolean;
}

function formatWeekday(): string {
  const s = new Date().toLocaleDateString("tr-TR", { weekday: "long" });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatDayMonth(): string {
  return new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long" });
}

function formatTime(): string {
  return new Date().toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function TopBar({ title, onTestSent, showGreeting = false }: TopBarProps) {
  const { professional } = useProContext();
  const router = useRouter();
  const [showSendModal, setShowSendModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(formatTime());

  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    triggerLoad, 
    appointmentPopup, 
    dismissAppointmentPopup,
    analysisPopup,
    dismissAnalysisPopup,
  } = useCombinedNotifications();

  useEffect(() => {
    if (!showGreeting) return;
    const interval = setInterval(() => {
      setCurrentTime(formatTime());
    }, 60000);
    return () => clearInterval(interval);
  }, [showGreeting]);

  const handleTestSent = () => {
    onTestSent?.();
  };

  const handleNotificationClick = useCallback(
    (n: ProPanelNotification) => {
      if (n.href) {
        router.push(n.href);
      }
    },
    [router]
  );

  return (
    <>
      <SendTestModal open={showSendModal} onClose={() => setShowSendModal(false)} onSent={handleTestSent} />
      <AppointmentReminderPopup notification={appointmentPopup} onDismiss={dismissAppointmentPopup} />
      <AnalysisReadyPopup notification={analysisPopup} onDismiss={dismissAnalysisPopup} />
      <header className="h-auto min-h-[64px] border-b border-[#B8CCBE] bg-gradient-to-r from-[#DCE8E0] via-[#E3ECE6] to-[#E8EDE9] flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sticky top-0 z-30">
        {showGreeting ? (
          <h1 className="text-lg font-semibold text-[#3D5A4C]">Ofisim</h1>
        ) : (
          <h1 className="text-lg font-semibold text-[#3D5A4C]">{title}</h1>
        )}

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Danışan Kaydet button - only on dashboard */}
          {showGreeting && (
            <button
              onClick={() => router.push("/clients?new=true")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4856A] hover:bg-[#C97B5D] text-white text-sm font-medium transition-all shadow-sm hover:shadow-md"
            >
              <span className="hidden sm:inline">Danışan Kaydet</span>
              <span className="sm:hidden">+</span>
            </button>
          )}

          {/* Bildirimler */}
          <NotificationCenter
            notifications={notifications}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
            onNotificationClick={handleNotificationClick}
            onOpen={triggerLoad}
            triggerClassName="text-[#6B8F7B] hover:bg-white/60 hover:text-[#3D5A4C]"
          />

          {/* Mobil Avatar */}
          <div className="lg:hidden">
            <Avatar
              firstName={professional?.first_name || "U"}
              lastName={professional?.last_name || ""}
              src={professional?.avatar_url}
              size="sm"
            />
          </div>
        </div>
      </header>
    </>
  );
}
