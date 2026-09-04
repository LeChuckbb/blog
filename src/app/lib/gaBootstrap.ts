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
  gtag("js", new Date());
  gtag("config", ${JSON.stringify(GA_MEASUREMENT_ID)}, internal
    ? { send_page_view: false, traffic_type: "internal" }
    : { send_page_view: false });
}
`.trim();
}
