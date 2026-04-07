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
          <div className="flex items-center gap-2.5 bg-white/35 border border-white/60 rounded-2xl px-3.5 py-2 shadow-sm">
            {/* Date — primary */}
            <div className="flex flex-col leading-none gap-1">
              <span className="text-[10px] font-semibold tracking-widest uppercase text-[#5B7B6A]/70">
                {formatWeekday()}
              </span>
              <span className="text-[15px] font-bold text-[#2D4A3C]">
                {formatDayMonth()}
              </span>
            </div>

            {/* Divider */}
            <div className="self-stretch w-px bg-[#5B7B6A]/20 rounded-full" />

            {/* Time — secondary */}
            <div className="flex flex-col items-center leading-none gap-1">
              <Clock className="h-3 w-3 text-[#5B7B6A]/50" />
              <span className="text-[13px] font-semibold tabular-nums text-[#5B7B6A]">
                {currentTime}
              </span>
            </div>
          </div>
        ) : (
          <h1 className="text-lg font-semibold text-[#3D5A4C]">{title}</h1>
        )}

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Test Gönder Butonu */}
          <button
            onClick={() => setShowSendModal(true)}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-white/50 hover:bg-white/80 border border-white/70 hover:border-white text-[#3D5A4C] text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
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
