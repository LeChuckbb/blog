---
name: obsidian-sync
description: blog-nextjs의 Obsidian→MDX 동기화 파이프라인(scripts/config.js, transform-obsidian.js, sync-content.js, reading-time.js, rehype-image-size.mjs)의 구조·불변식·변환 규칙. 동기화를 실행·검증하거나, 변환 버그(코드펜스 깨짐·위키링크 오해석·이미지 경로·frontmatter 처리)를 고치거나, 새 Obsidian 문법 변환 규칙을 추가하거나, posts.json 생성 로직을 손대는 작업이면 반드시 이 스킬을 사용한다. "동기화 안 됨", "변환 버그", "sync 스크립트 수정", "posts.json 안 맞음", "Obsidian 문법 변환 추가" 같은 요청에 트리거한다.
---

# Obsidian → MDX 동기화 파이프라인

`pnpm sync`(=`node scripts/sync-content.js`)는 Obsidian Vault의 글을 Next.js가 소비할 `content/*.mdx` + `src/app/posts.json`으로 바꾸는 **단방향 빌드 파이프라인**이다. `dev`/`build` 앞에 자동 실행되고, `build:vercel`은 sync를 생략한다(Vercel은 커밋된 산출물만 빌드).

수정 전에 반드시 이해할 것: **이 파이프라인은 불변식 위에 서 있고, 모르고 건드리면 회귀가 난다.** 아래 불변식을 먼저 읽는다.

## 핵심 불변식 (깨면 회귀)

1. **코드블록·인라인코드 보호**: 변환은 코드펜스/인라인코드를 플레이스홀더로 빼낸 뒤 규칙을 적용하고 복원한다. **어떤 새 변환 규칙도 코드 내부에 적용돼선 안 된다.** 새 규칙 추가 시 반드시 보호 구간 밖에서만 동작하는지 확인한다.
2. **2-패스 slug 수집**: 1패스에서 모든 published 글의 slug 집합(`existingSlugs`)을 모으고(위키링크 해석용), 2패스에서 실제 변환한다. slug 집합엔 **frontmatter slug와 파일명 기반 slug 둘 다** 넣어야 위키링크가 안정적으로 매칭된다.
3. **출력 파일명 = 원본 파일명**(.mdx 확장자만 교체). slug가 아니다. posts.json의 import 키(`filename`)가 여기에 묶이므로, 파일명 규칙을 바꾸면 앱의 `import(@/content/...)`가 깨진다.
4. **content/ 전량 재생성**: 동기화는 기존 `content/*.mdx`를 전부 지우고 다시 만든다. content/에 손으로 둔 파일은 사라진다.
5. **posts.json은 날짜 내림차순 정렬**. 필드는 `slug, date, title, tags, description, readingTime` + series 있을 때만 `series`. 스키마를 바꾸면 `src/app/config/types.ts`의 `Post` 타입과 소비처(page.tsx, sitemap, feed, jsonLd)를 함께 맞춰야 한다.
6. **readingTime은 변환 전 원본 기준** 계산. **description 자동추출도 원본 본문 기준**.

## 변환 규칙 (transform-obsidian.js)

`transform()`이 코드 보호 후 순서대로 적용:

1. **주석 `%% ... %%`** (멀티라인/인라인) → 제거
2. **블록 참조 `^xxxxxx`** → 단독 줄은 줄째 제거, 문단 끝 부착분은 ID만 제거(문장 유지). 코드 내부 보호.
3. **위키링크 `[[ ]]`**:
   - `[[파일|표시]]` → `[표시](/posts/slug)`, `[[파일]]` → `[파일](/posts/slug)`
   - slug는 파일명 기반 `generateSlug` 산출
   - **`existingSlugs`에 없으면** `unresolved:slug` 스킴으로 변환 → 렌더 단계(mdx-components)가 비활성 텍스트(red link)로 표시
4. **이미지**: `![alt](Attached file/x.png)` 및 http/절대/앵커 아닌 상대경로 → `/images/` 접두
5. **코드펜스 언어 정규화**: ` ``` mermaid`의 같은 줄 공백만 제거(개행 매칭 금지 — 펜스 깨짐 방지)
6. **MDX 특수문자 이스케이프**: 코드 바깥 `<`→`\<`, `{`/`}`→`\{`/`\}`, HTML 주석 `<!-- -->` 제거

> **콜아웃 주의**: `convertCallouts()` 메서드는 존재하지만 `transform()`에서 **호출되지 않는다.** 콜아웃은 빌드 시 `@r4ai/remark-callout` 플러그인이 처리한다. 콜아웃 변환을 transform에 추가하려다 이중 처리로 깨뜨리지 말 것.

MDX 컴파일은 **검증 전용**이다 — 출력은 컴파일된 JS가 아니라 `matter.stringify`로 만든 원본 마크다운 문자열이다.

## frontmatter 처리 (cleanFrontmatter)

- `publish_date` → `date`로 이전 후 원본 키 삭제
- slug 없으면 파일명 기반 생성
- 날짜 `YYYY-MM-DD`로 정규화
- tags가 문자열이면 콤마 split + 중복 제거
- title 없으면 파일명에서 생성

## 설정·경로 (config.js)

- `OBSIDIAN_VAULT_PATH`(.env.local) 우선. 없으면 플랫폼별 후보 경로를 `fs.existsSync`로 순회해 첫 존재 경로 채택, 못 찾으면 throw.
- Vault 기준: `blog-content/published`(빌드 대상), `blog-content/drafts`(제외).
- 무시 패턴: `_` 시작 / `.draft.` / `.temp.` 포함.
- 출력: `content/`, `src/app/posts.json`.

## reading-time.js / rehype-image-size.mjs

- **reading-time**: frontmatter·코드·태그·링크·이미지·강조 제거 후 CJK(500자/분)·라틴(200단어/분) 분리 계산 + 코드 줄(30줄/분) 가산, `Math.ceil`, **최소 1분**.
- **rehype-image-size**: 빌드 시 `http` 시작 `<img>`만 `probe-image-size`로 실제 width/height 주입(CLS 방지). 실패 시 1920×1080 폴백.

## 동기화 흐름

설정 검증 → Google Drive 동기화 2초 대기 → `content/*.mdx` 전량 삭제 → published 1패스(slug 수집)·2패스(변환) → posts.json 작성(날짜 내림차순).

## 수정 시 작업 순서

1. **재현 먼저**: 버그는 최소 `.md` 조각으로 현상을 재현한 뒤 고친다.
2. **불변식 점검**: 위 6개 불변식 중 무엇에 닿는지 확인. 특히 코드 보호·파일명 키.
3. **변환 규칙 추가 시**: 코드 보호 구간 밖에서만 동작하는지, 기존 규칙 순서와 충돌 없는지 본다.
4. **검증**: 실제 `pnpm sync` 실행 → 변환 전후 비교, posts.json 확인. **Vault 원본은 읽기만**(수정·삭제 시 `obsidian-safe-delete` 사용, rm 금지).
5. **영향 범위 보고**: 변환 규칙 변경이 기존 글 출력을 바꾸면, 어떤 글이 달라지는지 먼저 보고한다.

자세한 변환 엣지 케이스와 점검 항목은 `references/transform-rules.md`를 참조한다.
