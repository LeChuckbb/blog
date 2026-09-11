"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { List } from "lucide-react";
import type { TocItem } from "@/src/app/lib/tocUtil";
import TableOfContents from "@/src/app/_components/TableOfContents";
import { trackEvent } from "@/src/app/lib/gtag";
import { useScrollChrome } from "@/src/app/lib/useScrollChrome";

// 헤딩이 이 선 위로 올라가면 그 섹션을 읽는 중으로 본다.
const ACTIVE_LINE = 80;

function flatten(items: TocItem[]): TocItem[] {
  return items.flatMap((item) => [item, ...flatten(item.children ?? [])]);
}

/**
 * xl 미만 글 페이지의 읽기 chrome.
 * - 300px 넘게 내려가면 상단 헤더를 숨기고(html[data-reading-chrome]) 좌하단에 현재 섹션 알약을 띄운다.
 * - 위로 스크롤하면 헤더가 돌아오고 알약은 그 즉시 빠진다 — 모바일 주소창이 펼쳐지는 순간과 겹친다.
 * - 알약을 탭하면 바텀시트로 목차를 연다. 목차 자체는 데스크톱과 같은 TableOfContents를 재사용한다.
 */
export function MobileToc({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const { past, down, idle } = useScrollChrome();
  const reduceMotion = useReducedMotion();

  const flat = flatten(items);
  const activeText = flat.find((h) => h.id === activeId)?.text ?? "목차";
  // 하단 컨트롤은 헤더와 반대로: 헤더가 숨은 동안만 뜬다.
  const visible = past && down;

  // 헤더 숨김은 방향만 따른다(문턱은 훅이 이미 본다).
  useEffect(() => {
    const root = document.documentElement;
    if (down) root.dataset.readingChrome = "hidden";
    else delete root.dataset.readingChrome;
    return () => {
      delete root.dataset.readingChrome;
    };
  }, [down]);

  useEffect(() => {
    const updateActive = () => {
      let current: string | null = null;
      for (const { id } of flat) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= ACTIVE_LINE) current = id;
        else break;
      }
      setActiveId(current);
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    return () => window.removeEventListener("scroll", updateActive);
    // items는 글이 바뀌면 컴포넌트째 다시 마운트되므로 flat만 의존한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  // 시트가 열린 동안 뒤 본문이 스크롤되지 않게.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const openSheet = () => {
    trackEvent("toc_sheet_open", { heading_id: activeId ?? "" });
    setOpen(true);
  };

  if (flat.length === 0) return null;

  const enter = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, y: 8, scale: 0.96 };

  return (
    <div className="xl:hidden">
      <AnimatePresence>
        {visible && !open && (
          <motion.button
            key="pill"
            initial={enter}
            animate={{ opacity: idle ? 0.3 : 1, y: 0, scale: 1 }}
            exit={{ ...enter, transition: { duration: 0.15 } }}
            transition={{
              duration: idle ? 0.3 : 0.2,
              ease: "easeOut",
              opacity: { duration: idle ? 0.3 : 0.12 },
            }}
            onClick={openSheet}
            aria-label={`목차 열기 · 현재 ${activeText}`}
            className="fixed bottom-4 left-6 z-50 flex h-10 max-w-[calc(100%-100px)] items-center gap-2 rounded-lg border border-border bg-background/80 px-3 backdrop-blur-sm text-foreground clickable press-icon"
          >
            <List className="h-4 w-4 shrink-0 text-primary" />
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={activeText}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="truncate text-[13px] font-medium"
              >
                {activeText}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[60] bg-black/45"
            />
            <motion.div
              key="sheet"
              role="dialog"
              aria-modal="true"
              aria-label="목차"
              initial={reduceMotion ? { opacity: 0 } : { y: "100%" }}
              animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { y: "100%" }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="fixed inset-x-0 bottom-0 z-[70] flex max-h-[70vh] flex-col rounded-t-xl border border-b-0 border-border bg-background"
            >
              <div className="flex justify-center pt-2.5">
                <div className="h-1 w-9 rounded-full bg-muted" />
              </div>
              <div className="flex items-center justify-between border-b border-border px-4 pb-3 pt-2.5">
                <span className="text-xs font-medium text-muted-foreground">
                  목차
                </span>
                <button
                  onClick={() => setOpen(false)}
                  className="clickable press-text text-xs text-muted-foreground hover:text-foreground"
                >
                  닫기
                </button>
              </div>
              {/* 항목 클릭은 TableOfContents가 스크롤을 맡고, 여기서는 시트만 닫는다. */}
              <div
                className="overflow-y-auto px-2 pb-6"
                onClickCapture={(e) => {
                  if ((e.target as HTMLElement).closest("a[data-toc-id]"))
                    setOpen(false);
                }}
              >
                <TableOfContents items={items} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
