---
name: nextjs-blog-dev
description: blog-nextjs Next.js 15 앱 코드의 아키텍처·관례·불변식. App Router 페이지, MDX 렌더 파이프라인(remark/rehype 체인), 정적 생성 제약, SEO 출력(metadata/jsonLd/sitemap/feed), 경로 별칭, Tailwind 4 스타일 규약을 다룬다. src/app/ 이하 컴포넌트·페이지·렌더링·SEO 로직을 리팩토링하거나 새 기능을 추가하거나, MDX 플러그인 체인을 손대거나, 빌드/타입/정적생성 문제를 다루면 반드시 이 스킬을 사용한다. "컴포넌트 리팩토링", "새 페이지/기능", "MDX 플러그인", "메타데이터 수정", "렌더링 변경" 같은 요청에 트리거한다.
---

# Next.js 블로그 앱 개발 규약

이 프로젝트는 **Next.js 15 (App Router) + React 19 + Tailwind CSS 4 + MDX** 기반의 완전 정적 블로그다. 코드를 손대기 전에 아래 불변식과 관례를 따른다 — 특히 정적 생성과 MDX 파이프라인은 깨지기 쉽다.

## 핵심 불변식 (깨면 회귀)

1. **완전 정적 생성**: 글 페이지는 `generateStaticParams` + `dynamicParams = false`로 빌드 타임에 전부 생성된다. **빌드 타임 데이터(posts.json) 의존을 런타임 의존(요청 시 fetch/DB)으로 바꾸지 않는다.** 이 블로그의 성능·SEO·배포 모델이 정적 생성에 묶여 있다.
2. **posts.json은 동기화 산출물**: `src/app/posts.json`은 `pnpm sync`가 생성한다. **앱 코드에서 손으로 고쳐도 다음 sync가 덮어쓴다.** 스키마를 바꿔야 하면 `obsidian-sync` 스킬/sync-maintainer와 협의해 생성 로직부터 바꾼다. `Post` 타입은 `src/app/config/types.ts`.
3. **import 키 = 파일명**: 글 본문은 `import(@/content/{filename})`로 로드된다. posts.json의 항목과 content 파일명 매칭이 깨지면 페이지가 404 난다.
4. **홈 sitemap lastModified 고정**: `src/app/sitemap.ts`의 홈 lastModified는 `new Date()`가 아니라 **최신 글 날짜**로 고정돼 있다(빌드마다 바뀌면 Google 신뢰도 하락). 이 의도를 되돌리지 않는다.

## 디렉토리·경로 관례

- 경로 별칭: 루트 `@/*`, 콘텐츠 `@/content/*`.
- `src/app/config/` — `siteConfig.ts`(사이트 메타: title/description/url/author/locale/ogImage), `types.ts`(`Post` 타입).
- `src/app/lib/` — `jsonLd.ts`(구조화 데이터), `tocUtil.ts`(목차 추출), `util.ts`(`cn()` 클래스 병합).
- `src/app/_components/` — 공유 컴포넌트(언더스코어 = 라우트 세그먼트 아님).
- `src/app/posts/[slug]/page.tsx` — 글 페이지. `generateMetadata`(OG/Twitter/canonical) + `generateStaticParams` + MDX 동적 import.
- SEO 라우트: `sitemap.ts`, `robots.ts`, `feed.xml/route.ts`.

## MDX 렌더 파이프라인 (next.config.mjs)

플러그인 체인은 순서가 중요하다. 손댈 때 전체 체인을 읽고 순서·상호작용을 이해한다:

- **remark**: `remark-frontmatter`(yaml/toml) → `remark-gfm` → `@r4ai/remark-callout`(콜아웃) → `remark-flexible-markers` → `remark-toc`.
- **rehype**: `rehype-pretty-code`(Shiki, dark=catppuccin-frappe / light=github-light) → `rehype-slug` → 자체 `scripts/rehype-image-size.mjs`(원격 이미지 width/height 주입, CLS 방지).
- **콜아웃은 여기서 렌더된다** — 동기화 변환기(transform-obsidian.js)가 아니라 이 플러그인이 처리. 콜아웃 동작을 바꾸려면 동기화가 아니라 이 체인을 본다.
- `rehype-slug`와 `tocUtil.ts`는 **같은 slug 규칙**(github-slugger)을 써야 목차 앵커와 헤딩 id가 일치한다. 한쪽만 바꾸면 목차 링크가 깨진다.

## SEO 출력 로직 — 한 소스가 네 곳에 전파된다

posts.json/frontmatter가 소스이고, 네 곳이 이를 소비한다: `generateMetadata`(page.tsx), `jsonLd.ts`, `sitemap.ts`, `feed.xml`. **출력 로직을 바꾸면 네 곳의 일관성을 함께 본다.**

- `generateMetadata`: title/description(폴백 siteConfig) + OpenGraph(article, publishedTime, authors, tags, ogImage) + Twitter(summary_large_image) + canonical `/posts/{slug}`.
- `jsonLd.ts`: `generateBlogPostingJsonLd`(BlogPosting), `generateWebsiteJsonLd`(WebSite). keywords=tags join.
- SEO 출력을 바꾼 뒤에는 `blog-seo-audit` 스킬로 검수를 요청한다(seo-auditor).

## 스타일링 (Tailwind 4)

- `@tailwindcss/postcss` + `@tailwindcss/typography`. 클래스 병합은 `cn()`(`clsx` + `tailwind-merge`) — 새 className 조합 로직을 직접 만들지 말고 `util.ts`의 `cn()`을 쓴다.
- 다크모드는 `next-themes`. 색상은 라이트/다크 양쪽을 고려한다.
- 코드블록·헤딩 앵커에 커스텀 스타일이 있으니, 관련 변경 시 기존 스타일과 충돌을 확인한다.

## 작업 순서

1. 변경 범위가 위 불변식(정적 생성·posts.json·import 키·sitemap)에 닿는지 먼저 판단.
2. React/Next 패턴 작업이면 프로젝트의 `frontend-dev-guidelines`·`react-best-practices` 스킬을 참고해 성능·관례를 맞춘다.
3. 주변 코드의 네이밍·구조·주석 밀도를 닮게 작성한다.
4. **검증**: `pnpm lint` 통과 + 빌드 영향(타입·정적 생성) 확인 전에는 완료라 하지 않는다. SEO 출력 변경 시 audit 스크립트로 교차 점검.
5. posts.json 스키마/동기화 산출물 형태를 바꿔야 하면 sync-maintainer와 협의(앱만 고치면 sync가 덮어씀).
