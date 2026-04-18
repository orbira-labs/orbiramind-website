"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useProContext } from "@/lib/context";
import type { Client } from "@/lib/types";

export interface ClientCounts {
  total: number;
  active: number;
  passive: number;
}

export interface ClientAnalysisInfo {
  status: "pending" | "completed" | "none";
  lastCompletedAt?: string;
  pendingCount?: number;
}

export interface ClientAppointmentInfo {
  hasUpcoming: boolean;
  nextDate?: string;
}

/**
 * Tier-aware klinik aciliyet ozeti. hae.analysis_snapshots'tan en son
 * snapshot'in tier ve pattern sayilari. `unknown` = klinik tier eklenmeden
 * once olusturulmus eski snapshot; pattern listelemesi var ama tier yok.
 */
export type ClientTier = "critical" | "high" | "moderate" | "low" | "contextual" | "unknown";

export interface ClientTierInfo {
  maxTier: ClientTier;
  criticalPatternCount: number;
  highPatternCount: number;
  lastAnalysisAt: string;
}

export interface ClientWithExtras extends Client {
  analysisInfo?: ClientAnalysisInfo;
  appointmentInfo?: ClientAppointmentInfo;
  tierInfo?: ClientTierInfo;
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

  const [clients, setClients] = useState<ClientWithExtras[]>([]);
  const [counts, setCounts] = useState<ClientCounts>({ total: 0, active: 0, passive: 0 });
  const [totalMatching, setTotalMatching] = useState(0);
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);

  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>["channel"]> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userInteractedRef = useRef(false);
  const knownClientIds = useRef<Set<string>>(new Set());
  const initialLoadDone = useRef(false);

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [search]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    audioRef.current = new Audio("/sounds/notification.mp3");
    audioRef.current.volume = 0.5;

    const markInteracted = () => {
      userInteractedRef.current = true;
    };
    document.addEventListener("click", markInteracted, { once: true });
    document.addEventListener("keydown", markInteracted, { once: true });

    return () => {
      document.removeEventListener("click", markInteracted);
      document.removeEventListener("keydown", markInteracted);
    };
  }, []);

  const playSound = useCallback(() => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {
      if (!userInteractedRef.current) {
        const retryOnInteraction = () => {
          audioRef.current?.play().catch(() => {});
        };
        document.addEventListener("click", retryOnInteraction, { once: true });
      }
    });
  }, []);

  const fetchCounts = useCallback(async () => {
    if (!professional?.id) return;

    try {
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

      if (totalRes.error || activeRes.error || passiveRes.error) {
        console.error("Danışan sayıları alınamadı:", totalRes.error ?? activeRes.error ?? passiveRes.error);
        return;
      }

      setCounts({
        total: totalRes.count ?? 0,
        active: activeRes.count ?? 0,
        passive: passiveRes.count ?? 0,
      });
    } catch (err) {
      console.error("fetchCounts beklenmedik hata:", err);
    }
  }, [professional?.id]);

  const fetchList = useCallback(async () => {
    if (!professional?.id) return;
    setListLoading(true);

    try {
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

      const { data, count, error } = await query;

      if (error) {
        console.error("Danışan listesi alınamadı:", error);
        setListLoading(false);
        setLoading(false);
        return;
      }

      const clientList = (data as Client[]) || [];
      
      if (clientList.length > 0) {
        const clientIds = clientList.map(c => c.id);
        
        const [testsRes, appointmentsRes, tierRes] = await Promise.all([
          supabase.current
            .from("test_invitations")
            .select("client_id, status, completed_at")
            .in("client_id", clientIds)
            .order("completed_at", { ascending: false }),
          supabase.current
            .from("appointments")
            .select("client_id, starts_at")
            .in("client_id", clientIds)
            .eq("status", "scheduled")
            .gte("starts_at", new Date().toISOString())
            .order("starts_at", { ascending: true }),
          supabase.current.rpc("get_client_tier_summary", {
            p_client_ids: clientIds,
          }),
        ]);

        const testsByClient = new Map<string, { completed: string | null; pending: number }>();
        const appointmentsByClient = new Map<string, string>();
        const tierByClient = new Map<string, ClientTierInfo>();

        type TierRow = {
          client_id: string;
          max_tier: string | null;
          critical_pattern_count: number | null;
          high_pattern_count: number | null;
          last_analysis_at: string;
        };
        ((tierRes.data as TierRow[] | null) ?? []).forEach((row) => {
          const tierValue = (row.max_tier ?? "unknown") as ClientTier;
          tierByClient.set(row.client_id, {
            maxTier: tierValue,
            criticalPatternCount: row.critical_pattern_count ?? 0,
            highPatternCount: row.high_pattern_count ?? 0,
            lastAnalysisAt: row.last_analysis_at,
          });
        });

        (testsRes.data || []).forEach((t: { client_id: string; status: string; completed_at: string | null }) => {
          const existing = testsByClient.get(t.client_id) || { completed: null, pending: 0 };
          if (t.status === "completed" && t.completed_at && !existing.completed) {
            existing.completed = t.completed_at;
          }
          if (t.status === "sent" || t.status === "started") {
            existing.pending += 1;
          }
          testsByClient.set(t.client_id, existing);
        });

        (appointmentsRes.data || []).forEach((a: { client_id: string; starts_at: string }) => {
          if (!appointmentsByClient.has(a.client_id)) {
            appointmentsByClient.set(a.client_id, a.starts_at);
          }
        });

        const enrichedClients: ClientWithExtras[] = clientList.map(client => {
          const testInfo = testsByClient.get(client.id);
          const nextAppointment = appointmentsByClient.get(client.id);

          let analysisInfo: ClientAnalysisInfo | undefined;
          if (testInfo) {
            if (testInfo.pending > 0) {
              analysisInfo = { status: "pending", pendingCount: testInfo.pending };
            } else if (testInfo.completed) {
              analysisInfo = { status: "completed", lastCompletedAt: testInfo.completed };
            }
          }

          let appointmentInfo: ClientAppointmentInfo | undefined;
          if (nextAppointment) {
            appointmentInfo = {
              hasUpcoming: true,
              nextDate: new Date(nextAppointment).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit"
              })
            };
          }

          const tierInfo = tierByClient.get(client.id);

          return { ...client, analysisInfo, appointmentInfo, tierInfo };
        });

        setClients(enrichedClients);
      } else {
        setClients([]);
      }
      
      setTotalMatching(count ?? 0);
    } catch (err) {
      console.error("fetchList beklenmedik hata:", err);
    } finally {
      setListLoading(false);
      setLoading(false);
    }
  }, [professional?.id, page, pageSize, statusFilter, debouncedSearch]);

  useEffect(() => {
    fetchCounts();
    fetchList();
  }, [fetchCounts, fetchList]);

  useEffect(() => {
    if (clients.length > 0 && !initialLoadDone.current) {
      knownClientIds.current = new Set(clients.map(c => c.id));
      initialLoadDone.current = true;
    }
  }, [clients]);

  useEffect(() => {
    if (!professional?.id) return;

    if (channelRef.current) {
      supabase.current.removeChannel(channelRef.current);
    }

    channelRef.current = supabase.current
      .channel(`clients-realtime-${professional.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "pro",
          table: "clients",
          filter: `professional_id=eq.${professional.id}`,
        },
        (payload) => {
          const newClient = payload.new as Client;
          if (initialLoadDone.current && !knownClientIds.current.has(newClient.id)) {
            knownClientIds.current.add(newClient.id);
            playSound();
            toast.success("Danışan eklendi", {
              description: `${newClient.first_name} ${newClient.last_name}`,
            });
            fetchCounts();
            fetchList();
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "pro",
          table: "clients",
          filter: `professional_id=eq.${professional.id}`,
        },
        () => {
          fetchCounts();
          fetchList();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "pro",
          table: "clients",
          filter: `professional_id=eq.${professional.id}`,
        },
        (payload) => {
          const deletedId = (payload.old as { id?: string })?.id;
          if (deletedId) {
            knownClientIds.current.delete(deletedId);
          }
          fetchCounts();
          fetchList();
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.current.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [professional?.id, fetchCounts, fetchList, playSound]);

  const refresh = useCallback(async () => {
    await Promise.all([fetchCounts(), fetchList()]);
  }, [fetchCounts, fetchList]);

  return { clients, counts, totalMatching, loading, listLoading, refresh, debouncedSearch };
}
