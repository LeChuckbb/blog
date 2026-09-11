# 링크 호버 미리보기(카드 팝오버) 설계

## Context

게시글 본문의 링크에 마우스를 올리면 대상이 무엇인지 보여주는 카드를 띄운다. 본문 링크는 세 종류다.

| 종류 | href 형태 | 현재 렌더링 (`mdx-components.tsx` `a`) |
|---|---|---|
| 내부 글 (위키링크 변환) | `/posts/<slug>` | 일반 `<a>` |
| 외부 | `https://…` | `target=_blank` + 12px 외부 아이콘 |
| 미공개 글 | `unresolved:…` | 비활성 `<span>` — **이번 범위 밖** |

방향 비교(카드 팝오버 / 여백 사이드노트 / 한 줄 툴팁)는 디자인 캔버스에서 했고 **카드 팝오버**로 확정했다.
캔버스: https://claude.ai/code/artifact/18aed0cb-1b55-4cfb-8b0b-0f7a657ae720

## 결정 사항

- **런타임 fetch 없음.** 미리보기 데이터는 전부 빌드 산출물.
  - 내부 글: `src/app/posts.json`에 이미 있는 `title / date / readingTime / series / description`을 그대로 쓴다.
  - 외부 링크: 동기화 스크립트가 `content/*.mdx`의 외부 URL을 모아 Open Graph 메타를 수집해 `src/app/link-previews.json`에 캐시한다. **증분** — 이미 성공한 URL은 다시 가져오지 않는다.
- **`link-previews.json`은 커밋한다.** `build:vercel`은 `next build`만 돌리므로(`sync` 없음) `posts.json`과 같은 취급이다.
- **팝오버 구현은 `@radix-ui/react-hover-card`(shadcn `hover-card`).** 지연·포털·충돌 회피·키보드 포커스·터치 무시(HoverCard는 터치에서 열리지 않음)를 얻는다. 이미 shadcn(`components.json`, `@radix-ui/react-dropdown-menu`)을 쓰고 있어 결이 같다.
- **미리보기 데이터가 없는 링크는 지금과 똑같은 일반 링크.** 팝오버를 안 띄운다(도메인만 보여주는 반쪽 카드 없음).
- **파비콘 없음.** 외부 서비스(google favicons 등) 호출은 독자의 브라우저에서 제3자 요청이 되므로 쓰지 않는다. 지구본 SVG + 도메인으로 대체.
- **og:image는 `<img>`로 직접 표시**(`next/image` 아님 — 161개 도메인을 `remotePatterns`에 넣을 수 없다). 로드 실패 시 이미지 영역을 숨긴다.
- 적용 범위는 **MDX 본문의 `a`만**. 네비·시리즈·TOC 링크는 그대로.

## 규모 (2026-09-11 실측)

- 글 62편, 고유 외부 URL 161개 (S3 이미지 URL 246개는 `![…]` 이미지 문법이라 제외).
- 첫 sync: 161회 fetch, 동시 5 · 타임아웃 5s → 최악 ~3분, 통상 1분 내. 이후 sync: 새 링크가 있을 때만 그만큼.

## 데이터 모델

### `src/app/link-previews.json`

```json
{
  "https://developer.mozilla.org/ko/docs/Web/API/History": {
    "title": "History - Web API | MDN",
    "description": "History 인터페이스는 …",
    "image": "https://developer.mozilla.org/mdn-social-share.png",
    "siteName": "MDN Web Docs",
    "fetchedAt": "2026-09-11T03:00:00.000Z"
  },
  "https://example.com/gone": {
    "error": "HTTP 404",
    "fetchedAt": "2026-09-11T03:00:00.000Z"
  }
}
```

- 키는 MDX에 적힌 URL 그대로(정규화 안 함 — 같은 글이 `#anchor`만 다르게 두 번 나오면 두 번 fetch되는 정도는 감수).
- `title`은 필수. og:title → `<title>` 순. 둘 다 없으면 실패(`error: "no title"`)로 기록해 카드를 띄우지 않는다.
- `description` / `image` / `siteName`은 있으면 채움. `image`는 절대 URL로 정규화.
- 실패 항목은 **7일** 지나면 재시도. 성공 항목은 재수집하지 않는다(갱신하려면 키를 지우고 sync).

### 컴포넌트 props (`LinkPreviewData`)

```ts
export type LinkPreviewData =
  | {
      kind: "post";
      title: string;
      date: string;          // "2026-06-02"
      readingTime?: number;  // 분
      series?: string;
      description?: string;
    }
  | {
      kind: "external";
      title: string;
      domain: string;        // "developer.mozilla.org"
      description?: string;
      image?: string;
    };
```

## 렌더링 흐름

```
content/*.mdx ─(MDX 컴파일, 서버)─▶ mdx-components a(href)
                                       │ getLinkPreview(href)  ← posts.json / link-previews.json
                                       ▼
                              <LinkPreview href preview external>   (client)
                                       │ HoverCard: openDelay 300 · closeDelay 150 · side bottom · align start
                                       ▼
                              카드 (bg-popover, border-border, rounded-lg, w-80, shadow)
```

- 내부 카드: 시리즈 칩 · `YYYY.MM.DD · N분` · 제목(MaruBuri) · description 3줄 클램프
- 외부 카드: og:image 150px cover(있을 때) · 지구본+도메인 · 제목 2줄 · description 2줄
- 링크 자체의 표시는 지금과 동일. 카드가 열린 동안(`data-state=open`)만 `bg-accent` 배경을 살짝 얹는다.

## 범위 밖 (기록만)

- `unresolved:` 미공개 링크의 미리보기
- 파비콘 수집
- 팝오버 열림 GA 이벤트(`trackEvent`) — 필요해지면 `LinkPreview`의 `onOpenChange` 한 줄
- URL 정규화(anchor/쿼리 제거)
