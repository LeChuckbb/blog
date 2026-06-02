# CLAUDE.md

MDX 기반 Next.js 15 블로그. Obsidian에서 작성한 마크다운(.md)을 동기화 스크립트로 MDX(.mdx)로 변환해 게시한다. 한국어 콘텐츠, 목차, 구문 하이라이팅 지원.

## 명령어

이 프로젝트는 **pnpm**을 사용한다 (`packageManager: pnpm@9` 고정). npm/yarn 금지.

```bash
pnpm sync         # Obsidian → MDX 한 번 동기화
pnpm sync:watch   # 파일 변경 감지 자동 동기화
pnpm dev          # 동기화 후 개발 서버 (http://localhost:3000)
pnpm build        # 동기화 후 프로덕션 빌드
pnpm lint         # ESLint (Next.js 규칙 + Prettier)
```

> `dev`/`build`는 내부적으로 `sync`를 먼저 돌린다.

## 필수 선행 조건 (gotcha)

동기화 스크립트는 Obsidian Vault에 아래 폴더 구조가 **먼저** 있어야 동작한다:

```
Obsidian Vault/blog-content/
├── published/    # 게시할 글 (.md)
└── drafts/       # 작성 중인 글 (.md)
```

그리고 `.env.local`에 Vault 경로 설정:

```bash
OBSIDIAN_VAULT_PATH="/path/to/your/obsidian/vault"
```

## 콘텐츠 흐름

`published/*.md` → 동기화 스크립트(`scripts/`) → `content/*.mdx` + `src/app/posts.json`(메타데이터 자동 생성) → `/posts/[slug]` 라우팅. Obsidian 문법(`%% %%`, `[[ ]]`)은 변환기가 처리.

> 아키텍처·관례 상세는 코드와 `nextjs-blog-dev`(앱)·`obsidian-sync`(동기화)·`blog-content-authoring`(글 작성) 스킬에 있다.

## 운영 하네스

블로그 운영 작업(글 작성·발행, SEO·품질 검수, 동기화/변환 버그, 앱 코드 개발·리팩토링)은 `blog-harness` 스킬(오케스트레이터)을 진입점으로 사용한다. 후속 요청("다시 검수", "재발행", "그 기능 보완")도 동일. 단순 질문은 직접 응답 가능.

**안전 규칙:** Obsidian Vault 내 파일을 삭제·이동·정리하는 모든 작업은 `obsidian-safe-delete` 스킬을 사용한다(macOS 휴지통 이동). `rm` 절대 금지 — Vault 원본 보호 안전망.

상세 구성(에이전트 4 + 도메인 스킬)·라우팅·실행 모드는 `blog-harness` 스킬 문서 참조.
