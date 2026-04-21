"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/modules", label: "Module Map" },
  { href: "/flows", label: "Flowcharts" },
  { href: "/simulator", label: "Simulator" },
  { href: "/glossary", label: "Glossary" },
];

function KbdHint() {
  const [isMac, setIsMac] = useState(false);
  useEffect(() => {
    setIsMac(
      typeof navigator !== "undefined" &&
        /mac|iphone|ipad|ipod/i.test(navigator.platform + " " + navigator.userAgent),
    );
  }, []);
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new KeyboardEvent("keydown", {
              key: "k",
              metaKey: true,
              ctrlKey: !isMac,
              bubbles: true,
            }),
          );
        }
      }}
      className="hidden md:flex items-center gap-1 rounded-md border border-[var(--border)] px-2 py-1 text-[11px] font-mono text-[var(--text-subtle)] hover:text-[var(--text)] hover:border-[var(--primary)]/50 transition"
      aria-label="Open command palette"
    >
      <span>{isMac ? "⌘" : "Ctrl"}</span>
      <span>K</span>
    </button>
  );
}

export function Nav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span
            className="flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold"
            style={{ background: "#0f62fe", color: "#fff" }}
          >
            EPM
          </span>
          <span className="text-sm font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--primary-hover)] transition-colors">
            Planning Modules
          </span>
          <span className="text-xs text-[var(--text-subtle)] font-mono hidden sm:inline">
            / Interactive Guide
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm transition-colors",
                  active
                    ? "text-[var(--text)] bg-[var(--surface-2)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]/60",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <span className="mx-1 h-5 w-px bg-[var(--border)]" />
          <KbdHint />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
