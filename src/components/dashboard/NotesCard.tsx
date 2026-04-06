"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useNotes, type Note, type NoteColor } from "@/lib/hooks/useNotes";
import { StickyNote, Plus, Pin, Trash2, X, Check } from "lucide-react";
import { clsx } from "clsx";
import { toast } from "sonner";

const NOTE_COLORS: { value: NoteColor; bg: string; border: string; text: string }[] = [
  { value: "yellow", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-900" },
  { value: "green", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-900" },
  { value: "blue", bg: "bg-sky-50", border: "border-sky-200", text: "text-sky-900" },
  { value: "pink", bg: "bg-pink-50", border: "border-pink-200", text: "text-pink-900" },
  { value: "purple", bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-900" },
];

function getColorStyles(color: string) {
  return NOTE_COLORS.find((c) => c.value === color) || NOTE_COLORS[0];
}

interface NoteModalProps {
  open: boolean;
  onClose: () => void;
  note?: Note | null;
  onSave: (title: string, content: string, color: NoteColor) => Promise<void>;
  onDelete?: () => Promise<void>;
}

function NoteModal({ open, onClose, note, onSave, onDelete }: NoteModalProps) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [color, setColor] = useState<NoteColor>((note?.color as NoteColor) || "yellow");
  const [saving, setSaving] = useState(false);

  const colorStyles = getColorStyles(color);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Başlık gerekli");
      return;
    }
    setSaving(true);
    await onSave(title.trim(), content.trim(), color);
    setSaving(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={note ? "Notu Düzenle" : "Yeni Not"} size="md">
      <div className="space-y-4">
        <div className={clsx("rounded-xl p-4 border-2 transition-colors", colorStyles.bg, colorStyles.border)}>
          <input
            type="text"
            placeholder="Not başlığı..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={clsx(
              "w-full bg-transparent font-semibold text-lg outline-none placeholder:opacity-50",
              colorStyles.text
            )}
            autoFocus
          />
          <textarea
            placeholder="Detaylar (opsiyonel)..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className={clsx(
              "w-full bg-transparent mt-2 text-sm outline-none resize-none placeholder:opacity-50",
              colorStyles.text
            )}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-pro-text-secondary">Renk:</span>
          <div className="flex gap-1.5">
            {NOTE_COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => setColor(c.value)}
                className={clsx(
                  "h-6 w-6 rounded-full border-2 transition-all",
                  c.bg,
                  c.border,
                  color === c.value && "ring-2 ring-offset-1 ring-pro-primary scale-110"
                )}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {note && onDelete ? (
            <Button variant="danger" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-1" />
              Sil
            </Button>
          ) : (
            <div />
          )}
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>
              İptal
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
              <Check className="h-4 w-4 mr-1" />
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

interface NoteDetailModalProps {
  note: Note;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onTogglePin: () => void;
  onDelete: () => void;
}

function NoteDetailModal({ note, open, onClose, onEdit, onTogglePin, onDelete }: NoteDetailModalProps) {
  const colorStyles = getColorStyles(note.color);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className={clsx(
              "w-full max-w-md rounded-2xl p-5 shadow-2xl border-2 relative",
              colorStyles.bg,
              colorStyles.border
            )}
            style={{
              transform: "rotate(-1deg)",
              boxShadow: "0 10px 40px -10px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.05)",
            }}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-black/10 transition-colors"
            >
              <X className="h-4 w-4 opacity-60" />
            </button>

            <div className="pr-8">
              <div className="flex items-start gap-2 mb-3">
                {note.pinned && <Pin className="h-4 w-4 text-pro-primary shrink-0 mt-1" />}
                <h3 className={clsx("font-semibold text-lg", colorStyles.text)}>{note.title}</h3>
              </div>

              {note.content && (
                <p className={clsx("text-sm whitespace-pre-wrap leading-relaxed", colorStyles.text, "opacity-80")}>
                  {note.content}
                </p>
              )}

              <div className="flex items-center justify-between mt-5 pt-4 border-t border-black/10">
                <span className="text-xs opacity-50">
                  {new Date(note.updated_at).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={onTogglePin}
                    className={clsx(
                      "p-2 rounded-lg transition-colors",
                      note.pinned ? "bg-pro-primary/20 text-pro-primary" : "hover:bg-black/10 opacity-60"
                    )}
                    title={note.pinned ? "Sabitlemeyi Kaldır" : "Sabitle"}
                  >
                    <Pin className="h-4 w-4" />
                  </button>
                  <button
                    onClick={onEdit}
                    className="p-2 rounded-lg hover:bg-black/10 opacity-60 transition-colors"
                    title="Düzenle"
                  >
                    <StickyNote className="h-4 w-4" />
                  </button>
                  <button
                    onClick={onDelete}
                    className="p-2 rounded-lg hover:bg-red-500/20 text-red-600 opacity-60 hover:opacity-100 transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function NotesCard() {
  const { notes, loading, createNote, updateNote, deleteNote, togglePin } = useNotes();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);

  const handleCreate = async (title: string, content: string, color: NoteColor) => {
    const result = await createNote(title, content, color);
    if (result) {
      toast.success("Not eklendi");
    }
  };

  const handleUpdate = async (title: string, content: string, color: NoteColor) => {
    if (!editingNote) return;
    const result = await updateNote(editingNote.id, { title, content, color });
    if (result) {
      toast.success("Not güncellendi");
      setEditingNote(null);
    }
  };

  const handleDelete = async (noteId: string) => {
    const result = await deleteNote(noteId);
    if (result) {
      toast.success("Not silindi");
      setViewingNote(null);
      setEditingNote(null);
    }
  };

  const handleTogglePin = async (noteId: string) => {
    const result = await togglePin(noteId);
    if (result) {
      toast.success(result.pinned ? "Not sabitlendi" : "Sabitleme kaldırıldı");
      if (viewingNote?.id === noteId) {
        setViewingNote(result);
      }
    }
  };

  const displayedNotes = notes.slice(0, 5);

  return (
    <>
      <Card padding="lg" variant="elevated" className="h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-pro-text flex items-center gap-2">
            <span className="h-4 w-0.5 rounded-full bg-amber-500" />
            Notlarım
          </h3>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1 text-sm text-pro-primary hover:underline"
          >
            <Plus className="h-4 w-4" />
            Ekle
          </button>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-12 bg-pro-surface-alt rounded-lg" />
              </div>
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center mb-3">
              <StickyNote className="h-6 w-6 text-amber-600" />
            </div>
            <p className="text-sm text-pro-text-secondary mb-1">Henüz not yok</p>
            <p className="text-xs text-pro-text-tertiary mb-4">Hızlı hatırlatmalar için not ekleyin</p>
            <Button variant="secondary" size="sm" onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-1" />
              İlk Notunu Ekle
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {displayedNotes.map((note) => {
              const colorStyles = getColorStyles(note.color);
              return (
                <button
                  key={note.id}
                  onClick={() => setViewingNote(note)}
                  className={clsx(
                    "w-full text-left p-3 rounded-lg border transition-all hover:shadow-sm",
                    colorStyles.bg,
                    colorStyles.border,
                    "hover:scale-[1.01]"
                  )}
                >
                  <div className="flex items-start gap-2">
                    {note.pinned && <Pin className="h-3 w-3 text-pro-primary shrink-0 mt-0.5" />}
                    <div className="flex-1 min-w-0">
                      <p className={clsx("text-sm font-medium truncate", colorStyles.text)}>{note.title}</p>
                      {note.content && (
                        <p className={clsx("text-xs truncate mt-0.5", colorStyles.text, "opacity-60")}>
                          {note.content}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
            {notes.length > 5 && (
              <p className="text-xs text-pro-text-tertiary text-center pt-1">
                +{notes.length - 5} not daha
              </p>
            )}
          </div>
        )}
      </Card>

      <NoteModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreate}
      />

      <NoteModal
        open={!!editingNote}
        onClose={() => setEditingNote(null)}
        note={editingNote}
        onSave={handleUpdate}
        onDelete={editingNote ? () => handleDelete(editingNote.id) : undefined}
      />

      {viewingNote && (
        <NoteDetailModal
          note={viewingNote}
          open={!!viewingNote}
          onClose={() => setViewingNote(null)}
          onEdit={() => {
            setEditingNote(viewingNote);
            setViewingNote(null);
          }}
          onTogglePin={() => handleTogglePin(viewingNote.id)}
          onDelete={() => handleDelete(viewingNote.id)}
        />
      )}
    </>
  );
}
