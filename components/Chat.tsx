"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MessageSquare, X, Send, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ChatRole = "user" | "assistant";
type Message = { id: string; role: ChatRole; content: string };

const STORAGE_KEY = "epm-chat-history-v1";

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const SUGGESTIONS = [
  "What's the difference between Data Map, Smart Push, and Data Integration?",
  "What do I need to do before launching the Benefits and Taxes Wizard?",
  "Which rule type should I use if I only want to recalc edited cells?",
  "What are the prerequisites for Budget Revisions?",
];

export function Chat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Restore history from localStorage.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Message[];
        if (Array.isArray(parsed)) setMessages(parsed);
      }
    } catch {
      // ignore corrupted storage
    }
  }, []);

  // Persist messages.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Auto-scroll on new content.
  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open, streaming]);

  // Focus input when opened.
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || streaming) return;

      setError(null);
      const userMsg: Message = { id: newId(), role: "user", content: trimmed };
      const assistantId = newId();
      const assistantMsg: Message = {
        id: assistantId,
        role: "assistant",
        content: "",
      };

      const next = [...messages, userMsg, assistantMsg];
      setMessages(next);
      setInput("");
      setStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            messages: next
              .filter((m) => m.id !== assistantId)
              .map(({ role, content }) => ({ role, content })),
          }),
        });

        if (!res.ok || !res.body) {
          const errText = await res.text().catch(() => "");
          throw new Error(
            errText || `Request failed with status ${res.status}`,
          );
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: acc } : m,
            ),
          );
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: m.content + "\n\n_(stopped)_" }
                : m,
            ),
          );
        } else {
          const msg = err instanceof Error ? err.message : "Unknown error.";
          setError(msg);
          setMessages((prev) => prev.filter((m) => m.id !== assistantId));
        }
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [messages, streaming],
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const clear = useCallback(() => {
    setMessages([]);
    setError(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <>
      {/* Launcher button */}
      <button
        aria-label={open ? "Close EPM Assistant" : "Open EPM Assistant"}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "fixed bottom-5 right-5 z-[60] flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all",
          "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]",
          open && "rotate-90",
        )}
      >
        {open ? (
          <X className="h-5 w-5" />
        ) : (
          <MessageSquare className="h-5 w-5" />
        )}
      </button>

      {/* Panel */}
      <div
        role="dialog"
        aria-label="EPM Assistant"
        aria-hidden={!open}
        className={cn(
          "fixed bottom-20 right-5 z-[60] flex w-[min(28rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] shadow-2xl transition-all",
          "h-[min(36rem,calc(100vh-7rem))]",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface-2)] px-4 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[var(--primary)]" />
            <div>
              <div className="text-sm font-semibold text-[var(--text)]">
                EPM Assistant
              </div>
              <div className="text-[11px] text-[var(--text-subtle)]">
                Oracle EPM Planning Modules helper
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button
                onClick={clear}
                className="rounded px-2 py-1 text-xs text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="rounded p-1 text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-3 text-sm"
        >
          {messages.length === 0 ? (
            <div className="flex h-full flex-col gap-4">
              <p className="text-[var(--text-muted)]">
                Ask me anything about Oracle EPM Planning Modules — setup
                order, feature selection, data flow between modules, rule
                types, approvals, EPM Automate, IPM, and more.
              </p>
              <div className="flex flex-col gap-2">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-subtle)]">
                  Try asking
                </div>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-left text-[13px] text-[var(--text)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface)]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {messages.map((m) => (
                <MessageBubble key={m.id} role={m.role} content={m.content} />
              ))}
              {streaming &&
                messages[messages.length - 1]?.content === "" && (
                  <div className="flex items-center gap-2 text-xs text-[var(--text-subtle)]">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Thinking…
                  </div>
                )}
            </div>
          )}
          {error && (
            <div className="mt-3 rounded-md border border-[var(--danger)]/40 bg-[var(--danger)]/10 px-3 py-2 text-xs text-[var(--danger)]">
              {error}
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="border-t border-[var(--border)] bg-[var(--surface-2)] p-3">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              placeholder="Ask about EPM modules, rules, integrations…"
              className="flex-1 resize-none rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-subtle)] focus:border-[var(--primary)] focus:outline-none"
              style={{ minHeight: 38, maxHeight: 140 }}
              disabled={streaming}
            />
            {streaming ? (
              <button
                onClick={stop}
                className="flex h-[38px] items-center justify-center rounded-md border border-[var(--border-strong)] bg-[var(--surface)] px-3 text-xs text-[var(--text)] hover:bg-[var(--bg-elev)]"
              >
                Stop
              </button>
            ) : (
              <button
                onClick={() => send(input)}
                disabled={!input.trim()}
                aria-label="Send"
                className="flex h-[38px] w-[38px] items-center justify-center rounded-md bg-[var(--primary)] text-white transition-colors hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="mt-2 text-[10px] text-[var(--text-subtle)]">
            Responses are AI-generated from a curated EPM knowledge base.
            Verify anything critical against Oracle documentation.
          </div>
        </div>
      </div>
    </>
  );
}

function MessageBubble({
  role,
  content,
}: {
  role: ChatRole;
  content: string;
}) {
  const isUser = role === "user";
  return (
    <div
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-lg px-3 py-2 text-[13px] leading-relaxed",
          isUser
            ? "bg-[var(--primary)] text-white whitespace-pre-wrap"
            : "bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)]",
        )}
      >
        {isUser ? (
          content || <span className="text-[var(--text-subtle)]">…</span>
        ) : content ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-0.5">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-0.5">{children}</ol>,
              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              em: ({ children }) => <em className="italic">{children}</em>,
              code: ({ children, className }) => {
                const isBlock = className?.includes("language-");
                return isBlock ? (
                  <code className="block bg-[var(--surface-1)] border border-[var(--border)] rounded p-2 text-[12px] font-mono overflow-x-auto my-2">{children}</code>
                ) : (
                  <code className="bg-[var(--surface-1)] border border-[var(--border)] rounded px-1 text-[12px] font-mono">{children}</code>
                );
              },
              pre: ({ children }) => <pre className="my-2">{children}</pre>,
              h1: ({ children }) => <h1 className="font-semibold text-[15px] mt-3 mb-1">{children}</h1>,
              h2: ({ children }) => <h2 className="font-semibold text-[14px] mt-3 mb-1">{children}</h2>,
              h3: ({ children }) => <h3 className="font-semibold mt-2 mb-1">{children}</h3>,
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" className="underline text-[var(--primary)]">{children}</a>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-[var(--border)] pl-3 text-[var(--text-subtle)] my-2">{children}</blockquote>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        ) : (
          <span className="text-[var(--text-subtle)]">…</span>
        )}
      </div>
    </div>
  );
}
