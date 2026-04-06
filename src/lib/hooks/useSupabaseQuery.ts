"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface QueryState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useSupabaseQuery<T>(
  queryFn: (supabase: ReturnType<typeof createClient>) => Promise<{ data: T | null; error: unknown }>,
  defaultValue: T
): QueryState<T> {
  const [data, setData] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const result = await queryFn(supabase);
      if (result.error) {
        setError("Veri yüklenemedi");
      } else {
        setData(result.data ?? defaultValue);
      }
    } catch {
      setError("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }, [queryFn, defaultValue]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}
