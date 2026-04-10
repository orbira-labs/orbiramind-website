"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useProContext } from "@/lib/context";
import type { ProPanelNotification } from "@/components/layout/NotificationCenter";

const STORAGE_KEY = "pro_appointment_reminder_read_ids";
const DISMISSED_POPUP_KEY = "pro_appointment_popup_dismissed";

interface AppointmentRow {
  id: string;
  starts_at: string;
  client: { first_name: string; last_name: string } | null;
  note: string | null;
}

export interface ReminderNotification extends ProPanelNotification {
  appointmentId: string;
  startsAt: Date;
  minutesUntil: number;
  clientName: string;
  isPersistent: boolean;
}

function loadReadIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function saveReadIds(ids: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {}
}

function loadDismissedPopups(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(DISMISSED_POPUP_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function saveDismissedPopups(ids: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DISMISSED_POPUP_KEY, JSON.stringify([...ids]));
  } catch {}
}

export function useAppointmentReminders() {
  const { professional } = useProContext();
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(() => loadReadIds());
  const [dismissedPopups, setDismissedPopups] = useState<Set<string>>(() => loadDismissedPopups());
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [showPopup, setShowPopup] = useState<ReminderNotification | null>(null);
  const [soundPlayed, setSoundPlayed] = useState<Set<string>>(new Set());
  
  const supabase = useRef(createClient());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>["channel"]> | null>(null);

  // Update current time every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const userInteractedRef = useRef(false);

  // Initialize audio element and track user interaction for Chrome autoplay policy
  useEffect(() => {
    if (typeof window === "undefined") return;

    audioRef.current = new Audio("/sounds/notification.mp3");
    audioRef.current.volume = 0.5;

    const markInteracted = () => {
      userInteractedRef.current = true;
    };
    document.addEventListener("click", markInteracted, { once: true });
    document.addEventListener("keydown", markInteracted, { once: true });

    return () => {
      document.removeEventListener("click", markInteracted);
      document.removeEventListener("keydown", markInteracted);
    };
  }, []);

  const fetchUpcomingAppointments = useCallback(async () => {
    if (!professional?.id) return;

    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    const { data } = await supabase.current
      .from("appointments")
      .select("id, starts_at, note, client:clients(first_name, last_name)")
      .eq("professional_id", professional.id)
      .eq("status", "scheduled")
      .gte("starts_at", now.toISOString())
      .lte("starts_at", twoHoursLater.toISOString())
      .order("starts_at", { ascending: true });

    const mapped = (data || []).map((r: Record<string, unknown>) => ({
      ...r,
      client: Array.isArray(r.client) ? r.client[0] || null : r.client,
    })) as AppointmentRow[];

    setAppointments(mapped);
  }, [professional?.id]);

  // Fetch appointments on mount and set up realtime subscription
  useEffect(() => {
    if (!professional?.id) return;

    fetchUpcomingAppointments();

    // Refresh every minute
    const interval = setInterval(fetchUpcomingAppointments, 60000);

    // Set up realtime subscription
    if (channelRef.current) {
      supabase.current.removeChannel(channelRef.current);
    }

    channelRef.current = supabase.current
      .channel(`appointment-reminders-${professional.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "pro",
          table: "appointments",
          filter: `professional_id=eq.${professional.id}`,
        },
        () => fetchUpcomingAppointments()
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      if (channelRef.current) {
        supabase.current.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [professional?.id, fetchUpcomingAppointments]);

  const playSound = useCallback(() => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {
      if (!userInteractedRef.current) {
        const retryOnInteraction = () => {
          audioRef.current?.play().catch(() => {});
        };
        document.addEventListener("click", retryOnInteraction, { once: true });
      }
    });
  }, []);

  // Generate notifications for appointments
  const reminderNotifications: ReminderNotification[] = useMemo(() => {
    const now = currentTime.getTime();
    const notifications: ReminderNotification[] = [];

    appointments.forEach((apt) => {
      const startsAt = new Date(apt.starts_at);
      const minutesUntil = Math.floor((startsAt.getTime() - now) / 60000);
      const clientName = [apt.client?.first_name, apt.client?.last_name].filter(Boolean).join(" ") || "Danışan";

      // 30 minutes reminder
      if (minutesUntil <= 30 && minutesUntil > 15) {
        const id = `apt-30-${apt.id}`;
        notifications.push({
          id,
          appointmentId: apt.id,
          type: "appointment_reminder",
          title: "Randevu Hatırlatması",
          body: `${clientName} ile randevunuza 30 dakika kaldı`,
          createdAt: new Date().toISOString(),
          isRead: readIds.has(id),
          href: "/appointments",
          startsAt,
          minutesUntil,
          clientName,
          isPersistent: true,
        });
      }

      // 15 minutes reminder
      if (minutesUntil <= 15 && minutesUntil > 0) {
        const id = `apt-15-${apt.id}`;
        notifications.push({
          id,
          appointmentId: apt.id,
          type: "appointment_reminder",
          title: "Randevu Yaklaşıyor!",
          body: `${clientName} ile randevunuza ${minutesUntil} dakika kaldı`,
          createdAt: new Date().toISOString(),
          isRead: readIds.has(id),
          href: "/appointments",
          startsAt,
          minutesUntil,
          clientName,
          isPersistent: true,
        });
      }
    });

    return notifications;
  }, [appointments, currentTime, readIds]);

  // Handle 15-minute popup and sound
  useEffect(() => {
    const now = currentTime.getTime();

    appointments.forEach((apt) => {
      const startsAt = new Date(apt.starts_at);
      const minutesUntil = Math.floor((startsAt.getTime() - now) / 60000);
      const clientName = [apt.client?.first_name, apt.client?.last_name].filter(Boolean).join(" ") || "Danışan";
      const popupKey = `popup-15-${apt.id}`;
      const soundKey = `sound-15-${apt.id}`;

      // Show popup and play sound at 15 minutes
      if (minutesUntil <= 15 && minutesUntil > 14 && !dismissedPopups.has(popupKey)) {
        const notification: ReminderNotification = {
          id: `apt-15-${apt.id}`,
          appointmentId: apt.id,
          type: "appointment_reminder",
          title: "Randevu Yaklaşıyor!",
          body: `${clientName} ile randevunuza 15 dakika kaldı`,
          createdAt: new Date().toISOString(),
          isRead: false,
          href: "/appointments",
          startsAt,
          minutesUntil,
          clientName,
          isPersistent: true,
        };
        setShowPopup(notification);

        // Play sound only once
        if (!soundPlayed.has(soundKey)) {
          playSound();
          setSoundPlayed((prev) => new Set([...prev, soundKey]));
        }
      }
    });
  }, [appointments, currentTime, dismissedPopups, soundPlayed, playSound]);

  const markAsRead = useCallback((notificationId: string) => {
    setReadIds((prev) => {
      if (prev.has(notificationId)) return prev;
      const next = new Set(prev);
      next.add(notificationId);
      saveReadIds(next);
      return next;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setReadIds((prev) => {
      const next = new Set(prev);
      reminderNotifications.forEach((n) => next.add(n.id));
      saveReadIds(next);
      return next;
    });
  }, [reminderNotifications]);

  const dismissPopup = useCallback(() => {
    if (showPopup) {
      const popupKey = `popup-15-${showPopup.appointmentId}`;
      setDismissedPopups((prev) => {
        const next = new Set(prev);
        next.add(popupKey);
        saveDismissedPopups(next);
        return next;
      });
      setShowPopup(null);
    }
  }, [showPopup]);

  // Clear old dismissed popups (older than 24 hours - stored keys are date-specific)
  useEffect(() => {
    const cleanup = () => {
      // Clean up old sound played entries
      setSoundPlayed(new Set());
      
      // Clean up old dismissed popups (they're appointment-specific so no date cleanup needed)
    };

    // Run cleanup on mount
    cleanup();
  }, []);

  return {
    notifications: reminderNotifications,
    markAsRead,
    markAllAsRead,
    showPopup,
    dismissPopup,
    playSound,
  };
}
