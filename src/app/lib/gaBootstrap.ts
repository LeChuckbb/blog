import { siteConfig } from "@/src/app/config/siteConfig";
import { GA_MEASUREMENT_ID } from "@/src/app/lib/gtag";

const PRODUCTION_HOST = new URL(siteConfig.url).host;

/**
 * gtag 부트스트랩 스크립트 본문. layout의 <head>에 인라인해 gtag/js보다 먼저,
 * 그리고 첫 page_view보다 먼저 동기 실행시킨다.
 *
 * next/script로 넣지 않는 이유: 클라이언트 컴포넌트 안의 인라인 Script는 SSR HTML에
 * 실리지 않아 외부 gtag/js와의 실행 순서를 보장할 수 없다. 여기서는 순서가 곧 정확도다.
 *
 * - 호스트 가드: 프로덕션 도메인이 아니면 config 자체를 하지 않는다. localhost(pnpm dev)와
 *   Vercel 프리뷰 배포가 실서비스 속성에 섞이던 걸 여기서 끊는다.
 * - 옵트아웃: `?ga=off`로 한 번 들어온 기기는 localStorage에 표식을 남기고 이후 히트에
 *   traffic_type=internal이 붙는다. 차단이 아니라 라벨링이라 GA4 데이터 필터로 제외하면서도
 *   실시간 보고서로 배포 검증은 계속 할 수 있다. (해제는 `?ga=on`)
 * - send_page_view=false: page_view는 GoogleAnalytics 컴포넌트가 전부 책임진다.
 * - user_properties: preferred_theme / visit_bucket / reader_depth. 기기에 붙는 라벨이라
 *   이벤트가 아니라 여기서 한 번 set 한다. GA4 관리 > 맞춤 정의에 '사용자 속성'으로
 *   등록해야 보고서에 나타난다.
 */
export function gaBootstrapScript(): string | null {
  if (!GA_MEASUREMENT_ID) return null;

  return `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
if (location.host === ${JSON.stringify(PRODUCTION_HOST)}) {
  var internal = false;
  try {
    var mode = new URLSearchParams(location.search).get("ga");
    if (mode === "off") localStorage.setItem("ga_internal", "1");
    if (mode === "on") localStorage.removeItem("ga_internal");
    internal = localStorage.getItem("ga_internal") === "1";
  } catch (e) {
    // 사생활 보호 모드 등에서 localStorage 접근이 막히면 일반 트래픽으로 둔다.
  }
  // 사용자 속성: 이벤트가 아니라 기기에 붙어 따라다니는 라벨.
  // config보다 먼저 set 해야 첫 히트부터 실린다.
  var props = {};
  try {
    // next-themes가 쓰는 키를 그대로 읽는다. "system"이면 실제 적용된 쪽을 쓴다.
    var stored = localStorage.getItem("theme");
    props.preferred_theme = (stored === "dark" || stored === "light")
      ? stored
      : (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

    // 세션당 한 번만 센다. 페이지 이동마다 세면 방문 횟수가 아니라 조회수가 된다.
    var visits = parseInt(localStorage.getItem("ga_visits") || "0", 10) || 0;
    if (!sessionStorage.getItem("ga_session")) {
      visits += 1;
      localStorage.setItem("ga_visits", String(visits));
      sessionStorage.setItem("ga_session", "1");
    }
    props.visit_bucket = visits <= 1 ? "first" : (visits <= 5 ? "returning" : "regular");

    // 지금까지 읽은 고유 글 수의 구간. 누적 기록은 trackPageView가 하고
    // 여기서는 직전 방문까지의 값을 읽어 구간만 계산한다.
    var seen = (JSON.parse(localStorage.getItem("ga_posts_seen") || "[]") || []).length;
    props.reader_depth = seen === 0 ? "0"
      : (seen === 1 ? "1" : (seen <= 4 ? "2-4" : (seen <= 9 ? "5-9" : "10+")));
  } catch (e) {
    // localStorage가 막힌 환경에서는 속성 없이 보낸다.
  }

  gtag("set", "user_properties", props);
  gtag("js", new Date());
  gtag("config", ${JSON.stringify(GA_MEASUREMENT_ID)}, internal
    ? { send_page_view: false, traffic_type: "internal" }
    : { send_page_view: false });
}
`.trim();
}
