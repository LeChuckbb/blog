"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * 페이지 전환의 두 가지 뒷받침.
 *
 * 1. 방향을 <html data-nav="push|pop|ua">로 남긴다. 전환 자체는 next-view-transitions가
 *    startViewTransition으로 감싸고, 어느 쪽에서 들어올지는 globals.css의 ::view-transition-*
 *    규칙이 이 속성을 본다. "ua"는 브라우저가 이미 화면을 밀어준 경우(iOS 스와이프 뒤로가기).
 *
 * 2. 스크롤 변화를 전환 "앞"으로 옮긴다. WebKit은 전환 커밋 창에서 문서 스크롤이 바뀌면
 *    새 레이어보다 스크롤을 먼저 반영해 "옛 화면이 튄" 그림을 1~2프레임 그린다(iOS 깜빡임).
 *    그래서 이동이 시작되는 순간(클릭·뒤로가기) 목적지 스크롤로 먼저 옮기되, main을 그만큼
 *    translate로 되돌려 눈에는 그대로 보이게 하고, 새 경로가 그려지는 커밋에서 translate만
 *    지운다 — 커밋 시점엔 스크롤 변화가 없다. 뒤로가기의 목적지 스크롤은 우리가 저장해 둔다
 *    (브라우저 복원은 manual — 미리 옮긴 값이 저장되면 엉뚱한 곳으로 돌아간다).
 */
type NavigateEvent = Event & {
  navigationType?: string;
  hasUAVisualTransition?: boolean;
  destination?: { url: string };
};

const SCROLL_KEY = "page-transition:scroll";
const pending = { from: 0, target: 0, active: false };

const keyOf = (url: string) => {
  const u = new URL(url, location.href);
  return u.pathname + u.search;
};

function readScrollMap(): Record<string, number> {
  try {
    return JSON.parse(sessionStorage.getItem(SCROLL_KEY) || "{}");
  } catch {
    return {};
  }
}

function rememberScroll() {
  try {
    const map = readScrollMap();
    map[keyOf(location.href)] = window.scrollY;
    sessionStorage.setItem(SCROLL_KEY, JSON.stringify(map));
  } catch {
    // sessionStorage가 막힌 환경: 뒤로가기가 맨 위로 간다(브라우저 manual 복원과 같다).
  }
}

/** 전환이 시작되기 전에 목적지 스크롤로 옮기고, 그만큼 main을 되돌려 화면은 그대로 둔다. */
function preScroll(target: number) {
  const main = document.querySelector("main");
  const from = window.scrollY;
  if (!main) return;
  window.scrollTo(0, target);
  const moved = window.scrollY - from; // 짧은 페이지에서는 clamp될 수 있어 실제 이동량을 쓴다
  pending.from = from;
  pending.target = target;
  pending.active = true;
  if (moved !== 0) main.style.translate = `0 ${moved}px`;
}

function settle() {
  const main = document.querySelector("main");
  if (main) main.style.translate = "";
  // 떠난 페이지가 짧아 목표까지 못 갔으면 새 페이지에서 마저 간다(드문 경우라 유령 프레임을 감수한다).
  if (pending.active && window.scrollY !== pending.target)
    window.scrollTo(0, pending.target);
  pending.active = false;
}

export function PageTransitionDirection() {
  const pathname = usePathname();

  // 새 경로가 그려지는 커밋: 미리 옮겨 둔 스크롤에 맞춰 두었던 translate를 걷는다.
  useLayoutEffect(() => {
    settle();
  }, [pathname]);

  useEffect(() => {
    const html = document.documentElement;
    const navigation = (window as Window & { navigation?: EventTarget })
      .navigation;

    history.scrollRestoration = "manual";
    const onPageHide = () => {
      // 새로고침·외부 이탈은 브라우저가 복원하도록 되돌린다.
      history.scrollRestoration = "auto";
    };
    window.addEventListener("pagehide", onPageHide);

    // 사이트 안 링크 클릭: 라우터보다 먼저 본다. 떠나는 위치를 기억하고 맨 위로 미리 옮긴다.
    let undo: ReturnType<typeof setTimeout> | undefined;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest("a[href]");
      if (!(a instanceof HTMLAnchorElement) || a.target === "_blank") return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname)
        return;
      html.dataset.nav = "push";
      rememberScroll();
      preScroll(0);
      // 이동이 취소되면(드물다) 원래 자리로 되돌린다.
      clearTimeout(undo);
      undo = setTimeout(() => {
        if (!pending.active) return;
        const from = pending.from;
        settle();
        window.scrollTo(0, from);
      }, 3000);
    };
    document.addEventListener("click", onClick, true);

    // 뒤로/앞으로: 떠나는 위치를 기억하고, 목적지에 저장된 위치로 미리 옮긴다.
    const onTraverse = (destination: string, ua: boolean) => {
      html.dataset.nav = ua ? "ua" : "pop";
      rememberScroll();
      preScroll(readScrollMap()[keyOf(destination)] ?? 0);
    };

    let cleanup: () => void;
    if (navigation) {
      // Navigation API: push/traverse를 한 곳에서 구분하고 목적지 URL도 준다.
      // 뒤로가기 처리 중 라우터가 replaceState를 부르므로 replace는 아무것도 바꾸지 않는다.
      const onNavigate = (e: Event) => {
        const { navigationType, hasUAVisualTransition, destination } =
          e as NavigateEvent;
        if (navigationType === "traverse" && destination)
          onTraverse(destination.url, !!hasUAVisualTransition);
      };
      navigation.addEventListener("navigate", onNavigate);
      cleanup = () => navigation.removeEventListener("navigate", onNavigate);
    } else {
      // 폴백: popstate 시점에는 location이 이미 목적지다.
      const onPopState = (e: PopStateEvent) =>
        onTraverse(location.href, !!(e as NavigateEvent).hasUAVisualTransition);
      window.addEventListener("popstate", onPopState);
      cleanup = () => window.removeEventListener("popstate", onPopState);
    }

    return () => {
      clearTimeout(undo);
      window.removeEventListener("pagehide", onPageHide);
      document.removeEventListener("click", onClick, true);
      cleanup();
    };
  }, []);

  return null;
}
