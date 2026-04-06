"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Professional } from "@/lib/types";

interface ProContextValue {
  professional: Professional | null;
  creditBalance: number;
  setCreditBalance: (balance: number) => void;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  refreshCredits: () => Promise<void>;
  signOut: () => Promise<void>;
}

const ProContext = createContext<ProContextValue | null>(null);

interface ProProviderProps {
  initialProfessional: Professional | null;
  initialCredits: number;
  children: ReactNode;
}

export function ProProvider({
  initialProfessional,
  initialCredits,
  children,
}: ProProviderProps) {
  const router = useRouter();
  const [professional, setProfessional] = useState(initialProfessional);
  const [creditBalance, setCreditBalance] = useState(initialCredits);
  const [loading, setLoading] = useState(false);

  // initialCredits=0 geldiğinde mount sonrası lazy olarak çek
  useEffect(() => {
    if (professional?.id && initialCredits === 0) {
      const supabase = createClient();
      supabase
        .rpc("get_credit_balance", { p_professional_id: professional.id })
        .then(({ data }) => {
          if (typeof data === "number") setCreditBalance(data);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [professional?.id]);

  const refreshCredits = useCallback(async () => {
    if (!professional?.id) return;
    const supabase = createClient();
    const { data } = await supabase.rpc("get_credit_balance", {
      p_professional_id: professional.id,
    });
    if (typeof data === "number") setCreditBalance(data);
  }, [professional?.id]);

  const refreshProfile = useCallback(async () => {
    if (!professional?.id) return;
    const supabase = createClient();
    const { data } = await supabase
      .from("professionals")
      .select("*")
      .eq("id", professional.id)
      .single();
    if (data) setProfessional(data);
  }, [professional?.id]);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    sessionStorage.clear();
    router.push("/auth/login");
  }, [router]);

  return (
    <ProContext.Provider
      value={{
        professional,
        creditBalance,
        setCreditBalance,
        loading,
        refreshProfile,
        refreshCredits,
        signOut,
      }}
    >
      {children}
    </ProContext.Provider>
  );
}

export function useProContext() {
  const ctx = useContext(ProContext);
  if (!ctx) {
    throw new Error("useProContext must be used within ProProvider");
  }
  return ctx;
}
