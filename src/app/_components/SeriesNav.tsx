"use client";

import React, { useState } from "react";
import { Link } from "next-view-transitions";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/src/app/lib/gtag";

export interface SeriesPost {
  slug: string;
  title: string;
}

export interface SeriesData {
  seriesName: string;
  posts: SeriesPost[];
  currentIndex: number;
}

/**
 * header: 글 상단, 박스 안에 목록 펼침(맥락). 접을 수 있고 화살표로 이동.
 * footer: 글 하단, 박스 없는 한 줄 요약만(이동은 바로 아래 PostNav 카드가 맡는다).
 *   "전체 목록"을 누르면 그 자리에서 목록이 펼쳐진다 — 상단과 같은 목록을 항상 두 번
 *   보이면 짧은 글에서 위·아래가 데칼코마니처럼 겹쳐 보여서 접힘이 기본.
 */
type SeriesNavVariant = "header" | "footer";

export default function SeriesNav({
  seriesName,
  posts,
  currentIndex,
  variant = "header",
}: SeriesData & { variant?: SeriesNavVariant }) {
  const isFooter = variant === "footer";
  const [isCollapsed, setIsCollapsed] = useState(isFooter);
  const isExpanded = !isCollapsed;

  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  const listId = `series-list-${variant}`;

  if (isFooter) {
    return (
      <nav
        aria-label={`${seriesName} 시리즈 네비게이션`}
        className="flex flex-col gap-3"
      >
        {/* 한 줄 요약: 박스 없이. 이름이 길면 이름만 줄이고 n/m·버튼은 지킨다 */}
        <div className="flex items-center justify-between gap-3 min-w-0">
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs font-medium text-muted-foreground shrink-0">
              시리즈
            </span>
            <span className="font-semibold text-sm truncate">{seriesName}</span>
            <span className="text-xs text-muted-foreground shrink-0">
              {currentIndex + 1} / {posts.length}
            </span>
          </div>
          {/* 텍스트는 작지만 터치 타깃은 44px — 세로 패딩을 음수 마진으로 상쇄해 행 높이는 그대로 */}
          <button
            onClick={() => setIsCollapsed((v) => !v)}
            aria-expanded={isExpanded}
            aria-controls={listId}
            className={cn(
              "clickable press-text shrink-0 inline-flex items-center gap-1 -my-3.5 py-3.5 px-1",
              "text-xs text-muted-foreground hover:text-foreground",
            )}
          >
            {isExpanded ? "목록 숨기기" : "전체 목록"}
            {isExpanded ? (
              <ChevronUp className="h-3.5 w-3.5" aria-hidden />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" aria-hidden />
            )}
          </button>
        </div>

        {isExpanded && (
          <div
            id={listId}
            className="rounded-lg border border-border bg-muted/40 dark:bg-muted/20"
          >
            <SeriesList
              seriesName={seriesName}
              posts={posts}
              currentIndex={currentIndex}
              via="footer_list"
            />
          </div>
        )}
      </nav>
    );
  }

  return (
    <nav
      aria-label={`${seriesName} 시리즈 네비게이션`}
      className="my-8 rounded-lg border border-border bg-muted/40 dark:bg-muted/20"
    >
      {/* 헤더 */}
      <div
        className={cn(
          "flex items-center justify-between px-4 py-3",
          isExpanded && "border-b border-border",
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-medium text-muted-foreground shrink-0">
            시리즈
          </span>
          <span className="font-semibold text-sm truncate">{seriesName}</span>
        </div>

        {isExpanded ? (
          <div className="flex items-center gap-3 shrink-0 ml-4">
            <button
              onClick={() => setIsCollapsed(true)}
              aria-expanded={true}
              aria-controls={listId}
              aria-label="시리즈 목록 숨기기"
              className="clickable press-text text-xs text-muted-foreground hover:text-foreground"
            >
              숨기기
            </button>
            <span className="text-xs text-muted-foreground">
              {currentIndex + 1} / {posts.length}
            </span>
            <NavArrows
              seriesName={seriesName}
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
              onClick={() => setIsCollapsed(false)}
              aria-expanded={false}
              aria-controls={listId}
              aria-label="시리즈 목록 보기"
              className="clickable press-text text-xs text-muted-foreground hover:text-foreground"
            >
              목록
            </button>
            <NavArrows
              seriesName={seriesName}
              prevPost={prevPost}
              nextPost={nextPost}
              compact={true}
            />
          </div>
        )}
      </div>

      {/* 펼쳐진 목록 */}
      {isExpanded && (
        <div id={listId}>
          <SeriesList
            seriesName={seriesName}
            posts={posts}
            currentIndex={currentIndex}
            via="list"
          />
        </div>
      )}
    </nav>
  );
}

function SeriesList({
  seriesName,
  posts,
  currentIndex,
  via,
}: SeriesData & { via: "list" | "footer_list" }) {
  return (
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
                onClick={() =>
                  trackEvent("series_navigate", {
                    series: seriesName,
                    via,
                    to_slug: post.slug,
                  })
                }
                className={cn(
                  "clickable press-row flex items-start gap-3 px-4 py-2",
                  "hover:bg-muted/60 dark:hover:bg-muted/30",
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
  );
}

function NavArrows({
  seriesName,
  prevPost,
  nextPost,
  compact,
}: {
  seriesName: string;
  prevPost: SeriesPost | null;
  nextPost: SeriesPost | null;
  compact: boolean;
}) {
  const baseClass =
    "clickable press-icon flex items-center justify-center w-6 h-6 rounded text-sm";
  const activeClass =
    "text-foreground hover:bg-muted dark:hover:bg-muted/60 cursor-pointer";
  const disabledClass = "text-muted-foreground/30 cursor-default";

  return (
    <div className="flex items-center gap-1">
      {prevPost ? (
        <Link
          href={`/posts/${encodeURIComponent(prevPost.slug)}`}
          onClick={() =>
            trackEvent("series_navigate", {
              series: seriesName,
              via: "prev",
              to_slug: prevPost.slug,
            })
          }
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
          onClick={() =>
            trackEvent("series_navigate", {
              series: seriesName,
              via: "next",
              to_slug: nextPost.slug,
            })
          }
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
