"use client";

import { useEffect, useSyncExternalStore } from "react";

export type ChatRole = "user" | "assistant";
export type Message = { id: string; role: ChatRole; content: string };

type State = {
  messages: Message[];
  streaming: boolean;
  error: string | null;
};

const STORAGE_KEY = "epm-chat-history-v1";

let state: State = { messages: [], streaming: false, error: null };
const listeners = new Set<() => void>();
let abortCtrl: AbortController | null = null;
let hydrated = false;

const emit = () => listeners.forEach((l) => l());

function setState(patch: Partial<State>) {
  state = { ...state, ...patch };
  emit();
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.messages));
  } catch {
    // ignore
  }
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Message[];
      if (Array.isArray(parsed)) {
        state = { ...state, messages: parsed };
        emit();
      }
    }
  } catch {
    // ignore corrupted storage
  }

  window.addEventListener("storage", (e) => {
    if (e.key !== STORAGE_KEY) return;
    try {
      const parsed = e.newValue
        ? (JSON.parse(e.newValue) as Message[])
        : [];
      if (Array.isArray(parsed)) {
        state = { ...state, messages: parsed };
        emit();
      }
    } catch {
      // ignore
    }
  });
}

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function sendMessage(text: string) {
  const trimmed = text.trim();
  if (!trimmed || state.streaming) return;

  const userMsg: Message = { id: newId(), role: "user", content: trimmed };
  const assistantId = newId();
  const assistantMsg: Message = {
    id: assistantId,
    role: "assistant",
    content: "",
  };

  const next = [...state.messages, userMsg, assistantMsg];
  setState({ messages: next, streaming: true, error: null });
  persist();

  const controller = new AbortController();
  abortCtrl = controller;

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
      setState({
        messages: state.messages.map((m) =>
          m.id === assistantId ? { ...m, content: acc } : m,
        ),
      });
    }
    persist();
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      setState({
        messages: state.messages.map((m) =>
          m.id === assistantId
            ? { ...m, content: (m.content || "") + "\n\n_(stopped)_" }
            : m,
        ),
      });
      persist();
    } else {
      const msg = err instanceof Error ? err.message : "Unknown error.";
      setState({
        messages: state.messages.filter((m) => m.id !== assistantId),
        error: msg,
      });
      persist();
    }
  } finally {
    setState({ streaming: false });
    abortCtrl = null;
  }
}

export function stopStreaming() {
  abortCtrl?.abort();
}

export function clearChat() {
  setState({ messages: [], error: null });
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};
const getSnapshot = () => state;
const getServerSnapshot = () => state;

export function useChatStore() {
  useEffect(() => {
    hydrate();
  }, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
