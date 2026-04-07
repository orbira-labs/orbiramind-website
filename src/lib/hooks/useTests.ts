"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useProContext } from "@/lib/context";
import type { TestInvitation } from "@/lib/types";

interface TestWithClient extends TestInvitation {
  client: { first_name: string; last_name: string } | null;
}

interface TestCounts {
  total: number;
  pending: number;
  completed: number;
}

type StatusFilter = "all" | "waiting_client" | "waiting_analysis" | "completed";

const PAGE_SIZE = 20;

export function useTests(statusFilter: StatusFilter = "all") {
  const { professional } = useProContext();
  const supabase = useRef(createClient());
  
  const [tests, setTests] = useState<TestWithClient[]>([]);
  const [counts, setCounts] = useState<TestCounts>({ total: 0, pending: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const buildQuery = useCallback((forCount = false) => {
    let query = supabase.current
      .from("test_invitations")
      .select(forCount ? "id" : "*, client:clients(first_name, last_name)", forCount ? { count: "exact", head: true } : undefined)
      .eq("professional_id", professional?.id || "");

    if (statusFilter === "waiting_client") {
      query = query.eq("status", "sent");
    } else if (statusFilter === "waiting_analysis") {
      query = query.in("status", ["started", "completed"]);
    } else if (statusFilter === "completed") {
      query = query.eq("status", "reviewed");
    }

    return query;
  }, [professional?.id, statusFilter]);

  const fetchCounts = useCallback(async () => {
    if (!professional?.id) return;

    const { data } = await supabase.current
      .from("professional_stats")
      .select("pending_analyses_count, completed_analyses_count")
      .eq("professional_id", professional.id)
      .single();

    const statsData = data as {
      pending_analyses_count: number;
      completed_analyses_count: number;
    } | null;

    setCounts({
      total: (statsData?.pending_analyses_count ?? 0) + (statsData?.completed_analyses_count ?? 0),
      pending: statsData?.pending_analyses_count ?? 0,
      completed: statsData?.completed_analyses_count ?? 0,
    });
  }, [professional?.id]);

  const refresh = useCallback(async () => {
    if (!professional?.id) return;
    
    setLoading(true);
    setPage(0);

    const [dataRes] = await Promise.all([
      buildQuery()
        .order("created_at", { ascending: false })
        .range(0, PAGE_SIZE - 1),
      fetchCounts(),
    ]);

    const newData = (dataRes.data as TestWithClient[]) || [];
    setTests(newData);
    setHasMore(newData.length === PAGE_SIZE);
    setLoading(false);
  }, [professional?.id, buildQuery, fetchCounts]);

  const loadMore = useCallback(async () => {
    if (!professional?.id || loadingMore || !hasMore) return;

    setLoadingMore(true);
    const nextPage = page + 1;
    const from = nextPage * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data } = await buildQuery()
      .order("created_at", { ascending: false })
      .range(from, to);

    const newData = (data as TestWithClient[]) || [];
    setTests((prev) => [...prev, ...newData]);
    setPage(nextPage);
    setHasMore(newData.length === PAGE_SIZE);
    setLoadingMore(false);
  }, [professional?.id, loadingMore, hasMore, page, buildQuery]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { 
    tests, 
    counts,
    loading, 
    loadingMore,
    hasMore,
    refresh, 
    loadMore,
  };
}
