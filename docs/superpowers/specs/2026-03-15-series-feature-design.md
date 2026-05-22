# 시리즈(Series) 기능 설계

## Context

블로그에 시리즈 기능을 추가하여 연관된 포스트들을 그룹화하고, 게시글 상세 페이지에서 시리즈 네비게이션 UI를 제공한다. 현재 Redux(1)~(4), React SSR(1)~(2), 원티드 FE 프리온보딩 회고(1)~(3) 등 시리즈성 글이 존재하지만 명시적 연결이 없어 독자가 순서대로 탐색하기 어렵다.

## 결정 사항

- **UI 스타일**: 벨로그 스타일 (시리즈명 + 번호 리스트 + 현재 글 하이라이트 + 이전/다음 + 접기/펼치기)
- **위치**: 게시글 상세 페이지 header(제목/날짜) 아래, 본문 위
- **Frontmatter**: `series: "시리즈명"` 한 필드만 추가. 순서는 date 오름차순 자동 결정
- **데이터**: posts.json에 series 필드 포함 (기존 데이터 흐름 활용)
- **범위**: 게시글 상세 페이지만. 시리즈 전용 목록 페이지 없음

## 데이터 모델

### Obsidian Frontmatter
```yaml
---
publish_date: 2024-03-13
tags:
  - Redux
slug: redux-1
series: Redux 완벽 가이드
---
```

### Post 인터페이스
```typescript
export interface Post {
  slug: string;
  title: string;
  date: string;
  tags?: string[];
  description?: string;
  readingTime?: number;
  series?: string;  // 추가
}
```

### posts.json
```json
{
  "slug": "redux-1",
  "date": "2021-06-16",
  "title": "Redux(1) - 개념 및 구조",
  "tags": ["Redux"],
  "description": "",
  "readingTime": 5,
  "series": "Redux 완벽 가이드"
}
```

series가 없는 포스트는 필드 자체를 생략한다.

## 데이터 흐름

```
Obsidian .md (series: "Redux 완벽 가이드")
  → transform-obsidian.js (cleanFrontmatter가 스프레드로 필드 보존)
  → sync-content.js processFile() (series 필드 추출)
  → sync-content.js updatePostsJson() (posts.json에 series 포함)
  → page.tsx getSeriesData() (같은 series 필터 → date 오름차순 정렬)
  → <SeriesNav> 컴포넌트 렌더링
```

## SeriesNav 컴포넌트

### Props
```typescript
interface SeriesPost {
  slug: string;
  title: string;
}

interface SeriesNavProps {
  seriesName: string;
  posts: SeriesPost[];
  currentIndex: number;  // 0-based
}
```

### 상태
- `isExpanded: boolean` (기본값 true) — 접기/펼치기

### UI 상세

**펼친 상태:**
- 시리즈명 (굵은 글씨)
- 번호 매긴 글 목록 (현재 글은 파란색 하이라이트, 다른 글은 Link)
- 하단: "▲ 숨기기" | "3/4" | ◀ ▶

**접힌 상태:**
- 시리즈명 | "3/4" | "▼ 목록" | ◀ ▶ (한 줄)

### 엣지 케이스
- series가 없는 포스트: SeriesNav 미표시
- 시리즈에 1개만 있는 포스트: SeriesNav 미표시
- 첫 번째 글: 이전(◀) 비활성화
- 마지막 글: 다음(▶) 비활성화

## page.tsx 헬퍼

```typescript
function getSeriesData(currentPost: Post): SeriesData | null {
  if (!currentPost.series) return null;

  const seriesPosts = (postsData.posts as Post[])
    .filter(p => p.series === currentPost.series)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(p => ({ slug: p.slug, title: p.title }));

  if (seriesPosts.length < 2) return null;

  const currentIndex = seriesPosts.findIndex(p => p.slug === currentPost.slug);
  if (currentIndex === -1) return null;

  return { seriesName: currentPost.series, posts: seriesPosts, currentIndex };
}
```

## 변경 파일

| 파일 | 변경 유형 |
|------|----------|
| `src/app/types.ts` | series? 필드 추가 |
| `scripts/sync-content.js` | processFile, updatePostsJson에 series 전달 |
| `src/app/_components/SeriesNav.tsx` | 신규 생성 |
| `src/app/posts/[slug]/page.tsx` | getSeriesData 함수 + SeriesNav 렌더링 |
| Obsidian 소스 파일들 | series frontmatter 추가 |

## 커밋 전략 (Tidy First)

1. **구조적**: Post 타입에 series? 추가
2. **구조적**: sync-content.js에 series 필드 전달 로직 추가
3. **행동적**: SeriesNav 컴포넌트 구현 + page.tsx 통합
4. **행동적**: 기존 시리즈 포스트 frontmatter 추가 + 동기화

## 검증

- `npm run lint` — ESLint 통과
- `npm run sync` — posts.json에 series 필드 반영 확인
- `npm run build` — 정적 빌드 성공
- `npm run dev` — 시리즈 포스트 페이지에서 UI 확인
  - 현재 글 하이라이트, 이전/다음 네비게이션, 접기/펼치기
  - 다크/라이트 모드, 모바일 뷰포트
