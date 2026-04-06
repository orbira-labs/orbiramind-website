"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { CreditTransaction, CreditPackage } from "@/lib/types";

export function useTransactions() {
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const [txRes, pkgRes] = await Promise.all([
      supabase
        .from("credit_transactions")
        .select("*")
        .eq("professional_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("credit_packages")
        .select("*")
        .eq("is_active", true)
        .order("sort_order"),
    ]);

    setTransactions(txRes.data || []);
    setPackages(pkgRes.data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { transactions, packages, loading, refresh };
}
