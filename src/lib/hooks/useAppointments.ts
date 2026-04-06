"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useProContext } from "@/lib/context";
import type { Appointment } from "@/lib/types";

interface AppointmentWithClient extends Appointment {
  client: { first_name: string; last_name: string } | null;
}

const CACHE_KEY = "pro_appointments_cache";
const CACHE_TTL = 60_000;

function getCache(): { data: AppointmentWithClient[]; timestamp: number } | null {
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

function setCache(data: AppointmentWithClient[]) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {}
}

export function useAppointments() {
  const { professional } = useProContext();
  const initialCache = useRef(getCache());
  
  const [appointments, setAppointments] = useState<AppointmentWithClient[]>(initialCache.current?.data ?? []);
  const [loading, setLoading] = useState(!initialCache.current);

  const refresh = useCallback(async () => {
    if (!professional?.id) return;
    
    const supabase = createClient();
    const { data } = await supabase
      .from("appointments")
      .select("*, client:clients(first_name, last_name)")
      .eq("professional_id", professional.id)
      .order("starts_at", { ascending: true });

    const newData = (data as AppointmentWithClient[]) || [];
    setAppointments(newData);
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

  return { appointments, loading, refresh };
}
