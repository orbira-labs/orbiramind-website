"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useProContext } from "@/lib/context";
import type { SessionPriceTemplate } from "@/lib/types";

export function useSessionTemplates() {
  const { professional } = useProContext();
  const supabase = useRef(createClient());

  const [templates, setTemplates] = useState<SessionPriceTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = useCallback(async () => {
    if (!professional) return;
    setLoading(true);

    const { data, error } = await supabase.current
      .from("session_price_templates")
      .select("*")
      .eq("professional_id", professional.id)
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (!error && data) {
      setTemplates(data as SessionPriceTemplate[]);
    }
    setLoading(false);
  }, [professional]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  async function createTemplate(input: {
    name: string;
    session_count: number;
    price_per_session_cents: number;
    total_price_cents: number;
    discount_percent: number;
  }) {
    if (!professional) return { error: "Oturum bulunamadı" };

    const type = input.session_count === 1 ? "single" : "package";

    const { data, error } = await supabase.current
      .from("session_price_templates")
      .insert({
        professional_id: professional.id,
        name: input.name,
        type,
        session_count: input.session_count,
        price_per_session_cents: input.price_per_session_cents,
        total_price_cents: input.total_price_cents,
        discount_percent: input.discount_percent,
        sort_order: templates.length,
      })
      .select()
      .single();

    if (error) return { error: error.message };

    setTemplates((prev) => [...prev, data as SessionPriceTemplate]);
    return { data: data as SessionPriceTemplate };
  }

  async function updateTemplate(
    id: string,
    input: {
      name: string;
      session_count: number;
      price_per_session_cents: number;
      total_price_cents: number;
      discount_percent: number;
    }
  ) {
    if (!professional) return { error: "Oturum bulunamadı" };

    const type = input.session_count === 1 ? "single" : "package";

    const { data, error } = await supabase.current
      .from("session_price_templates")
      .update({
        name: input.name,
        type,
        session_count: input.session_count,
        price_per_session_cents: input.price_per_session_cents,
        total_price_cents: input.total_price_cents,
        discount_percent: input.discount_percent,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("professional_id", professional.id)
      .select()
      .single();

    if (error) return { error: error.message };

    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? (data as SessionPriceTemplate) : t))
    );
    return { data: data as SessionPriceTemplate };
  }

  async function deleteTemplate(id: string) {
    if (!professional) return { error: "Oturum bulunamadı" };

    const { error } = await supabase.current
      .from("session_price_templates")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("professional_id", professional.id);

    if (error) return { error: error.message };

    setTemplates((prev) => prev.filter((t) => t.id !== id));
    return {};
  }

  return {
    templates,
    loading,
    fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  };
}
