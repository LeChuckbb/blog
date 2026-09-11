# 링크 호버 미리보기 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> 이 레포의 사용자 규칙(`~/.claude/CLAUDE.md`)이 우선한다: **메인 에이전트가 직접 TDD로 구현**하고, 끝에 전체 리뷰 1회. `git push` 금지.

**Goal:** 게시글 본문의 내부 글 링크·외부 링크에 마우스를 올리면 대상 정보를 담은 카드 팝오버를 띄운다 — 런타임 fetch 없이.

**Architecture:** 동기화 스크립트가 외부 링크의 Open Graph 메타를 빌드 시점에 수집해 `src/app/link-previews.json`에 증분 캐시한다. MDX의 `a` 컴포넌트(서버)가 `posts.json`/`link-previews.json`에서 미리보기 데이터를 찾아 클라이언트 컴포넌트 `LinkPreview`(Radix HoverCard)에 넘긴다. 데이터가 없으면 지금과 동일한 일반 링크.

**Tech Stack:** Next.js 15.3 App Router · React 19 · `@next/mdx` · Tailwind v4 · shadcn `hover-card`(`@radix-ui/react-hover-card`) · Node 22 (`fetch`, `node --test`) · pnpm

**Spec:** `docs/superpowers/specs/2026-09-11-link-preview-design.md`

## Global Constraints

- 패키지 매니저는 **pnpm**만. npm/yarn 금지.
- `scripts/`는 CommonJS(`require`/`module.exports`). 앱 코드는 TS/ESM.
- 새 의존성은 `@radix-ui/react-hover-card` 하나뿐. OG 파서·HTML 엔티티 디코더는 직접 쓴다(정규식, 의존성 0).
- 테스트 러너: 프로젝트에 없으므로 **Node 내장 `node --test`** 를 `scripts/` 전용으로 추가. React 컴포넌트는 단위 테스트 없이 `pnpm build` + dev 서버 육안 확인.
- `src/app/link-previews.json`은 **커밋한다** (`build:vercel`은 sync를 돌리지 않음).
- 외부 fetch: 동시 5, 타임아웃 5초, `User-Agent` 명시, 성공 항목 재수집 없음, 실패 항목 7일 후 재시도.
- 미리보기 데이터 없는 링크 = 현재 렌더링 그대로. 회귀 금지.
- 커밋 직전 `git rev-parse --abbrev-ref HEAD`로 브랜치 확인. 작업 브랜치: `feat/link-preview` (main에서 분기).

---

## 파일 구조

| 파일 | 역할 |
|---|---|
| `scripts/link-preview/og-parser.js` (신규) | 순수 함수. HTML 문자열 → `{title, description, image, siteName}`. fetch 없음. |
| `scripts/link-preview/collect.js` (신규) | `extractExternalUrls(mdx)`, `collectLinkPreviews(...)`. fetch·캐시·동시성. `fetchImpl`/`now` 주입 가능. |
| `scripts/link-preview/*.test.js` (신규) | `node --test` 테스트. |
| `scripts/config.js` (수정) | `linkPreviewsJsonPath` 추가. |
| `scripts/sync-content.js` (수정) | `updatePostsJson` 뒤에 `updateLinkPreviews()` 호출. |
| `src/app/link-previews.json` (생성·커밋) | OG 캐시. |
| `src/app/config/types.ts` (수정) | `LinkPreviewData` 타입. |
| `src/app/lib/linkPreview.ts` (신규) | `getLinkPreview(href)` — 두 JSON을 읽어 `LinkPreviewData \| null`. 서버 전용. |
| `components/ui/hover-card.tsx` (shadcn 생성) | Radix HoverCard 래퍼. |
| `src/app/_components/LinkPreview.tsx` (신규) | `"use client"`. 링크 + 카드. |
| `mdx-components.tsx` (수정) | `a`에서 `getLinkPreview` → `LinkPreview`. |
| `package.json` (수정) | `test` 스크립트, 의존성. |

---

### Task 1: 브랜치·테스트 러너 준비

**Files:**
- Modify: `package.json` (scripts)

- [ ] **Step 1: 브랜치 생성**

```bash
cd /Users/mac/workspace/blog-nextjs
git rev-parse --abbrev-ref HEAD   # main 확인
git checkout -b feat/link-preview
```

- [ ] **Step 2: `test` 스크립트 추가**

`package.json`의 `scripts`에 한 줄:

```json
"test": "node --test scripts/"
```

- [ ] **Step 3: 빈 상태로 실행해 러너 동작 확인**

Run: `pnpm test`
Expected: `# tests 0` … `# fail 0` (테스트 파일이 없어도 정상 종료)

- [ ] **Step 4: Commit**

```bash
git add package.json
git commit -m "chore: node --test 러너 스크립트 추가

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: OG 파서 (순수 함수)

**Files:**
- Create: `scripts/link-preview/og-parser.js`
- Test: `scripts/link-preview/og-parser.test.js`

**Interfaces:**
- Produces: `parseOpenGraph(html: string, pageUrl: string) → { title: string|null, description: string|null, image: string|null, siteName: string|null }`

- [ ] **Step 1: 실패하는 테스트 작성**

`scripts/link-preview/og-parser.test.js`:

```js
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { parseOpenGraph } = require('./og-parser');

test('og:* 메타를 읽는다', () => {
  const html = `<html><head>
    <meta property="og:title" content="History - Web API">
    <meta property="og:description" content="브라우저 세션 기록">
    <meta property="og:image" content="https://mdn.dev/share.png">
    <meta property="og:site_name" content="MDN">
    <title>무시될 title</title>
  </head></html>`;
  assert.deepEqual(parseOpenGraph(html, 'https://mdn.dev/x'), {
    title: 'History - Web API',
    description: '브라우저 세션 기록',
    image: 'https://mdn.dev/share.png',
    siteName: 'MDN',
  });
});

test('og:title이 없으면 <title>, description은 meta name=description으로 폴백', () => {
  const html = `<head><title>  Plain  Page </title>
    <meta name="description" content="일반 설명"></head>`;
  const r = parseOpenGraph(html, 'https://a.com');
  assert.equal(r.title, 'Plain Page');
  assert.equal(r.description, '일반 설명');
  assert.equal(r.image, null);
  assert.equal(r.siteName, null);
});

test('content가 property보다 앞에 와도 읽는다', () => {
  const html = `<meta content="역순" property="og:title">`;
  assert.equal(parseOpenGraph(html, 'https://a.com').title, '역순');
});

test('상대 경로 og:image는 페이지 URL 기준 절대 URL로', () => {
  const html = `<meta property="og:image" content="/img/og.png">`;
  assert.equal(parseOpenGraph(html, 'https://a.com/posts/1').image, 'https://a.com/img/og.png');
});

test('HTML 엔티티를 디코드한다', () => {
  const html = `<meta property="og:title" content="A &amp; B &#39;C&#39; &quot;D&quot; &lt;E&gt;">`;
  assert.equal(parseOpenGraph(html, 'https://a.com').title, `A & B 'C' "D" <E>`);
});

test('아무것도 없으면 전부 null', () => {
  assert.deepEqual(parseOpenGraph('<p>hi</p>', 'https://a.com'), {
    title: null, description: null, image: null, siteName: null,
  });
});
```

- [ ] **Step 2: 실패 확인**

Run: `pnpm test`
Expected: FAIL — `Cannot find module './og-parser'`

- [ ] **Step 3: 구현**

`scripts/link-preview/og-parser.js`:

```js
/**
 * HTML 문자열에서 Open Graph 메타를 추출한다. 네트워크 없음.
 * <head>만 보면 되므로 앞 200KB만 검사한다(대용량 페이지 방어).
 */
const HEAD_LIMIT = 200 * 1024;

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

function decodeEntities(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, name) => ENTITIES[name.toLowerCase()] ?? m);
}

function clean(s) {
  return decodeEntities(s).replace(/\s+/g, ' ').trim();
}

/**
 * <meta ... property|name="key" ... content="..."> 를 속성 순서와 무관하게 찾는다.
 */
function readMeta(html, key) {
  const tagRe = /<meta\b[^>]*>/gi;
  let m;
  while ((m = tagRe.exec(html))) {
    const tag = m[0];
    const keyMatch = tag.match(/\b(?:property|name)\s*=\s*["']([^"']+)["']/i);
    if (!keyMatch || keyMatch[1].toLowerCase() !== key) continue;
    const contentMatch = tag.match(/\bcontent\s*=\s*["']([^"']*)["']/i);
    if (contentMatch && contentMatch[1].trim()) return clean(contentMatch[1]);
  }
  return null;
}

function readTitleTag(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m && m[1].trim() ? clean(m[1]) : null;
}

function toAbsolute(url, base) {
  if (!url) return null;
  try {
    return new URL(url, base).toString();
  } catch {
    return null;
  }
}

function parseOpenGraph(html, pageUrl) {
  const head = html.slice(0, HEAD_LIMIT);
  return {
    title: readMeta(head, 'og:title') ?? readTitleTag(head),
    description: readMeta(head, 'og:description') ?? readMeta(head, 'description'),
    image: toAbsolute(readMeta(head, 'og:image'), pageUrl),
    siteName: readMeta(head, 'og:site_name'),
  };
}

module.exports = { parseOpenGraph };
```

- [ ] **Step 4: 통과 확인**

Run: `pnpm test`
Expected: `# pass 6` `# fail 0`

- [ ] **Step 5: Commit**

```bash
git add scripts/link-preview/og-parser.js scripts/link-preview/og-parser.test.js
git commit -m "feat(sync): Open Graph 메타 파서 추가

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: 외부 URL 추출 + 증분 수집기

**Files:**
- Create: `scripts/link-preview/collect.js`
- Test: `scripts/link-preview/collect.test.js`

**Interfaces:**
- Consumes: `parseOpenGraph` (Task 2)
- Produces:
  - `extractExternalUrls(mdx: string) → string[]` — 중복 제거, `![…](…)` 이미지 제외, `http(s)`만
  - `collectLinkPreviews({ urls, cache, fetchImpl = fetch, now = () => new Date(), concurrency = 5, timeoutMs = 5000, retryErrorAfterMs = 7일, log = console.log }) → Promise<cache>` — `cache`는 `{ [url]: entry }` 객체. 성공 항목은 건너뛰고, 실패 항목은 `retryErrorAfterMs` 지났을 때만 재시도. 새 객체를 반환(입력 불변).

- [ ] **Step 1: 실패하는 테스트 작성**

`scripts/link-preview/collect.test.js`:

```js
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { extractExternalUrls, collectLinkPreviews } = require('./collect');

test('extractExternalUrls: 외부 링크만, 이미지 제외, 중복 제거', () => {
  const mdx = [
    '본문 [MDN](https://developer.mozilla.org/ko/docs/A) 과',
    '![그림](https://my-personal-image-bucket.s3.ap-northeast-2.amazonaws.com/x.png)',
    '[내부](/posts/redux-1) [앵커](#top)',
    '[또 MDN](https://developer.mozilla.org/ko/docs/A)',
    '[유튜브](https://www.youtube.com/watch?v=1 "제목")',
  ].join('\n');
  assert.deepEqual(extractExternalUrls(mdx), [
    'https://developer.mozilla.org/ko/docs/A',
    'https://www.youtube.com/watch?v=1',
  ]);
});

function okResponse(html) {
  return { ok: true, status: 200, headers: new Map([['content-type', 'text/html']]), text: async () => html };
}

test('collectLinkPreviews: 새 URL은 fetch해서 성공 항목으로 저장', async () => {
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(url);
    return okResponse('<meta property="og:title" content="T"><meta property="og:description" content="D">');
  };
  const now = () => new Date('2026-09-11T00:00:00Z');
  const out = await collectLinkPreviews({ urls: ['https://a.com/1'], cache: {}, fetchImpl, now });
  assert.deepEqual(calls, ['https://a.com/1']);
  assert.deepEqual(out['https://a.com/1'], {
    title: 'T', description: 'D', image: null, siteName: null,
    fetchedAt: '2026-09-11T00:00:00.000Z',
  });
});

test('collectLinkPreviews: 성공 캐시는 다시 fetch하지 않는다', async () => {
  let n = 0;
  const cache = { 'https://a.com/1': { title: 'T', fetchedAt: '2026-01-01T00:00:00.000Z' } };
  const out = await collectLinkPreviews({ urls: ['https://a.com/1'], cache, fetchImpl: async () => { n++; return okResponse(''); } });
  assert.equal(n, 0);
  assert.deepEqual(out, cache);
});

test('collectLinkPreviews: HTTP 실패는 error로 기록', async () => {
  const fetchImpl = async () => ({ ok: false, status: 404, headers: new Map(), text: async () => '' });
  const now = () => new Date('2026-09-11T00:00:00Z');
  const out = await collectLinkPreviews({ urls: ['https://a.com/gone'], cache: {}, fetchImpl, now });
  assert.deepEqual(out['https://a.com/gone'], { error: 'HTTP 404', fetchedAt: '2026-09-11T00:00:00.000Z' });
});

test('collectLinkPreviews: title 없으면 실패 처리', async () => {
  const out = await collectLinkPreviews({
    urls: ['https://a.com/x'], cache: {},
    fetchImpl: async () => okResponse('<p>no title</p>'),
    now: () => new Date('2026-09-11T00:00:00Z'),
  });
  assert.equal(out['https://a.com/x'].error, 'no title');
});

test('collectLinkPreviews: 실패 항목은 7일 지나야 재시도', async () => {
  let n = 0;
  const fetchImpl = async () => { n++; return okResponse('<title>Back</title>'); };
  const recent = { 'https://a.com/x': { error: 'HTTP 500', fetchedAt: '2026-09-10T00:00:00.000Z' } };
  const stale  = { 'https://a.com/x': { error: 'HTTP 500', fetchedAt: '2026-09-01T00:00:00.000Z' } };
  const now = () => new Date('2026-09-11T00:00:00Z');

  await collectLinkPreviews({ urls: ['https://a.com/x'], cache: recent, fetchImpl, now });
  assert.equal(n, 0);

  const out = await collectLinkPreviews({ urls: ['https://a.com/x'], cache: stale, fetchImpl, now });
  assert.equal(n, 1);
  assert.equal(out['https://a.com/x'].title, 'Back');
});

test('collectLinkPreviews: fetch 예외(타임아웃 등)도 error로 기록하고 계속 진행', async () => {
  const fetchImpl = async (url) => {
    if (url.endsWith('/bad')) throw new Error('timeout');
    return okResponse('<title>Good</title>');
  };
  const out = await collectLinkPreviews({
    urls: ['https://a.com/bad', 'https://a.com/good'], cache: {}, fetchImpl,
    now: () => new Date('2026-09-11T00:00:00Z'),
  });
  assert.equal(out['https://a.com/bad'].error, 'timeout');
  assert.equal(out['https://a.com/good'].title, 'Good');
});

test('collectLinkPreviews: 동시성 제한을 지킨다', async () => {
  let inFlight = 0, peak = 0;
  const fetchImpl = async () => {
    inFlight++; peak = Math.max(peak, inFlight);
    await new Promise((r) => setTimeout(r, 5));
    inFlight--;
    return okResponse('<title>x</title>');
  };
  const urls = Array.from({ length: 12 }, (_, i) => `https://a.com/${i}`);
  await collectLinkPreviews({ urls, cache: {}, fetchImpl, concurrency: 3 });
  assert.equal(peak, 3);
});

test('collectLinkPreviews: 캐시에만 있고 본문에 없는 URL은 버린다', async () => {
  const cache = { 'https://a.com/removed': { title: 'old', fetchedAt: '2026-01-01T00:00:00.000Z' } };
  const out = await collectLinkPreviews({ urls: [], cache, fetchImpl: async () => okResponse('') });
  assert.deepEqual(out, {});
});
```

- [ ] **Step 2: 실패 확인**

Run: `pnpm test`
Expected: FAIL — `Cannot find module './collect'`

- [ ] **Step 3: 구현**

`scripts/link-preview/collect.js`:

```js
const { parseOpenGraph } = require('./og-parser');

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
const USER_AGENT = 'Mozilla/5.0 (compatible; blog-link-preview/1.0; +https://github.com/LeChuckbb)';

/**
 * MDX 본문에서 외부 링크 URL을 추출한다.
 * - `![alt](url)` 이미지는 제외 (S3 이미지가 다수)
 * - `[text](url "title")` 의 title 부분은 잘라낸다
 * - http(s)만, 등장 순서 유지, 중복 제거
 */
function extractExternalUrls(mdx) {
  const seen = new Set();
  const re = /(!?)\[[^\]]*\]\((https?:\/\/[^\s)]+)(?:\s+"[^"]*")?\)/g;
  let m;
  while ((m = re.exec(mdx))) {
    if (m[1] === '!') continue;
    seen.add(m[2]);
  }
  return [...seen];
}

function isFresh(entry, nowMs, retryErrorAfterMs) {
  if (!entry) return false;
  if (!entry.error) return true; // 성공 항목은 영구
  const fetchedAt = Date.parse(entry.fetchedAt || 0);
  return nowMs - fetchedAt < retryErrorAfterMs;
}

async function fetchOne(url, { fetchImpl, timeoutMs, nowIso }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetchImpl(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'user-agent': USER_AGENT, accept: 'text/html,application/xhtml+xml' },
    });
    if (!res.ok) return { error: `HTTP ${res.status}`, fetchedAt: nowIso };
    const html = await res.text();
    const og = parseOpenGraph(html, url);
    if (!og.title) return { error: 'no title', fetchedAt: nowIso };
    return { ...og, fetchedAt: nowIso };
  } catch (err) {
    const msg = err && err.name === 'AbortError' ? 'timeout' : String((err && err.message) || err);
    return { error: msg, fetchedAt: nowIso };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * 외부 URL들의 OG 메타를 증분 수집한다.
 * 성공 항목은 재수집하지 않고, 실패 항목은 retryErrorAfterMs 경과 시 재시도.
 * 본문에서 사라진 URL은 결과에서 제거한다. 입력 cache는 변경하지 않는다.
 */
async function collectLinkPreviews({
  urls,
  cache,
  fetchImpl = globalThis.fetch,
  now = () => new Date(),
  concurrency = 5,
  timeoutMs = 5000,
  retryErrorAfterMs = SEVEN_DAYS,
  log = () => {},
}) {
  const nowDate = now();
  const nowMs = nowDate.getTime();
  const nowIso = nowDate.toISOString();

  const result = {};
  const queue = [];
  for (const url of urls) {
    if (isFresh(cache[url], nowMs, retryErrorAfterMs)) result[url] = cache[url];
    else queue.push(url);
  }

  log(`🔗 링크 미리보기: 캐시 ${Object.keys(result).length}개, 수집 ${queue.length}개`);

  let next = 0;
  async function worker() {
    while (next < queue.length) {
      const url = queue[next++];
      const entry = await fetchOne(url, { fetchImpl, timeoutMs, nowIso });
      result[url] = entry;
      log(entry.error ? `  ✗ ${url} (${entry.error})` : `  ✓ ${url}`);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, queue.length) }, worker));

  // 키를 정렬해 diff가 안정되게 한다
  return Object.fromEntries(Object.keys(result).sort().map((k) => [k, result[k]]));
}

module.exports = { extractExternalUrls, collectLinkPreviews };
```

- [ ] **Step 4: 통과 확인**

Run: `pnpm test`
Expected: `# pass 15` `# fail 0`

- [ ] **Step 5: Commit**

```bash
git add scripts/link-preview/collect.js scripts/link-preview/collect.test.js
git commit -m "feat(sync): 외부 링크 OG 메타 증분 수집기 추가

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: sync 파이프라인에 연결 + 첫 수집

**Files:**
- Modify: `scripts/config.js` (`initializePaths`, `ensureDirectories`)
- Modify: `scripts/sync-content.js` (`sync()`, 새 메서드 `updateLinkPreviews`)
- Create (생성물): `src/app/link-previews.json`

**Interfaces:**
- Consumes: `extractExternalUrls`, `collectLinkPreviews` (Task 3)
- Produces: `src/app/link-previews.json` — `{ [url]: { title, description, image, siteName, fetchedAt } | { error, fetchedAt } }`

- [ ] **Step 1: config에 경로 추가**

`scripts/config.js` `initializePaths()` 끝, `this.postsJsonPath = …` 다음 줄:

```js
    this.linkPreviewsJsonPath = path.join(this.projectRoot, 'src/app/link-previews.json');
```

- [ ] **Step 2: sync-content.js 상단 import**

```js
const { extractExternalUrls, collectLinkPreviews } = require('./link-preview/collect');
```

- [ ] **Step 3: `sync()`에서 호출**

`await this.updatePostsJson(posts);` 바로 다음 줄에:

```js
      // 외부 링크 미리보기(OG) 증분 수집
      await this.updateLinkPreviews(posts);
```

- [ ] **Step 4: 메서드 추가** (`updatePostsJson` 바로 아래)

```js
  /**
   * 외부 링크 미리보기 캐시(link-previews.json) 갱신
   * 변환된 content/*.mdx에서 외부 URL을 모아 OG 메타를 증분 수집한다.
   * 네트워크 실패는 항목별 error로 기록되며 동기화 자체는 실패하지 않는다.
   */
  async updateLinkPreviews(posts) {
    const urls = new Set();
    for (const post of posts) {
      const mdx = fs.readFileSync(path.join(this.config.contentPath, post.filename), 'utf-8');
      extractExternalUrls(mdx).forEach((u) => urls.add(u));
    }

    let cache = {};
    if (fs.existsSync(this.config.linkPreviewsJsonPath)) {
      cache = JSON.parse(fs.readFileSync(this.config.linkPreviewsJsonPath, 'utf-8'));
    }

    const next = await collectLinkPreviews({ urls: [...urls], cache, log: console.log });
    fs.writeFileSync(this.config.linkPreviewsJsonPath, JSON.stringify(next, null, 2) + '\n');

    const failed = Object.values(next).filter((e) => e.error).length;
    console.log(`✓ link-previews.json 갱신 완료 (${Object.keys(next).length}개, 실패 ${failed}개)`);
  }
```

- [ ] **Step 5: 첫 수집 실행**

Run: `pnpm sync`
Expected: `🔗 링크 미리보기: 캐시 0개, 수집 161개` → URL별 ✓/✗ → `✓ link-previews.json 갱신 완료 (161개, 실패 N개)`. 1~3분 소요.

- [ ] **Step 6: 두 번째 실행은 즉시 끝나는지 확인**

Run: `pnpm sync`
Expected: `🔗 링크 미리보기: 캐시 161개, 수집 0개` — OG 단계가 1초 안에 지나감.

- [ ] **Step 7: 결과 훑기**

```bash
node -e "const j=require('./src/app/link-previews.json');const e=Object.entries(j);console.log('total',e.length,'error',e.filter(([,v])=>v.error).length);e.filter(([,v])=>v.error).slice(0,15).forEach(([k,v])=>console.log(v.error,k))"
```

실패 사유가 `HTTP 403`(봇 차단)이나 `timeout`이 대부분이면 정상. **파서 버그로 보이는 실패**(HTML은 받았는데 `no title`)가 있으면 그 사이트의 HTML을 저장해 Task 2 테스트에 케이스로 추가하고 파서를 고친다.

- [ ] **Step 8: Commit**

```bash
git rev-parse --abbrev-ref HEAD   # feat/link-preview
git add scripts/config.js scripts/sync-content.js src/app/link-previews.json
git commit -m "feat(sync): 동기화 시 외부 링크 OG 미리보기 수집·캐시

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: 타입 + 서버 조회 함수

**Files:**
- Modify: `src/app/config/types.ts`
- Create: `src/app/lib/linkPreview.ts`

**Interfaces:**
- Produces:
  - `type LinkPreviewData` (스펙의 discriminated union)
  - `getLinkPreview(href: string | undefined) → LinkPreviewData | null` — 서버 전용(JSON import). `/posts/<slug>` → `kind: "post"`, `http(s)://…` → `kind: "external"`, 그 외·데이터 없음 → `null`.

- [ ] **Step 1: 타입 추가** (`src/app/config/types.ts` 끝에)

```ts
export type LinkPreviewData =
  | {
      kind: "post";
      title: string;
      date: string;
      readingTime?: number;
      series?: string;
      description?: string;
    }
  | {
      kind: "external";
      title: string;
      domain: string;
      description?: string;
      image?: string;
    };
```

- [ ] **Step 2: 조회 함수 작성**

`src/app/lib/linkPreview.ts`:

```ts
import postsData from "@/src/app/posts.json";
import linkPreviews from "@/src/app/link-previews.json";
import type { LinkPreviewData, Post } from "@/src/app/config/types";

type ExternalEntry =
  | { title: string; description?: string | null; image?: string | null; siteName?: string | null; fetchedAt: string }
  | { error: string; fetchedAt: string };

const posts = (postsData as { posts: Post[] }).posts;
const previews = linkPreviews as Record<string, ExternalEntry>;

/**
 * 본문 링크의 미리보기 데이터. 서버(MDX 렌더)에서만 호출한다.
 * 데이터가 없으면 null — 호출자는 일반 링크로 렌더링한다.
 */
export function getLinkPreview(href: string | undefined): LinkPreviewData | null {
  if (!href) return null;

  if (href.startsWith("/posts/")) {
    const slug = decodeURIComponent(href.slice("/posts/".length).split(/[#?]/)[0]);
    const post = posts.find((p) => p.slug === slug);
    if (!post) return null;
    return {
      kind: "post",
      title: post.title,
      date: post.date,
      readingTime: post.readingTime,
      series: post.series,
      description: post.description || undefined,
    };
  }

  if (/^https?:\/\//.test(href)) {
    const entry = previews[href];
    if (!entry || "error" in entry) return null;
    return {
      kind: "external",
      title: entry.title,
      domain: new URL(href).hostname.replace(/^www\./, ""),
      description: entry.description ?? undefined,
      image: entry.image ?? undefined,
    };
  }

  return null;
}
```

- [ ] **Step 3: 타입 검사**

Run: `pnpm exec tsc --noEmit`
Expected: 오류 없음. (`resolveJsonModule`이 꺼져 있어 JSON import가 실패하면 `tsconfig.json` `compilerOptions`에 `"resolveJsonModule": true` 추가 — 단 `posts.json` import가 이미 `page.tsx`에서 동작하므로 보통 이미 켜져 있다.)

- [ ] **Step 4: Commit**

```bash
git add src/app/config/types.ts src/app/lib/linkPreview.ts
git commit -m "feat: 링크 미리보기 데이터 타입·서버 조회 함수

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: HoverCard 설치 + `LinkPreview` 클라이언트 컴포넌트

**Files:**
- Create (shadcn): `components/ui/hover-card.tsx`
- Create: `src/app/_components/LinkPreview.tsx`
- Modify: `package.json`, `pnpm-lock.yaml` (의존성)

**Interfaces:**
- Consumes: `LinkPreviewData` (Task 5)
- Produces: `<LinkPreview href external preview>{children}</LinkPreview>` — `props: { href: string; external: boolean; preview: LinkPreviewData; className?: string; children: React.ReactNode }`. 외부 링크일 때 `target=_blank rel="noopener noreferrer"`와 12px 외부 아이콘을 **컴포넌트 안에서** 렌더한다(기존 `mdx-components.tsx`의 마크업을 그대로 옮김).

- [ ] **Step 1: shadcn hover-card 추가**

Run: `pnpm dlx shadcn@latest add hover-card`
Expected: `components/ui/hover-card.tsx` 생성, `@radix-ui/react-hover-card` 의존성 추가. 생성 파일은 손대지 않는다.

- [ ] **Step 2: 컴포넌트 작성**

`src/app/_components/LinkPreview.tsx`:

```tsx
"use client";

import { useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import type { LinkPreviewData } from "@/src/app/config/types";

interface LinkPreviewProps {
  href: string;
  external: boolean;
  preview: LinkPreviewData;
  className?: string;
  children: React.ReactNode;
}

function ExternalIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="inline-block ml-0.5 mb-0.5 w-3 h-3 opacity-60"
      aria-hidden="true"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-3.5 h-3.5 shrink-0"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function formatDate(iso: string) {
  // "2026-06-02" → "2026.06.02"
  return iso.replaceAll("-", ".");
}

function PostCard({ preview }: { preview: Extract<LinkPreviewData, { kind: "post" }> }) {
  return (
    <div className="flex flex-col gap-1.5 p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {preview.series && (
          <span className="inline-flex items-center rounded-full bg-accent px-2 py-px font-medium text-accent-foreground">
            {preview.series}
          </span>
        )}
        <span>
          {formatDate(preview.date)}
          {preview.readingTime ? ` · ${preview.readingTime}분` : ""}
        </span>
      </div>
      <div className="font-serif text-[15px] font-semibold leading-snug text-popover-foreground">
        {preview.title}
      </div>
      {preview.description && (
        <p className="m-0 line-clamp-3 text-[13px] leading-relaxed text-muted-foreground">
          {preview.description}
        </p>
      )}
    </div>
  );
}

function ExternalCard({ preview }: { preview: Extract<LinkPreviewData, { kind: "external" }> }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(preview.image) && !imageFailed;

  return (
    <div className="flex flex-col">
      {showImage && (
        // og:image는 도메인이 제각각이라 next/image 대신 <img>. 실패하면 영역째 숨긴다.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview.image}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImageFailed(true)}
          className="h-[150px] w-full object-cover border-b border-border bg-muted"
        />
      )}
      <div className="flex flex-col gap-1 px-3.5 pt-3 pb-3.5">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <GlobeIcon />
          <span className="truncate">{preview.domain}</span>
        </div>
        <div className="line-clamp-2 text-sm font-semibold leading-snug text-popover-foreground">
          {preview.title}
        </div>
        {preview.description && (
          <p className="m-0 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
            {preview.description}
          </p>
        )}
      </div>
    </div>
  );
}

export function LinkPreview({ href, external, preview, className, children }: LinkPreviewProps) {
  return (
    <HoverCard openDelay={300} closeDelay={150}>
      <HoverCardTrigger asChild>
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          // 카드가 열린 동안만 accent 배경 (Radix가 트리거에 data-state=open을 붙인다)
          className={cn("rounded-[4px] data-[state=open]:bg-accent", className)}
        >
          {children}
          {external && <ExternalIcon />}
        </a>
      </HoverCardTrigger>
      <HoverCardContent
        side="bottom"
        align="start"
        sideOffset={6}
        className="w-80 overflow-hidden rounded-lg border border-border bg-popover p-0 text-popover-foreground shadow-lg not-prose"
      >
        {preview.kind === "post" ? <PostCard preview={preview} /> : <ExternalCard preview={preview} />}
      </HoverCardContent>
    </HoverCard>
  );
}
```

- [ ] **Step 3: 타입·린트**

Run: `pnpm exec tsc --noEmit && pnpm lint`
Expected: 오류 없음. `no-img-element` 경고는 위 disable 주석으로 억제됨.

- [ ] **Step 4: Commit**

```bash
git add components/ui/hover-card.tsx src/app/_components/LinkPreview.tsx package.json pnpm-lock.yaml
git commit -m "feat: 링크 호버 미리보기 카드 컴포넌트(LinkPreview)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: MDX `a`에 연결 + 실제 화면 확인

**Files:**
- Modify: `mdx-components.tsx` (`a` 컴포넌트, 현재 `a: ({ children, href, className, ...rest }) => { … }` 블록)

**Interfaces:**
- Consumes: `getLinkPreview` (Task 5), `LinkPreview` (Task 6)

- [ ] **Step 1: import 추가** (파일 상단)

```tsx
import { LinkPreview } from "./src/app/_components/LinkPreview";
import { getLinkPreview } from "./src/app/lib/linkPreview";
```

- [ ] **Step 2: `a` 컴포넌트 수정**

`unresolved:` 분기는 그대로 두고, 그 아래 `const isExternal = …` 부터 `return ( <a …> … </a> );` 까지를 다음으로 교체:

```tsx
      const isExternal = href?.startsWith("http") ?? false;
      const preview = getLinkPreview(href);

      // 미리보기 데이터가 있는 링크만 HoverCard로. 없으면 기존과 동일한 일반 링크.
      if (href && preview) {
        return (
          <LinkPreview href={href} external={isExternal} preview={preview} className={className}>
            {children}
          </LinkPreview>
        );
      }

      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className={className}
          {...rest}
        >
          {children}
          {isExternal && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="inline-block ml-0.5 mb-0.5 w-3 h-3 opacity-60"
              aria-hidden="true"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          )}
        </a>
      );
```

- [ ] **Step 3: 프로덕션 빌드**

Run: `pnpm build`
Expected: 62개 `/posts/[slug]` 정적 생성, 오류 없음. `'use client'` 경계 오류(서버 컴포넌트에서 JSON을 클라이언트로 넘기는 건 직렬화 가능한 plain object라 문제없음)가 나면 `preview`에 `undefined` 대신 값이 있는 필드만 담기도록 `getLinkPreview`를 확인한다.

- [ ] **Step 4: dev 서버로 육안 확인**

Run: `pnpm dev` 후 브라우저(또는 Playwright MCP)로 확인. 확인 항목 — 각각 체크:

- [ ] 내부 링크가 있는 글(예: 시리즈 글 `redux-2`의 "이전 글" 링크)에서 hover 300ms 후 카드: 시리즈 칩 · 날짜·분 · 제목(세리프) · 설명 3줄
- [ ] 외부 링크(예: MDN 링크가 있는 글)에서 카드: og:image · 도메인 · 제목 · 설명
- [ ] og:image 없는/실패한 사이트: 이미지 영역 없이 텍스트만
- [ ] `link-previews.json`에 `error`인 URL: 카드 없음, 링크 동작 그대로
- [ ] 커서를 링크 → 카드로 옮겨도 닫히지 않음(150ms 유예)
- [ ] Tab 키로 링크에 포커스 → 카드 열림, Esc → 닫힘
- [ ] 뷰포트 하단 근처 링크: 카드가 위로 뒤집힘
- [ ] 라이트/다크 토글 양쪽에서 카드 색이 토큰을 따름
- [ ] 브라우저 콘솔에 hydration 경고 없음 (HoverCard가 포털로 렌더하므로 `<p>` 안에 `<div>`가 들어가지 않아야 함)
- [ ] 모바일 에뮬레이션(터치)에서 탭 시 카드가 뜨지 않고 바로 이동

- [ ] **Step 5: Commit**

```bash
git rev-parse --abbrev-ref HEAD   # feat/link-preview
git add mdx-components.tsx
git commit -m "feat: 본문 링크 hover 시 미리보기 카드 표시

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: 문서 반영 + 전체 리뷰

**Files:**
- Modify: `CLAUDE.md` (콘텐츠 흐름 한 줄)
- 검토: 위 전체 diff

- [ ] **Step 1: CLAUDE.md 콘텐츠 흐름 갱신**

`## 콘텐츠 흐름` 문단의
`published/*.md → 동기화 스크립트(scripts/) → content/*.mdx + src/app/posts.json(메타데이터 자동 생성) → /posts/[slug] 라우팅.`
을
`published/*.md → 동기화 스크립트(scripts/) → content/*.mdx + src/app/posts.json(메타데이터) + src/app/link-previews.json(외부 링크 OG 캐시, 증분·커밋 대상) → /posts/[slug] 라우팅.`
으로 바꾼다.

- [ ] **Step 2: 전체 검증**

```bash
pnpm test && pnpm lint && pnpm exec tsc --noEmit && pnpm build
```
Expected: 전부 통과.

- [ ] **Step 3: 전체 diff 리뷰 1회** (`superpowers:requesting-code-review` 또는 `/code-review`)

Run: `git diff main...feat/link-preview --stat` 로 범위 확인 후 리뷰. 관점: (1) 미리보기 없는 링크의 렌더링이 변경 전과 바이트 단위로 같은가, (2) `link-previews.json`의 실패 항목이 화면에 새지 않는가, (3) sync 실패 시 동기화 전체가 죽지 않는가.

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: 콘텐츠 흐름에 link-previews.json 추가

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 5: 로컬 머지까지만** — `git push`·PR·배포는 사용자가 직접.

```bash
git checkout main && git merge --no-ff feat/link-preview
```

---

## 자기 검토 결과

- **스펙 커버리지**: 런타임 fetch 없음(T3·T4·T5) · 커밋되는 캐시(T4) · HoverCard(T6) · 데이터 없으면 일반 링크(T7) · 파비콘 없음/지구본(T6) · `<img>` 직접(T6) · MDX `a`만(T7) · 실패 7일 재시도(T3) · title 필수(T3) · 절대 URL 이미지(T2) — 전부 대응.
- **타입/이름 일관성**: `getLinkPreview` · `LinkPreviewData` · `LinkPreview` · `extractExternalUrls` · `collectLinkPreviews` · `linkPreviewsJsonPath` — 태스크 간 동일.
- **알려진 미결**: `pnpm dlx shadcn add hover-card`가 생성하는 `hover-card.tsx`의 정확한 내용은 shadcn 버전에 따라 다르다. 생성 파일을 손대지 않으므로 계획에는 영향 없음.
