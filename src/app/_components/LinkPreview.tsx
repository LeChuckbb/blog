"use client";

import { useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import type { LinkPreviewData } from "@/src/app/config/types";

interface LinkPreviewProps {
  href: string;
  external: boolean;
  preview: LinkPreviewData;
  className?: string;
  children: React.ReactNode;
}

function ExternalIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="inline-block ml-0.5 mb-0.5 w-3 h-3 opacity-60"
      aria-hidden="true"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-3.5 h-3.5 shrink-0"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function formatDate(iso: string) {
  // "2026-06-02" → "2026.06.02"
  return iso.replaceAll("-", ".");
}

function PostCard({
  preview,
}: {
  preview: Extract<LinkPreviewData, { kind: "post" }>;
}) {
  return (
    <div className="flex flex-col gap-1.5 p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {preview.series && (
          <span className="inline-flex items-center rounded-full bg-accent px-2 py-px font-medium text-accent-foreground">
            {preview.series}
          </span>
        )}
        <span>
          {formatDate(preview.date)}
          {preview.readingTime ? ` · ${preview.readingTime}분` : ""}
        </span>
      </div>
      <div className="font-serif text-[15px] font-semibold leading-snug text-popover-foreground">
        {preview.title}
      </div>
      {preview.description && (
        <p className="m-0 line-clamp-3 text-[13px] leading-relaxed text-muted-foreground">
          {preview.description}
        </p>
      )}
    </div>
  );
}

function ExternalCard({
  preview,
}: {
  preview: Extract<LinkPreviewData, { kind: "external" }>;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(preview.image) && !imageFailed;

  return (
    <div className="flex flex-col">
      {showImage && (
        // og:image는 도메인이 제각각이라 next/image 대신 <img>. 실패하면 영역째 숨긴다.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview.image}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImageFailed(true)}
          className="h-[150px] w-full object-cover border-b border-border bg-muted"
        />
      )}
      <div className="flex flex-col gap-1 px-3.5 pt-3 pb-3.5">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <GlobeIcon />
          <span className="truncate">{preview.domain}</span>
        </div>
        <div className="line-clamp-2 text-sm font-semibold leading-snug text-popover-foreground">
          {preview.title}
        </div>
        {preview.description && (
          <p className="m-0 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
            {preview.description}
          </p>
        )}
      </div>
    </div>
  );
}

export function LinkPreview({
  href,
  external,
  preview,
  className,
  children,
}: LinkPreviewProps) {
  return (
    <HoverCard openDelay={300} closeDelay={150}>
      <HoverCardTrigger asChild>
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          // 카드가 열린 동안만 accent 배경 (Radix가 트리거에 data-state=open을 붙인다)
          className={cn("rounded-[4px] data-[state=open]:bg-accent", className)}
        >
          {children}
          {external && <ExternalIcon />}
        </a>
      </HoverCardTrigger>
      <HoverCardContent
        side="bottom"
        align="start"
        sideOffset={6}
        className="w-80 overflow-hidden rounded-lg border border-border bg-popover p-0 text-popover-foreground shadow-lg not-prose"
      >
        {preview.kind === "post" ? (
          <PostCard preview={preview} />
        ) : (
          <ExternalCard preview={preview} />
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
