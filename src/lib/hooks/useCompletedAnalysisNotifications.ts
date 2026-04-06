"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useProContext } from "@/lib/context";
import type { ProPanelNotification } from "@/components/layout/NotificationCenter";

const STORAGE_KEY = "pro_analysis_notif_read_ids";

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

interface CompletedRow {
  id: string;
  completed_at: string | null;
  created_at: string;
  client: { first_name: string; last_name: string } | null;
}

export function useCompletedAnalysisNotifications() {
  const { professional } = useProContext();
  const [rows, setRows] = useState<CompletedRow[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(() => loadReadIds());
  const [enabled, setEnabled] = useState(false);
  const supabase = useRef(createClient());
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>["channel"]> | null>(null);

  const triggerLoad = useCallback(() => {
    setEnabled(true);
  }, []);

  const fetchCompleted = useCallback(async () => {
    if (!professional?.id) return;

    const { data } = await supabase.current
      .from("test_invitations")
      .select("id, completed_at, created_at, client:clients(first_name, last_name)")
      .eq("professional_id", professional.id)
      .eq("status", "completed")
      .order("completed_at", { ascending: false })
      .limit(20);

    const mapped = (data || []).map((r: Record<string, unknown>) => ({
      ...r,
      client: Array.isArray(r.client) ? r.client[0] || null : r.client,
    })) as CompletedRow[];

    setRows(mapped);
  }, [professional?.id]);

  useEffect(() => {
    if (!enabled) return;
    fetchCompleted();
  }, [enabled, fetchCompleted]);

  useEffect(() => {
    if (!professional?.id) return;

    if (channelRef.current) {
      supabase.current.removeChannel(channelRef.current);
    }

    channelRef.current = supabase.current
      .channel(`completed-analysis-notif-${professional.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "pro",
          table: "test_invitations",
          filter: `professional_id=eq.${professional.id}`,
        },
        () => fetchCompleted()
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.current.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [professional?.id, fetchCompleted]);

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
      rows.forEach((r) => next.add(`inv-${r.id}`));
      saveReadIds(next);
      return next;
    });
  }, [rows]);

  const notifications: ProPanelNotification[] = useMemo(
    () =>
      rows.map((item) => {
        const id = `inv-${item.id}`;
        const name =
          [item.client?.first_name, item.client?.last_name].filter(Boolean).join(" ") || "Danışan";
        return {
          id,
          type: "analysis_completed" as const,
          title: "Analiz tamamlandı",
          body: `${name} için karakter analizi raporu hazır.`,
          createdAt: item.completed_at ?? item.created_at,
          isRead: readIds.has(id),
          href: `/tests/${item.id}`,
        };
      }),
    [rows, readIds]
  );

  return { notifications, markAsRead, markAllAsRead, triggerLoad };
}
