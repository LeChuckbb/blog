"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UnpublishedLinkProps {
  className?: string;
  children: React.ReactNode;
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-[13px] h-[13px] shrink-0"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

/**
 * 아직 블로그에 게시되지 않은 글(옵시디언 볼트 전용)을 가리키던 위키링크.
 * 클릭 불가능한 비활성 텍스트로 표현하고(위키의 red link 패턴),
 * 브라우저 기본 title 툴팁(~1초, OS 고정) 대신 150ms에 뜨는 툴팁으로 이유를 알려준다.
 */
export function UnpublishedLink({ className, children }: UnpublishedLinkProps) {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={className}
            aria-disabled="true"
            role="link"
            tabIndex={0}
          >
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          sideOffset={6}
          className="flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-border bg-popover text-muted-foreground shadow-lg text-[12.5px] not-prose"
        >
          <LockIcon />
          <span>아직 공개되지 않은 글</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
