"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface SeriesPost {
  slug: string;
  title: string;
}

export interface SeriesData {
  seriesName: string;
  posts: SeriesPost[];
  currentIndex: number;
}

export default function SeriesNav({
  seriesName,
  posts,
  currentIndex,
}: SeriesData) {
  const [isExpanded, setIsExpanded] = useState(true);

  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  return (
    <nav
      aria-label={`${seriesName} 시리즈 네비게이션`}
      className="my-8 rounded-lg border border-border bg-muted/40 dark:bg-muted/20"
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-medium text-muted-foreground shrink-0">
            시리즈
          </span>
          <span className="font-semibold text-sm truncate">{seriesName}</span>
        </div>

        {isExpanded ? (
          <div className="flex items-center gap-3 shrink-0 ml-4">
            <button
              onClick={() => setIsExpanded(false)}
              aria-expanded={true}
              aria-label="시리즈 목록 숨기기"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              숨기기
            </button>
            <span className="text-xs text-muted-foreground">
              {currentIndex + 1} / {posts.length}
            </span>
            <NavArrows
              prevPost={prevPost}
              nextPost={nextPost}
              compact={false}
            />
          </div>
        ) : (
          <div className="flex items-center gap-3 shrink-0 ml-4">
            <span className="text-xs text-muted-foreground">
              {currentIndex + 1} / {posts.length}
            </span>
            <button
              onClick={() => setIsExpanded(true)}
              aria-expanded={false}
              aria-label="시리즈 목록 보기"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              목록
            </button>
            <NavArrows prevPost={prevPost} nextPost={nextPost} compact={true} />
          </div>
        )}
      </div>

      {/* 펼쳐진 목록 */}
      {isExpanded && (
        <ol className="py-2">
          {posts.map((post, index) => {
            const isCurrent = index === currentIndex;
            return (
              <li key={post.slug}>
                {isCurrent ? (
                  <div
                    aria-current="page"
                    className="flex items-start gap-3 px-4 py-2 bg-primary/10 dark:bg-primary/15"
                  >
                    <span className="shrink-0 mt-0.5 text-xs font-mono text-primary font-semibold w-5 text-right">
                      {index + 1}.
                    </span>
                    <span className="text-sm font-semibold text-primary leading-snug">
                      {post.title}
                    </span>
                  </div>
                ) : (
                  <Link
                    href={`/posts/${encodeURIComponent(post.slug)}`}
                    className={cn(
                      "flex items-start gap-3 px-4 py-2",
                      "hover:bg-muted/60 dark:hover:bg-muted/30 transition-colors",
                      "text-foreground/80 hover:text-foreground",
                    )}
                  >
                    <span className="shrink-0 mt-0.5 text-xs font-mono text-muted-foreground w-5 text-right">
                      {index + 1}.
                    </span>
                    <span className="text-sm leading-snug">{post.title}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </nav>
  );
}

function NavArrows({
  prevPost,
  nextPost,
  compact,
}: {
  prevPost: SeriesPost | null;
  nextPost: SeriesPost | null;
  compact: boolean;
}) {
  const baseClass =
    "flex items-center justify-center w-6 h-6 rounded text-sm transition-colors";
  const activeClass =
    "text-foreground hover:bg-muted dark:hover:bg-muted/60 cursor-pointer";
  const disabledClass = "text-muted-foreground/30 cursor-default";

  return (
    <div className="flex items-center gap-1">
      {prevPost ? (
        <Link
          href={`/posts/${encodeURIComponent(prevPost.slug)}`}
          aria-label={`이전 글: ${prevPost.title}`}
          title={compact ? prevPost.title : undefined}
          className={cn(baseClass, activeClass)}
        >
          ◀
        </Link>
      ) : (
        <span aria-disabled="true" className={cn(baseClass, disabledClass)}>
          ◀
        </span>
      )}
      {nextPost ? (
        <Link
          href={`/posts/${encodeURIComponent(nextPost.slug)}`}
          aria-label={`다음 글: ${nextPost.title}`}
          title={compact ? nextPost.title : undefined}
          className={cn(baseClass, activeClass)}
        >
          ▶
        </Link>
      ) : (
        <span aria-disabled="true" className={cn(baseClass, disabledClass)}>
          ▶
        </span>
      )}
    </div>
  );
}
