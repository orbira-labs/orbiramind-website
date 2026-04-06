"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Send, Clock } from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { NotificationCenter, type ProPanelNotification } from "./NotificationCenter";
import { useProContext } from "@/lib/context";
import { useCompletedAnalysisNotifications } from "@/lib/hooks/useCompletedAnalysisNotifications";
import { SendTestModal } from "@/components/tests/SendTestModal";

interface TopBarProps {
  title?: string;
  onTestSent?: () => void;
  showGreeting?: boolean;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Günaydın";
  if (h < 18) return "İyi günler";
  return "İyi akşamlar";
}

function formatTodayDate(): string {
  return new Date().toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    weekday: "long",
  });
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

  const { notifications, markAsRead, markAllAsRead, triggerLoad } = useCompletedAnalysisNotifications();

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
      <header className="h-auto min-h-[64px] border-b border-[#B8CCBE] bg-gradient-to-r from-[#DCE8E0] via-[#E3ECE6] to-[#E8EDE9] flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sticky top-0 z-30">
        {showGreeting ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[#5B7B6A] bg-white/50 px-2.5 py-1 rounded-lg">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-sm font-medium tabular-nums">{currentTime}</span>
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-semibold text-[#3D5A4C]">
                {getGreeting()},{" "}
                <span className="text-[#5B7B6A]">{professional?.first_name || "Hoş geldiniz"}</span>
              </h1>
              <p className="text-xs text-[#6B8F7B]">{formatTodayDate()}</p>
            </div>
          </div>
        ) : (
          <h1 className="text-lg font-semibold text-[#3D5A4C]">{title}</h1>
        )}

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Test Gönder Butonu */}
          <button
            onClick={() => setShowSendModal(true)}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-[var(--pro-analysis)] hover:bg-[var(--pro-analysis-hover)] text-white text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Test Gönder</span>
          </button>

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
