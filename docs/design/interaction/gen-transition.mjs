import { writeFileSync } from "node:fs";

const CHEV_L = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg>`;
const CHEV_R = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>`;

const POSTS = [
  ["06.02", "블로그 후기만 세 번째 - Obsidian 기반 블로그 만들기"],
  ["05.19", "원티드 하이파이브 2026 후기 - AI 시대에서 살아남기"],
  ["03.14", "서버 에러가 200 OK로 내려오는 상황에서 에러 설계하기"],
  ["12.22", "Next.js URL Search Params 꼭 써보세요"],
  ["11.24", "소년이 온다를 읽고"],
];

const HELMET = `
<helmet>
  <style>
    :root {
      --background: oklch(0.982 0.005 95); --foreground: oklch(0.245 0.006 286);
      --primary: oklch(0.59 0.20 277); --muted: oklch(0.955 0.005 95); --muted-40: oklch(0.955 0.005 95 / 40%);
      --muted-foreground: oklch(0.571 0.006 107); --border: oklch(0.913 0.007 89); --accent: oklch(0.94 0.04 277); --press: oklch(0.94 0.04 277);
    }
    .dark {
      --background: oklch(0.228 0.008 286); --foreground: oklch(0.942 0.005 107);
      --primary: oklch(0.72 0.18 277); --muted: oklch(0.320 0.011 286); --muted-40: oklch(0.320 0.011 286 / 20%);
      --muted-foreground: oklch(0.705 0.006 107); --border: oklch(1 0 0 / 10%); --accent: oklch(0.22 0.06 277); --press: oklch(0.30 0.07 277);
    }
    body { margin: 0; }
    .page { font-family: "Asta Sans Variable", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif; letter-spacing: -0.01em; word-break: keep-all; line-height: 1.75; background: var(--background); color: var(--foreground); -webkit-font-smoothing: antialiased; }
    .serif { font-family: "MaruBuri", "Apple SD Gothic Neo", serif; }
    a { color: var(--primary); text-decoration: none; } a:hover { color: var(--primary); }
    button { font: inherit; color: inherit; background: none; border: 0; padding: 0; margin: 0; cursor: pointer; }
    .c { cursor: pointer; transition: color 150ms ease, background-color 150ms ease, transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1); -webkit-tap-highlight-color: transparent; }
    .c:active { transition-duration: 150ms, 100ms, 100ms; background-color: var(--press); }
    .h-muted:hover { background-color: var(--muted); }
    .t-row:active { transform: scale(0.985); } .t-icon:active { transform: scale(0.95); } .t-chip:active { transform: scale(0.97); }

    /* ── 페이지 전환: 두 화면을 겹쳐 두고 클래스로 in/out 애니메이션 ── */
    .frame { position: relative; overflow: hidden; background: var(--background); border: 1px solid var(--border); border-radius: 14px; }
    .screen { position: absolute; inset: 0; background: var(--background); overflow: hidden; }
    .screen.hidden { display: none; }
    /* slide (권장): 새 화면은 오른쪽 24px에서 페이드 인, 이전 화면은 왼쪽 24px로 살짝 밀리며 페이드 아웃. 뒤로가기는 방향 반전. */
    .slide .enter-push { animation: in-right 260ms cubic-bezier(0.2, 0.8, 0.2, 1) both; }
    .slide .leave-push { animation: out-left 260ms cubic-bezier(0.2, 0.8, 0.2, 1) both; }
    .slide .enter-pop { animation: in-left 260ms cubic-bezier(0.2, 0.8, 0.2, 1) both; }
    .slide .leave-pop { animation: out-right 260ms cubic-bezier(0.2, 0.8, 0.2, 1) both; }
    /* fade: 방향 없이 크로스페이드만 (reduced-motion 폴백과 동일) */
    .fade .enter-push, .fade .enter-pop { animation: fade-in 200ms ease both; }
    .fade .leave-push, .fade .leave-pop { animation: fade-out 200ms ease both; }
    /* ios: 화면 폭 100% 밀기 + 아래 화면 30% 밀림 + 그림자 (비교용, 과함) */
    .ios .enter-push { animation: ios-in 360ms cubic-bezier(0.32, 0.72, 0, 1) both; box-shadow: -8px 0 24px oklch(0 0 0 / 15%); }
    .ios .leave-push { animation: ios-under-out 360ms cubic-bezier(0.32, 0.72, 0, 1) both; }
    .ios .enter-pop { animation: ios-under-in 360ms cubic-bezier(0.32, 0.72, 0, 1) both; }
    .ios .leave-pop { animation: ios-out 360ms cubic-bezier(0.32, 0.72, 0, 1) both; box-shadow: -8px 0 24px oklch(0 0 0 / 15%); }
    .leave-push, .leave-pop { z-index: 1; pointer-events: none; } .enter-push, .enter-pop { z-index: 2; }
    .ios .leave-push { z-index: 1; } .ios .enter-pop { z-index: 1; } .ios .leave-pop { z-index: 2; }

    /* 같은 방향 연속 이동(이전/다음 카드)도 다시 재생되도록 홀수 번째는 동일한 -b 키프레임을 쓴다 */
    .slide .alt.enter-push { animation-name: in-right-b; } .slide .alt.leave-push { animation-name: out-left-b; }
    .fade .alt.enter-push { animation-name: fade-in-b; } .fade .alt.leave-push { animation-name: fade-out-b; }
    .ios .alt.enter-push { animation-name: ios-in-b; } .ios .alt.leave-push { animation-name: ios-under-out-b; }
    @keyframes in-right-b { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: none; } }
    @keyframes out-left-b { from { opacity: 1; transform: none; } to { opacity: 0; transform: translateX(-24px); } }
    @keyframes fade-in-b { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fade-out-b { from { opacity: 1; } to { opacity: 0; } }
    @keyframes ios-in-b { from { transform: translateX(100%); } to { transform: none; } }
    @keyframes ios-under-out-b { from { transform: none; } to { transform: translateX(-30%); } }
    @keyframes in-right { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: none; } }
    @keyframes out-left { from { opacity: 1; transform: none; } to { opacity: 0; transform: translateX(-24px); } }
    @keyframes in-left { from { opacity: 0; transform: translateX(-24px); } to { opacity: 1; transform: none; } }
    @keyframes out-right { from { opacity: 1; transform: none; } to { opacity: 0; transform: translateX(24px); } }
    @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fade-out { from { opacity: 1; } to { opacity: 0; } }
    @keyframes ios-in { from { transform: translateX(100%); } to { transform: none; } }
    @keyframes ios-out { from { transform: none; } to { transform: translateX(100%); } }
    @keyframes ios-under-out { from { transform: none; } to { transform: translateX(-30%); } }
    @keyframes ios-under-in { from { transform: translateX(-30%); } to { transform: none; } }
    @media (prefers-reduced-motion: reduce) { .screen { animation: fade-in 200ms ease both !important; transform: none !important; } .leave-push, .leave-pop { animation: fade-out 200ms ease both !important; } }

    .hdr { display: flex; align-items: center; justify-content: space-between; height: 56px; padding: 0 16px; border-bottom: 1px solid var(--border); }
    .sec-n { font-size: 0.8125rem; color: var(--muted-foreground); line-height: 1.5; }
  </style>
</helmet>`;

// 프레임 하나 = 목록 화면 + 글 화면. 폭에 따라 목록 밀도만 다르고 전환 규칙은 같다.
function frame(key, w, h, desktop) {
  const rows = POSTS.map(([d, t], i) => `
      <button type="button" class="c t-row h-muted" onClick="{{ ${key}Open }}" style="display: flex; align-items: baseline; gap: 16px; margin: 0 -12px; padding: 8px 12px; border-radius: 10px; min-height: 44px; box-sizing: border-box; text-align: left; width: calc(100% + 24px);">
        <span style="flex-shrink: 0; width: 48px; font-size: 0.875rem; color: var(--muted-foreground);">${d}</span>
        <span style="font-size: 0.875rem; font-weight: 600; color: var(--primary);">${t}</span>
      </button>`).join("");
  const pad = desktop ? "32px 48px" : "24px 16px";
  return `
  <div class="frame" style="width: ${w}px; height: ${h}px;">
    <div class="screen {{ ${key}ListClass }}">
      <div class="hdr"><span class="serif" style="font-weight: 600; color: var(--primary);">LeChuck</span><span style="width: 36px; height: 36px; border-radius: 6px; background: var(--muted);"></span></div>
      <div style="padding: ${pad}; max-width: 680px;">
        <div style="display: flex; gap: 6px; align-items: flex-end;"><span class="serif" style="font-size: 1.875rem; font-weight: 700; line-height: 1.2;">2026</span><span class="serif" style="font-size: 0.875rem; color: var(--muted-foreground);">5 posts</span></div>
        <div style="display: flex; flex-direction: column; margin-top: 16px;">${rows}</div>
      </div>
    </div>
    <div class="screen {{ ${key}PostClass }}">
      <div class="hdr"><button type="button" class="c t-chip h-muted serif" onClick="{{ ${key}Back }}" style="display: inline-flex; align-items: center; gap: 4px; min-height: 44px; padding: 0 8px; margin-left: -8px; border-radius: 6px; font-weight: 600; color: var(--primary);">${CHEV_L}LeChuck</button><span style="width: 36px; height: 36px; border-radius: 6px; background: var(--muted);"></span></div>
      <div style="padding: ${pad}; max-width: 680px;">
        <h1 style="margin: 0 0 8px; font-size: ${desktop ? "2.25rem" : "1.75rem"}; font-weight: 700; letter-spacing: -0.025em; line-height: 1.2;">서버 에러가 200 OK로 내려오는 상황에서 에러 설계하기</h1>
        <div class="serif" style="font-size: 0.875rem; color: var(--muted-foreground);">2026-03-14 · 8 min to read</div>
        <p style="margin: 24px 0 0; font-size: 1.0625rem;">23년 7월, 이직 후 새로운 팀 새로운 프로젝트에 합류했다. 핵심 기능까지만 구현된 기존 코드베이스를 살피다 보니 서버 에러가 전부 200으로 내려오고 있었다.</p>
        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 24px; opacity: 0.35;"><div style="height: 12px; border-radius: 4px; background: var(--muted);"></div><div style="height: 12px; width: 92%; border-radius: 4px; background: var(--muted);"></div><div style="height: 12px; width: 78%; border-radius: 4px; background: var(--muted);"></div></div>
        <div style="display: grid; grid-template-columns: repeat(${desktop ? 2 : 1}, minmax(0, 1fr)); gap: 12px; margin-top: 40px;">
          <button type="button" class="c t-row h-muted" onClick="{{ ${key}Next }}" style="display: flex; align-items: center; gap: 12px; padding: 14px 16px; border: 1px solid var(--border); border-radius: 10px; background: var(--muted-40); text-align: left;"><span style="color: var(--muted-foreground); display: flex;">${CHEV_L}</span><span style="display: flex; flex-direction: column; gap: 4px;"><span style="font-size: 0.75rem; color: var(--muted-foreground); line-height: 1.25;">이전 글</span><span style="font-size: 0.875rem; font-weight: 600; line-height: 1.45;">Next.js URL Search Params 꼭 써보세요</span></span></button>
          <button type="button" class="c t-row h-muted" onClick="{{ ${key}Next }}" style="display: flex; align-items: center; gap: 12px; padding: 14px 16px; border: 1px solid var(--border); border-radius: 10px; background: var(--muted-40); text-align: left; ${desktop ? "flex-direction: row-reverse; text-align: right;" : ""}"><span style="color: var(--muted-foreground); display: flex;">${CHEV_R}</span><span style="display: flex; flex-direction: column; gap: 4px;"><span style="font-size: 0.75rem; color: var(--muted-foreground); line-height: 1.25;">다음 글</span><span style="font-size: 0.875rem; font-weight: 600; line-height: 1.45;">원티드 하이파이브 2026 후기</span></span></button>
        </div>
      </div>
    </div>
  </div>`;
}

const body = `
<div style="display: flex; flex-direction: column; gap: 24px;">
  <div style="display: flex; flex-direction: column; gap: 4px;">
    <div style="font-size: 1.25rem; font-weight: 700; letter-spacing: -0.02em;">페이지 전환 — 목록 → 글 → 뒤로</div>
    <div class="sec-n">글을 누르면 들어가고, 헤더 로고를 누르면 돌아옵니다. 이전/다음 카드는 같은 방향(push)으로 다시 재생됩니다. 위 토글: slide(권장) · fade · ios(비교용).</div>
  </div>
  <div style="display: flex; gap: 48px; align-items: flex-start;">
    ${frame("m", 390, 720, false)}
    ${frame("d", 760, 720, true)}
  </div>
</div>`;

const W = 1264, H = 860;
const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>${HELMET}
<div class="page {{ mode }} {{ themeClass }}" style="position: relative; width: ${W}px; min-height: ${H}px; box-sizing: border-box; padding: 32px;">
${body}
</div>
</x-dc>
<script data-dc-script data-props='{"transition":{"editor":"enum","options":["slide","fade","ios"],"default":"slide","tsType":"string"},"dark":{"editor":"boolean","default":false,"tsType":"boolean"},"$preview":{"width":${W},"height":${H}}}'>
class Component extends DCLogic {
  constructor(props) {
    super(props);
    // 프레임별 현재 화면과 마지막 이동 방향. seq는 같은 방향 재생을 강제로 다시 트리거한다.
    this.state = { m: { view: "list", dir: null, seq: 0 }, d: { view: "list", dir: null, seq: 0 } };
  }
  go(key, view, dir) {
    this.setState((s) => ({ [key]: { view, dir, seq: s[key].seq + 1 } }));
  }
  classes(f) {
    const listOn = f.view === "list";
    if (!f.dir) return { list: listOn ? "" : "hidden", post: listOn ? "hidden" : "" };
    const alt = f.seq % 2 ? " alt" : "";
    const enter = "enter-" + f.dir + alt, leave = "leave-" + f.dir + alt;
    return listOn ? { list: enter, post: leave } : { list: leave, post: enter };
  }
  renderVals() {
    const m = this.classes(this.state.m), d = this.classes(this.state.d);
    return {
      mode: this.props.transition ?? "slide",
      themeClass: this.props.dark ? "dark" : "",
      mListClass: m.list, mPostClass: m.post, dListClass: d.list, dPostClass: d.post,
      mOpen: () => this.go("m", "post", "push"), mBack: () => this.go("m", "list", "pop"), mNext: () => this.go("m", "post", "push"),
      dOpen: () => this.go("d", "post", "push"), dBack: () => this.go("d", "list", "pop"), dNext: () => this.go("d", "post", "push"),
    };
  }
}
</script>
</body>
</html>
`;
writeFileSync("PageTransition.dc.html", html);
console.log("ok");
