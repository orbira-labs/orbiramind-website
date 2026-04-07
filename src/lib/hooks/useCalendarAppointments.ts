"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, format } from "date-fns";
import { createClient } from "@/lib/supabase/client";
import { useProContext } from "@/lib/context";
import type { Appointment } from "@/lib/types";

interface AppointmentWithClient extends Appointment {
  client: { first_name: string; last_name: string } | null;
}

export function useCalendarAppointments(currentMonth: Date) {
  const { professional } = useProContext();
  const supabase = useRef(createClient());
  
  const [appointments, setAppointments] = useState<AppointmentWithClient[]>([]);
  const [loading, setLoading] = useState(true);

  // Date objesini string'e çevir - sadece ay ve yıl değiştiğinde değişecek
  const monthKey = useMemo(() => format(currentMonth, "yyyy-MM"), [currentMonth]);

  const refresh = useCallback(async () => {
    if (!professional?.id) return;
    
    setLoading(true);

    // monthKey'den Date'i yeniden oluştur
    const [year, month] = monthKey.split("-").map(Number);
    const monthDate = new Date(year, month - 1, 1);
    
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const { data } = await supabase.current
      .from("appointments")
      .select("*, client:clients(first_name, last_name)")
      .eq("professional_id", professional.id)
      .gte("starts_at", calendarStart.toISOString())
      .lte("starts_at", calendarEnd.toISOString())
      .order("starts_at", { ascending: true });

    setAppointments((data as AppointmentWithClient[]) || []);
    setLoading(false);
  }, [professional?.id, monthKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { appointments, loading, refresh };
}
