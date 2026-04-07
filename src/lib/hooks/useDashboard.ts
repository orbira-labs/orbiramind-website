"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useProContext } from "@/lib/context";

export interface DashboardAppointment {
  id: string;
  client_id: string;
  starts_at: string;
  duration_minutes: number;
  note: string | null;
  status: "scheduled" | "completed" | "cancelled";
  client: { first_name: string; last_name: string } | null;
}

export interface DashboardTest {
  id: string;
  token: string;
  status: string;
  created_at: string;
  sent_via: "email" | "whatsapp" | "manual";
  started_at: string | null;
  completed_at: string | null;
  client: { first_name: string; last_name: string } | null;
}

export interface DashboardStats {
  active_clients: number;
  todays_appointments: number;
  pending_analyses: number;
}

export interface DashboardInitialData {
  upcomingAppointments: DashboardAppointment[];
  recentTests: DashboardTest[];
  stats: DashboardStats;
}

const CACHE_KEY = "pro_dashboard_cache";
const CACHE_TTL = 60_000;

interface CacheData extends DashboardInitialData {
  timestamp: number;
}

const DEFAULT_STATS: DashboardStats = {
  active_clients: 0,
  todays_appointments: 0,
  pending_analyses: 0,
};

function getCache(): CacheData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as CacheData;
    if (Date.now() - data.timestamp > CACHE_TTL) return null;
    return data;
  } catch {
    return null;
  }
}

function setCache(data: DashboardInitialData) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ ...data, timestamp: Date.now() })
    );
  } catch {}
}

export function useDashboard(initialData?: DashboardInitialData) {
  const { professional } = useProContext();
  const isMounted = useRef(false);
  const channelRef = useRef<ReturnType<
    ReturnType<typeof createClient>["channel"]
  > | null>(null);

  // SSR'dan gelen initialData varsa önce onu kullan,
  // yoksa sessionStorage cache'e bak, yoksa default
  const resolveInitial = (): DashboardInitialData => {
    if (initialData) return initialData;
    if (typeof window !== "undefined") {
      const cached = getCache();
      if (cached) return cached;
    }
    return {
      upcomingAppointments: [],
      recentTests: [],
      stats: DEFAULT_STATS,
    };
  };

  const initial = useRef<DashboardInitialData | null>(null);
  if (!isMounted.current) {
    initial.current = resolveInitial();
  }

  const supabase = useRef(createClient());

  const [upcomingAppointments, setUpcomingAppointments] = useState<
    DashboardAppointment[]
  >(initial.current?.upcomingAppointments ?? []);
  const [recentTests, setRecentTests] = useState<DashboardTest[]>(
    initial.current?.recentTests ?? []
  );
  const [stats, setStats] = useState<DashboardStats>(
    initial.current?.stats ?? DEFAULT_STATS
  );
  // SSR initialData varsa veya cache varsa loading=false ile başla
  const [loading, setLoading] = useState(!initial.current?.stats.active_clients && !initialData);

  const fetchData = useCallback(async () => {
    if (!professional?.id) return;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [
      aptsRes,
      testsRes,
      clientsCountRes,
      pendingAnalysesRes,
      todayAptsRes,
    ] = await Promise.all([
      supabase.current
        .from("appointments")
        .select(
          "id, client_id, starts_at, duration_minutes, note, status, client:clients(first_name, last_name)"
        )
        .eq("professional_id", professional.id)
        .eq("status", "scheduled")
        .gte("starts_at", new Date().toISOString())
        .order("starts_at", { ascending: true })
        .limit(5),
      supabase.current
        .from("test_invitations")
        .select(
          "id, token, status, created_at, sent_via, started_at, completed_at, client:clients(first_name, last_name)"
        )
        .eq("professional_id", professional.id)
        .order("created_at", { ascending: false })
        .limit(5),
      supabase.current
        .from("clients")
        .select("id", { count: "exact", head: true })
        .eq("professional_id", professional.id)
        .eq("status", "active"),
      supabase.current
        .from("test_invitations")
        .select("id", { count: "exact", head: true })
        .eq("professional_id", professional.id)
        .in("status", ["sent", "started"]),
      supabase.current
        .from("appointments")
        .select("id", { count: "exact", head: true })
        .eq("professional_id", professional.id)
        .eq("status", "scheduled")
        .gte("starts_at", todayStart.toISOString())
        .lte("starts_at", todayEnd.toISOString()),
    ]);

    const newApts = (aptsRes.data || []).map((a: Record<string, unknown>) => ({
      ...a,
      client: Array.isArray(a.client) ? a.client[0] || null : a.client,
    })) as DashboardAppointment[];

    const newTests = (testsRes.data || []).map(
      (t: Record<string, unknown>) => ({
        ...t,
        client: Array.isArray(t.client) ? t.client[0] || null : t.client,
      })
    ) as DashboardTest[];

    const newStats: DashboardStats = {
      active_clients: clientsCountRes.count ?? 0,
      todays_appointments: todayAptsRes.count ?? 0,
      pending_analyses: pendingAnalysesRes.count ?? 0,
    };

    setUpcomingAppointments(newApts);
    setRecentTests(newTests);
    setStats(newStats);
    setLoading(false);

    setCache({
      upcomingAppointments: newApts,
      recentTests: newTests,
      stats: newStats,
    });
  }, [professional?.id]);

  useEffect(() => {
    isMounted.current = true;
    if (!professional?.id) return;
    // SSR'dan data geldiyse skeleton gösterme, arka planda güncelle
    if (initialData) {
      setLoading(false);
      fetchData();
      return;
    }
    const cached = getCache();
    if (cached) setLoading(false);
    fetchData();
  }, [professional?.id, fetchData, initialData]);

  useEffect(() => {
    if (!professional?.id) return;

    if (channelRef.current) {
      supabase.current.removeChannel(channelRef.current);
    }

    channelRef.current = supabase.current
      .channel(`dashboard-${professional.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "pro",
          table: "test_invitations",
          filter: `professional_id=eq.${professional.id}`,
        },
        () => fetchData()
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "pro",
          table: "appointments",
          filter: `professional_id=eq.${professional.id}`,
        },
        () => fetchData()
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.current.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [professional?.id, fetchData]);

  return { upcomingAppointments, recentTests, stats, loading, refresh: fetchData };
}
