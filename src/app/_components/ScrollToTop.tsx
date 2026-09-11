"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUp } from "lucide-react";
import { useScrollChrome } from "@/src/app/lib/useScrollChrome";

// globals.css의 읽기 chrome 브레이크포인트(xl 미만)와 같은 값.
const NARROW = "(max-width: 79.99rem)";

export function ScrollToTop() {
  const { past, down, idle } = useScrollChrome();
  const [narrow, setNarrow] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const mq = window.matchMedia(NARROW);
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // xl 미만에서는 MobileToc 알약과 한 몸으로: 위로 스크롤하면(주소창이 펼쳐지는 순간) 즉시 빠진다.
  // 데스크톱은 주소창이 없으니 문턱만 본다.
  const visible = past && (down || !narrow);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const enter = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, y: 8, scale: 0.96 };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={enter}
          animate={{ opacity: idle ? 0.3 : 1, y: 0, scale: 1 }}
          exit={{ ...enter, transition: { duration: 0.15 } }}
          transition={{
            duration: idle ? 0.3 : 0.2,
            ease: "easeOut",
            opacity: { duration: idle ? 0.3 : 0.12 },
          }}
          onClick={scrollToTop}
          aria-label="맨 위로 이동"
          className="fixed bottom-4 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background/80 backdrop-blur-sm text-primary clickable press-icon"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
