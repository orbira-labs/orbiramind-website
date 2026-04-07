"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useProContext } from "@/lib/context";
import type { Appointment } from "@/lib/types";

interface AppointmentWithClient extends Appointment {
  client: { first_name: string; last_name: string } | null;
}

interface AppointmentCounts {
  upcoming: number;
  past: number;
  total: number;
}

type AppointmentFilter = "upcoming" | "past" | "all";

const PAGE_SIZE = 30;

export function useAppointments(filter: AppointmentFilter = "all") {
  const { professional } = useProContext();
  const supabase = useRef(createClient());
  
  const [appointments, setAppointments] = useState<AppointmentWithClient[]>([]);
  const [counts, setCounts] = useState<AppointmentCounts>({ upcoming: 0, past: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  // useRef ile now'u sabitliyoruz - sadece component mount olduğunda oluşur
  const nowRef = useRef(new Date().toISOString());

  const buildQuery = useCallback((forCount = false) => {
    let query = supabase.current
      .from("appointments")
      .select(forCount ? "id" : "*, client:clients(first_name, last_name)", forCount ? { count: "exact", head: true } : undefined)
      .eq("professional_id", professional?.id || "");

    if (filter === "upcoming") {
      query = query.gte("starts_at", nowRef.current);
    } else if (filter === "past") {
      query = query.lt("starts_at", nowRef.current);
    }

    return query;
  }, [professional?.id, filter]);

  const fetchCounts = useCallback(async () => {
    if (!professional?.id) return;

    const { data } = await supabase.current
      .from("professional_stats")
      .select("upcoming_appointments_count, total_appointments_count")
      .eq("professional_id", professional.id)
      .single();

    const statsData = data as {
      upcoming_appointments_count: number;
      total_appointments_count: number;
    } | null;

    const upcoming = statsData?.upcoming_appointments_count ?? 0;
    const total = statsData?.total_appointments_count ?? 0;

    setCounts({
      upcoming,
      past: total - upcoming,
      total,
    });
  }, [professional?.id]);

  const refresh = useCallback(async () => {
    if (!professional?.id) return;
    
    setLoading(true);
    setPage(0);

    const orderAsc = filter === "upcoming" || filter === "all";

    const [dataRes] = await Promise.all([
      buildQuery()
        .order("starts_at", { ascending: orderAsc })
        .range(0, PAGE_SIZE - 1),
      fetchCounts(),
    ]);

    const newData = (dataRes.data as AppointmentWithClient[]) || [];
    setAppointments(newData);
    setHasMore(newData.length === PAGE_SIZE);
    setLoading(false);
  }, [professional?.id, buildQuery, fetchCounts, filter]);

  const loadMore = useCallback(async () => {
    if (!professional?.id || loadingMore || !hasMore) return;

    setLoadingMore(true);
    const nextPage = page + 1;
    const from = nextPage * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const orderAsc = filter === "upcoming" || filter === "all";

    const { data } = await buildQuery()
      .order("starts_at", { ascending: orderAsc })
      .range(from, to);

    const newData = (data as AppointmentWithClient[]) || [];
    setAppointments((prev) => [...prev, ...newData]);
    setPage(nextPage);
    setHasMore(newData.length === PAGE_SIZE);
    setLoadingMore(false);
  }, [professional?.id, loadingMore, hasMore, page, buildQuery, filter]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { 
    appointments, 
    counts,
    loading, 
    loadingMore,
    hasMore,
    refresh, 
    loadMore,
  };
}
