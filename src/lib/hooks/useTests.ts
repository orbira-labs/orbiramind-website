"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useProContext } from "@/lib/context";
import type { TestInvitation } from "@/lib/types";

interface TestWithClient extends TestInvitation {
  client: { first_name: string; last_name: string } | null;
}

const CACHE_KEY = "pro_tests_cache";
const CACHE_TTL = 60_000;

function getCache(): { data: TestWithClient[]; timestamp: number } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw);
    if (Date.now() - cached.timestamp > CACHE_TTL) return null;
    return cached;
  } catch {
    return null;
  }
}

function setCache(data: TestWithClient[]) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {}
}

export function useTests() {
  const { professional } = useProContext();
  const initialCache = useRef(getCache());
  const supabase = useRef(createClient());
  
  const [tests, setTests] = useState<TestWithClient[]>(initialCache.current?.data ?? []);
  const [loading, setLoading] = useState(!initialCache.current);

  const refresh = useCallback(async () => {
    if (!professional?.id) return;
    
    const { data } = await supabase.current
      .from("test_invitations")
      .select("*, client:clients(first_name, last_name)")
      .eq("professional_id", professional.id)
      .order("created_at", { ascending: false });

    const newData = (data as TestWithClient[]) || [];
    setTests(newData);
    setLoading(false);
    setCache(newData);
  }, [professional?.id]);

  useEffect(() => {
    if (!professional?.id) return;
    
    if (initialCache.current) {
      setLoading(false);
    }
    refresh();
  }, [professional?.id, refresh]);

  const completedCount = tests.filter((t) => t.status === "completed").length;

  return { tests, loading, refresh, completedCount };
}
