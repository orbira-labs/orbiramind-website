"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { useNotes, type Note, type NoteColor } from "@/lib/hooks/useNotes";
import { Button } from "@/components/ui/Button";
import { StickyNote, Plus, Pin, Trash2, X, Check, Pencil, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { toast } from "sonner";

const NOTE_COLORS: { value: NoteColor; bg: string; bgSoft: string; border: string; text: string; accent: string; shadow: string }[] = [
  { value: "yellow", bg: "bg-amber-50", bgSoft: "bg-amber-50/80", border: "border-amber-200/60", text: "text-amber-800", accent: "bg-amber-400", shadow: "shadow-amber-200/50" },
  { value: "green", bg: "bg-emerald-50", bgSoft: "bg-emerald-50/80", border: "border-emerald-200/60", text: "text-emerald-800", accent: "bg-emerald-400", shadow: "shadow-emerald-200/50" },
  { value: "blue", bg: "bg-sky-50", bgSoft: "bg-sky-50/80", border: "border-sky-200/60", text: "text-sky-800", accent: "bg-sky-400", shadow: "shadow-sky-200/50" },
  { value: "pink", bg: "bg-pink-50", bgSoft: "bg-pink-50/80", border: "border-pink-200/60", text: "text-pink-800", accent: "bg-pink-400", shadow: "shadow-pink-200/50" },
  { value: "purple", bg: "bg-violet-50", bgSoft: "bg-violet-50/80", border: "border-violet-200/60", text: "text-violet-800", accent: "bg-violet-400", shadow: "shadow-violet-200/50" },
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

  useEffect(() => {
    if (open) {
      setTitle(note?.title || "");
      setContent(note?.content || "");
      setColor((note?.color as NoteColor) || "yellow");
    }
  }, [open, note]);

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
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/25 backdrop-blur-[2px]" 
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ 
              type: "spring", 
              damping: 28, 
              stiffness: 350,
              mass: 0.8
            }}
            onClick={(e) => e.stopPropagation()}
            className={clsx(
              "relative w-full max-w-md rounded-3xl overflow-hidden",
              "bg-white shadow-2xl",
              colorStyles.shadow
            )}
            style={{
              boxShadow: `0 25px 50px -12px rgba(0,0,0,0.15), 0 0 0 1px ${color === 'yellow' ? 'rgba(251, 191, 36, 0.1)' : color === 'green' ? 'rgba(52, 211, 153, 0.1)' : color === 'blue' ? 'rgba(56, 189, 248, 0.1)' : color === 'pink' ? 'rgba(244, 114, 182, 0.1)' : 'rgba(167, 139, 250, 0.1)'}`,
            }}
          >
            <div className={clsx("h-1.5 w-full", colorStyles.accent)} />
            
            <div className="px-6 pt-5 pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <motion.div
                    initial={{ rotate: -10 }}
                    animate={{ rotate: 0 }}
                    transition={{ type: "spring", damping: 10 }}
                  >
                    <Sparkles className={clsx("h-5 w-5", colorStyles.text, "opacity-60")} />
                  </motion.div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {note ? "Notu Düzenle" : "Yeni Not"}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 transition-all duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="px-6 pb-6">
              <motion.div 
                layout
                className={clsx(
                  "rounded-2xl p-5 transition-all duration-300",
                  colorStyles.bg,
                  "border border-transparent"
                )}
                style={{
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)"
                }}
              >
                <input
                  type="text"
                  placeholder="Not başlığı..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={clsx(
                    "w-full bg-transparent font-medium text-base outline-none",
                    "placeholder:text-gray-400/70 transition-colors",
                    "focus:placeholder:text-gray-400/50",
                    colorStyles.text
                  )}
                  autoFocus
                  style={{ caretColor: color === 'yellow' ? '#f59e0b' : color === 'green' ? '#10b981' : color === 'blue' ? '#0ea5e9' : color === 'pink' ? '#ec4899' : '#8b5cf6' }}
                />
                <div className={clsx("h-px my-3 opacity-20", colorStyles.accent)} />
                <textarea
                  placeholder="Düşüncelerinizi yazın..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={5}
                  className={clsx(
                    "w-full bg-transparent text-sm outline-none resize-none leading-relaxed",
                    "placeholder:text-gray-400/60 transition-colors",
                    colorStyles.text,
                    "opacity-90"
                  )}
                  style={{ caretColor: color === 'yellow' ? '#f59e0b' : color === 'green' ? '#10b981' : color === 'blue' ? '#0ea5e9' : color === 'pink' ? '#ec4899' : '#8b5cf6' }}
                />
              </motion.div>

              <div className="flex items-center gap-3 mt-5">
                <span className="text-sm text-gray-500 font-medium">Renk</span>
                <div className="flex gap-2">
                  {NOTE_COLORS.map((c) => (
                    <motion.button
                      key={c.value}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setColor(c.value)}
                      className={clsx(
                        "h-7 w-7 rounded-full transition-all duration-200 relative",
                        c.bg,
                        color === c.value 
                          ? "ring-2 ring-offset-2 ring-gray-400/50" 
                          : "hover:ring-2 hover:ring-offset-1 hover:ring-gray-200"
                      )}
                    >
                      {color === c.value && (
                        <motion.div
                          layoutId="colorCheck"
                          className={clsx("absolute inset-0 flex items-center justify-center rounded-full", c.accent)}
                          transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        >
                          <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                {note && onDelete ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onDelete}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Sil
                  </motion.button>
                ) : (
                  <div />
                )}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    İptal
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={saving}
                    className={clsx(
                      "flex items-center gap-1.5 px-5 py-2 text-sm font-medium text-white rounded-xl transition-all",
                      "bg-pro-primary hover:bg-pro-primary-hover disabled:opacity-50 disabled:cursor-not-allowed",
                      "shadow-sm hover:shadow-md"
                    )}
                  >
                    <Check className="h-4 w-4" />
                    {saving ? "Kaydediliyor..." : "Kaydet"}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete();
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px]" 
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20, rotate: 2 }}
            transition={{ 
              type: "spring", 
              damping: 22, 
              stiffness: 280,
              mass: 0.9
            }}
            onClick={(e) => e.stopPropagation()}
            className={clsx(
              "relative w-full max-w-md rounded-3xl overflow-hidden",
              "bg-white"
            )}
            style={{
              boxShadow: "0 30px 60px -15px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.03)"
            }}
          >
            <div className={clsx("h-1.5 w-full", colorStyles.accent)} />
            
            <div className={clsx("p-6", colorStyles.bg)}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {note.pinned && (
                      <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", damping: 12 }}
                      >
                        <Pin className="h-4 w-4 text-pro-primary" />
                      </motion.div>
                    )}
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                      Not
                    </span>
                  </div>
                  <motion.h3 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className={clsx("font-semibold text-xl leading-tight", colorStyles.text)}
                  >
                    {note.title}
                  </motion.h3>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-white/60 transition-all"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              {note.content && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="mt-4"
                >
                  <p className={clsx(
                    "text-sm whitespace-pre-wrap leading-relaxed",
                    colorStyles.text,
                    "opacity-80"
                  )}>
                    {note.content}
                  </p>
                </motion.div>
              )}

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-4 pt-3 border-t border-black/5"
              >
                <span className="text-xs text-gray-400">
                  {new Date(note.updated_at).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="px-6 py-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between"
            >
              <div className="flex gap-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onTogglePin}
                  className={clsx(
                    "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                    note.pinned 
                      ? "bg-pro-primary/10 text-pro-primary" 
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  )}
                >
                  <Pin className="h-4 w-4" />
                  {note.pinned ? "Sabitli" : "Sabitle"}
                </motion.button>
              </div>

              <div className="flex gap-2">
                <AnimatePresence mode="wait">
                  {showDeleteConfirm ? (
                    <motion.div
                      key="confirm"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-center gap-2"
                    >
                      <span className="text-xs text-red-500">Silmek istediğinize emin misiniz?</span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        İptal
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDelete}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                      >
                        Evet, Sil
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="actions"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex gap-2"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDelete}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                        Sil
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onEdit}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white bg-pro-primary hover:bg-pro-primary-hover transition-all shadow-sm"
                      >
                        <Pencil className="h-4 w-4" />
                        Düzenle
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
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
