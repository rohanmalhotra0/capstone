"use client";

import { useEffect, useId, useRef, useState } from "react";

interface FlowChartProps {
  chart: string;
  className?: string;
}

export function FlowChart({ chart, className }: FlowChartProps) {
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const uid = useId().replace(/:/g, "");
  const idRef = useRef(`mmd-${uid}`);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        const isLight =
          typeof document !== "undefined" &&
          document.documentElement.classList.contains("light");

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "loose",
          theme: "base",
          fontFamily:
            "var(--font-plex-sans), ui-sans-serif, system-ui, -apple-system",
          themeVariables: isLight
            ? {
                primaryColor: "#ffffff",
                primaryTextColor: "#161616",
                primaryBorderColor: "#dde1e6",
                lineColor: "#525252",
                secondaryColor: "#e8eaf0",
                tertiaryColor: "#f4f4f4",
                background: "#ffffff",
                mainBkg: "#ffffff",
                nodeTextColor: "#161616",
                clusterBkg: "#e8eaf0",
                clusterBorder: "#c1c7cd",
              }
            : {
                primaryColor: "#1c2238",
                primaryTextColor: "#f4f4f4",
                primaryBorderColor: "#2f385a",
                lineColor: "#a6adbb",
                secondaryColor: "#151a29",
                tertiaryColor: "#0b0f1a",
                background: "#0b0f1a",
                mainBkg: "#1c2238",
                nodeTextColor: "#f4f4f4",
                clusterBkg: "#151a29",
                clusterBorder: "#2f385a",
              },
        });

        const { svg: renderedSvg } = await mermaid.render(
          idRef.current,
          chart,
        );
        if (!cancelled) {
          setSvg(renderedSvg);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : String(e));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (error) {
    return (
      <div
        className={
          "rounded-md border border-[var(--danger)]/40 bg-[var(--danger)]/10 p-4 text-sm font-mono text-[var(--danger)] " +
          (className ?? "")
        }
      >
        Mermaid render error: {error}
      </div>
    );
  }

  if (!svg) {
    return (
      <div
        className={
          "flex items-center justify-center h-48 text-xs font-mono text-[var(--text-subtle)] " +
          (className ?? "")
        }
      >
        Rendering diagram…
      </div>
    );
  }

  return (
    <div
      className={"mermaid-container w-full overflow-auto " + (className ?? "")}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
