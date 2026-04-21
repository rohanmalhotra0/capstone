"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Send, Sparkles, Loader2, Plus, Square } from "lucide-react";
import {
  useChatStore,
  sendMessage,
  stopStreaming,
  clearChat,
} from "@/lib/chat-store";
import { MessageBubble } from "@/components/ChatMessage";

const SUGGESTIONS = [
  {
    title: "Compare integration paths",
    body: "What's the difference between Data Map, Smart Push, and Data Integration?",
  },
  {
    title: "Prep the B&T Wizard",
    body: "What do I need to do before launching the Benefits and Taxes Wizard?",
  },
  {
    title: "Pick the right rule type",
    body: "Which rule type should I use if I only want to recalc edited cells?",
  },
  {
    title: "Budget Revisions prerequisites",
    body: "What are the prerequisites for Budget Revisions?",
  },
  {
    title: "Approvals state machine",
    body: "Walk me through Bottom Up vs Distribute approvals with an example.",
  },
  {
    title: "Module map overview",
    body: "Explain how the five Planning Modules connect and share data.",
  },
];

export default function ChatPage() {
  const { messages, streaming, error } = useChatStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const lastLenRef = useRef(0);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < 80 ||
      messages.length !== lastLenRef.current;
    if (atBottom) el.scrollTop = el.scrollHeight;
    lastLenRef.current = messages.length;
  }, [messages, streaming]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Auto-grow textarea.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
  }, [input]);

  const submit = () => {
    const t = input.trim();
    if (!t || streaming) return;
    setInput("");
    void sendMessage(t);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const pickSuggestion = (s: string) => {
    if (streaming) return;
    void sendMessage(s);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col">
      {/* subheader */}
      <div className="border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[var(--primary)]/15">
              <Sparkles className="h-3.5 w-3.5 text-[var(--primary)]" />
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-[13px] font-semibold text-[var(--text)]">
                EPM Assistant
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-subtle)]">
                /chat
              </span>
            </div>
          </div>
          {!isEmpty && (
            <button
              onClick={clearChat}
              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] px-2.5 py-1 text-[12px] text-[var(--text-muted)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
            >
              <Plus className="h-3.5 w-3.5" />
              New chat
            </button>
          )}
        </div>
      </div>

      {/* messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6">
          {isEmpty ? (
            <EmptyState onPick={pickSuggestion} />
          ) : (
            <div className="flex flex-col gap-8 pt-10 pb-24">
              {messages.map((m) => (
                <MessageBubble
                  key={m.id}
                  role={m.role}
                  content={m.content}
                  variant="fullscreen"
                />
              ))}
              {streaming &&
                messages[messages.length - 1]?.content === "" && (
                  <div className="flex items-center gap-2 text-[12px] text-[var(--text-subtle)]">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Thinking…
                  </div>
                )}
              {error && (
                <div className="rounded-md border border-[var(--danger)]/40 bg-[var(--danger)]/10 px-3 py-2 text-[13px] text-[var(--danger)]">
                  {error}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* composer */}
      <div className="border-t border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-md">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <div className="flex items-end gap-2 rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] p-2 shadow-sm transition-colors focus-within:border-[var(--primary)]">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              placeholder="Message EPM Assistant…"
              className="flex-1 resize-none bg-transparent px-3 py-2 text-[14.5px] leading-relaxed text-[var(--text)] placeholder:text-[var(--text-subtle)] outline-none"
              style={{ minHeight: 40, maxHeight: 220 }}
              disabled={streaming}
            />
            {streaming ? (
              <button
                onClick={stopStreaming}
                aria-label="Stop generating"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-strong)] bg-[var(--surface-2)] text-[var(--text)] transition-colors hover:bg-[var(--bg-elev)]"
              >
                <Square className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={!input.trim()}
                aria-label="Send"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)] text-white transition-colors hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            )}
          </div>
          <p className="mt-2 text-center text-[11px] text-[var(--text-subtle)]">
            Responses are AI-generated from a curated EPM knowledge base.
            Verify anything critical against Oracle documentation.
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (s: string) => void }) {
  return (
    <div className="flex min-h-[calc(100vh-16rem)] flex-col items-center justify-center py-12">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)]/10">
        <Sparkles className="h-5 w-5 text-[var(--primary)]" />
      </div>
      <h1 className="mt-6 text-balance text-center text-[34px] font-semibold tracking-tight text-[var(--text)] sm:text-[40px]">
        How can I help with Oracle EPM?
      </h1>
      <p className="mt-3 max-w-xl text-center text-[14.5px] leading-relaxed text-[var(--text-muted)]">
        Ask about modules, rules, integrations, approvals, EPM Automate, IPM
        — anything in the Planning Modules study guide.
      </p>
      <div className="mt-10 grid w-full max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.title}
            onClick={() => onPick(s.body)}
            className="group rounded-lg border border-[var(--border)] bg-[var(--surface)]/40 p-4 text-left transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface)]"
          >
            <div className="text-[13px] font-medium text-[var(--text)]">
              {s.title}
            </div>
            <div className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-[var(--text-muted)]">
              {s.body}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
