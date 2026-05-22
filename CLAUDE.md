# CLAUDE.md

이 파일은 이 저장소의 코드 작업 시 Claude Code (claude.ai/code)에게 가이드를 제공합니다.

## 프로젝트 개요

이 프로젝트는 MDX를 콘텐츠 관리에 사용하는 Next.js 15 블로그 애플리케이션입니다. Obsidian과의 자동 동기화 시스템을 통해 Obsidian에서 작성한 마크다운 파일을 자동으로 MDX로 변환하여 블로그에 게시할 수 있습니다. 목차, 구문 하이라이팅, 자동 frontmatter 파싱 등의 기능과 함께 한국어 콘텐츠를 지원합니다.

## 설정 및 초기화

### ⚠️ 필수 선행 조건
동기화 스크립트가 정상 작동하려면 **반드시** Obsidian Vault에 다음 폴더 구조를 먼저 생성해야 합니다:

```
Obsidian Vault/
└── blog-content/
    ├── published/    # 게시할 글을 여기에 (.md 파일)
    └── drafts/       # 작성 중인 글 (.md 파일)
```

### 환경 변수 설정
`.env.local` 파일에 Obsidian Vault 경로를 설정:
```bash
OBSIDIAN_VAULT_PATH="/path/to/your/obsidian/vault"
```

## 개발 명령어

```bash
# 콘텐츠 동기화
npm run sync         # Obsidian → MDX 한 번 동기화
npm run sync:watch   # 파일 변경 감지 자동 동기화

# 개발 (동기화 포함)
npm run dev          # 동기화 후 개발 서버 시작 (http://localhost:3000)

# 빌드 및 프로덕션 (동기화 포함)
npm run build        # 동기화 후 프로덕션 빌드
npm run start        # 프로덕션 서버 시작

# 코드 품질
npm run lint         # Next.js 규칙과 Prettier로 ESLint 실행
```

## 아키텍처

### 콘텐츠 관리
- **이중 워크플로우**: Obsidian(.md) → 동기화 스크립트 → Next.js(.mdx)
- **소스 파일**: Obsidian Vault의 `blog-content/published/` 폴더에 마크다운 파일 작성
- **변환된 파일**: 자동으로 `/content/*.mdx`로 변환되어 저장
- **포스트 메타데이터**: `/src/app/posts.json`에 모든 포스트의 slug 매핑과 메타데이터 자동 생성
- **동적 라우팅**: Next.js App Router를 사용하여 `/posts/[slug]`로 포스트 제공
- **문법 변환**: Obsidian 문법 (`%% %%`, `[[ ]]`) 자동 변환

### 주요 컴포넌트

1. **동기화 시스템** (`scripts/`):
   - `config.js`: 설정 관리 및 경로 자동 감지
   - `transform-obsidian.js`: Obsidian 문법 변환기 (`%% %%`, `[[ ]]` → MDX)
   - `sync-content.js`: 메인 동기화 스크립트 및 posts.json 자동 업데이트

2. **MDX 처리 파이프라인** (`next.config.mjs`):
   - remark 플러그인: frontmatter, toc, gfm
   - rehype 플러그인: 구문 하이라이팅 (catppuccin-frappe 테마), slug 생성, 자동 헤딩 링크

3. **목차** (`src/app/_components/TableOfContents.tsx`):
   - 스크롤 추적 기능이 있는 클라이언트 사이드 컴포넌트
   - 한국어 텍스트 slug화 지원
   - 활성 상태 관리가 있는 중첩된 헤딩 구조

4. **포스트 렌더링** (`src/app/posts/[slug]/page.tsx`):
   - `generateStaticParams()`를 사용한 정적 생성
   - MDX 파일에서 서버 사이드 ToC 생성
   - MDX 콘텐츠의 동적 import

### 스타일링
- PostCSS를 사용한 Tailwind CSS 4
- className 병합을 위한 유틸리티 함수 (`src/app/util.ts`)
- 코드 블록과 헤딩 앵커를 위한 커스텀 스타일

### TypeScript 설정
- 경로 별칭: 루트는 `@/*`, 콘텐츠 디렉토리는 `@/content/*`
- Strict 모드 활성화
- 향상된 타입 체킹을 위한 Next.js 플러그인

## 워크플로우

### 블로그 포스트 작성 및 게시

1. **Obsidian에서 글 작성**
   - `Obsidian Vault/blog-content/published/` 폴더에 `.md` 파일 생성
   - frontmatter와 함께 마크다운으로 작성
   - Obsidian 고유 문법 사용 가능 (`%% 주석 %%`, `[[ 내부링크 ]]`)

2. **동기화 실행**
   ```bash
   npm run sync        # 한 번 동기화
   # 또는
   npm run sync:watch  # 실시간 감지 모드
   ```

3. **자동 변환 과정**
   - Obsidian 문법을 MDX 호환 문법으로 변환
   - `/content/` 폴더에 `.mdx` 파일 생성
   - `posts.json` 파일 자동 업데이트

4. **개발 및 확인**
   ```bash
   npm run dev         # 동기화 + 개발 서버 실행
   ```

5. **배포**
   ```bash
   npm run build       # 동기화 + 프로덕션 빌드
   ```

### Google Drive 통합
- Obsidian Vault가 Google Drive와 동기화되어 있으면 어디서든 글 작성 가능
- 파일 변경 시 자동으로 블로그에 반영 (sync:watch 모드 사용 시)

## 하네스: 원티드 채용공고 크롤러

**목표:** 원티드(wanted.co.kr) 채용공고를 내부 API로 크롤링하고 직군 분류·코딩테스트 유형·경력 분포를 포함한 분석 엑셀을 생성한다.

**트리거:** "원티드 크롤링", "채용공고 데이터 수집/분석", "직군별 분포", "코딩테스트 통계" 관련 요청 시 `wanted-job-crawler` 스킬을 사용한다. 후속 수정·확장 요청에도 동일 스킬로 처리.

**산출물 위치:** `output/` 디렉토리 (data/raw_cards.json, data/details.json, wanted_seoul_dev_jobs.xlsx)

**변경 이력:**
| 날짜 | 변경 내용 | 대상 | 사유 |
|------|----------|------|------|
| 2026-05-20 | 초기 구성 — wanted-job-crawler 스킬 + 번들 스크립트 | ~/.claude/skills/wanted-job-crawler | 본 세션의 크롤링 노하우를 재사용 가능한 스킬로 응축 |
| 2026-05-20 | 개발 전체 수집(`--all-dev`/`--all-categories`) 추가, 코딩테스트 분류 정책 변경(코딩테스트/알고리즘 명시 우선·코드리뷰 면접 제외·실무과제 보강) | crawl_wanted.py + classification-rules.md (output & 스킬) | job_group_id=518 전체 분석 요청 + 분류 오분류 3건(센트비/모티프/미리디) 교정 |