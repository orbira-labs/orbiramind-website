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
  pendingTests: DashboardTest[];
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
  const channelRef = useRef<ReturnType<
    ReturnType<typeof createClient>["channel"]
  > | null>(null);

  const supabase = useRef(createClient());

  // Use initialData directly for initial state to ensure hydration consistency.
  // Cache is only checked after mount when no initialData is provided.
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    DashboardAppointment[]
  >(initialData?.upcomingAppointments ?? []);
  const [pendingTests, setPendingTests] = useState<DashboardTest[]>(
    initialData?.pendingTests ?? []
  );
  const [stats, setStats] = useState<DashboardStats>(
    initialData?.stats ?? DEFAULT_STATS
  );
  const [loading, setLoading] = useState(!initialData);

  const fetchData = useCallback(async () => {
    if (!professional?.id) return;

    const [aptsRes, testsRes, statsRes] = await Promise.all([
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
          "id, token, status, created_at, started_at, completed_at, client:clients(first_name, last_name)"
        )
        .eq("professional_id", professional.id)
        .in("status", ["sent", "started", "completed"])
        .order("created_at", { ascending: false })
        .limit(10),
      supabase.current
        .from("professional_stats")
        .select("active_clients_count, todays_appointments_count, pending_analyses_count")
        .eq("professional_id", professional.id)
        .single(),
    ]);

    const newApts = (aptsRes.data || []).map((a: Record<string, unknown>) => ({
      ...a,
      client: Array.isArray(a.client) ? a.client[0] || null : a.client,
    })) as DashboardAppointment[];

    const COMPLETED_TTL_MS = 5 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    const newTests = ((testsRes.data || []) as Array<Record<string, unknown>>)
      .map((t) => ({
        id: t.id as string,
        token: t.token as string,
        status: t.status as string,
        created_at: t.created_at as string,
        started_at: t.started_at as string | null,
        completed_at: t.completed_at as string | null,
        client: Array.isArray(t.client) 
          ? (t.client[0] as { first_name: string; last_name: string } | null) || null 
          : (t.client as { first_name: string; last_name: string } | null),
      }))
      .filter((t) => {
        if (t.status !== "completed") return true;
        const ref = t.completed_at ?? t.created_at;
        return now - new Date(ref).getTime() < COMPLETED_TTL_MS;
      })
      .sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

    const statsData = statsRes.data as { 
      active_clients_count: number; 
      todays_appointments_count: number; 
      pending_analyses_count: number 
    } | null;

    const newStats: DashboardStats = {
      active_clients: statsData?.active_clients_count ?? 0,
      todays_appointments: statsData?.todays_appointments_count ?? 0,
      pending_analyses: statsData?.pending_analyses_count ?? 0,
    };

    setUpcomingAppointments(newApts);
    setPendingTests(newTests);
    setStats(newStats);
    setLoading(false);

    setCache({
      upcomingAppointments: newApts,
      pendingTests: newTests,
      stats: newStats,
    });
  }, [professional?.id]);

  useEffect(() => {
    if (!professional?.id) return;

    // If initialData was provided (SSR), just refresh in background
    if (initialData) {
      fetchData();
      return;
    }

    // No initialData: try to restore from cache, then fetch fresh data
    const cached = getCache();
    if (cached) {
      setUpcomingAppointments(cached.upcomingAppointments);
      setPendingTests(cached.pendingTests);
      setStats(cached.stats);
      setLoading(false);
    }
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

  return { upcomingAppointments, pendingTests, stats, loading, refresh: fetchData };
}
