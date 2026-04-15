"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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
  showBackButton?: boolean;
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

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Günaydın";
  if (hour < 18) return "İyi günler";
  return "İyi akşamlar";
}

export function TopBar({ title, onTestSent, showGreeting = false, showBackButton = false }: TopBarProps) {
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
      
      <header className="sticky top-0 z-30">
        {/* Desktop Header */}
        <div className="hidden md:flex h-16 border-b border-[#B8CCBE] bg-gradient-to-r from-[#DCE8E0] via-[#E3ECE6] to-[#E8EDE9] items-center justify-between px-6 lg:px-8">
          {showGreeting ? (
            <h1 className="text-lg font-semibold text-[#3D5A4C]">
              {getGreeting()}{professional?.first_name ? `, ${professional.first_name}` : ""}
            </h1>
          ) : (
            <h1 className="text-lg font-semibold text-[#3D5A4C]">{title}</h1>
          )}

          <div className="flex items-center gap-3">
            {showGreeting && (
              <button
                onClick={() => router.push("/clients?new=true")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4856A] hover:bg-[#C97B5D] text-white text-sm font-medium transition-all shadow-sm hover:shadow-md"
              >
                Danışan Kaydet
              </button>
            )}

            <NotificationCenter
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onNotificationClick={handleNotificationClick}
              onOpen={triggerLoad}
              triggerClassName="text-[#6B8F7B] hover:bg-white/60 hover:text-[#3D5A4C]"
            />
          </div>
        </div>

        {/* Mobile Header */}
        <div className="flex md:hidden h-14 border-b border-[#B8CCBE] bg-gradient-to-r from-[#DCE8E0] via-[#E3ECE6] to-[#E8EDE9] items-center justify-between px-4 pt-[env(safe-area-inset-top)]">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {showBackButton && (
              <button
                onClick={() => router.back()}
                className="flex items-center justify-center min-w-[44px] min-h-[44px] -ml-2 rounded-lg text-[#6B8F7B] active:bg-white/60 active:text-[#3D5A4C] transition-colors touch-manipulation"
                aria-label="Geri"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            {showGreeting ? (
              <h1 className="text-base font-semibold text-[#3D5A4C] truncate max-w-[180px]">
                {getGreeting()}{professional?.first_name ? `, ${professional.first_name}` : ""}
              </h1>
            ) : (
              <h1 className="text-base font-semibold text-[#3D5A4C] truncate flex-1">{title}</h1>
            )}
          </div>

          <div className="flex items-center gap-2">
            {showGreeting && (
              <button
                onClick={() => router.push("/clients?new=true")}
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#D4856A] active:bg-[#C97B5D] text-white text-lg font-medium transition-colors"
              >
                +
              </button>
            )}

            <NotificationCenter
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onNotificationClick={handleNotificationClick}
              onOpen={triggerLoad}
              triggerClassName="w-9 h-9 text-[#6B8F7B] active:bg-white/60 active:text-[#3D5A4C]"
            />

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
