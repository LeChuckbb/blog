---
name: blog-seo-audit
description: blog-nextjs 콘텐츠의 SEO·품질 검수 규칙과 점검 스크립트. frontmatter↔posts.json↔본문↔JSON-LD/sitemap/RSS 경계면 일관성, description·title 품질, 내부 위키링크 무결성, 목차·헤딩 구조, 시리즈 일관성, 이미지 메타를 검수한다. "SEO 검수", "콘텐츠 품질 점검", "메타데이터 감사", "내부 링크 확인", "글 점검", "발행 전 검수" 같은 요청이면 반드시 이 스킬을 사용한다. 발행된 글 전체 또는 특정 글의 SEO·품질 진단·개선안 작성에 트리거한다.
---

# 콘텐츠 SEO·품질 검수 규칙

이 블로그의 SEO 품질은 여러 경계면이 일관적일 때 보장된다: **frontmatter(content/*.mdx) ↔ posts.json ↔ 본문 ↔ 출력물(jsonLd/sitemap/feed/metadata)**. 검수의 핵심은 단순 존재 확인이 아니라 **이 경계면들을 교차 비교**하는 것이다.

## 먼저 자동 점검 스크립트를 돌린다

기계적으로 검출 가능한 이슈(누락·불일치·고아 파일·링크 깨짐)는 사람이 눈으로 찾지 말고 스크립트로 모은다:

```bash
node .claude/skills/blog-seo-audit/scripts/audit.js
```

이 스크립트는 `content/*.mdx`와 `src/app/posts.json`을 읽어 아래를 JSON으로 리포트한다: frontmatter↔posts.json 필드 불일치, description 누락/길이 이탈, title 누락/길이, date 형식 오류, 미해결 위키링크(`unresolved:` 또는 변환 후 잔여 `[[ ]]`), 시리즈 그룹 현황, 이미지 참조 대비 `public/images/` 존재 여부, posts.json↔content 고아(import 키 누락). 스크립트 출력으로 1차 진단한 뒤, 아래 기준으로 심각도를 판정하고 개선안을 쓴다.

## 검수 항목과 심각도 기준

### Critical (발행/검색 노출에 직접 악영향)

- **date 누락/형식 오류**: 정렬·sitemap·RSS pubDate가 깨진다. `YYYY-MM-DD` 아니면 critical.
- **posts.json↔content 고아**: posts.json 항목인데 import할 파일이 없거나, content 파일인데 posts.json에 없음 → 페이지 404 또는 누락.
- **title 누락**: 파일명이 제목으로 노출.
- **미해결 내부 링크**: 의도치 않은 `unresolved:`(red link). 가리키는 글이 발행돼야 하는데 안 된 경우.

### Warning (SEO 품질 저하)

- **description 누락**: 자동 추출 폴백에 의존 → 품질 들쭉날쭉. 직접 작성 권장.
- **description 길이 이탈**: 권장 120~155자. 너무 짧으면(< 80자) 정보 부족, 너무 길면 잘림.
- **title 길이**: 검색 결과 잘림 방지로 ~60자 이내 권장.
- **tags 없음/과다**: 0개면 카테고리 분류·관련글 약화, 과다(예: 10개+)면 희석.
- **헤딩 구조 이상**: h1 본문 중복, h2 없이 h3부터 시작, 레벨 점프(h2→h4) → 목차·접근성·SEO 약화.
- **시리즈 불일치**: 같은 시리즈 의도인데 series 문자열이 미세하게 다름, 또는 멤버 1개라 내비 미노출.

### Info (개선 여지)

- description에 핵심 키워드가 앞쪽에 없음.
- 이미지 alt 텍스트 비어 있음(접근성·이미지 SEO).
- 내부 링크가 전혀 없는 글(사이트 내 링크 그래프 약화).

## 경계면 교차 비교 — 무엇을 어떻게 보나

진단을 신뢰하려면 추측하지 말고 실제 출력 로직을 읽는다:

- **metadata**: `src/app/posts/[slug]/page.tsx`의 `generateMetadata`가 어떤 필드를 OG/Twitter/canonical로 쓰는지 확인 후, 해당 필드가 posts.json에 적절히 있는지 본다.
- **JSON-LD**: `src/app/lib/jsonLd.ts`의 `generateBlogPostingJsonLd`가 headline/description/keywords(=tags join)/datePublished 등을 어디서 끌어오는지 확인. tags가 비면 keywords가 비는 식의 연쇄를 본다.
- **sitemap**: `src/app/sitemap.ts` — 모든 글이 포함되는지, 홈 lastModified가 최신 글 날짜로 고정돼 있는지(빌드마다 바뀌면 안 됨).
- **RSS**: `src/app/feed.xml/route.ts` — description(CDATA)·pubDate(UTC)·category(tags)가 채워지는지.

이들은 모두 posts.json/frontmatter를 소스로 하므로, **소스 한 곳의 결함이 4개 출력에 전파**된다. 그래서 소스 정합성이 가장 비용 대비 효과가 크다.

## 출력 — 리포트 형식

심각도별로 분류하고, 각 항목에 **위치(`파일:라인` 또는 slug+필드)·현재값·권장값·근거**를 적는다. "description이 약하다" 대신 실제 값·길이·권장 문장을 제시한다. 마지막에 우선순위 상위 5개를 요약한다.

## 검수자의 경계

- 너는 **진단하고 개선안을 제시**한다. 콘텐츠 수정은 `blog-content-authoring`(content-publisher), 출력 로직 버그 수정은 `nextjs-blog-dev`(code-developer)에 위임한다. 단 사용자가 직접 고치라 하면 수행한다.
- posts.json/content 불일치를 발견하면 **삭제·수정하지 말고 불일치 자체를 보고**한다(동기화가 소스이므로 손으로 고치면 다음 sync에서 덮어쓰임 — 원인은 Vault 원본/스크립트에 있다).
