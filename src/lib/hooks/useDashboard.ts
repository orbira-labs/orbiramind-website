"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useProContext } from "@/lib/context";

interface DashboardAppointment {
  id: string;
  client_id: string;
  starts_at: string;
  duration_minutes: number;
  note: string | null;
  status: "scheduled" | "completed" | "cancelled";
  client: { first_name: string; last_name: string } | null;
}

interface DashboardTest {
  id: string;
  token: string;
  status: string;
  created_at: string;
  client: { first_name: string; last_name: string } | null;
}

export interface DashboardStats {
  total_clients: number;
  todays_appointments: number;
  remaining_tests: number;
  completed_tests: number;
}

const CACHE_KEY = "pro_dashboard_cache";
const CACHE_TTL = 60_000;

interface CacheData {
  upcomingAppointments: DashboardAppointment[];
  recentTests: DashboardTest[];
  stats: DashboardStats;
  timestamp: number;
}

const DEFAULT_STATS: DashboardStats = {
  total_clients: 0,
  todays_appointments: 0,
  remaining_tests: 0,
  completed_tests: 0,
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

function setCache(data: Omit<CacheData, "timestamp">) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ...data, timestamp: Date.now() }));
  } catch {}
}

export function useDashboard() {
  const { professional } = useProContext();
  const initialCache = useRef<CacheData | null>(null);
  const isMounted = useRef(false);
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>["channel"]> | null>(null);

  if (!isMounted.current && typeof window !== "undefined") {
    initialCache.current = getCache();
  }

  const supabase = useRef(createClient());

  const [upcomingAppointments, setUpcomingAppointments] = useState<DashboardAppointment[]>(
    initialCache.current?.upcomingAppointments ?? []
  );
  const [recentTests, setRecentTests] = useState<DashboardTest[]>(
    initialCache.current?.recentTests ?? []
  );
  const [stats, setStats] = useState<DashboardStats>(
    initialCache.current?.stats ?? DEFAULT_STATS
  );
  const [loading, setLoading] = useState(!initialCache.current);

  const fetchData = useCallback(async () => {
    if (!professional?.id) return;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [aptsRes, testsRes, clientsCountRes, completedCountRes, todayAptsRes, creditRes] =
      await Promise.all([
        supabase.current
          .from("appointments")
          .select("id, client_id, starts_at, duration_minutes, note, status, client:clients(first_name, last_name)")
          .eq("professional_id", professional.id)
          .eq("status", "scheduled")
          .gte("starts_at", new Date().toISOString())
          .order("starts_at", { ascending: true })
          .limit(5),
        supabase.current
          .from("test_invitations")
          .select("id, token, status, created_at, client:clients(first_name, last_name)")
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
          .eq("status", "completed"),
        supabase.current
          .from("appointments")
          .select("id", { count: "exact", head: true })
          .eq("professional_id", professional.id)
          .eq("status", "scheduled")
          .gte("starts_at", todayStart.toISOString())
          .lte("starts_at", todayEnd.toISOString()),
        supabase.current
          .from("credit_balance")
          .select("balance")
          .eq("professional_id", professional.id)
          .maybeSingle(),
      ]);

    const newApts = (aptsRes.data || []).map((a: Record<string, unknown>) => ({
      ...a,
      client: Array.isArray(a.client) ? a.client[0] || null : a.client,
    })) as DashboardAppointment[];

    const newTests = (testsRes.data || []).map((t: Record<string, unknown>) => ({
      ...t,
      client: Array.isArray(t.client) ? t.client[0] || null : t.client,
    })) as DashboardTest[];

    const newStats: DashboardStats = {
      total_clients: clientsCountRes.count ?? 0,
      todays_appointments: todayAptsRes.count ?? 0,
      remaining_tests: (creditRes.data as { balance?: number } | null)?.balance ?? 0,
      completed_tests: completedCountRes.count ?? 0,
    };

    setUpcomingAppointments(newApts);
    setRecentTests(newTests);
    setStats(newStats);
    setLoading(false);

    setCache({ upcomingAppointments: newApts, recentTests: newTests, stats: newStats });
  }, [professional?.id]);

  useEffect(() => {
    isMounted.current = true;
    if (!professional?.id) return;
    if (initialCache.current) setLoading(false);
    fetchData();
  }, [professional?.id, fetchData]);

  useEffect(() => {
    if (!professional?.id) return;

    if (channelRef.current) {
      supabase.current.removeChannel(channelRef.current);
    }

    channelRef.current = supabase.current
      .channel(`dashboard-${professional.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "pro", table: "test_invitations", filter: `professional_id=eq.${professional.id}` },
        () => fetchData()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "pro", table: "appointments", filter: `professional_id=eq.${professional.id}` },
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
