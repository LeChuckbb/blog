# Quartz 4 분석

> Obsidian Vault를 정적 웹사이트로 변환하는 오픈소스 SSG. "디지털 가든" 컨셉에 최적화.
> 공식 사이트: https://quartz.jzhao.xyz

---

## 주요 기능

### Wikilinks

`[[ ]]` 문법으로 다른 노트를 참조하는 **정방향 링크**. Quartz가 CrawlLinks 플러그인으로 자동 처리한다.

| 문법 | 설명 |
|------|------|
| `[[노트명]]` | 기본 링크 |
| `[[노트명\|표시할 텍스트]]` | 커스텀 텍스트 |
| `[[노트명#헤딩]]` | 특정 섹션으로 링크 |
| `[[노트명#^블록ID]]` | 특정 블록으로 링크 |
| `![[노트명]]` | 트랜스클루전 (내용 통째로 임베드) |
| `![[이미지.png\|100x145]]` | 이미지 임베드 + 크기 지정 |

### Backlinks

다른 노트에서 현재 노트를 `[[ ]]`로 참조한 것을 자동 역추적해서 노트 하단에 표시한다.

```
# React 노트 하단에 자동 표시:
───────────────────
📎 Backlinks
 - A 노트  ← "오늘 [[React]] 공부하면서..."
 - B 노트  ← "[[React]] Hooks를 사용해서..."
───────────────────
```

- 팝오버 미리보기 지원 (hover 시 해당 노트 내용 미리보기)
- 백링크가 없는 페이지에서는 자동으로 숨김 (설정 변경 가능)
- `quartz.layout.ts`에서 `Component.Backlinks({ hideWhenEmpty: false })`로 제어

#### Wikilinks vs Backlinks 차이

| | Wikilinks | Backlinks |
|---|---|---|
| 방향 | 내가 → 다른 노트 | 다른 노트 → 나 |
| 작성 | 수동 (`[[ ]]`) | 자동 (Quartz가 추적) |
| 용도 | 참조 걸기 | "누가 나를 참조하나" 확인 |

Wikilinks가 **원인**이고, Backlinks는 그 **결과**를 자동으로 모아 보여주는 것.

### Graph View

노트 간 연결 관계를 인터랙티브 그래프로 시각화한다.

- **로컬 그래프**: 현재 노트와 직접 연결된 노트들만 표시 (depth 조절 가능)
- **글로벌 그래프**: 아이콘 클릭으로 전환, Vault 전체의 모든 연결을 한눈에 표시
- 노드 크기 = 해당 노트의 링크 수에 비례
- 방문한 노트는 색상이 달라짐
- 드래그, 줌, 패닝 지원

```ts
// quartz.layout.ts
Component.Graph({
  localGraph: { depth: 1 },
  globalGraph: { depth: -1 }  // -1 = 전체
})
```

주요 옵션: `depth`, `repelForce`, `fontSize`, `enableRadial`, `drag`, `zoom`

> 필수: `ContentIndex` 이미터 플러그인이 설정에 포함되어야 함.

### Private Pages

두 가지 방식으로 비공개 페이지를 관리한다.

**방법 1: frontmatter 기반**

```yaml
---
draft: true   # 이 노트는 빌드에서 제외
---
```

`ExplicitPublish` 플러그인 사용 시 → `publish: true`가 있는 문서만 공개, 나머지 전부 비공개.

**방법 2: ignorePatterns (폴더/파일 패턴)**

```ts
// quartz.config.ts
ignorePatterns: ["some/folder", "**/private", "*.secret.md"]
```

**주의사항**
- 빌드된 사이트에서만 제외. GitHub 저장소가 public이면 소스는 여전히 보임
- 완전히 숨기려면 `.gitignore`에도 추가 필요
- 이미지/PDF 같은 비-마크다운 파일은 항상 공개됨

---

## 전체 기능 목록

| 카테고리 | 기능 |
|---|---|
| 콘텐츠 | Wikilinks, Backlinks, Transclusion, Callouts, LaTeX, Mermaid Diagrams, Syntax Highlighting, Citations |
| 탐색 | Graph View, Full-text Search, Explorer, Breadcrumbs, Table of Contents, Popover Previews, Folder/Tag Listings |
| UI | Darkmode, Reader Mode, Recent Notes, RSS Feed, Social Media Preview Cards |
| 기술 | SPA Routing, Internationalization, Private Pages, Docker Support |
| Obsidian 호환 | Obsidian Flavored Markdown, OxHugo 호환, Roam Research 호환 |

---

## 글 작성 & 배포 플로우

```
[Obsidian에서 글 작성] → [content/ 폴더에 저장] → [npx quartz sync] → [GitHub → 자동 배포]
```

### Frontmatter

```yaml
---
title: 페이지 제목
date: 2026-03-15
tags:
  - 태그명
description: 페이지 설명
draft: false       # true면 빌드 제외
aliases:           # 다른 이름들
  - 별명
permalink: /custom-url   # 고정 URL
---
```

### 명령어

```bash
# 초기 설정 (한 번만)
git clone https://github.com/jackyzha0/quartz.git
cd quartz && npm i
npx quartz create

# 로컬 미리보기
npx quartz build --serve   # localhost:8080

# 배포 (commit + push + GitHub Actions 빌드 자동 처리)
npx quartz sync
```

`npx quartz sync` 한 줄로 git commit + push + 빌드 & 배포가 자동 처리된다.

---

## 현재 블로그 (Next.js) vs Quartz 4 비교

### 기능 비교

| 기능 | 현재 블로그 | Quartz 4 |
|------|:---:|:---:|
| Obsidian 문법 호환 | O (커스텀 sync 스크립트) | O (네이티브) |
| Wikilinks | 단방향 링크로 변환만 함 | 완전 지원 + 팝오버 미리보기 |
| 그래프 뷰 | X | O |
| 백링크 | X | O |
| 전문 검색 | X | O |
| 팝오버 미리보기 | X | O |
| 파일 탐색기 | X | O |
| 트랜스클루전 | X | O |
| LaTeX | X | O |
| Private Pages | X | O |
| 댓글 | X | O (Giscus 등) |
| i18n | X | O |
| 목차 (TOC) | O | O |
| 다크모드 | O | O |
| 코드 하이라이팅 | O (Shiki 듀얼테마) | O |
| Mermaid 다이어그램 | O | O |
| Callouts | O | O |
| RSS 피드 | O | O |
| SEO / OG 카드 | O (동적 메타) | O |
| SPA 라우팅 | O (Next.js) | O |
| 시리즈 네비게이션 | O | X |
| 읽기 시간 표시 | O | X |
| 커스텀 MDX 컴포넌트 | O (자유롭게 확장) | 제한적 |
| 동적 기능 (API 등) | O (서버 컴포넌트) | X (순수 정적) |

### 플로우 비교

| 단계 | 현재 블로그 | Quartz 4 |
|------|:---:|:---:|
| 글 작성 | Obsidian `published/` 폴더 | Obsidian `content/` 폴더 |
| 변환 | `npm run sync` (커스텀 스크립트) | 내장 (자동) |
| 중간 파일 | `.mdx` 파일 생성됨 | 없음 (직접 처리) |
| 배포 | `npm run build` + 별도 배포 | `npx quartz sync` 한 줄 |
| 설정 파일 | `next.config.mjs` + 여러 파일 | `quartz.config.ts` 하나 |

### 언제 뭘 쓸까

| 목적 | 추천 |
|------|------|
| 빠르게 디지털 가든 만들기 | Quartz 4 |
| 그래프 뷰/백링크가 핵심 | Quartz 4 |
| 노트 간 연결 시각화가 중요 | Quartz 4 |
| 디자인/기능 완전 커스터마이징 | 현재 블로그 |
| 동적 기능 (API, 인증 등) | 현재 블로그 |
| 블로그 + 포트폴리오 겸용 | 현재 블로그 |
| 한국어 최적화 폰트/디자인 | 현재 블로그 |

---

## Quartz 4 vs Obsidian Publish 비교

> Obsidian Publish: Obsidian이 공식 운영하는 유료 호스팅 서비스. 설정 없이 바로 사용 가능.
> 공식 사이트: https://obsidian.md/publish

### 핵심 차이

| | **Quartz 4** | **Obsidian Publish** |
|---|---|---|
| **비용** | 무료 (오픈소스) | $8/월 (연간) / $10/월 (월간) |
| **호스팅** | 직접 (GitHub Pages, Cloudflare, Netlify 등) | Obsidian 서버에서 직접 호스팅 |
| **초기 설정** | Node.js + Git 필요, 30~60분 | Obsidian 앱에서 클릭 몇 번 |
| **커스터마이징** | 매우 높음 (소스코드 수정 가능) | CSS만 가능 |
| **소스코드 공개** | GitHub에 공개됨 (비공개 처리 필요) | Obsidian 서버에 저장 (비공개) |

### 기능 비교

| 기능 | Quartz 4 | Obsidian Publish |
|------|:---:|:---:|
| 그래프 뷰 | O | O |
| 백링크 | O | O |
| 팝오버 미리보기 | O | O |
| 전문 검색 | O | O |
| Wikilinks / 트랜스클루전 | O | O |
| Callouts | O | O |
| Stacked Pages (패널 탐색) | X | O |
| 비밀번호 보호 | X | O |
| 커스텀 도메인 | O (직접 설정) | O (유료 포함) |
| CSS 커스터마이징 | O | O |
| JS 커스터마이징 | O (제한 없음) | O |
| 테마 완전 교체 | O | X |
| 다크모드 | O | O |
| SEO / OG 카드 | O | O |
| RSS 피드 | O | X |
| i18n | O | X |
| 댓글 (Giscus 등) | O | X |
| LaTeX | O | O |
| Mermaid | O | O |
| Google Analytics | O | O |
| 저장 용량 | 무제한 (호스팅 플랫폼 따름) | 4GB |
| 모바일 앱에서 발행 | X | O |

### 배포 플로우 비교

**Quartz 4**
```
Obsidian 작성 → npx quartz sync → GitHub → GitHub Actions → 자동 배포
```

**Obsidian Publish**
```
Obsidian 작성 → Publish 패널에서 파일 선택 → "Publish" 클릭 → 즉시 반영
```

Obsidian Publish가 훨씬 단순하다. 앱 안에서 전부 해결됨.

### Obsidian Publish만의 기능: Stacked Pages

링크를 클릭하면 새 페이지가 옆으로 패널처럼 쌓이는 방식. Obsidian 앱의 탭 방식과 동일한 경험. Quartz에는 없는 기능.

### 비밀번호 보호

Obsidian Publish는 사이트 전체 또는 개별 페이지에 비밀번호를 걸 수 있다. Quartz의 Private Pages는 빌드에서 제외하는 방식이라 소스가 GitHub에 공개되는 반면, Obsidian Publish는 서버에서 접근 제어를 하기 때문에 더 안전하다.

### 소스코드 노출 문제

| | Quartz 4 | Obsidian Publish |
|---|---|---|
| 마크다운 소스 위치 | GitHub 저장소 (기본 공개) | Obsidian 서버 (비공개) |
| 비공개 처리 | .gitignore + ignorePatterns 필요 | 기본 비공개 |

### 정리: 언제 뭘 쓸까

| 상황 | 추천 |
|------|------|
| 코딩 없이 바로 시작하고 싶다 | **Obsidian Publish** |
| 비용이 부담된다 | **Quartz 4** |
| 완전한 커스터마이징이 필요하다 | **Quartz 4** |
| 소스코드를 GitHub에 올리기 싫다 | **Obsidian Publish** |
| 비밀번호 보호가 필요하다 | **Obsidian Publish** |
| 모바일에서 바로 발행하고 싶다 | **Obsidian Publish** |
| RSS, 댓글 등 확장 기능이 필요하다 | **Quartz 4** |
| 디지털 가든 + 무료 + 커스텀 | **Quartz 4** |