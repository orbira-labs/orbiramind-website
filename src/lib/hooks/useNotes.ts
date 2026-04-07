"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useProContext } from "@/lib/context";

export interface Note {
  id: string;
  professional_id: string;
  title: string;
  content: string | null;
  color: string;
  pinned: boolean;
  created_at: string;
  updated_at: string;
}

export type NoteColor = "yellow" | "green" | "blue" | "pink" | "purple";

export function useNotes() {
  const { professional } = useProContext();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchNotes = useCallback(async () => {
    if (!professional?.id) return;

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .schema("pro")
        .from("notes")
        .select("*")
        .eq("professional_id", professional.id)
        .order("pinned", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;
      setNotes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Notlar yüklenemedi");
    } finally {
      setLoading(false);
    }
  }, [professional?.id, supabase]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const createNote = async (title: string, content?: string, color: NoteColor = "yellow") => {
    if (!professional?.id) return null;

    try {
      const { data, error: createError } = await supabase
        .schema("pro")
        .from("notes")
        .insert({
          professional_id: professional.id,
          title,
          content: content || null,
          color,
        })
        .select()
        .single();

      if (createError) throw createError;
      setNotes((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Not oluşturulamadı");
      return null;
    }
  };

  const updateNote = async (id: string, updates: Partial<Pick<Note, "title" | "content" | "color" | "pinned">>) => {
    try {
      const { data, error: updateError } = await supabase
        .schema("pro")
        .from("notes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (updateError) throw updateError;
      setNotes((prev) => prev.map((n) => (n.id === id ? data : n)));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Not güncellenemedi");
      return null;
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .schema("pro")
        .from("notes")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;
      setNotes((prev) => prev.filter((n) => n.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Not silinemedi");
      return false;
    }
  };

  const togglePin = async (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return null;
    return updateNote(id, { pinned: !note.pinned });
  };

  return {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    refresh: fetchNotes,
  };
}
