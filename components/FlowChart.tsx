"use client";

import { useEffect, useId, useRef, useState } from "react";

interface FlowChartProps {
  chart: string;
  className?: string;
  /** Multiplier applied to the rendered SVG's intrinsic width/height. */
  scale?: number;
}

export function FlowChart({ chart, className, scale = 1 }: FlowChartProps) {
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
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
                primaryTextColor: "#111114",
                primaryBorderColor: "#c9c4b6",
                lineColor: "#4a4a52",
                secondaryColor: "#f0ede6",
                tertiaryColor: "#f7f5f0",
                background: "#f7f5f0",
                mainBkg: "#ffffff",
                nodeTextColor: "#111114",
                clusterBkg: "#f0ede6",
                clusterBorder: "#c9c4b6",
              }
            : {
                primaryColor: "#191a1f",
                primaryTextColor: "#ededef",
                primaryBorderColor: "#32343c",
                lineColor: "#9a9ba3",
                secondaryColor: "#131316",
                tertiaryColor: "#0a0a0b",
                background: "#0a0a0b",
                mainBkg: "#191a1f",
                nodeTextColor: "#ededef",
                clusterBkg: "#131316",
                clusterBorder: "#32343c",
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

  // Post-render: scale the injected <svg> by multiplying its intrinsic
  // width/height. Mermaid outputs `max-width: …px` so we also clear that.
  useEffect(() => {
    if (!svg || scale === 1) return;
    const svgEl = containerRef.current?.querySelector("svg");
    if (!svgEl) return;
    const w = parseFloat(svgEl.getAttribute("width") ?? "0");
    const h = parseFloat(svgEl.getAttribute("height") ?? "0");
    if (w) svgEl.setAttribute("width", String(w * scale));
    if (h) svgEl.setAttribute("height", String(h * scale));
    svgEl.style.maxWidth = "none";
    svgEl.style.height = "auto";
  }, [svg, scale]);

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
      ref={containerRef}
      className={"mermaid-container w-full overflow-auto " + (className ?? "")}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
