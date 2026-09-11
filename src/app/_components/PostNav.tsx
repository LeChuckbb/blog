"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/src/app/lib/gtag";

export interface PostNavTarget {
  slug: string;
  title: string;
  /** 카드 위에 붙는 작은 라벨. 시리즈 안에서 이어지면 "시리즈 이전 글"처럼 출처를 밝힌다. */
  label: string;
}

export interface PostNavData {
  prev: PostNavTarget | null;
  next: PostNavTarget | null;
}

/**
 * 글 하단 이전/다음 글 카드. md 이상 2열, 그 아래는 1열로 쌓인다.
 * 없는 쪽은 빈 칸으로 남겨 2열에서 다음 카드가 항상 오른쪽에 온다.
 */
export default function PostNav({ prev, next }: PostNavData) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="이전 글 / 다음 글"
      className="grid grid-cols-1 md:grid-cols-2 gap-3"
    >
      {prev ? <NavCard post={prev} direction="prev" /> : <span aria-hidden />}
      {next ? <NavCard post={next} direction="next" /> : <span aria-hidden />}
    </nav>
  );
}

function NavCard({
  post,
  direction,
}: {
  post: PostNavTarget;
  direction: "prev" | "next";
}) {
  const isNext = direction === "next";
  const Chevron = isNext ? ChevronRight : ChevronLeft;

  return (
    <Link
      href={`/posts/${encodeURIComponent(post.slug)}`}
      onClick={() =>
        trackEvent("post_navigate", {
          direction,
          label: post.label,
          to_slug: post.slug,
        })
      }
      className={cn(
        "flex items-center gap-3 min-w-0 px-4 py-3.5 rounded-lg border border-border",
        "bg-muted/40 dark:bg-muted/20 hover:bg-muted transition-colors",
        // 2열일 때만 다음 카드를 오른쪽 정렬 — 1열에서는 둘 다 왼쪽이 읽기 편하다
        isNext && "md:flex-row-reverse md:text-right",
      )}
    >
      <Chevron className="h-5 w-5 shrink-0 text-muted-foreground" />
      <span className="flex flex-col gap-1 min-w-0">
        <span className="text-xs text-muted-foreground leading-tight">
          {post.label}
        </span>
        <span className="text-sm font-semibold leading-snug">{post.title}</span>
      </span>
    </Link>
  );
}
