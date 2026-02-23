"use client";

import { useRef } from "react";
import { CopyButton } from "./CopyButton";

interface CodeBlockProps {
  children: React.ReactNode;
  [key: string]: unknown;
}

export function CodeBlock({ children, ...rest }: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null);

  return (
    <div className="code-block-wrapper">
      <pre ref={preRef} {...rest}>
        {children}
      </pre>
      <CopyButton preRef={preRef} />
    </div>
  );
}
