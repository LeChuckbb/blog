import { writeFileSync } from "node:fs";

const I = {
  github: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>`,
  sun: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>`,
  file: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>`,
  github16: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>`,
  copy: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>`,
  up: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m18 15-6-6-6 6"></path></svg>`,
  list: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h16"></path><path d="M4 12h16"></path><path d="M4 18h10"></path></svg>`,
  chevL: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg>`,
  chevR: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>`,
};

const HELMET = `
<helmet>
  <style>
    :root {
      --background: oklch(0.982 0.005 95);
      --foreground: oklch(0.245 0.006 286);
      --primary: oklch(0.59 0.20 277);
      --muted: oklch(0.955 0.005 95);
      --muted-40: oklch(0.955 0.005 95 / 40%);
      --muted-60: oklch(0.955 0.005 95 / 60%);
      --muted-foreground: oklch(0.571 0.006 107);
      --border: oklch(0.913 0.007 89);
      --accent: oklch(0.94 0.04 277);
      --accent-foreground: oklch(0.35 0.18 277);
      --secondary: oklch(0.955 0.005 95);
      --ring: oklch(0.59 0.20 277);
      --press: oklch(0.94 0.04 277);
      --press-strong: oklch(0.90 0.06 277);
      --lift-shadow: 0 1px 2px oklch(0.245 0.006 286 / 8%), 0 2px 6px oklch(0.245 0.006 286 / 6%);
    }
    .dark {
      --background: oklch(0.228 0.008 286);
      --foreground: oklch(0.942 0.005 107);
      --primary: oklch(0.72 0.18 277);
      --muted: oklch(0.320 0.011 286);
      --muted-40: oklch(0.320 0.011 286 / 20%);
      --muted-60: oklch(0.320 0.011 286 / 30%);
      --muted-foreground: oklch(0.705 0.006 107);
      --border: oklch(1 0 0 / 10%);
      --accent: oklch(0.22 0.06 277);
      --accent-foreground: oklch(0.75 0.15 277);
      --secondary: oklch(0.320 0.011 286);
      --ring: oklch(0.72 0.18 277);
      --press: oklch(0.30 0.07 277);
      --press-strong: oklch(0.34 0.09 277);
      --lift-shadow: 0 1px 2px oklch(0 0 0 / 30%), 0 2px 8px oklch(0 0 0 / 25%);
    }
    body { margin: 0; }
    .page {
      font-family: "Asta Sans Variable", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
      letter-spacing: -0.01em; word-break: keep-all; line-height: 1.75;
      background: var(--background); color: var(--foreground);
      -webkit-font-smoothing: antialiased;
    }
    .serif { font-family: "MaruBuri", "Apple SD Gothic Neo", serif; }
    .mono { font-family: D2Coding, ui-monospace, monospace; }
    a { color: var(--primary); text-decoration: none; }
    a:hover { color: var(--primary); }
    button { font: inherit; color: inherit; background: none; border: 0; padding: 0; margin: 0; cursor: pointer; }

    /* ── 통일 규칙 ─────────────────────────────────────────
       .c      : 클릭 가능한 모든 요소. 색 150ms, 변형 200ms(누를 땐 100ms).
       .h-muted / .h-accent : hover 틴트(콘텐츠 면=중립 muted, 크롬=accent).
       .t-icon / .t-chip / .t-row : 면적 등급 — 작을수록 더 줄어든다.
       .t-text : 텍스트 링크. 변형 없음, 눌리면 살짝 흐려진다.
       ─────────────────────────────────────────────────── */
    .c { cursor: pointer; transition: color 150ms ease, background-color 150ms ease, transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 200ms ease, opacity 150ms ease; -webkit-tap-highlight-color: transparent; }
    .c:active { transition-duration: 150ms, 100ms, 100ms, 100ms, 100ms; }
    .c:focus-visible { outline: 2px solid var(--ring); outline-offset: 2px; }
    .h-muted:hover { background-color: var(--muted); }
    .h-accent:hover { background-color: var(--accent); }
    .t-text:hover { text-decoration: underline; text-underline-offset: 3px; }
    .t-text:active { opacity: 0.6; }
    .fade:hover { color: var(--foreground); }

    /* scale (권장): hover 중립 틴트 → press 브랜드 틴트 + 면적별 축소 */
    .scale .c.t-icon:active, .scale .c.t-chip:active, .scale .c.t-row:active { background-color: var(--press); }
    .scale .c.h-accent:active { background-color: var(--press-strong); }
    .scale .c.t-icon:active { transform: scale(0.95); }
    .scale .c.t-chip:active { transform: scale(0.97); }
    .scale .c.t-row:active { transform: scale(0.985); }

    /* tint: 움직임 없이 틴트 2단계만 */
    .tint .c.t-icon:active, .tint .c.t-chip:active, .tint .c.t-row:active { background-color: var(--press); }
    .tint .c.h-accent:active { background-color: var(--press-strong); }

    /* lift: hover에 1px 떠오르고 press에 가라앉는다 */
    .lift .c.t-icon:hover, .lift .c.t-chip:hover, .lift .c.t-row:hover { transform: translateY(-1px); box-shadow: var(--lift-shadow); }
    .lift .c.t-icon:active, .lift .c.t-chip:active, .lift .c.t-row:active { transform: translateY(0) scale(0.985); box-shadow: none; background-color: var(--press); }

    @media (prefers-reduced-motion: reduce) {
      .c, .c:active { transition-duration: 0ms; }
      .c:active, .c:hover { transform: none !important; }
    }

    .sec { display: flex; flex-direction: column; gap: 12px; }
    .sec-h { font-size: 0.75rem; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: var(--muted-foreground); }
    .sec-n { font-size: 0.8125rem; color: var(--muted-foreground); line-height: 1.5; }
  </style>
</helmet>`;

// ── 요소들 (실제 클래스 값을 그대로 옮김) ─────────────────────
const logo = `<a href="#" class="c t-chip t-text serif" style="display: inline-flex; align-items: center; min-height: 44px; padding: 0 6px; margin: 0 -6px; border-radius: 6px; font-size: 1.125rem; font-weight: 600; color: var(--primary);">LeChuck</a>`;
const navLink = (icon, text) => `<a href="#" class="c t-chip h-accent fade" style="display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: 6px; font-size: 0.875rem; color: var(--muted-foreground); min-height: 32px; box-sizing: border-box;">${icon}<span>${text}</span></a>`;
const iconBtn = (icon, label) => `<button type="button" class="c t-icon h-accent" aria-label="${label}" style="display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 6px; color: var(--foreground);">${icon}</button>`;
const pill = `<button type="button" class="c t-chip h-muted" style="display: inline-flex; align-items: center; gap: 8px; height: 40px; padding: 0 12px; border-radius: 10px; border: 1px solid var(--border); background: var(--background); color: var(--foreground); font-size: 0.875rem; box-sizing: border-box;">${I.list}<span>마치며</span></button>`;
const scrollTop = `<button type="button" class="c t-icon h-muted" aria-label="맨 위로" style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 10px; border: 1px solid var(--border); background: var(--background); color: var(--primary); box-sizing: border-box;">${I.up}</button>`;
const copyBtn = `<button type="button" class="c t-icon h-muted" aria-label="코드 복사" style="position: absolute; top: 8px; right: 8px; display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 6px; border: 1px solid var(--border); background: var(--secondary); color: var(--foreground); box-sizing: border-box;">${I.copy}</button>`;
const codeBlock = `<div style="position: relative; padding: 14px 16px; border-radius: 10px; background: var(--muted); font-size: 0.8125rem; line-height: 1.6;" class="mono"><div>const next = resolvedTheme === "dark" ? "light" : "dark";</div><div>setTheme(next);</div>${copyBtn}</div>`;

const postRow = (date, title) => `<a href="#" class="c t-row h-muted" style="display: flex; align-items: baseline; gap: 16px; margin: 0 -12px; padding: 8px 12px; border-radius: 10px; min-height: 44px; box-sizing: border-box;"><span style="flex-shrink: 0; width: 48px; font-size: 0.875rem; color: var(--muted-foreground);">${date}</span><span class="t-text" style="font-size: 0.875rem; font-weight: 600; color: var(--primary);">${title}</span></a>`;
const tocLink = (text, level, active) => `<a href="#" class="c t-chip h-accent fade" style="display: block; padding: 4px 8px; margin-left: ${level === 2 ? 8 : 0}px; border-radius: 4px; font-size: 0.875rem; ${active ? "color: var(--primary); font-weight: 500; background: var(--muted);" : "color: var(--muted-foreground);"} ${level === 1 && !active ? "font-weight: 500;" : ""}">${text}</a>`;

const seriesRow = (n, title, cur) => cur
  ? `<div aria-current="page" style="display: flex; align-items: flex-start; gap: 12px; padding: 8px 16px; background: var(--accent);"><span class="mono" style="flex-shrink: 0; width: 20px; text-align: right; font-size: 0.75rem; line-height: 1.6; color: var(--primary); font-weight: 600;">${n}.</span><span style="font-size: 0.875rem; line-height: 1.375; color: var(--primary); font-weight: 600;">${title}</span></div>`
  : `<a href="#" class="c t-row h-muted fade" style="display: flex; align-items: flex-start; gap: 12px; padding: 8px 16px; color: var(--foreground); min-height: 44px; box-sizing: border-box;"><span class="mono" style="flex-shrink: 0; width: 20px; text-align: right; font-size: 0.75rem; line-height: 1.6; color: var(--muted-foreground);">${n}.</span><span style="font-size: 0.875rem; line-height: 1.375;">${title}</span></a>`;
const seriesBox = `
<div style="border: 1px solid var(--border); border-radius: 10px; background: var(--muted-40); overflow: hidden;">
  <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid var(--border);">
    <div style="display: flex; align-items: center; gap: 8px; min-width: 0;"><span style="font-size: 0.75rem; font-weight: 500; color: var(--muted-foreground);">시리즈</span><span style="font-size: 0.875rem; font-weight: 600;">브라우저 동작 원리</span></div>
    <div style="display: flex; align-items: center; gap: 12px;"><button type="button" class="c t-text fade" style="font-size: 0.75rem; color: var(--muted-foreground); min-height: 44px;">숨기기</button><span style="font-size: 0.75rem; color: var(--muted-foreground);">3 / 4</span></div>
  </div>
  <div style="display: flex; flex-direction: column; padding: 8px 0;">
    ${seriesRow(1, "브라우저의 렌더링 과정(Critical Rendering Path)")}${seriesRow(2, "브라우저 렌더링 최적화")}${seriesRow(3, "DOM API", true)}${seriesRow(4, "브라우저 이벤트")}
  </div>
</div>`;
const navCard = (label, title, side) => `<a href="#" class="c t-row h-muted" style="display: flex; align-items: center; gap: 12px; min-width: 0; padding: 14px 16px; border: 1px solid var(--border); border-radius: 10px; background: var(--muted-40); color: var(--foreground); ${side === "r" ? "flex-direction: row-reverse; text-align: right;" : ""}"><span style="display: flex; flex-shrink: 0; color: var(--muted-foreground);">${side === "l" ? I.chevL : I.chevR}</span><span style="display: flex; flex-direction: column; gap: 4px; min-width: 0;"><span style="font-size: 0.75rem; color: var(--muted-foreground); line-height: 1.25;">${label}</span><span style="font-size: 0.875rem; font-weight: 600; line-height: 1.45;">${title}</span></span></a>`;
const prose = `<p style="margin: 0; font-size: 1.0625rem;">이 때 fallback UI 처리를 위해서 빈 값을 성공으로 간주하게 백엔드에 변경을 요청했다. (<a href="#" class="c t-text">데이터가 없을 때 200인가 404인가?</a>) 이것들은 3년이 지난 지금까지도 팀 내 표준으로 쓰이고 있다.</p>`;

function shell(body, w, h, extraProps = "") {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>${HELMET}
<div class="page {{mode}} {{themeClass}}" style="position: relative; width: ${w}px; min-height: ${h}px; box-sizing: border-box; padding: 32px;">
${body}
</div>
</x-dc>
<script data-dc-script data-props='{"press":{"editor":"enum","options":["scale","tint","lift"],"default":"scale","tsType":"string"},"dark":{"editor":"boolean","default":false,"tsType":"boolean"},"$preview":{"width":${w},"height":${h}}}'>
class Component extends DCLogic {
  renderVals() {
    return { mode: this.props.press ?? "scale", themeClass: this.props.dark ? "dark" : "" };
  }
}
</script>
</body>
</html>
`;
}

// ── Main: 데스크톱 인터랙션 시트 ─────────────────────────────
const main = `
<div style="display: flex; flex-direction: column; gap: 40px;">
  <div style="display: flex; flex-direction: column; gap: 4px;">
    <div style="font-size: 1.25rem; font-weight: 700; letter-spacing: -0.02em;">클릭 요소 인터랙션 시트</div>
    <div class="sec-n">위 토글로 press 방식을 바꾸고, 각 요소에 마우스를 올리고 눌러 보세요. hover 150ms, 누를 때 100ms, 놓을 때 200ms.</div>
  </div>

  <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 40px;">
    <div class="sec">
      <div class="sec-h">사이드바 · 아이콘 버튼</div>
      <div style="display: flex; flex-direction: column; gap: 8px; width: 160px;">
        <div style="display: flex; align-items: center; gap: 8px;">${logo}${iconBtn(I.sun, "테마 변경")}</div>
        <div style="display: flex; flex-direction: column; gap: 4px; padding-top: 12px; border-top: 1px solid var(--border);">${navLink(I.file, "Posts")}${navLink(I.github16, "GitHub")}</div>
      </div>
      <div class="sec-n">로고·아이콘 0.95 / 링크 0.97. 크롬은 hover도 accent, press는 한 단계 진한 accent.</div>
    </div>
    <div class="sec">
      <div class="sec-h">모바일 헤더 · 하단 고정 버튼 · 코드 복사</div>
      <div style="display: flex; align-items: center; gap: 12px;">${iconBtn(I.github, "GitHub")}${iconBtn(I.sun, "테마 변경")}<span style="width: 16px;"></span>${pill}${scrollTop}</div>
      ${codeBlock}
      <div class="sec-n">테두리 있는 버튼도 같은 등급(아이콘 0.95). 복사 버튼은 코드 블록 hover 시 나타나는 원래 동작 유지.</div>
    </div>
  </div>

  <div style="display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); gap: 40px;">
    <div class="sec">
      <div class="sec-h">홈 · 글 목록</div>
      <div style="display: flex; flex-direction: column;">
        ${postRow("06.02", "블로그 후기만 세 번째 - Obsidian 기반 블로그 만들기")}${postRow("05.19", "원티드 하이파이브 2026 후기 - AI 시대에서 살아남기")}${postRow("03.14", "서버 에러가 200 OK로 내려오는 상황에서 에러 설계하기")}
      </div>
      <div class="sec-n">넓은 행은 0.985만 — 680px 행이 3% 줄면 20px가 움직여 과해진다.</div>
    </div>
    <div class="sec">
      <div class="sec-h">목차</div>
      <div style="display: flex; flex-direction: column; gap: 2px; width: 240px;">${tocLink("문제의 시작", 1, false)}${tocLink("200 OK 안의 에러", 1, true)}${tocLink("응답 스키마 정리", 2, false)}${tocLink("팀에 정착시키기", 1, false)}</div>
      <div class="sec-n">목차 항목은 링크 등급(0.97). 현재 섹션(muted 배경)은 그대로 두고 누르면 accent.</div>
    </div>
  </div>

  <div class="sec">
    <div class="sec-h">글 하단 · 시리즈 목록 + 이전/다음 카드</div>
    <div style="display: flex; flex-direction: column; gap: 12px; max-width: 680px;">
      ${seriesBox}
      <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px;">${navCard("시리즈 이전 글", "브라우저 렌더링 최적화", "l")}${navCard("시리즈 다음 글", "브라우저 이벤트", "r")}</div>
    </div>
    <div class="sec-n">시리즈 행·카드 모두 넓은 면 등급(0.985). "숨기기" 같은 텍스트 버튼은 변형 없이 흐려지기만.</div>
  </div>

  <div class="sec">
    <div class="sec-h">본문 링크</div>
    <div style="max-width: 680px;">${prose}</div>
    <div class="sec-n">텍스트는 축소하지 않는다(글자가 흔들려 보임). hover 밑줄, press 60% 불투명.</div>
  </div>
</div>`;

// ── Mobile: 터치 기준 ────────────────────────────────────────
const mobile = `
<div style="display: flex; flex-direction: column; gap: 32px;">
  <div class="sec-n">터치에는 hover가 없다 — press 한 단계가 전부라 accent 틴트가 눌림 피드백을 맡는다.</div>
  <div class="sec">
    <div class="sec-h">헤더</div>
    <div style="display: flex; align-items: center; justify-content: space-between; height: 56px; padding: 0 16px; margin: 0 -16px; border-bottom: 1px solid var(--border);">${logo}<div style="display: flex; align-items: center; gap: 4px;">${iconBtn(I.github, "GitHub")}${iconBtn(I.sun, "테마 변경")}</div></div>
  </div>
  <div class="sec">
    <div class="sec-h">글 목록</div>
    <div style="display: flex; flex-direction: column;">${postRow("06.02", "블로그 후기만 세 번째 - Obsidian 기반 블로그 만들기")}${postRow("05.19", "원티드 하이파이브 2026 후기 - AI 시대에서 살아남기")}</div>
  </div>
  <div class="sec">
    <div class="sec-h">글 하단</div>
    <div style="display: flex; flex-direction: column; gap: 12px;">${seriesBox}${navCard("시리즈 이전 글", "브라우저 렌더링 최적화", "l")}${navCard("시리즈 다음 글", "브라우저 이벤트", "r")}</div>
  </div>
  <div class="sec">
    <div class="sec-h">하단 고정 버튼</div>
    <div style="display: flex; align-items: center; justify-content: space-between;">${pill}${scrollTop}</div>
  </div>
</div>`;

const W = 960, H = 1180, MW = 390, MH = 1000;
writeFileSync("Main.dc.html", shell(main, W, H));
writeFileSync("Mobile.dc.html", shell(mobile, MW, MH));

const canvas = {
  artboards: [
    { file: "Main.dc.html", title: "인터랙션 시트 — 데스크톱", x: 0, y: 0, w: W, h: H, is_interactive: true },
    { file: "Mobile.dc.html", title: "인터랙션 시트 — 모바일 390", x: W + 100, y: 0, w: MW, h: MH, is_interactive: true },
  ],
  annotations: [
    { id: "rule", x: 0, y: -260, w: 960, text: "통일 규칙 (권장 = scale)\n· 모든 클릭 요소: 색 150ms · 변형 200ms(누를 때 100ms) · 키보드 포커스 링 2px\n· hover: 콘텐츠 면(글 목록·시리즈·카드)은 중립 muted, 크롬(사이드바·아이콘·목차)은 accent\n· press: 브랜드 accent 틴트 + 면적별 축소 — 아이콘·알약 0.95 / 링크·칩·목차 0.97 / 넓은 행·카드 0.985\n· 텍스트 링크·텍스트 버튼: 축소 없음, hover 밑줄, press 60% 불투명\n· prefers-reduced-motion: 변형 제거, 틴트만\n\n대안 토글: tint(움직임 0, 틴트 2단계만) · lift(hover 1px 떠오름+그림자, press 가라앉음)" },
  ],
  launch: { view: "canvas" },
};
writeFileSync("canvas.json", JSON.stringify(canvas, null, 2));
console.log("ok");
