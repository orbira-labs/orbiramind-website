"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MoreVertical, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import type { Client } from "@/lib/types";

interface ClientRowActionsProps {
  client: Client;
  onSetStatus: (status: "active" | "passive") => void;
  onDelete: () => void;
}

export function ClientRowActions({ client, onSetStatus, onDelete }: ClientRowActionsProps) {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, openUpward: false });
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleScroll() {
      setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  const isActive = client.status === "active";

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuHeight = 120;
      const menuWidth = 176;
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUpward = spaceBelow < menuHeight;
      
      setMenuPosition({
        top: openUpward ? rect.top - menuHeight - 4 : rect.bottom + 4,
        left: rect.right - menuWidth,
        openUpward,
      });
    }
    
    setOpen((prev) => !prev);
  };

  const menu = open && mounted ? (
    createPortal(
      <div
        className="fixed z-[9999] w-44 py-1 rounded-xl bg-pro-surface border border-pro-border shadow-[var(--pro-shadow-elevated)]"
        style={{ top: menuPosition.top, left: menuPosition.left }}
        role="menu"
      >
        {!isActive && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onSetStatus("active");
              setOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-pro-text-secondary hover:bg-pro-surface-alt hover:text-pro-text transition-colors"
            role="menuitem"
          >
            <ToggleRight className="h-4 w-4" />
            Aktife al
          </button>
        )}
        {isActive && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onSetStatus("passive");
              setOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-pro-text-secondary hover:bg-pro-surface-alt hover:text-pro-text transition-colors"
            role="menuitem"
          >
            <ToggleLeft className="h-4 w-4" />
            Pasife al
          </button>
        )}
        <div className="my-1 border-t border-pro-border" />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setOpen(false);
            onDelete();
          }}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-pro-danger hover:bg-pro-danger-light transition-colors"
          role="menuitem"
        >
          <Trash2 className="h-4 w-4" />
          Sil
        </button>
      </div>,
      document.body
    )
  ) : null;

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="p-2 rounded-lg text-pro-text-tertiary hover:text-pro-text hover:bg-pro-surface-alt transition-colors"
        aria-label="Danışan işlemleri"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {menu}
    </div>
  );
}
