"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

interface MermaidProps {
  chart: string;
}

export function Mermaid({ chart }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

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
        })
        .catch((err) => {
          setError(String(err));
        });
    });
  }, [chart, resolvedTheme]);

  if (error) {
    return (
      <pre className="text-destructive text-sm p-4 rounded bg-muted overflow-x-auto">
        {chart}
      </pre>
    );
  }

  return (
    <div className="my-7 rounded-lg border border-border dark:border-primary/20 bg-muted p-4 overflow-x-auto">
      <div ref={containerRef} className="flex justify-center" />
    </div>
  );
}
