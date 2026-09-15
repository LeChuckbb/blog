# 목차(ToC) 헤딩 파싱 정정 Implementation Plan

> 이 레포의 사용자 규칙(`~/.claude/CLAUDE.md`)이 우선한다: **메인 에이전트가 직접 TDD로 구현**하고, 끝에 전체 리뷰 1회. `git push` 금지. 구현 세션은 이 문서를 읽고 시작한다.

**Goal:** 헤딩에 인라인 마크다운(링크·강조·코드·이스케이프)이 섞여 있어도 목차에는 **렌더된 텍스트**가 표시되고, 목차 앵커가 `rehype-slug`가 붙이는 헤딩 id와 항상 일치한다.

**증상 (2026-09-15, 「git flow를 버리고 gitlab flow를 선택한 까닭」):**

```
원문(Vault)  ## [[Git Flow]] 방식이 불편했다
MDX(sync)    ## [Git Flow](unresolved:git-flow) 방식이 불편했다      ← 정상. 본문은 red link로 렌더됨
목차(현재)   "[Git Flow](unresolved:git-flow) 방식이 불편했다"        ← 마크다운 원문이 그대로 노출
목차 앵커    #git-flowunresolvedgit-flow-방식이-불편했다              ← 헤딩 실제 id(#git-flow-방식이-불편했다)와 불일치 → 클릭해도 스크롤 안 됨
```

**원인:** `src/app/lib/tocUtil.ts`의 `extractHeadings()`가 정규식 `^(#{1,6})\s+(.+)$`으로 줄을 뜯고 `\<`·`\>` 두 이스케이프만 벗긴다. 마크다운 인라인 문법을 전혀 해석하지 않으므로 링크·`**강조**`·`` `코드` ``·`\{` 등이 모두 원문 그대로 목차 텍스트가 되고, 그 텍스트로 slug를 만드니 id도 어긋난다. 반면 헤딩 id는 `rehype-slug`가 **렌더된 텍스트**(hast-util-to-string)로 만든다.

**해결:** 목차도 마크다운을 **파싱해서** 헤딩 노드의 텍스트(`mdast-util-to-string`)를 쓴다. 이미 빌드 파이프라인이 쓰는 `unified` + `remark-parse`를 그대로 사용하므로 slug 입력이 `rehype-slug`와 같은 문자열이 된다. 스파이크(2026-09-15)로 확인: 위 글 6개 헤딩이 모두 `"Git Flow 방식이 불편했다" → git-flow-방식이-불편했다` 형태로 나온다.

**부수 효과 (같은 수정으로 함께 해결):**
- 코드 펜스 안의 `# 주석` 줄이 헤딩으로 오인될 가능성 제거 (정규식은 펜스를 모른다).
- `\<`·`\>` 수동 언이스케이프 코드 삭제 — 파서가 `\{`, `\}` 등 모든 이스케이프를 처리.

**Tech Stack:** Next.js 15.3 App Router · `unified@11` · `remark-parse@11` · `mdast-util-to-string@4` · `unist-util-visit@5`(이미 직접 의존성) · `github-slugger@2` · Node 22.20 (`node --test`, 타입 스트리핑 기본 활성) · pnpm

## Global Constraints

- 패키지 매니저 **pnpm**만.
- `unified`·`remark-parse`·`mdast-util-to-string`은 지금 `@next/mdx`의 **전이 의존성**으로만 존재한다(pnpm 격리라 루트에서 import 불가). 앱 코드에서 쓰려면 **직접 의존성으로 추가**한다. 버전은 이미 설치된 것과 같은 메이저(11 / 11 / 4)로 고정해 중복 설치를 피한다.
- `tocUtil.ts`의 공개 API(`TocItem`, `extractHeadings`, `buildTocTree`, `generateTocFromFile`, `generateTocFromContent`)와 반환 형태는 **바꾸지 않는다**. 소비처(`posts/[slug]/page.tsx`, `TableOfContents`, `MobileToc`)는 손대지 않는다.
- `level`은 원문의 `#` 개수 그대로 둔다. `remark-demote-headings`는 렌더 시 depth만 옮기고 텍스트는 그대로라 앵커는 계속 일치한다(해당 플러그인 주석 참조). 트리 형태는 상대 깊이만 쓰므로 영향 없음.
- 슬러그는 계속 `github-slugger` 인스턴스 하나로 문서 전체를 순회(중복 헤딩 `-1` 접미 규칙이 `rehype-slug`와 같아야 함).
- `remark-parse`에 **GFM 등 추가 플러그인을 붙이지 않는다** — 헤딩 텍스트 추출엔 기본 파서로 충분하고, 붙이면 콜아웃·마커 플러그인과의 정합을 다시 따져야 한다. (단, `~~취소선~~`은 GFM 없이는 `~~` 문자가 텍스트에 남는다. 현재 헤딩에 쓰인 글은 없다.)
- 커밋 직전 `git rev-parse --abbrev-ref HEAD` 확인. 작업 브랜치: `fix/toc-heading-parse` (**main에서 분기** — 현재 체크아웃된 `feat/diagram-lightbox`는 별개 작업).
- Vault 원본은 읽기만 한다. 이 수정은 앱 코드만 건드리며 sync 파이프라인·MDX 산출물은 그대로다.

---

## 파일 구조

| 파일 | 역할 |
|---|---|
| `package.json` (수정) | `unified`·`remark-parse`·`mdast-util-to-string` 직접 의존성 추가, `test` 스크립트에 `src/**/*.test.ts` 포함 |
| `src/app/lib/tocUtil.ts` (수정) | `extractHeadings()`를 remark 파싱 기반으로 교체. 나머지는 유지 |
| `src/app/lib/tocUtil.test.ts` (신규) | `node --test` 단위 테스트 |
| `.claude/skills/nextjs-blog-dev/SKILL.md` (수정) | "tocUtil은 remark로 파싱, rehype-slug와 같은 텍스트 규칙" 한 줄 갱신 |

---

### Task 1: 브랜치·의존성·테스트 러너

- [ ] **Step 1: 브랜치**

```bash
cd /Users/mac/workspace/blog-nextjs
git rev-parse --abbrev-ref HEAD     # feat/diagram-lightbox 이면 main으로
git checkout main && git checkout -b fix/toc-heading-parse
```

- [ ] **Step 2: 의존성 추가** — 설치된 전이 버전과 동일 메이저로.

```bash
pnpm add unified@^11 remark-parse@^11 mdast-util-to-string@^4
pnpm ls unified remark-parse mdast-util-to-string   # 중복 버전 없이 하나로 묶였는지
```

- [ ] **Step 3: `test` 스크립트 확장** — `package.json`

```json
"test": "node --test \"scripts/**/*.test.js\" \"src/**/*.test.ts\""
```

Node 22.20은 `.ts`를 기본으로 타입 스트리핑하므로 별도 플래그 불필요. `pnpm test`가 기존 `scripts/` 테스트를 그대로 통과하는지 먼저 확인.

### Task 2: 실패하는 테스트 작성 — `src/app/lib/tocUtil.test.ts`

`extractHeadings`·`generateTocFromContent`를 대상으로. 각 케이스는 **text**와 **id** 둘 다 단언한다.

- [ ] 링크가 든 헤딩: `## [Git Flow](unresolved:git-flow) 방식이 불편했다` → text `Git Flow 방식이 불편했다`, id `git-flow-방식이-불편했다` (이번 버그의 재현)
- [ ] 강조·인라인코드: `## **굵게** 와 `코드`` → text `굵게 와 코드`
- [ ] 이스케이프: `# 한강 작가와 \<소년이 온다>` → text `한강 작가와 <소년이 온다>` (기존 동작 유지), `## a \{b\}` → `a {b}`
- [ ] 코드 펜스 안의 `# 주석` 은 헤딩이 아니다
- [ ] 평문 헤딩·레벨·중복 헤딩 `-1` 접미: 기존 동작 회귀 없음
- [ ] frontmatter 포함 문자열 → `generateTocFromContent`가 frontmatter를 헤딩으로 잡지 않음
- [ ] `pnpm test` 실행 → 새 테스트만 실패하는 것 확인

### Task 3: `extractHeadings()` 교체

- [ ] `unified().use(remarkParse).parse(content)` 로 mdast 생성
- [ ] `visit(tree, "heading", node => …)` 로 순회, `text = toString(node).trim()`, `level = node.depth`, `id = slugger.slug(text)`
- [ ] 정규식과 `.replace(/\\([<>])/g, "$1")` 삭제
- [ ] `pnpm test` 전부 통과

### Task 4: 실제 화면 검증

- [ ] `pnpm build` 성공 (sync 포함 — Vault 접근 필요. `build:vercel`로 대체 가능)
- [ ] `pnpm dev` → `/posts/gitlab-flow` 에서 데스크톱 사이드 목차·모바일 목차 모두 "Git Flow 방식이 불편했다"로 표시되고, 클릭 시 해당 헤딩으로 스크롤되는지 확인 (헤딩 `id`가 `git-flow-방식이-불편했다`인지 DevTools로 확인)
- [ ] 회귀 확인 2건: `소년이 온다를 읽고`(`\<` 이스케이프 헤딩), `리액트 최신 동향 살펴보기`(h1 강등 + 코드블록 다수) 의 목차가 이전과 동일하게 보이는지

### Task 5: 문서·리뷰·커밋

- [ ] `.claude/skills/nextjs-blog-dev/SKILL.md` 33행 부근: "tocUtil은 `remark-parse`로 파싱한 헤딩 텍스트에 github-slugger를 적용 — `rehype-slug`와 입력 문자열이 같다" 로 갱신
- [ ] 전체 diff 1회 리뷰 (공개 API 불변, 소비처 무변경, 의존성 중복 없음)
- [ ] 브랜치 확인 후 커밋. push·PR은 하지 않는다.

---

## 검토하고 버린 대안

- **sync 단계에서 헤딩 안의 링크를 평문으로 바꾸기**(`transform-obsidian.js`): 링크만 막고 강조·코드·이스케이프는 그대로 남는다. 본문 헤딩의 red link 표시도 사라진다. 증상 하나만 덮는 처방이라 제외.
- **정규식에 인라인 문법 제거 규칙 추가**: 마크다운 파서를 정규식으로 재구현하는 셈. `rehype-slug`와 어긋날 여지가 계속 남는다.
