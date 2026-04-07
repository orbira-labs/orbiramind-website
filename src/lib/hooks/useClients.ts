"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useProContext } from "@/lib/context";
import type { Client } from "@/lib/types";

const DROPDOWN_LIMIT = 100;

export function useClients(searchTerm?: string) {
  const { professional } = useProContext();
  const supabase = useRef(createClient());
  
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);

  const refresh = useCallback(async () => {
    if (!professional?.id) return;
    
    setLoading(true);
    
    let query = supabase.current
      .from("clients")
      .select("*")
      .eq("professional_id", professional.id)
      .eq("status", "active")
      .order("first_name", { ascending: true })
      .limit(DROPDOWN_LIMIT + 1);

    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.trim();
      const likePattern = `%${term}%`;
      query = query.or(
        `first_name.ilike.${likePattern},last_name.ilike.${likePattern}`
      );
    }

    const { data } = await query;

    const newData = data || [];
    const hasMoreData = newData.length > DROPDOWN_LIMIT;
    
    setClients(hasMoreData ? newData.slice(0, DROPDOWN_LIMIT) : newData);
    setHasMore(hasMoreData);
    setLoading(false);
  }, [professional?.id, searchTerm]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { clients, setClients, loading, hasMore, refresh };
}
