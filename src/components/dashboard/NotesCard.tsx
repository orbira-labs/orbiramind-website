"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { useNotes, type Note, type NoteColor } from "@/lib/hooks/useNotes";
import { StickyNote, Plus, Pin, Trash2, X, Pencil, AlertCircle } from "lucide-react";
import { clsx } from "clsx";
import { toast } from "sonner";

const PRIORITY_OPTIONS: {
  value: NoteColor;
  label: string;
  color: string;
  bg: string;
  bgLight: string;
  border: string;
}[] = [
  {
    value: "green",
    label: "Düşük",
    color: "#86EFAC",
    bg: "bg-emerald-300",
    bgLight: "bg-emerald-50",
    border: "border-emerald-200",
  },
  {
    value: "yellow",
    label: "Orta",
    color: "#FCD34D",
    bg: "bg-amber-300",
    bgLight: "bg-amber-50",
    border: "border-amber-200",
  },
  {
    value: "red",
    label: "Yüksek",
    color: "#FCA5A5",
    bg: "bg-red-300",
    bgLight: "bg-red-50",
    border: "border-red-200",
  },
];

function getPriority(color: NoteColor) {
  return PRIORITY_OPTIONS.find((p) => p.value === color) || PRIORITY_OPTIONS[0];
}

interface NoteModalProps {
  open: boolean;
  onClose: () => void;
  note?: Note | null;
  onSave: (title: string, content: string, color: NoteColor) => Promise<void>;
  onDelete?: () => Promise<void>;
}

function NoteModal({ open, onClose, note, onSave, onDelete }: NoteModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState<NoteColor>("green");
  const [saving, setSaving] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(note?.title || "");
      setContent(note?.content || "");
      setPriority((note?.color as NoteColor) || "green");
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [open, note]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Başlık gerekli");
      return;
    }
    setSaving(true);
    await onSave(title.trim(), content.trim(), priority);
    setSaving(false);
    handleClose();
  };

  if (!open) return null;

  const selectedPriority = getPriority(priority);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleClose}>
      <div
        className={clsx(
          "fixed inset-0 bg-black/40 backdrop-blur-sm transition-all duration-200",
          isVisible ? "opacity-100" : "opacity-0"
        )}
      />

      <div
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          "relative w-full max-w-xl bg-white rounded-2xl shadow-xl transition-all duration-200",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pro-primary/10 flex items-center justify-center">
              <StickyNote className="h-5 w-5 text-pro-primary" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                {note ? "Notu Düzenle" : "Yeni Not"}
              </h2>
              <p className="text-xs text-gray-500">Düşüncelerinizi kaydedin</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-11 h-11 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors touch-manipulation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Başlık</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Not başlığını yazın..."
              className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus:bg-white focus:border-gray-300 transition-all"
              autoFocus
            />
          </div>

          {/* Content Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">İçerik</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Detayları yazın..."
              rows={5}
              className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus:bg-white focus:border-gray-300 transition-all resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
          <div className="flex items-center gap-2">
            {/* Priority Dots */}
            <div className="flex items-center gap-2">
              {PRIORITY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPriority(option.value)}
                  className={clsx(
                    "w-9 h-9 rounded-full transition-all duration-200 flex items-center justify-center touch-manipulation",
                    priority === option.value
                      ? "ring-2 ring-offset-2 ring-gray-300"
                      : "hover:scale-110 active:scale-95"
                  )}
                  style={{ backgroundColor: option.color }}
                  title={option.label}
                />
              ))}
            </div>
            {note && onDelete && (
              <button
                onClick={onDelete}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2"
              >
                <Trash2 className="h-4 w-4" />
                Sil
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              İptal
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !title.trim()}
              className="px-5 py-2 text-sm font-semibold text-white bg-pro-primary hover:bg-pro-primary-hover rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface NoteDetailModalProps {
  note: Note;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const NOTE_STYLES: Record<NoteColor, { bg: string; shadow: string; tape: string }> = {
  green: {
    bg: "bg-gradient-to-br from-emerald-100 via-emerald-50 to-green-100",
    shadow: "shadow-[0_20px_60px_-10px_rgba(16,185,129,0.3)]",
    tape: "bg-emerald-200/80",
  },
  yellow: {
    bg: "bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-50",
    shadow: "shadow-[0_20px_60px_-10px_rgba(245,158,11,0.3)]",
    tape: "bg-amber-200/80",
  },
  red: {
    bg: "bg-gradient-to-br from-red-100 via-rose-50 to-pink-50",
    shadow: "shadow-[0_20px_60px_-10px_rgba(239,68,68,0.3)]",
    tape: "bg-red-200/80",
  },
};

function NoteDetailModal({
  note,
  open,
  onClose,
  onEdit,
  onDelete,
}: NoteDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setShowDeleteConfirm(false);
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [open]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete();
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  if (!open) return null;

  const style = NOTE_STYLES[note.color as NoteColor] || NOTE_STYLES.green;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleClose}>
      <div
        className={clsx(
          "fixed inset-0 bg-black/40 backdrop-blur-sm transition-all duration-200",
          isVisible ? "opacity-100" : "opacity-0"
        )}
      />

      <div
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          "relative w-full max-w-sm max-h-[85vh] flex flex-col transition-all duration-300",
          isVisible ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-90 -rotate-2"
        )}
      >
        {/* Tape effect */}
        <div className={clsx(
          "absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 rounded-sm rotate-0 z-10",
          style.tape,
          "shadow-sm"
        )} />

        {/* Note paper */}
        <div
          className={clsx(
            "relative flex flex-col max-h-full min-h-[280px]",
            style.bg,
            style.shadow,
            "before:absolute before:inset-0 before:bg-[linear-gradient(transparent_31px,rgba(0,0,0,0.04)_31px)] before:bg-[length:100%_32px] before:pointer-events-none"
          )}
          style={{
            transform: "rotate(0.8deg)",
            clipPath: "polygon(0.5% 0.8%, 3% 0.2%, 8% 0.6%, 15% 0.1%, 25% 0.5%, 35% 0.2%, 45% 0.7%, 55% 0.3%, 65% 0.6%, 75% 0.2%, 85% 0.5%, 92% 0.1%, 97% 0.4%, 99.5% 0.8%, 99.8% 3%, 99.3% 10%, 99.7% 20%, 99.2% 35%, 99.6% 50%, 99.3% 65%, 99.7% 80%, 99.4% 90%, 99.8% 97%, 99.2% 99.5%, 97% 99.8%, 90% 99.3%, 80% 99.7%, 65% 99.2%, 50% 99.6%, 35% 99.3%, 20% 99.7%, 10% 99.4%, 3% 99.8%, 0.5% 99.2%, 0.2% 97%, 0.6% 90%, 0.1% 80%, 0.5% 65%, 0.2% 50%, 0.7% 35%, 0.3% 20%, 0.6% 10%, 0.2% 3%)",
          }}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 w-11 h-11 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-white/40 transition-colors z-10 touch-manipulation"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Content area */}
          <div className="px-8 pt-10 pb-6 min-h-[200px] overflow-y-auto flex-1">
            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-800 leading-tight pr-6 font-[family-name:var(--font-caveat)]">
              {note.title}
            </h2>

            {/* Content */}
            {note.content && (
              <p className="mt-5 text-lg text-gray-700 leading-relaxed whitespace-pre-wrap font-[family-name:var(--font-caveat)]">
                {note.content}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="px-8 pb-6 pt-2">
            {showDeleteConfirm ? (
              <div className="flex items-center justify-center gap-3 py-2">
                <span className="text-sm text-gray-600">Silmek istediğinize emin misiniz?</span>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:bg-white/50 rounded-lg transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  Evet, sil
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50/50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Sil
                </button>
                <button
                  onClick={onEdit}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-white/60 hover:bg-white/80 rounded-lg transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Düzenle
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
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
    } else {
      toast.error("Not eklenemedi");
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
          <h3 className="font-semibold text-pro-text">Notlarım</h3>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 text-sm text-pro-primary hover:text-pro-primary-hover font-semibold min-h-[44px] min-w-[44px] px-2 -mr-2 rounded-lg transition-colors touch-manipulation active:bg-pro-primary-light"
          >
            <Plus className="h-4 w-4" />
            Ekle
          </button>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-14 bg-pro-surface-alt rounded-xl" />
              </div>
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-14 w-14 rounded-2xl bg-pro-primary-light flex items-center justify-center mb-4">
              <StickyNote className="h-6 w-6 text-pro-primary" />
            </div>
            <p className="text-sm font-medium text-pro-text mb-1">Not bulunmuyor</p>
            <p className="text-xs text-pro-text-tertiary">Notlarınız burada görünecek</p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayedNotes.map((note) => {
              const priority = getPriority(note.color as NoteColor);
              return (
                <button
                  key={note.id}
                  onClick={() => setViewingNote(note)}
                  className={clsx(
                    "w-full text-left p-3 rounded-xl hover:shadow-sm transition-all duration-200 group",
                    priority.bgLight
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {note.pinned && (
                          <Pin className="h-3 w-3 text-pro-primary shrink-0" />
                        )}
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {note.title}
                        </p>
                      </div>
                      {note.content && (
                        <p className="text-xs text-gray-600 truncate mt-0.5">{note.content}</p>
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
          onDelete={() => handleDelete(viewingNote.id)}
        />
      )}
    </>
  );
}
