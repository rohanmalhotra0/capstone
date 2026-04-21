"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatRole } from "@/lib/chat-store";

const popupComponents: Components = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => (
    <ul className="list-disc pl-4 mb-2 space-y-0.5">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-4 mb-2 space-y-0.5">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ children, className }) => {
    const isBlock = className?.includes("language-");
    return isBlock ? (
      <code className="block bg-[var(--surface-1)] border border-[var(--border)] rounded p-2 text-[12px] font-mono overflow-x-auto my-2">
        {children}
      </code>
    ) : (
      <code className="bg-[var(--surface-1)] border border-[var(--border)] rounded px-1 text-[12px] font-mono">
        {children}
      </code>
    );
  },
  pre: ({ children }) => <pre className="my-2">{children}</pre>,
  h1: ({ children }) => (
    <h1 className="font-semibold text-[15px] mt-3 mb-1">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="font-semibold text-[14px] mt-3 mb-1">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-semibold mt-2 mb-1">{children}</h3>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline text-[var(--primary)]"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-[var(--border)] pl-3 text-[var(--text-subtle)] my-2">
      {children}
    </blockquote>
  ),
};

const fullscreenComponents: Components = {
  p: ({ children }) => (
    <p className="mb-4 last:mb-0 leading-[1.7]">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc pl-6 mb-4 space-y-1.5 marker:text-[var(--text-subtle)]">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-6 mb-4 space-y-1.5 marker:text-[var(--text-subtle)]">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-[1.7]">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-[var(--text)]">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ children, className }) => {
    const isBlock = className?.includes("language-");
    return isBlock ? (
      <code className="block bg-[var(--surface-1)] border border-[var(--border)] rounded-md p-3 text-[13px] font-mono overflow-x-auto my-3 leading-relaxed">
        {children}
      </code>
    ) : (
      <code className="bg-[var(--surface-1)] border border-[var(--border)] rounded px-1.5 py-0.5 text-[13px] font-mono">
        {children}
      </code>
    );
  },
  pre: ({ children }) => <pre className="my-3">{children}</pre>,
  h1: ({ children }) => (
    <h1 className="font-semibold text-[22px] mt-6 mb-3 tracking-tight">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="font-semibold text-[18px] mt-5 mb-2.5 tracking-tight">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-semibold text-[16px] mt-4 mb-2">{children}</h3>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-2 text-[var(--primary)] hover:text-[var(--primary-hover)]"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-[var(--border-strong)] pl-4 text-[var(--text-muted)] my-4 italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-6 border-[var(--border)]" />,
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto">
      <table className="w-full border-collapse text-[14px]">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-[var(--border-strong)] px-3 py-2 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-[var(--border)] px-3 py-2 align-top">
      {children}
    </td>
  ),
};

export function MessageBubble({
  role,
  content,
  variant = "popup",
}: {
  role: ChatRole;
  content: string;
  variant?: "popup" | "fullscreen";
}) {
  const isUser = role === "user";

  if (variant === "fullscreen") {
    if (isUser) {
      return (
        <div className="flex justify-end">
          <div className="max-w-[80%] rounded-2xl bg-[var(--primary)] px-4 py-2.5 text-[14.5px] leading-relaxed text-white whitespace-pre-wrap">
            {content || <span className="opacity-70">…</span>}
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--text-subtle)]">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-[var(--primary)]/15">
            <Sparkles className="h-3 w-3 text-[var(--primary)]" />
          </span>
          EPM Assistant
        </div>
        <div className="text-[15px] leading-[1.7] text-[var(--text)]">
          {content ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={fullscreenComponents}
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

  return (
    <div
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
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
            components={popupComponents}
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
