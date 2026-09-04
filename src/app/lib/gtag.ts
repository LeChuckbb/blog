// GA4 계측 헬퍼.
//
// "보낼지 말지"는 전부 GoogleAnalytics 컴포넌트의 부트스트랩이 판단한다
// (프로덕션 호스트인가, 이 기기가 옵트아웃했는가). 여기서는 gtag이 살아 있으면
// 보내기만 한다 — 호출부가 환경을 신경 쓰지 않게 하려는 분리다.
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/** 이 블로그에서 의미가 있는 행동만 이름을 고정해 둔다. 오타로 새 이벤트가 생기는 걸 막는다. */
// 읽은 글을 기기에 누적해 둔다. 다음 방문의 reader_depth 계산에 쓰인다(gaBootstrap.ts).
// 여기서 속성을 갱신하지 않는 이유: 사용자 속성은 히트에 실려 나가는 값이라
// 방문 도중 바꾸면 같은 세션 안에서 값이 갈린다. 구간은 방문 시작 시점에 고정한다.
const SEEN_POSTS_KEY = "ga_posts_seen";
const SEEN_POSTS_LIMIT = 200;

function rememberPost(pathname: string) {
  if (!pathname.startsWith("/posts/")) return;
  try {
    const seen: string[] = JSON.parse(
      localStorage.getItem(SEEN_POSTS_KEY) || "[]",
    );
    const slug = decodeURIComponent(pathname.slice("/posts/".length));
    if (seen.includes(slug)) return;
    seen.push(slug);
    localStorage.setItem(
      SEEN_POSTS_KEY,
      JSON.stringify(seen.slice(-SEEN_POSTS_LIMIT)),
    );
  } catch {
    // localStorage가 막힌 환경에서는 누적하지 않는다.
  }
}

export type GaEventName =
  | "code_copy"
  | "toc_navigate"
  | "series_navigate"
  | "theme_change";

type GaParams = Record<string, string | number | boolean>;

export function trackEvent(name: GaEventName, params?: GaParams) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
}

// config에서 send_page_view를 껐기 때문에 첫 진입분까지 여기서 보낸다.
// GA4 '향상된 측정'의 history 기반 자동 수집에 기대지 않으려는 것이다.
export function trackPageView(pathname: string) {
  if (typeof window === "undefined") return;
  rememberPost(pathname);
  window.gtag?.("event", "page_view", {
    page_path: pathname,
    page_location: window.location.href,
    page_title: document.title,
  });
}
