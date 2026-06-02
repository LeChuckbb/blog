"use client";

import { useRef } from "react";
import { cn } from "../lib/util";
import { CopyButton } from "./CopyButton";

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

export function CodeBlock({ children, className, ...rest }: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null);

  return (
    <div className="group/code relative my-7">
      <pre
        ref={preRef}
        className={cn(
          "rounded-lg overflow-x-auto border border-border px-3 py-4 m-0",
          className,
        )}
        {...rest}
      >
        {children}
      </pre>
      <CopyButton preRef={preRef} />
    </div>
  );
}
