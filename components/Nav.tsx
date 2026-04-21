"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/", label: "Index", num: "00" },
  { href: "/atlas", label: "EPM Atlas", num: "01" },
  { href: "/simulator", label: "Simulator", num: "02" },
  { href: "/glossary", label: "Glossary", num: "03" },
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
      className="hidden md:inline-flex items-center gap-1 text-[11px] font-mono text-[var(--text-subtle)] hover:text-[var(--text)] transition"
      aria-label="Open command palette"
    >
      <kbd className="border border-[var(--border)] rounded px-1.5 py-0.5 text-[10px]">
        {isMac ? "⌘" : "Ctrl"}
      </kbd>
      <kbd className="border border-[var(--border)] rounded px-1.5 py-0.5 text-[10px]">
        K
      </kbd>
    </button>
  );
}

export function Nav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-baseline gap-2 group">
          <span className="text-[13px] font-semibold tracking-tight text-[var(--text)]">
            EPM<span className="text-[var(--text-subtle)]">/</span>Planning
          </span>
          <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[var(--text-subtle)] hidden sm:inline">
            v0.2
          </span>
        </Link>
        <nav className="flex items-center gap-5 sm:gap-6">
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
                  "relative text-[13px] transition-colors py-3 hidden sm:inline-flex items-center gap-1.5",
                  active
                    ? "text-[var(--text)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]",
                )}
              >
                <span className="font-mono text-[10px] text-[var(--text-subtle)]">
                  {link.num}
                </span>
                <span className="tracking-tight">{link.label}</span>
                {active && (
                  <span className="absolute inset-x-0 -bottom-px h-px bg-[var(--text)]" />
                )}
              </Link>
            );
          })}
          {/* Mobile labels only */}
          <div className="sm:hidden flex items-center gap-3">
            {links.slice(1).map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-[12px]",
                    active
                      ? "text-[var(--text)]"
                      : "text-[var(--text-muted)]",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <span className="h-4 w-px bg-[var(--border)]" />
          <KbdHint />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
