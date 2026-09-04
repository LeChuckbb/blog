"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { GA_MEASUREMENT_ID, trackPageView } from "@/src/app/lib/gtag";

/**
 * gtag 라이브러리 로드 + page_view 전송.
 * dataLayer 초기화와 config는 layout <head>의 부트스트랩(gaBootstrap.ts)이 이미 끝냈다.
 */
export function GoogleAnalytics() {
  const pathname = usePathname();

  // 소프트 내비게이션 포함 모든 경로 변경에서 page_view를 보낸다.
  // 쿼리스트링은 의도적으로 보지 않는다 — useSearchParams를 쓰면 이 컴포넌트를 감싼
  // 트리가 정적 생성에서 빠지고, 이 블로그는 쿼리로 콘텐츠가 갈리지 않는다.
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;
    trackPageView(pathname);
  }, [pathname]);

  if (!GA_MEASUREMENT_ID) return null;

  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      strategy="afterInteractive"
    />
  );
}
