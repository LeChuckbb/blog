"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { List } from "lucide-react";
import type { TocItem } from "@/src/app/lib/tocUtil";
import TableOfContents from "@/src/app/_components/TableOfContents";
import { trackEvent } from "@/src/app/lib/gtag";

// ScrollToTop과 같은 문턱·fade 규칙을 공유해 두 컨트롤이 한 몸처럼 움직인다.
const SHOW_AFTER = 300;
const FADE_AFTER_MS = 1000;
// 손가락 떨림에 헤더가 깜빡이지 않도록 방향 판정에 두는 데드존.
const DIRECTION_DEADZONE = 8;
// 헤딩이 이 선 위로 올라가면 그 섹션을 읽는 중으로 본다.
const ACTIVE_LINE = 80;

function flatten(items: TocItem[]): TocItem[] {
  return items.flatMap((item) => [item, ...flatten(item.children ?? [])]);
}

/**
 * xl 미만 글 페이지의 읽기 chrome.
 * - 300px 넘게 내려가면 상단 헤더를 숨기고(html[data-reading-chrome]) 좌하단에 현재 섹션 알약을 띄운다.
 * - 알약을 탭하면 바텀시트로 목차를 연다. 목차 자체는 데스크톱과 같은 TableOfContents를 재사용한다.
 */
export function MobileToc({ items }: { items: TocItem[] }) {
  const [visible, setVisible] = useState(false);
  const [faded, setFaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const fadeTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const lastY = useRef(0);
  const reduceMotion = useReducedMotion();

  const flat = flatten(items);
  const activeText = flat.find((h) => h.id === activeId)?.text ?? "목차";

  const setHeaderHidden = useCallback((hidden: boolean) => {
    const root = document.documentElement;
    if (hidden) root.dataset.readingChrome = "hidden";
    else delete root.dataset.readingChrome;
  }, []);

  useEffect(() => {
    lastY.current = window.scrollY;

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

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      const pastThreshold = y > SHOW_AFTER;

      setVisible(pastThreshold);
      setFaded(false);
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
      fadeTimer.current = setTimeout(() => setFaded(true), FADE_AFTER_MS);

      // 아래로: 문턱을 넘었을 때만 숨김. 위로: 데드존만 넘으면 즉시 복귀.
      if (delta > DIRECTION_DEADZONE && pastThreshold) {
        setHeaderHidden(true);
        lastY.current = y;
      } else if (delta < -DIRECTION_DEADZONE || !pastThreshold) {
        setHeaderHidden(false);
        lastY.current = y;
      }

      updateActive();
    };

    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
      setHeaderHidden(false);
    };
    // items는 글이 바뀌면 컴포넌트째 다시 마운트되므로 flat만 의존한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, setHeaderHidden]);

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
            animate={{ opacity: faded ? 0.3 : 1, y: 0, scale: 1 }}
            exit={{ ...enter, transition: { duration: 0.15 } }}
            transition={{
              duration: faded ? 0.3 : 0.2,
              ease: "easeOut",
              opacity: { duration: faded ? 0.3 : 0.12 },
            }}
            onClick={openSheet}
            aria-label={`목차 열기 · 현재 ${activeText}`}
            className="fixed bottom-6 left-6 z-50 flex h-10 max-w-[calc(100%-100px)] items-center gap-2 rounded-lg border border-border bg-background/80 px-3 backdrop-blur-sm text-foreground clickable press-icon"
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
