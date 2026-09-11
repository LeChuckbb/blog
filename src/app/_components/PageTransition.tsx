"use client";

import { useEffect } from "react";

/**
 * 페이지 전환 방향을 <html data-nav="push|pop|ua">로 남긴다.
 * 전환 자체는 next-view-transitions가 startViewTransition으로 감싸고,
 * 어느 쪽으로 밀릴지는 globals.css의 ::view-transition-* 규칙이 이 속성을 보고 정한다.
 * "ua"는 브라우저가 이미 화면을 밀어준 경우(iOS 스와이프 뒤로가기) — 우리 애니메이션을
 * 한 번 더 돌리면 두 번 그려져 깜빡이므로 CSS가 0ms로 넘긴다.
 */
type UaTransitionEvent = Event & { hasUAVisualTransition?: boolean };
export function PageTransitionDirection() {
  useEffect(() => {
    const html = document.documentElement;
    const navigation = (
      window as Window & {
        navigation?: EventTarget;
      }
    ).navigation;

    // Navigation API가 있으면 push/replace/traverse를 한 곳에서 구분할 수 있다.
    if (navigation) {
      const onNavigate = (e: Event) => {
        const { navigationType, hasUAVisualTransition } =
          e as UaTransitionEvent & {
            navigationType?: string;
          };
        // 뒤로가기 처리 중 라우터가 replaceState를 부르므로 replace는 방향을 바꾸지 않는다.
        if (navigationType === "traverse")
          html.dataset.nav = hasUAVisualTransition ? "ua" : "pop";
        else if (navigationType === "push") html.dataset.nav = "push";
      };
      navigation.addEventListener("navigate", onNavigate);
      return () => navigation.removeEventListener("navigate", onNavigate);
    }

    // 폴백: 뒤로/앞으로는 popstate, 그 외 클릭 이동은 push로 본다.
    const onPopState = (e: PopStateEvent) => {
      html.dataset.nav = (e as UaTransitionEvent).hasUAVisualTransition
        ? "ua"
        : "pop";
    };
    const onClick = () => {
      html.dataset.nav = "push";
    };
    window.addEventListener("popstate", onPopState);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("popstate", onPopState);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}
