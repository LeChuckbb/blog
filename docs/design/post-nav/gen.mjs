import { writeFileSync } from "node:fs";

const PREV = { title: "Next.js URL Search Params 꼭 써보세요", date: "2024.12.22" };
const NEXT = { title: "원티드 하이파이브 2026 후기 - AI 시대에서 살아남기", date: "2026.05.19" };

const HELMET = `
<helmet>
  <style>
    :root {
      --background: oklch(0.982 0.005 95);
      --foreground: oklch(0.245 0.006 286);
      --primary: oklch(0.59 0.20 277);
      --muted: oklch(0.955 0.005 95);
      --muted-40: oklch(0.955 0.005 95 / 40%);
      --muted-foreground: oklch(0.571 0.006 107);
      --border: oklch(0.913 0.007 89);
      --accent: oklch(0.94 0.04 277);
    }
    .dark {
      --background: oklch(0.228 0.008 286);
      --foreground: oklch(0.942 0.005 107);
      --primary: oklch(0.72 0.18 277);
      --muted: oklch(0.320 0.011 286);
      --muted-40: oklch(0.320 0.011 286 / 20%);
      --muted-foreground: oklch(0.705 0.006 107);
      --border: oklch(1 0 0 / 10%);
      --accent: oklch(0.22 0.06 277);
    }
    body { margin: 0; }
    .page {
      font-family: "Asta Sans Variable", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
      letter-spacing: -0.01em; word-break: keep-all; line-height: 1.75;
      background: var(--background); color: var(--foreground);
      -webkit-font-smoothing: antialiased;
    }
    .serif { font-family: "MaruBuri", "Apple SD Gothic Neo", serif; }
    a { color: var(--primary); text-decoration: none; }
    a:hover { color: var(--primary); }
    .row:hover { background: var(--muted); }
    .card:hover { background: var(--muted); }
    .row:hover .t, .card:hover .t, .cell:hover .t { text-decoration: underline; text-underline-offset: 3px; }
    .prose p { margin: 0; font-size: 1.0625rem; line-height: 1.75; }
    .prose hr { border: 0; border-top: 1px solid var(--border); margin: 3em 0; }
  </style>
</helmet>`;

const PARA = `
<div class="prose">
  <p>에러 설계에 있어 중요한 지점은 에러 객체 구조를 짜는 게 아니라 에러의 흐름을 통제하는 것이다. Server side/Client side에서 에러가 발생할 때, 그리고 Server Action, RSC, proxy, useQuery, useMutation과 같은 다양한 상황에서 발생하는 에러가 어디에서 어떻게 처리되는지. 이 핵심 부분은 별도 글에서 이어가보겠다.</p>
</div>`;

const ARROW_L = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5"></path><path d="m12 19-7-7 7-7"></path></svg>`;
const ARROW_R = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>`;
const CHEV_L = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg>`;
const CHEV_R = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>`;
const CHEV_UP = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m18 15-6-6-6 6"></path></svg>`;
const CHEV_DOWN_S = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>`;
const CHEV_UP_S = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m18 15-6-6-6 6"></path></svg>`;
const LIST_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h16"></path><path d="M4 12h16"></path><path d="M4 18h10"></path></svg>`;

// 모바일 실제 크롬: MobileToc 알약(좌하단) + ScrollToTop(우하단), 둘 다 bottom-6 h-10
const MOBILE_CHROME = `
<div style="position: absolute; left: 24px; bottom: 24px; display: flex; align-items: center; gap: 8px; height: 40px; padding: 0 12px; border-radius: 10px; border: 1px solid var(--border); background: var(--background); color: var(--foreground); font-size: 0.875rem; box-sizing: border-box;">${LIST_ICON}<span>마치며</span></div>
<div style="position: absolute; right: 24px; bottom: 24px; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 10px; border: 1px solid var(--border); background: var(--background); color: var(--primary); box-sizing: border-box;">${CHEV_UP}</div>`;

const LABEL = (text, dir) => `<span style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.75rem; color: var(--muted-foreground); line-height: 1.25;">${dir === "l" ? ARROW_L : ""}<span>${text}</span>${dir === "r" ? ARROW_R : ""}</span>`;

// ── A: 구분선형 (권장) ─────────────────────────────────────
function navA(mobile) {
  const cell = (post, side) => `
  <a href="#" class="cell" style="display: flex; flex-direction: column; gap: 6px; min-width: 0; min-height: 44px; align-items: ${!mobile && side === "r" ? "flex-end" : "flex-start"}; text-align: ${!mobile && side === "r" ? "right" : "left"};">
    ${LABEL(side === "l" ? "이전 글" : "다음 글", side)}
    <span class="t" style="font-size: 0.9375rem; font-weight: 600; color: var(--primary); line-height: 1.5;">${post.title}</span>
    <span class="serif" style="font-size: 0.75rem; color: var(--muted-foreground); line-height: 1.25;">${post.date}</span>
  </a>`;
  return `
<nav aria-label="이전 글 / 다음 글" style="margin-top: 64px; padding-top: 32px; border-top: 1px solid var(--border); display: grid; grid-template-columns: ${mobile ? "repeat(1, minmax(0, 1fr))" : "repeat(2, minmax(0, 1fr))"}; gap: ${mobile ? "20px" : "32px"};">
  ${cell(PREV, "l")}
  ${cell(NEXT, "r")}
</nav>`;
}

// ── B: 카드형 (SeriesNav 박스 어휘) ─────────────────────────
function navB(mobile) {
  const card = (post, side) => `
  <a href="#" class="card" style="display: flex; align-items: center; gap: 12px; min-width: 0; padding: 14px 16px; border: 1px solid var(--border); border-radius: 10px; background: var(--muted-40); ${side === "r" ? "flex-direction: row-reverse; text-align: right;" : ""}">
    <span style="display: flex; flex-shrink: 0; color: var(--muted-foreground);">${side === "l" ? CHEV_L : CHEV_R}</span>
    <span style="display: flex; flex-direction: column; gap: 4px; min-width: 0;">
      <span style="font-size: 0.75rem; color: var(--muted-foreground); line-height: 1.25;">${side === "l" ? "이전 글" : "다음 글"}</span>
      <span class="t" style="font-size: 0.875rem; font-weight: 600; color: var(--foreground); line-height: 1.45;">${post.title}</span>
    </span>
  </a>`;
  return `
<nav aria-label="이전 글 / 다음 글" style="margin-top: 64px; display: grid; grid-template-columns: ${mobile ? "repeat(1, minmax(0, 1fr))" : "repeat(2, minmax(0, 1fr))"}; gap: 12px;">
  ${card(PREV, "l")}
  ${card(NEXT, "r")}
</nav>`;
}


// ── 최종: 시리즈 인지형 카드 내비 ───────────────────────────
const SERIES = {
  name: "브라우저 동작 원리",
  posts: [
    "브라우저의 렌더링 과정(Critical Rendering Path)",
    "브라우저 렌더링 최적화",
    "DOM API",
    "브라우저 이벤트",
  ],
  current: 2,
};
const S_PREV = { title: SERIES.posts[1] };
const S_NEXT = { title: SERIES.posts[3] };

function cardB(post, side, label) {
  return `
  <a href="#" class="card" style="display: flex; align-items: center; gap: 12px; min-width: 0; padding: 14px 16px; border: 1px solid var(--border); border-radius: 10px; background: var(--muted-40); ${side === "r" ? "flex-direction: row-reverse; text-align: right;" : ""}">
    <span style="display: flex; flex-shrink: 0; color: var(--muted-foreground);">${side === "l" ? CHEV_L : CHEV_R}</span>
    <span style="display: flex; flex-direction: column; gap: 4px; min-width: 0;">
      <span style="font-size: 0.75rem; color: var(--muted-foreground); line-height: 1.25;">${label}</span>
      <span class="t" style="font-size: 0.875rem; font-weight: 600; color: var(--foreground); line-height: 1.45;">${post.title}</span>
    </span>
  </a>`;
}

function seriesList() {
  return `
  <ol style="list-style: none; margin: 0; padding: 8px 0; border: 1px solid var(--border); border-radius: 10px; background: var(--muted-40); display: flex; flex-direction: column;">
    ${SERIES.posts.map((t, i) => {
      const cur = i === SERIES.current;
      return `<li style="display: flex; align-items: flex-start; gap: 12px; padding: 8px 16px; ${cur ? "background: var(--accent);" : ""}">
      <span style="flex-shrink: 0; width: 20px; text-align: right; font-family: D2Coding, ui-monospace, monospace; font-size: 0.75rem; line-height: 1.6; color: ${cur ? "var(--primary)" : "var(--muted-foreground)"}; font-weight: ${cur ? 600 : 400};">${i + 1}.</span>
      <span style="font-size: 0.875rem; line-height: 1.375; color: ${cur ? "var(--primary)" : "var(--foreground)"}; font-weight: ${cur ? 600 : 400};">${t}</span>
    </li>`;
    }).join("")}
  </ol>`;
}

function navFinal(mobile, { series = true, expanded = false } = {}) {
  const cols = mobile ? "repeat(1, minmax(0, 1fr))" : "repeat(2, minmax(0, 1fr))";
  const header = series ? `
  <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; min-width: 0;">
    <div style="display: flex; align-items: baseline; gap: 8px; min-width: 0;">
      <span style="flex-shrink: 0; font-size: 0.75rem; font-weight: 500; color: var(--muted-foreground);">시리즈</span>
      <span style="font-size: 0.875rem; font-weight: 600; color: var(--foreground); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${SERIES.name}</span>
      <span style="flex-shrink: 0; font-size: 0.75rem; color: var(--muted-foreground);">${SERIES.current + 1} / ${SERIES.posts.length}</span>
    </div>
    <button type="button" aria-expanded="${expanded}" style="flex-shrink: 0; display: inline-flex; align-items: center; gap: 4px; min-height: 44px; padding: 0 4px; border: 0; background: transparent; font: inherit; font-size: 0.75rem; color: var(--muted-foreground); cursor: pointer;">${expanded ? "목록 숨기기" : "전체 목록"}${expanded ? CHEV_UP_S : CHEV_DOWN_S}</button>
  </div>` : "";
  const cards = series
    ? cardB(S_PREV, "l", "시리즈 이전 글") + cardB(S_NEXT, "r", "시리즈 다음 글")
    : cardB(PREV, "l", "이전 글") + cardB(NEXT, "r", "다음 글");
  return `
<nav aria-label="${series ? SERIES.name + " 시리즈 · " : ""}이전 글 / 다음 글" style="margin-top: 64px; display: flex; flex-direction: column; gap: 12px;">
  ${header}
  ${expanded ? seriesList() : ""}
  <div style="display: grid; grid-template-columns: ${cols}; gap: 12px;">
    ${cards}
  </div>
</nav>`;
}

// ── C: 목록형 (홈 목록 행 어휘 그대로) ────────────────────────
function navC(mobile) {
  const row = (post, side) => `
  <a href="#" class="row" style="display: flex; align-items: baseline; gap: 16px; margin: 0 -12px; padding: 8px 12px; border-radius: 10px; min-height: 44px; box-sizing: border-box;">
    <span style="display: inline-flex; align-items: center; gap: 4px; flex-shrink: 0; width: 48px; font-size: 0.875rem; color: var(--muted-foreground);">${side === "l" ? ARROW_L : ARROW_R}<span>${side === "l" ? "이전" : "다음"}</span></span>
    <span class="t" style="font-size: 0.875rem; font-weight: 600; color: var(--primary); min-width: 0;">${post.title}</span>
  </a>`;
  return `
<nav aria-label="이전 글 / 다음 글" style="margin-top: 64px; padding-top: 24px; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 2px;">
  <span class="serif" style="font-size: 0.875rem; color: var(--muted-foreground); margin-bottom: 6px;">이어서 읽기</span>
  ${row(PREV, "l")}
  ${row(NEXT, "r")}
</nav>`;
}

function artboard(nav, mobile, w, h) {
  const pad = mobile ? "0 16px 96px" : "0 40px 96px";
  const paddingTop = mobile ? "24px" : "40px";
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>${HELMET}
<div class="page {{themeClass}}" style="position: relative; width: ${w}px; min-height: ${h}px; box-sizing: border-box; padding: ${paddingTop} ${mobile ? "16px" : "40px"} 96px;">
  <article style="max-width: 680px; margin: 0 auto; min-width: 0;">
    ${PARA}
    ${nav}
  </article>
  ${mobile ? MOBILE_CHROME : ""}
</div>
</x-dc>
<script data-dc-script data-props='{"dark":{"editor":"boolean","default":false,"tsType":"boolean"},"$preview":{"width":${w},"height":${h}}}'>
class Component extends DCLogic {
  renderVals() {
    return { themeClass: this.props.dark ? "dark" : "" };
  }
}
</script>
</body>
</html>
`;
}

const D = { w: 760, h: 560 };
const M = { w: 390, h: 720 };
const out = {
  "Main.dc.html": artboard(navFinal(false), false, D.w, D.h),
  "Main-Mobile.dc.html": artboard(navFinal(true), true, M.w, M.h),
  "SeriesExpanded.dc.html": artboard(navFinal(false, { expanded: true }), false, D.w, 760),
  "NoSeries.dc.html": artboard(navFinal(false, { series: false }), false, D.w, 520),
  "NoSeries-Mobile.dc.html": artboard(navFinal(true, { series: false }), true, M.w, 640),
  // 1차 탐색 (2페이지)
  "DirectionA.dc.html": artboard(navA(false), false, 760, 520),
  "A-Mobile.dc.html": artboard(navA(true), true, 390, 640),
  "DirectionB.dc.html": artboard(navB(false), false, 760, 520),
  "B-Mobile.dc.html": artboard(navB(true), true, 390, 640),
  "DirectionC.dc.html": artboard(navC(false), false, 760, 520),
  "C-Mobile.dc.html": artboard(navC(true), true, 390, 640),
};
for (const [f, s] of Object.entries(out)) writeFileSync(f, s);

const P2 = "page-2";
const canvas = {
  pages: [
    { id: "page-1", name: "최종 · 카드형" },
    { id: P2, name: "1차 탐색 (A/B/C)" },
  ],
  artboards: [
    { file: "Main.dc.html", title: "시리즈 글 — 데스크톱", x: 0, y: 0, w: D.w, h: D.h },
    { file: "Main-Mobile.dc.html", title: "시리즈 글 — 모바일 390", x: D.w + 100, y: 0, w: M.w, h: M.h },
    { file: "SeriesExpanded.dc.html", title: "전체 목록 펼침 — 데스크톱", x: D.w + 100 + M.w + 100, y: 0, w: D.w, h: 760 },
    { file: "NoSeries.dc.html", title: "시리즈 없는 글 — 데스크톱", x: 0, y: 880, w: D.w, h: 520 },
    { file: "NoSeries-Mobile.dc.html", title: "시리즈 없는 글 — 모바일 390", x: D.w + 100, y: 880, w: M.w, h: 640 },

    { file: "DirectionA.dc.html", title: "A · 구분선형 — 데스크톱", x: 0, y: 0, w: 760, h: 520, page: P2 },
    { file: "A-Mobile.dc.html", title: "A · 구분선형 — 모바일", x: 860, y: 0, w: 390, h: 640, page: P2 },
    { file: "DirectionB.dc.html", title: "B · 카드형 — 데스크톱", x: 0, y: 800, w: 760, h: 520, page: P2 },
    { file: "B-Mobile.dc.html", title: "B · 카드형 — 모바일", x: 860, y: 800, w: 390, h: 640, page: P2 },
    { file: "DirectionC.dc.html", title: "C · 목록형 — 데스크톱", x: 0, y: 1600, w: 760, h: 520, page: P2 },
    { file: "C-Mobile.dc.html", title: "C · 목록형 — 모바일", x: 860, y: 1600, w: 390, h: 640, page: P2 },
  ],
  annotations: [
    { id: "note-final", x: 0, y: -190, w: 760, page: "page-1", text: "하단 내비 규칙\n· 시리즈 글: 카드가 시리즈 내 이웃 편을 가리킴. 카드 위 한 줄에 시리즈명 · n/m · [전체 목록] — 누르면 그 자리에서 펼쳐져 위로 올라갈 필요 없음(상단 SeriesNav와 같은 목록 스타일).\n· 시리즈 첫/마지막 편: 없는 쪽은 시간순 이전/다음 글로 대체하고 라벨만 '이전 글'/'다음 글'.\n· 시리즈 없는 글: 한 줄 없이 카드 둘만.\n· 모바일: 카드 1열, 다음 카드도 왼쪽 정렬 유지(오른쪽 정렬은 2열일 때만).\n· dark 토글로 다크 모드 확인. 폰트는 시스템 대체 서체." },
    { id: "note-p2", x: 0, y: -120, w: 700, page: P2, text: "1차 시안 보관. B 카드형을 골라 1페이지에서 시리즈 인지형으로 발전시킴." },
  ],
  launch: { view: "canvas", page: "page-1" },
};
writeFileSync("canvas.json", JSON.stringify(canvas, null, 2));
console.log("generated", Object.keys(out).length, "artboards");
