import { writeFileSync } from "node:fs";

// ── 토큰: globals.css :root / .dark 그대로 ─────────────────
const HELMET = `
<helmet>
  <style>
    :root {
      --background: oklch(0.982 0.005 95);
      --foreground: oklch(0.245 0.006 286);
      --foreground-80: oklch(0.245 0.006 286 / 80%);
      --primary: oklch(0.59 0.20 277);
      --primary-10: oklch(0.59 0.20 277 / 10%);
      --muted: oklch(0.955 0.005 95);
      --muted-40: oklch(0.955 0.005 95 / 40%);
      --muted-foreground: oklch(0.571 0.006 107);
      --muted-foreground-30: oklch(0.571 0.006 107 / 30%);
      --border: oklch(0.913 0.007 89);
      --accent: oklch(0.94 0.04 277);
    }
    .dark {
      --background: oklch(0.228 0.008 286);
      --foreground: oklch(0.942 0.005 107);
      --foreground-80: oklch(0.942 0.005 107 / 80%);
      --primary: oklch(0.72 0.18 277);
      --primary-10: oklch(0.72 0.18 277 / 15%);
      --muted: oklch(0.320 0.011 286);
      --muted-40: oklch(0.320 0.011 286 / 20%);
      --muted-foreground: oklch(0.705 0.006 107);
      --muted-foreground-30: oklch(0.705 0.006 107 / 30%);
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
    .serif { font-family: "MaruBuri", "Apple SD Gothic Neo", "Nanum Myeongjo", Georgia, serif; }
    .mono { font-family: D2Coding, ui-monospace, monospace; }
    a { color: var(--primary); text-decoration: none; }
    a:hover { color: var(--primary); }
    .row:hover { background: var(--muted); }
    .card:hover { background: var(--muted); }
    .prose p { margin: 0 0 1.25em; font-size: 1.0625rem; line-height: 1.75; }
    .prose p:last-child { margin-bottom: 0; }
    .prose h2 { font-size: 1.5rem; font-weight: 700; margin: 2em 0 1em; line-height: 1.33; }
  </style>
</helmet>`;

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
const S_PREV = SERIES.posts[1];
const S_NEXT = SERIES.posts[3];

// ── 아이콘(lucide 스트로크) ────────────────────────────────
const svg = (d, s = 16) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const CHEV_L = svg(`<path d="m15 18-6-6 6-6"></path>`, 20);
const CHEV_R = svg(`<path d="m9 18 6-6-6-6"></path>`, 20);
const CHEV_L_S = svg(`<path d="m15 18-6-6 6-6"></path>`, 14);
const CHEV_R_S = svg(`<path d="m9 18 6-6-6-6"></path>`, 14);
const CHEV_DOWN_S = svg(`<path d="m6 9 6 6 6-6"></path>`, 14);
const ARROW_R = svg(`<path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path>`, 16);
const CHECK_S = svg(`<path d="M20 6 9 17l-5-5"></path>`, 12);

// ── 짧은 글 본문(세로 모니터에 한 화면에 들어오는 길이) ─────
const HEADER = `
<header style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 32px;">
  <h1 style="margin: 0; font-size: 2.25rem; font-weight: 700; letter-spacing: -0.025em; line-height: 1.2;">DOM API</h1>
  <div class="serif" style="display: flex; align-items: center; gap: 8px; font-size: 0.875rem; color: var(--muted-foreground);"><span>2025.03.14</span><span>·</span><span>3 min to read</span></div>
</header>`;

const PROSE = `
<div class="prose">
  <p>DOM은 브라우저가 HTML을 파싱해 만든 트리이고, DOM API는 자바스크립트가 그 트리를 읽고 바꾸는 창구다. 이 글은 렌더링 과정 편에서 다룬 "파싱 → 트리"의 다음 단계, 즉 만들어진 트리를 어떻게 다루는지를 짧게 정리한다.</p>
  <p>핵심은 두 가지다. 노드를 <em>찾는</em> 방법(<code class="mono">querySelector</code>, <code class="mono">getElementById</code>)과 노드를 <em>바꾸는</em> 방법(<code class="mono">textContent</code>, <code class="mono">classList</code>, <code class="mono">append</code>). 나머지는 이 둘의 변주다.</p>
  <p>바꿀 때 주의할 점은 한 번의 변경이 한 번의 리플로우로 이어질 수 있다는 것. 렌더링 최적화 편에서 본 것처럼 읽기와 쓰기를 섞어 호출하면 강제 동기 레이아웃이 일어난다. 다음 편에서는 이 트리 위에서 이벤트가 어떻게 흐르는지 본다.</p>
</div>`;

// ── SeriesNav 헤더형 (실제 컴포넌트 마크업 그대로) ─────────
function arrows(compact) {
  const btn = (icon, on) => `<span style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 4px; color: ${on ? "var(--foreground)" : "var(--muted-foreground-30)"};">${icon}</span>`;
  return `<span style="display: flex; align-items: center; gap: 4px;">${btn(CHEV_L_S, true)}${btn(CHEV_R_S, true)}</span>`;
}
function seriesRows() {
  return `<ol style="list-style: none; margin: 0; padding: 8px 0; display: flex; flex-direction: column;">
    ${SERIES.posts.map((t, i) => {
      const cur = i === SERIES.current;
      return `<li style="display: flex; align-items: flex-start; gap: 12px; padding: 8px 16px; ${cur ? "background: var(--primary-10);" : ""}">
      <span class="mono" style="flex-shrink: 0; width: 20px; margin-top: 2px; text-align: right; font-size: 0.75rem; line-height: 1.5; color: ${cur ? "var(--primary)" : "var(--muted-foreground)"}; font-weight: ${cur ? 600 : 400};">${i + 1}.</span>
      <span style="font-size: 0.875rem; line-height: 1.375; color: ${cur ? "var(--primary)" : "var(--foreground-80)"}; font-weight: ${cur ? 600 : 400};">${t}</span>
    </li>`;
    }).join("")}
  </ol>`;
}
/** variant: "header-open" | "header-collapsed" | "footer" */
function seriesNav(variant) {
  const open = variant !== "header-collapsed";
  const isFooter = variant === "footer";
  const right = isFooter
    ? `<span style="flex-shrink: 0; margin-left: 16px; font-size: 0.75rem; color: var(--muted-foreground);">${SERIES.current + 1} / ${SERIES.posts.length}</span>`
    : `<span style="display: flex; align-items: center; gap: 12px; flex-shrink: 0; margin-left: 16px;">
        ${open ? `<span style="font-size: 0.75rem; color: var(--muted-foreground);">숨기기</span>` : ""}
        <span style="font-size: 0.75rem; color: var(--muted-foreground);">${SERIES.current + 1} / ${SERIES.posts.length}</span>
        ${open ? "" : `<span style="font-size: 0.75rem; color: var(--muted-foreground);">목록</span>`}
        ${arrows(!open)}
      </span>`;
  return `
<nav aria-label="${SERIES.name} 시리즈 네비게이션" style="margin: ${isFooter ? "0" : "32px 0"}; border: 1px solid var(--border); border-radius: 10px; background: var(--muted-40);">
  <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; ${open ? "border-bottom: 1px solid var(--border);" : ""}">
    <div style="display: flex; align-items: center; gap: 8px; min-width: 0;">
      <span style="flex-shrink: 0; font-size: 0.75rem; font-weight: 500; color: var(--muted-foreground);">시리즈</span>
      <span style="font-size: 0.875rem; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${SERIES.name}</span>
    </div>
    ${right}
  </div>
  ${open ? seriesRows() : ""}
</nav>`;
}

// ── PostNav 카드 (실제 컴포넌트 마크업 그대로) ─────────────
function navCard(title, side, label) {
  return `
  <a href="#" class="card" style="display: flex; align-items: center; gap: 12px; min-width: 0; padding: 14px 16px; border: 1px solid var(--border); border-radius: 10px; background: var(--muted-40); ${side === "r" ? "flex-direction: row-reverse; text-align: right;" : ""}">
    <span style="display: flex; flex-shrink: 0; color: var(--muted-foreground);">${side === "l" ? CHEV_L : CHEV_R}</span>
    <span style="display: flex; flex-direction: column; gap: 4px; min-width: 0;">
      <span style="font-size: 0.75rem; color: var(--muted-foreground); line-height: 1.25;">${label}</span>
      <span style="font-size: 0.875rem; font-weight: 600; color: var(--foreground); line-height: 1.45;">${title}</span>
    </span>
  </a>`;
}
const POST_NAV = `
<nav aria-label="이전 글 / 다음 글" style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px;">
  ${navCard(S_PREV, "l", "시리즈 이전 글")}
  ${navCard(S_NEXT, "r", "시리즈 다음 글")}
</nav>`;

// ── 현재: 상단 펼침 + 하단 펼침 (데칼코마니) ─────────────────
const FOOTER_CURRENT = `
<footer style="margin-top: 64px; display: flex; flex-direction: column; gap: 12px;">
  ${seriesNav("footer")}
  ${POST_NAV}
</footer>`;

// ── A: 역할 분리 — 상단은 목록(맥락), 하단은 한 줄 + 카드(이동) ──
const FOOTER_A = `
<footer style="margin-top: 64px; display: flex; flex-direction: column; gap: 12px;">
  <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; min-width: 0;">
    <div style="display: flex; align-items: baseline; gap: 8px; min-width: 0;">
      <span style="flex-shrink: 0; font-size: 0.75rem; font-weight: 500; color: var(--muted-foreground);">시리즈</span>
      <span style="font-size: 0.875rem; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${SERIES.name}</span>
      <span style="flex-shrink: 0; font-size: 0.75rem; color: var(--muted-foreground);">${SERIES.current + 1} / ${SERIES.posts.length}</span>
    </div>
    <span style="flex-shrink: 0; display: inline-flex; align-items: center; gap: 4px; min-height: 44px; padding: 0 4px; font-size: 0.75rem; color: var(--muted-foreground);">전체 목록${CHEV_DOWN_S}</span>
  </div>
  ${POST_NAV}
</footer>`;

// ── B: 무게 이동 — 상단은 접힌 한 줄, 하단이 펼침 목록 ──────
const FOOTER_B = FOOTER_CURRENT;

// ── C: 하단을 '진행' 형태로 — 목록을 반복하지 않고 남은 길만 ──
function progressFooter() {
  const seg = (i) => {
    const done = i < SERIES.current;
    const cur = i === SERIES.current;
    return `<span style="flex: 1 1 0; height: 4px; border-radius: 2px; background: ${done || cur ? "var(--primary)" : "var(--border)"}; ${cur ? "" : done ? "opacity: .45;" : ""}"></span>`;
  };
  const read = SERIES.posts.slice(0, SERIES.current);
  return `
<footer style="margin-top: 64px; display: flex; flex-direction: column; gap: 16px; padding: 20px; border: 1px solid var(--border); border-radius: 10px; background: var(--muted-40);">
  <div style="display: flex; flex-direction: column; gap: 10px;">
    <div style="display: flex; align-items: baseline; justify-content: space-between; gap: 12px; min-width: 0;">
      <div style="display: flex; align-items: baseline; gap: 8px; min-width: 0;">
        <span style="flex-shrink: 0; font-size: 0.75rem; font-weight: 500; color: var(--muted-foreground);">시리즈</span>
        <span style="font-size: 0.875rem; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${SERIES.name}</span>
      </div>
      <span class="mono" style="flex-shrink: 0; font-size: 0.75rem; color: var(--muted-foreground);">${SERIES.current + 1}편까지 읽음 · 남은 글 ${SERIES.posts.length - SERIES.current - 1}</span>
    </div>
    <div style="display: flex; gap: 4px;">${SERIES.posts.map((_, i) => seg(i)).join("")}</div>
  </div>

  <a href="#" class="card" style="display: flex; align-items: center; justify-content: space-between; gap: 16px; min-width: 0; padding: 16px 18px; border: 1px solid var(--border); border-radius: 10px; background: var(--background);">
    <span style="display: flex; flex-direction: column; gap: 4px; min-width: 0;">
      <span style="font-size: 0.75rem; color: var(--muted-foreground); line-height: 1.25;">다음 편 · ${SERIES.current + 2}/${SERIES.posts.length}</span>
      <span style="font-size: 1rem; font-weight: 600; color: var(--foreground); line-height: 1.4;">${S_NEXT}</span>
    </span>
    <span style="display: flex; flex-shrink: 0; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 999px; background: var(--primary); color: oklch(0.985 0 0);">${ARROW_R}</span>
  </a>

  <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 6px 14px; font-size: 0.8125rem; color: var(--muted-foreground); line-height: 1.4;">
    <span style="flex-shrink: 0;">앞서 읽은 글</span>
    ${read.map((t, i) => `<a href="#" style="display: inline-flex; align-items: center; gap: 4px; color: var(--muted-foreground);"><span style="display: inline-flex; color: var(--primary);">${CHECK_S}</span><span class="mono" style="font-size: 0.75rem;">${i + 1}.</span><span>${t}</span></a>`).join("")}
  </div>
</footer>`;
}

// ── 아트보드 ────────────────────────────────────────────────
function artboard({ top, footer }, w, h) {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>${HELMET}
<div class="page {{themeClass}}" style="position: relative; width: ${w}px; min-height: ${h}px; box-sizing: border-box; padding: 64px 40px 96px;">
  <article style="max-width: 680px; margin: 0 auto; min-width: 0;">
    ${HEADER}
    ${top}
    ${PROSE}
    ${footer}
  </article>
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

const W = 760;
const out = {
  "Current.dc.html": artboard({ top: seriesNav("header-open"), footer: FOOTER_CURRENT }, W, 1280),
  "Main.dc.html": artboard({ top: seriesNav("header-open"), footer: FOOTER_A }, W, 1100),
  "DirectionB.dc.html": artboard({ top: seriesNav("header-collapsed"), footer: FOOTER_B }, W, 1120),
  "DirectionC.dc.html": artboard({ top: seriesNav("header-open"), footer: progressFooter() }, W, 1240),
};
for (const [f, s] of Object.entries(out)) writeFileSync(f, s);

const GAP = 100;
const P2 = "page-2";
const canvas = {
  pages: [
    { id: "page-1", name: "확정 · A 역할 분리" },
    { id: P2, name: "탐색 (B/C)" },
  ],
  artboards: [
    { file: "Current.dc.html", title: "이전 — 위·아래 목록이 데칼코마니", x: 0, y: 0, w: W, h: 1280 },
    { file: "Main.dc.html", title: "A · 역할 분리 — 상단 목록, 하단은 한 줄+카드 (구현됨)", x: W + GAP, y: 0, w: W, h: 1100 },
    { file: "DirectionB.dc.html", title: "B · 무게 이동 — 상단 한 줄, 하단 목록", x: 0, y: 0, w: W, h: 1120, page: P2 },
    { file: "DirectionC.dc.html", title: "C · 진행형 — 하단은 남은 길만", x: W + GAP, y: 0, w: W, h: 1240, page: P2 },
  ],
  annotations: [
    { id: "note-problem", x: 0, y: -200, w: W, text: "문제: 세로 모니터에서 짧은 글은 상단 SeriesNav(펼침)와 하단 SeriesNav(항상 펼침)가 한 화면에 같이 보여 같은 박스가 두 번 찍힌다. 세 시안 모두 '같은 정보를 같은 형태로 두 번 보이지 않게' 하는 방향이고, 어느 쪽에 무게를 둘지가 다르다." },
    { id: "note-a", x: W + GAP, y: -200, w: W, text: "A · 역할 분리 (확정, SeriesNav footer variant로 구현)\n상단 = 맥락(전체 목록), 하단 = 이동(한 줄 요약 + 이전/다음 카드). 하단 목록은 '전체 목록'을 누르면 그 자리에서 펼쳐진다.\n장점: 코드 변경 최소(footer variant를 접힘 기본으로). 어떤 글 길이에도 두 박스가 다른 형태.\n단점: 다 읽은 뒤 3편 뒤로 건너뛰려면 클릭 한 번 더." },
    { id: "note-b", x: 0, y: -200, w: W, page: P2, text: "B · 무게 이동\n상단은 접힌 한 줄(시리즈명 · n/m · 목록 · ◀▶)만, 하단이 펼침 목록을 갖는다. 글을 시작할 땐 목록이 필요 없고 다 읽은 뒤에 필요하다는 가정.\n장점: 본문이 더 빨리 시작. isCollapsed 기본값만 바꾸면 됨.\n단점: 처음 온 독자가 시리즈 구조를 미리 못 봄(펼치면 보이긴 함). 하단 박스가 커서 긴 글에서도 무겁다." },
    { id: "note-c", x: W + GAP, y: -200, w: W, page: P2, text: "C · 진행형\n하단은 목록을 반복하지 않고 '어디까지 왔고 다음이 뭔지'만 보여준다: 진행 세그먼트 + 다음 편 큰 카드 + 읽은 글은 한 줄 링크. PostNav 카드를 이 블록이 흡수한다.\n장점: 형태가 완전히 달라 중복감 0. 다 읽은 순간의 행동(다음 편)에 가장 집중.\n단점: 새 컴포넌트. 시리즈 마지막 편·비시리즈 글은 기존 PostNav로 분기해야 해 하단 어휘가 둘로 갈린다." },
    { id: "note-d", x: 0, y: 1400, w: W, page: P2, text: "시안으로 그리지 않은 대안 D · 조건부 표시: 상단 SeriesNav가 뷰포트 안에 아직 보이면(IntersectionObserver) 하단 시리즈 목록을 렌더하지 않는다. 짧은 글에만 효과가 있고 스크롤 중 레이아웃이 튈 수 있어 A~C와 함께 쓰는 보조책 정도." },
  ],
  launch: { view: "canvas", page: "page-1" },
};
writeFileSync("canvas.json", JSON.stringify(canvas, null, 2));
console.log("generated", Object.keys(out).length, "artboards");
