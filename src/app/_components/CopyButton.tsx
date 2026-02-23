"use client";

import { useState } from "react";

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
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // clipboard API not available
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="copy-button"
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
