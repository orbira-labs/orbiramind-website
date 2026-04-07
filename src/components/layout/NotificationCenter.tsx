"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, FileText, Calendar, AlertCircle, Clock, Pin } from "lucide-react";
import { formatRelative } from "@/lib/utils";
import { clsx } from "clsx";

export interface ProPanelNotification {
  id: string;
  type: "analysis_completed" | "appointment_reminder" | "client_inactive" | "system";
  title: string;
  body: string;
  createdAt: string;
  isRead: boolean;
  href?: string;
  isPersistent?: boolean;
}

interface NotificationCenterProps {
  notifications: ProPanelNotification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onNotificationClick?: (notification: ProPanelNotification) => void;
  onOpen?: () => void;
  triggerClassName?: string;
}

const notificationIcons = {
  analysis_completed: FileText,
  appointment_reminder: Calendar,
  client_inactive: AlertCircle,
  system: Bell,
};

const notificationColors = {
  analysis_completed: "bg-[var(--pro-analysis-light)] text-[var(--pro-analysis)]",
  appointment_reminder: "bg-[var(--pro-appointment-light)] text-[var(--pro-appointment)]",
  client_inactive: "bg-[var(--pro-client-light)] text-[var(--pro-client)]",
  system: "bg-pro-info-light text-pro-info",
};

export function NotificationCenter({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onNotificationClick,
  onOpen,
  triggerClassName,
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (notification: ProPanelNotification) => {
    // For persistent notifications (like appointment reminders), 
    // only mark as read when explicitly clicked, don't auto-dismiss
    if (!notification.isRead && !notification.isPersistent) {
      onMarkAsRead?.(notification.id);
    }
    onNotificationClick?.(notification);
    setIsOpen(false);
  };

  const handleMarkAsReadClick = (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    onMarkAsRead?.(notificationId);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          const next = !isOpen;
          setIsOpen(next);
          if (next) onOpen?.();
        }}
        className={clsx(
          "relative p-2 transition-colors",
          triggerClassName ? "rounded-xl" : "rounded-lg",
          triggerClassName
            ? clsx(triggerClassName, isOpen && "bg-white/70 text-[#3D5A4C]")
            : isOpen
              ? "bg-pro-primary-light text-pro-primary"
              : "text-pro-text-secondary hover:text-pro-text hover:bg-pro-surface-alt"
        )}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-pro-danger text-white text-[10px] font-medium flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-pro-surface rounded-2xl shadow-[var(--pro-shadow-elevated)] border border-pro-border overflow-hidden z-50"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-pro-border">
              <h3 className="font-semibold text-pro-text">Bildirimler</h3>
              {unreadCount > 0 && (
                <button onClick={onMarkAllAsRead} className="text-xs text-pro-primary hover:underline">
                  Tümünü okundu işaretle
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-12 text-center">
                  <Bell className="h-8 w-8 text-pro-text-tertiary mx-auto mb-2" />
                  <p className="text-sm text-pro-text-tertiary">Bildirim yok</p>
                </div>
              ) : (
                <div className="divide-y divide-pro-border">
                  {notifications.map((notification) => {
                    const Icon = notificationIcons[notification.type];
                    const colorClass = notificationColors[notification.type];

                    return (
                      <button
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={clsx(
                          "w-full flex items-start gap-3 p-4 text-left transition-colors hover:bg-pro-surface-alt relative",
                          !notification.isRead && "bg-pro-primary-light/20",
                          notification.isPersistent && !notification.isRead && "border-l-4 border-[var(--pro-appointment)]"
                        )}
                      >
                        {/* Persistent indicator */}
                        {notification.isPersistent && !notification.isRead && (
                          <div className="absolute top-2 right-2">
                            <Pin className="h-3 w-3 text-[var(--pro-appointment)]" />
                          </div>
                        )}
                        <div
                          className={clsx(
                            "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
                            colorClass
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={clsx(
                                "text-sm truncate",
                                notification.isRead ? "text-pro-text-secondary" : "text-pro-text font-medium"
                              )}
                            >
                              {notification.title}
                            </p>
                            {!notification.isRead && (
                              <span className="h-2 w-2 rounded-full bg-pro-primary shrink-0 mt-1.5" />
                            )}
                          </div>
                          <p className="text-xs text-pro-text-tertiary mt-0.5 line-clamp-2">{notification.body}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-[10px] text-pro-text-tertiary flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatRelative(notification.createdAt)}
                            </p>
                            {notification.isPersistent && !notification.isRead && (
                              <button
                                onClick={(e) => handleMarkAsReadClick(e, notification.id)}
                                className="text-[10px] text-pro-primary hover:underline"
                              >
                                Okundu
                              </button>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
