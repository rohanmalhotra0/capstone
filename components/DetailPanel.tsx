"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

interface DetailPanelProps {
  open: boolean;
  onClose: () => void;
  accentColor?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function DetailPanel({
  open,
  onClose,
  accentColor,
  title,
  subtitle,
  children,
  className,
}: DetailPanelProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const lastFocused = React.useRef<HTMLElement | null>(null);

  const onCloseRef = React.useRef(onClose);
  React.useEffect(() => {
    onCloseRef.current = onClose;
  });

  React.useEffect(() => {
    if (!open) return;
    lastFocused.current = document.activeElement as HTMLElement | null;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }
      // Focus trap
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);

    // Move focus into the panel
    requestAnimationFrame(() => {
      const firstFocusable =
        panelRef.current?.querySelector<HTMLElement>(
          'button, a[href], [tabindex]:not([tabindex="-1"])',
        ) ?? panelRef.current;
      firstFocusable?.focus();
    });

    return () => {
      window.removeEventListener("keydown", onKey);
      lastFocused.current?.focus?.();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[var(--bg)]/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={typeof title === "string" ? title : "Detail panel"}
            tabIndex={-1}
            initial={{ x: "100%", opacity: 0.4 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.4 }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className={cn(
              "fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[460px] bg-[var(--surface)] border-l border-[var(--border)] shadow-2xl overflow-y-auto outline-none",
              className,
            )}
          >
            <div
              className="sticky top-0 z-10 flex items-start justify-between gap-4 px-6 pt-6 pb-4 bg-[var(--surface)] border-b border-[var(--border)]"
              style={{
                boxShadow: accentColor
                  ? `inset 0 2px 0 ${accentColor}`
                  : undefined,
              }}
            >
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-subtle)] mb-1">
                  {subtitle}
                </div>
                <h2 className="text-xl font-semibold text-[var(--text)] tracking-tight">
                  {title}
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close panel"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-5">{children}</div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
