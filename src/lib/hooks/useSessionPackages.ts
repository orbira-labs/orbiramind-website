"use client";

import { useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useProContext } from "@/lib/context";
import type {
  SessionPackage,
  SessionTransaction,
  SessionPayment,
} from "@/lib/types";

interface ClientSessionSummary {
  totalSessions: number;
  remainingSessions: number;
  totalPriceCents: number;
  paidAmountCents: number;
  balanceCents: number;
}

export function useSessionPackages() {
  const { professional } = useProContext();
  const supabase = useRef(createClient());

  const [packages, setPackages] = useState<SessionPackage[]>([]);
  const [transactions, setTransactions] = useState<SessionTransaction[]>([]);
  const [payments, setPayments] = useState<SessionPayment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPackages = useCallback(
    async (clientId: string) => {
      if (!professional) return;
      setLoading(true);

      const [pkgRes, txnRes, payRes] = await Promise.all([
        supabase.current
          .from("session_packages")
          .select("*")
          .eq("client_id", clientId)
          .eq("professional_id", professional.id)
          .order("created_at", { ascending: false }),
        supabase.current
          .from("session_transactions")
          .select("*")
          .eq("client_id", clientId)
          .eq("professional_id", professional.id)
          .order("created_at", { ascending: false }),
        supabase.current
          .from("session_payments")
          .select("*")
          .eq("professional_id", professional.id)
          .order("created_at", { ascending: false }),
      ]);

      if (pkgRes.data) setPackages(pkgRes.data as SessionPackage[]);
      if (txnRes.data) setTransactions(txnRes.data as SessionTransaction[]);

      if (payRes.data && pkgRes.data) {
        const pkgIds = new Set(
          (pkgRes.data as SessionPackage[]).map((p) => p.id)
        );
        setPayments(
          (payRes.data as SessionPayment[]).filter((p) => pkgIds.has(p.package_id))
        );
      }

      setLoading(false);
    },
    [professional]
  );

  async function assignPackage(
    clientId: string,
    input: {
      template_id?: string;
      name: string;
      total_sessions: number;
      total_price_cents: number;
      initial_payment_cents?: number;
      payment_method?: "cash" | "card" | "transfer" | "other";
    }
  ) {
    if (!professional) return { error: "Oturum bulunamadı" };

    const { data: pkg, error: pkgError } = await supabase.current
      .from("session_packages")
      .insert({
        professional_id: professional.id,
        client_id: clientId,
        template_id: input.template_id || null,
        name: input.name,
        total_sessions: input.total_sessions,
        remaining_sessions: input.total_sessions,
        total_price_cents: input.total_price_cents,
      })
      .select()
      .single();

    if (pkgError) return { error: pkgError.message };

    const newPkg = pkg as SessionPackage;

    if (input.initial_payment_cents && input.initial_payment_cents > 0) {
      const { data: pay } = await supabase.current
        .from("session_payments")
        .insert({
          package_id: newPkg.id,
          professional_id: professional.id,
          amount_cents: input.initial_payment_cents,
          method: input.payment_method || null,
          note: "İlk ödeme",
        })
        .select()
        .single();

      if (pay) setPayments((prev) => [pay as SessionPayment, ...prev]);
    }

    setPackages((prev) => [newPkg, ...prev]);
    return { data: newPkg };
  }

  async function addPayment(
    packageId: string,
    input: {
      amount_cents: number;
      method?: "cash" | "card" | "transfer" | "other";
      note?: string;
    }
  ) {
    if (!professional) return { error: "Oturum bulunamadı" };

    const { data, error } = await supabase.current
      .from("session_payments")
      .insert({
        package_id: packageId,
        professional_id: professional.id,
        amount_cents: input.amount_cents,
        method: input.method || null,
        note: input.note || null,
      })
      .select()
      .single();

    if (error) return { error: error.message };

    setPayments((prev) => [data as SessionPayment, ...prev]);
    return { data: data as SessionPayment };
  }

  async function handleAppointmentCompleted(
    appointmentId: string,
    clientId: string
  ): Promise<{ remaining: number } | { error: string }> {
    if (!professional) return { error: "Oturum bulunamadı" };

    const activePackage = packages
      .filter((p) => p.client_id === clientId && p.status === "active" && p.remaining_sessions > 0)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0];

    if (!activePackage) {
      const { data: dbPkg } = await supabase.current
        .from("session_packages")
        .select("*")
        .eq("client_id", clientId)
        .eq("professional_id", professional.id)
        .eq("status", "active")
        .gt("remaining_sessions", 0)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (!dbPkg) return { error: "Bu danışanın aktif seans paketi yok" };

      const { data: remaining } = await supabase.current.rpc("deduct_session", {
        p_package_id: dbPkg.id,
        p_appointment_id: appointmentId,
        p_professional_id: professional.id,
        p_client_id: clientId,
      });

      if (remaining === -1) return { error: "Seans düşürülemedi" };
      return { remaining: remaining as number };
    }

    const { data: remaining } = await supabase.current.rpc("deduct_session", {
      p_package_id: activePackage.id,
      p_appointment_id: appointmentId,
      p_professional_id: professional.id,
      p_client_id: clientId,
    });

    if (remaining === -1) return { error: "Seans düşürülemedi" };

    setPackages((prev) =>
      prev.map((p) =>
        p.id === activePackage.id
          ? {
              ...p,
              remaining_sessions: remaining as number,
              status: remaining === 0 ? "completed" : p.status,
            }
          : p
      )
    );

    return { remaining: remaining as number };
  }

  async function handleAppointmentCancelled(
    appointmentId: string
  ): Promise<{ remaining: number } | { info: string } | { error: string }> {
    if (!professional) return { error: "Oturum bulunamadı" };

    const { data: remaining } = await supabase.current.rpc("refund_session", {
      p_appointment_id: appointmentId,
      p_professional_id: professional.id,
    });

    if (remaining === -1) return { info: "Bu randevu için seans düşümü yapılmamıştı" };
    if (remaining === -2) return { info: "Bu randevu için seans zaten iade edilmiş" };
    if (remaining === -3) return { error: "Paket bulunamadı" };

    return { remaining: remaining as number };
  }

  function getClientSummary(): ClientSessionSummary {
    const activeAndCompleted = packages.filter((p) => p.status !== "cancelled");
    const totalSessions = activeAndCompleted.reduce((s, p) => s + p.total_sessions, 0);
    const remainingSessions = activeAndCompleted.reduce((s, p) => s + p.remaining_sessions, 0);
    const totalPriceCents = activeAndCompleted.reduce((s, p) => s + p.total_price_cents, 0);

    const packageIds = new Set(activeAndCompleted.map((p) => p.id));
    const paidAmountCents = payments
      .filter((p) => packageIds.has(p.package_id))
      .reduce((s, p) => s + p.amount_cents, 0);

    return {
      totalSessions,
      remainingSessions,
      totalPriceCents,
      paidAmountCents,
      balanceCents: totalPriceCents - paidAmountCents,
    };
  }

  function getPackagePayments(packageId: string): SessionPayment[] {
    return payments.filter((p) => p.package_id === packageId);
  }

  function getPackageTransactions(packageId: string): SessionTransaction[] {
    return transactions.filter((t) => t.package_id === packageId);
  }

  return {
    packages,
    transactions,
    payments,
    loading,
    fetchPackages,
    assignPackage,
    addPayment,
    handleAppointmentCompleted,
    handleAppointmentCancelled,
    getClientSummary,
    getPackagePayments,
    getPackageTransactions,
  };
}
