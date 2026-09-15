"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Maximize2 } from "lucide-react";
import { Lightbox } from "./Lightbox";
import { trackEvent } from "@/src/app/lib/gtag";

interface MermaidProps {
  chart: string;
}

/** ```mermaid 블록 상단의 `title:` frontmatter — 라이트박스 상단 바에 쓴다. */
function extractTitle(chart: string): string | undefined {
  const m = chart.match(/^---\s*\n[\s\S]*?\btitle:\s*(.+?)\s*\n[\s\S]*?---/);
  return m?.[1];
}

export function Mermaid({ chart }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const title = extractTitle(chart);

  useEffect(() => {
    if (!containerRef.current) return;

    const id = `mermaid-${Math.random().toString(36).slice(2)}`;
    import("mermaid").then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        theme: resolvedTheme === "dark" ? "dark" : "default",
        ...(resolvedTheme === "dark" && {
          themeVariables: {
            primaryColor: "#3b2066",
            primaryBorderColor: "#8b5cf6",
            primaryTextColor: "#f0eaf8",
            secondaryColor: "#2d1f4e",
            tertiaryColor: "#1e1635",
          },
        }),
      });
      mermaid
        .render(id, chart.trim())
        .then(({ svg }) => {
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
          }
          // 라이트박스는 같은 SVG 문자열을 다시 주입한다 — mermaid 재렌더 없음.
          setSvg(svg);
        })
        .catch((err) => {
          setError(String(err));
        });
    });
  }, [chart, resolvedTheme]);

  const openLightbox = () => {
    if (!svg) return;
    setOpen(true);
    trackEvent("media_zoom", { kind: "diagram" });
  };

  if (error) {
    return (
      <pre className="text-destructive text-sm p-4 rounded bg-muted overflow-x-auto">
        {chart}
      </pre>
    );
  }

  return (
    <>
      {/* 카드 전체가 클릭 대상. 칩은 hover 때만 드러나는 힌트다. */}
      <div
        role="button"
        tabIndex={0}
        aria-label={title ? `${title} 크게 보기` : "다이어그램 크게 보기"}
        onClick={openLightbox}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openLightbox();
          }
        }}
        className="group/diagram clickable relative my-7 cursor-zoom-in overflow-x-auto rounded-lg border border-border bg-muted p-4 hover:border-primary/45 focus-visible:outline-2 focus-visible:outline-ring dark:border-primary/20"
      >
        <div ref={containerRef} className="flex justify-center" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-2.5 right-2.5 flex h-8 items-center gap-1.5 rounded-md border border-border bg-card/90 px-2.5 text-xs font-medium text-foreground opacity-0 backdrop-blur-sm transition-opacity duration-150 group-hover/diagram:opacity-100 group-focus-visible/diagram:opacity-100"
        >
          <Maximize2 className="h-4 w-4" />
          크게 보기
        </span>
      </div>

      <Lightbox open={open} onClose={() => setOpen(false)} title={title}>
        {svg && (
          <div className="contents" dangerouslySetInnerHTML={{ __html: svg }} />
        )}
      </Lightbox>
    </>
  );
}
