"use client";

import { useState } from "react";
import { trackEvent } from "@/src/app/lib/gtag";

interface CopyButtonProps {
  preRef: React.RefObject<HTMLPreElement | null>;
}

export function CopyButton({ preRef }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const pre = preRef.current;
    if (!pre) return;

    const code = pre.querySelector("code");
    const text = code ? code.innerText : pre.innerText;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      // rehype-pretty-code가 pre에 남긴 언어를 함께 보낸다 — 어떤 언어의 코드가
      // 실제로 쓰이는지가 글감 판단에 쓸모 있는 유일한 부가 정보다.
      trackEvent("code_copy", {
        code_language: pre.dataset.language ?? "unknown",
      });
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // clipboard API not available
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 rounded-md bg-secondary text-secondary-foreground border border-border cursor-pointer opacity-0 group-hover/code:opacity-100 transition-[opacity,background-color] duration-150 hover:bg-muted"
      aria-label={copied ? "복사됨" : "코드 복사"}
      title={copied ? "복사됨!" : "복사"}
    >
      {copied ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
      )}
    </button>
  );
}
