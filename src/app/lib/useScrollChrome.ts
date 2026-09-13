"use client";

import { useEffect, useRef, useState } from "react";
import { SCROLL_RESTORED_EVENT } from "@/src/app/_components/PageTransition";

// 이 문턱을 넘어야 읽기 chrome(헤더 숨김 + 하단 컨트롤)이 켜진다.
const SHOW_AFTER = 300;
// 스크롤이 멈추고 이만큼 지나면 하단 컨트롤이 가라앉는다.
const IDLE_AFTER_MS = 1000;
// 손가락 떨림에 방향이 뒤집히지 않도록 두는 데드존.
const DIRECTION_DEADZONE = 8;

export type ScrollChrome = {
  /** 문턱(300px)을 넘어 내려가 있는가 — 방향과 무관. */
  past: boolean;
  /**
   * 마지막 판정 방향이 아래인가. 위로 데드존만 넘어도 즉시 false가 된다 —
   * 모바일 브라우저 주소창이 펼쳐지는 바로 그 순간이라 하단 컨트롤이 같이 빠져야 한다.
   */
  down: boolean;
  /** 스크롤이 멈추고 1초 지났는가. */
  idle: boolean;
};

/**
 * MobileToc·ScrollToTop이 공유하는 스크롤 방향/문턱/idle 판정.
 * 헤더는 `down`에 맞춰 숨고, 하단 컨트롤은 `past && down`일 때만 뜬다 —
 * 상단 chrome과 하단 chrome이 서로 반대로, 같은 순간에 움직이도록.
 */
export function useScrollChrome(): ScrollChrome {
  const [past, setPast] = useState(false);
  const [down, setDown] = useState(false);
  const [idle, setIdle] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      const pastThreshold = y > SHOW_AFTER;

      setPast(pastThreshold);
      setIdle(false);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setIdle(true), IDLE_AFTER_MS);

      // 아래로: 문턱을 넘었을 때만. 위로: 데드존만 넘으면 즉시.
      if (delta > DIRECTION_DEADZONE && pastThreshold) {
        setDown(true);
        lastY.current = y;
      } else if (delta < -DIRECTION_DEADZONE || !pastThreshold) {
        setDown(false);
        lastY.current = y;
      }
    };

    // 뒤로가기 복원 스크롤은 사용자의 읽기 동작이 아니다 — 기준점만 옮기고 방향은 그대로 둔다.
    const onRestored = () => {
      lastY.current = window.scrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener(SCROLL_RESTORED_EVENT, onRestored);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener(SCROLL_RESTORED_EVENT, onRestored);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  return { past, down, idle };
}
