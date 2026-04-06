"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useProContext } from "@/lib/context";
import type { Client } from "@/lib/types";

export interface ClientCounts {
  total: number;
  active: number;
  passive: number;
}

interface UseClientsListOptions {
  page: number;
  pageSize: number;
  statusFilter: "all" | "active" | "passive";
  search: string;
}

function sanitizeIlikeTerm(term: string): string {
  return term.replace(/[%_,]/g, "").trim();
}

export function useClientsList({ page, pageSize, statusFilter, search }: UseClientsListOptions) {
  const { professional } = useProContext();
  const supabase = useRef(createClient());

  const [clients, setClients] = useState<Client[]>([]);
  const [counts, setCounts] = useState<ClientCounts>({ total: 0, active: 0, passive: 0 });
  const [totalMatching, setTotalMatching] = useState(0);
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);

  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [search]);

  const fetchCounts = useCallback(async () => {
    if (!professional?.id) return;

    const [totalRes, activeRes, passiveRes] = await Promise.all([
      supabase.current
        .from("clients")
        .select("id", { count: "exact", head: true })
        .eq("professional_id", professional.id),
      supabase.current
        .from("clients")
        .select("id", { count: "exact", head: true })
        .eq("professional_id", professional.id)
        .eq("status", "active"),
      supabase.current
        .from("clients")
        .select("id", { count: "exact", head: true })
        .eq("professional_id", professional.id)
        .in("status", ["passive", "archived"]),
    ]);

    setCounts({
      total: totalRes.count ?? 0,
      active: activeRes.count ?? 0,
      passive: passiveRes.count ?? 0,
    });
  }, [professional?.id]);

  const fetchList = useCallback(async () => {
    if (!professional?.id) return;
    setListLoading(true);

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase.current
      .from("clients")
      .select("*", { count: "exact" })
      .eq("professional_id", professional.id)
      .order("updated_at", { ascending: false })
      .range(from, to);

    if (statusFilter === "active") {
      query = query.eq("status", "active");
    } else if (statusFilter === "passive") {
      query = query.in("status", ["passive", "archived"]);
    }

    if (debouncedSearch) {
      const cleanTerm = sanitizeIlikeTerm(debouncedSearch);
      if (cleanTerm) {
        const likePattern = `%${cleanTerm}%`;
        query = query.or(
          `first_name.ilike.${likePattern},last_name.ilike.${likePattern},email.ilike.${likePattern},phone.ilike.${likePattern}`
        );
      }
    }

    const { data, count } = await query;

    setClients((data as Client[]) || []);
    setTotalMatching(count ?? 0);
    setListLoading(false);
    setLoading(false);
  }, [professional?.id, page, pageSize, statusFilter, debouncedSearch]);

  useEffect(() => {
    fetchCounts();
    fetchList();
  }, [fetchCounts, fetchList]);

  const refresh = useCallback(async () => {
    await Promise.all([fetchCounts(), fetchList()]);
  }, [fetchCounts, fetchList]);

  return { clients, counts, totalMatching, loading, listLoading, refresh, debouncedSearch };
}
