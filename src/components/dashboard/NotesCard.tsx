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
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
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
              className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200/70 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-400/60 transition-colors"
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
              className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200/70 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-400/60 transition-colors resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
          <div className="flex items-center gap-2">
            {/* Priority Dots */}
            <div className="flex items-center gap-1">
              {PRIORITY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPriority(option.value)}
                  className={clsx(
                    "w-5 h-5 rounded-full transition-all duration-200 flex items-center justify-center",
                    priority === option.value
                      ? "ring-2 ring-offset-1 ring-gray-300"
                      : "hover:scale-110"
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
  onTogglePin: () => void;
  onDelete: () => void;
}

function NoteDetailModal({
  note,
  open,
  onClose,
  onEdit,
  onTogglePin,
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

  const priority = getPriority(note.color as NoteColor);

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
          "relative w-full max-w-lg bg-white rounded-2xl shadow-xl transition-all duration-200",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={clsx(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                    priority.bgLight,
                    priority.border,
                    "border"
                  )}
                >
                  <span className={clsx("w-2 h-2 rounded-full", priority.bg)} />
                  {priority.label} Önem
                </span>
                {note.pinned && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-pro-primary/10 text-pro-primary">
                    <Pin className="h-3 w-3" />
                    Sabitli
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{note.title}</h3>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(note.updated_at).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        {note.content && (
          <div className="p-5">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {note.content}
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
          <button
            onClick={onTogglePin}
            className={clsx(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              note.pinned
                ? "text-pro-primary bg-pro-primary/10 hover:bg-pro-primary/15"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <Pin className="h-4 w-4" />
            {note.pinned ? "Sabiti Kaldır" : "Sabitle"}
          </button>

          <div className="flex gap-2">
            {showDeleteConfirm ? (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-1.5">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-xs text-red-600 font-medium">Emin misiniz?</span>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-2 py-1 text-xs font-medium text-gray-600 hover:bg-white rounded transition-colors"
                >
                  Hayır
                </button>
                <button
                  onClick={handleDelete}
                  className="px-2 py-1 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded transition-colors"
                >
                  Evet
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Sil
                </button>
                <button
                  onClick={onEdit}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-pro-primary hover:bg-pro-primary-hover rounded-lg transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                  Düzenle
                </button>
              </>
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
            className="flex items-center gap-1 text-sm text-pro-primary hover:text-pro-primary-hover font-semibold"
          >
            <Plus className="h-3.5 w-3.5" />
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
                  className="w-full text-left p-3 rounded-xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200 group"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={clsx("w-1 h-full min-h-[36px] rounded-full shrink-0", priority.bg)}
                    />
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
                        <p className="text-xs text-gray-500 truncate mt-0.5">{note.content}</p>
                      )}
                    </div>
                    <span
                      className={clsx(
                        "shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded",
                        priority.bgLight,
                        priority.value === "green" && "text-emerald-700",
                        priority.value === "yellow" && "text-amber-700",
                        priority.value === "red" && "text-red-700"
                      )}
                    >
                      {priority.label}
                    </span>
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
