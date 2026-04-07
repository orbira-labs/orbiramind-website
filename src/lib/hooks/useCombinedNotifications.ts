"use client";

import { useMemo, useCallback } from "react";
import { useCompletedAnalysisNotifications } from "./useCompletedAnalysisNotifications";
import { useAppointmentReminders } from "./useAppointmentReminders";
import type { ProPanelNotification } from "@/components/layout/NotificationCenter";

export function useCombinedNotifications() {
  const {
    notifications: analysisNotifications,
    markAsRead: markAnalysisAsRead,
    markAllAsRead: markAllAnalysisAsRead,
    triggerLoad,
    showPopup: analysisPopup,
    dismissPopup: dismissAnalysisPopup,
  } = useCompletedAnalysisNotifications();

  const {
    notifications: reminderNotifications,
    markAsRead: markReminderAsRead,
    markAllAsRead: markAllRemindersAsRead,
    showPopup: appointmentPopup,
    dismissPopup: dismissAppointmentPopup,
  } = useAppointmentReminders();

  // Combine and sort notifications by date (most recent first)
  // Appointment reminders should appear at the top since they're time-sensitive
  const notifications: ProPanelNotification[] = useMemo(() => {
    const combined = [...reminderNotifications, ...analysisNotifications];
    
    // Sort: unread first, then by date
    return combined.sort((a, b) => {
      // Unread notifications first
      if (a.isRead !== b.isRead) {
        return a.isRead ? 1 : -1;
      }
      // Then by date (most recent first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [reminderNotifications, analysisNotifications]);

  const markAsRead = useCallback(
    (id: string) => {
      if (id.startsWith("apt-")) {
        markReminderAsRead(id);
      } else {
        markAnalysisAsRead(id);
      }
    },
    [markReminderAsRead, markAnalysisAsRead]
  );

  const markAllAsRead = useCallback(() => {
    markAllRemindersAsRead();
    markAllAnalysisAsRead();
  }, [markAllRemindersAsRead, markAllAnalysisAsRead]);

  return {
    notifications,
    markAsRead,
    markAllAsRead,
    triggerLoad,
    // Appointment popup
    appointmentPopup,
    dismissAppointmentPopup,
    // Analysis popup
    analysisPopup,
    dismissAnalysisPopup,
  };
}
